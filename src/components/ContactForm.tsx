"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const emailOk = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const website = String(fd.get("website") ?? "");
    if (website) return;

    const nameTrim = name.trim();
    const phoneDigits = phone.replace(/\D/g, "");
    const emailTrim = email.trim();
    if (!nameTrim) {
      setStatus("error");
      setErrorMessage("Please enter your name.");
      return;
    }
    if (phoneDigits.length !== 10) {
      setStatus("error");
      setErrorMessage("Please enter a valid 10-digit phone number.");
      return;
    }
    if (!emailTrim || !emailOk(emailTrim)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address with @.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameTrim,
          email: emailTrim,
          phone: phoneDigits,
          message,
          website,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong.");
        return;
      }
      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

  const inputClass =
    "w-full bg-transparent border border-white/70 p-4 rounded-md text-white placeholder:text-white [&::placeholder]:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/60";

  return (
    <form className="space-y-6 text-left" onSubmit={onSubmit} noValidate>
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

      <div>
        <label htmlFor="contact-name" className="sr-only">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name *"
          className={inputClass}
          disabled={status === "loading"}
          autoComplete="name"
          required
          aria-required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="contact-email" className="sr-only">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email *"
            className={inputClass}
            disabled={status === "loading"}
            autoComplete="email"
            aria-required
          />
        </div>
        <div>
          <label htmlFor="contact-phone" className="sr-only">
            Phone
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            placeholder="Phone * (10 digits)"
            className={inputClass}
            disabled={status === "loading"}
            required
            aria-required
            maxLength={10}
            pattern="[0-9]{10}"
            title="Enter exactly 10 digits"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="sr-only">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message *"
          className={inputClass}
          disabled={status === "loading"}
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-200" role="alert">
          {errorMessage}
        </p>
      )}
      {status === "success" && (
        <p className="text-sm text-emerald-200" role="status">
          Thank you. Your message has been sent.
        </p>
      )}

      <div className="text-center">
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-blue-600 hover:bg-blue-700 transition px-10 py-4 rounded-md font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Sending…" : "SEND MESSAGE ✈"}
        </button>
      </div>
    </form>
  );
}
