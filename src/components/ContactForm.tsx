"use client";

import { useState, type FormEvent } from "react";

interface ContactFormProps {
  subject?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function ContactForm({ subject = "" }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject,
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");

    // Simulate form submission
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 1000);
  }

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <svg
          className="h-12 w-12 text-success mx-auto mb-3"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-green-800 mb-1">
          Message Sent!
        </h3>
        <p className="text-sm text-green-700">
          Thank you for reaching out. We will get back to you within 24 hours.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="Your name"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="you@example.com"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="(555) 000-0000"
          />
        </div>
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Subject *
          </label>
          <select
            id="subject"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          >
            <option value="">Select a subject</option>
            <option value="general">General Inquiry</option>
            <option value="catering">Catering</option>
            <option value="events">Events</option>
            <option value="feedback">Feedback</option>
            <option value="wholesale">Wholesale</option>
          </select>
        </div>
      </div>
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-foreground mb-1"
        >
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-vertical"
          placeholder="How can we help you?"
        />
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full sm:w-auto px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>

      {status === "error" && (
        <p className="text-sm text-error">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
