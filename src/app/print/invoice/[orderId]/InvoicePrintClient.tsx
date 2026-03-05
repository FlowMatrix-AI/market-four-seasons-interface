"use client";

import { useEffect } from "react";

export default function InvoicePrintClient() {
  useEffect(() => {
    window.print();
  }, []);

  return null;
}
