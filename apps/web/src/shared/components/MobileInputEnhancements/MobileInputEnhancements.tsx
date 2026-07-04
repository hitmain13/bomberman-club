"use client";

import { useEffect } from "react";

import { bindMobileInputFocusEnhancements } from "@/shared/utils/scroll-input-into-view";

export function MobileInputEnhancements(): null {
  useEffect(() => bindMobileInputFocusEnhancements(), []);
  return null;
}
