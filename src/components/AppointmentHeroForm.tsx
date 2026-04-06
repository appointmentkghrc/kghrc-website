"use client";

import { FormEvent, useState } from "react";

const inputClass =
  "w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-primary";

export default function AppointmentHeroForm() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function handleMobileChange(value: string) {
    setMobile(value.replace(/\D/g, "").slice(0, 10));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const website = String(new FormData(form).get("website") ?? "");
    if (website) return;

    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/appointment-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, mobile, query, website }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong.");
        return;
      }
      setStatus("success");
      setName("");
      setMobile("");
      setQuery("");
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate>
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

      <div>
        <label htmlFor="appointment-name" className="sr-only">
          Name
        </label>
        <input
          id="appointment-name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className={inputClass}
          disabled={status === "loading"}
          autoComplete="name"
          required
        />
      </div>

      <div>
        <span className="sr-only">Mobile number</span>
        <div className="flex items-center rounded-lg bg-white/20 text-white border border-white/30 backdrop-blur-md focus-within:ring-2 focus-within:ring-primary">
          <span className="px-4 py-3 border-r border-white/30 text-white/90">+91</span>
          <input
            id="appointment-mobile"
            type="tel"
            name="mobile"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="Mobile No"
            maxLength={10}
            value={mobile}
            onChange={(e) => handleMobileChange(e.target.value)}
            className="w-full px-4 py-3 bg-transparent text-white placeholder-white/70 focus:outline-none"
            disabled={status === "loading"}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="appointment-query" className="sr-only">
          Query or problem
        </label>
        <textarea
          id="appointment-query"
          name="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Write your query/problem"
          rows={3}
          className={`${inputClass} resize-none`}
          disabled={status === "loading"}
          required
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-200" role="alert">
          {errorMessage}
        </p>
      )}
      {status === "success" && (
        <p className="text-sm text-emerald-200" role="status">
          Thank you. Your query has been submitted.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-3 mt-2 rounded-full bg-primary text-white font-semibold hover:bg-[#00c2c0] transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Sending…" : "Submit Query"}
      </button>
    </form>
  );
}
