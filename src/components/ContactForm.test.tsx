import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";

describe("ContactForm", () => {
  it("should render all form fields", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText("Full Name *")).toBeInTheDocument();
    expect(screen.getByLabelText("Email *")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone")).toBeInTheDocument();
    expect(screen.getByLabelText("Subject *")).toBeInTheDocument();
    expect(screen.getByLabelText("Message *")).toBeInTheDocument();
  });

  it("should render the submit button", () => {
    render(<ContactForm />);
    expect(
      screen.getByRole("button", { name: "Send Message" })
    ).toBeInTheDocument();
  });

  it("should pre-fill the subject when prop is provided", () => {
    render(<ContactForm subject="catering" />);
    const select = screen.getByLabelText("Subject *") as HTMLSelectElement;
    expect(select.value).toBe("catering");
  });

  it("should show success message after submission", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(<ContactForm />);

    await user.type(screen.getByLabelText("Full Name *"), "Jane Smith");
    await user.type(screen.getByLabelText("Email *"), "jane@example.com");
    await user.selectOptions(screen.getByLabelText("Subject *"), "general");
    await user.type(screen.getByLabelText("Message *"), "Hello!");

    await user.click(screen.getByRole("button", { name: "Send Message" }));

    vi.advanceTimersByTime(1100);

    expect(await screen.findByText("Message Sent!")).toBeInTheDocument();

    vi.useRealTimers();
  });

  it("should have required attributes on required fields", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText("Full Name *")).toBeRequired();
    expect(screen.getByLabelText("Email *")).toBeRequired();
    expect(screen.getByLabelText("Subject *")).toBeRequired();
    expect(screen.getByLabelText("Message *")).toBeRequired();
    expect(screen.getByLabelText("Phone")).not.toBeRequired();
  });
});
