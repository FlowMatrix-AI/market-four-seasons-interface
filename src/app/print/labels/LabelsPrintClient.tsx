"use client";

import { useEffect } from "react";

export default function LabelsPrintClient() {
  useEffect(() => {
    window.print();
  }, []);

  return null;
}
