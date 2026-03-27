"use client";

import { useState } from "react";

export default function AppointmentMobileInput() {
  const [mobile, setMobile] = useState("");

  const handleMobileChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
    setMobile(digitsOnly);
  };

  return (
    <div className="flex items-center rounded-lg bg-white/20 text-white border border-white/30 backdrop-blur-md focus-within:ring-2 focus-within:ring-primary">
      <span className="px-4 py-3 border-r border-white/30 text-white/90">
        +91
      </span>
      <input
        type="tel"
        name="mobile"
        placeholder="Mobile No"
        inputMode="numeric"
        pattern="[0-9]{10}"
        maxLength={10}
        minLength={10}
        value={mobile}
        onChange={(e) => handleMobileChange(e.target.value)}
        className="w-full px-4 py-3 bg-transparent text-white placeholder-white/70 focus:outline-none"
        required
      />
    </div>
  );
}
