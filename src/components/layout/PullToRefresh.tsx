"use client";

import React from "react";

/** WYSHKIT 2026: Replaced 184-line custom implementation with simple wrapper. Use native browser pull-to-refresh or refresh button. */
export function PullToRefresh({
  children,
}: {
  onRefresh?: () => Promise<void>;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return <>{children}</>;
}
