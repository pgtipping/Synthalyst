declare module "web-vitals" {
  // Metric types
  export type MetricName = "CLS" | "FCP" | "FID" | "INP" | "LCP" | "TTFB";

  export interface Metric {
    name: MetricName;
    value: number;
    delta: number;
    id: string;
    entries: PerformanceEntry[];
    navigationType?: NavigationType;
  }

  // Report handler type
  export type ReportHandler = (metric: Metric) => void;

  // Core functions
  export function getCLS(
    onReport: ReportHandler,
    reportAllChanges?: boolean
  ): void;
  export function getFCP(onReport: ReportHandler): void;
  export function getFID(onReport: ReportHandler): void;
  export function getINP(
    onReport: ReportHandler,
    reportAllChanges?: boolean
  ): void;
  export function getLCP(
    onReport: ReportHandler,
    reportAllChanges?: boolean
  ): void;
  export function getTTFB(onReport: ReportHandler): void;

  // Convenience function to get all metrics
  export function onCLS(
    onReport: ReportHandler,
    reportAllChanges?: boolean
  ): void;
  export function onFCP(onReport: ReportHandler): void;
  export function onFID(onReport: ReportHandler): void;
  export function onINP(
    onReport: ReportHandler,
    reportAllChanges?: boolean
  ): void;
  export function onLCP(
    onReport: ReportHandler,
    reportAllChanges?: boolean
  ): void;
  export function onTTFB(onReport: ReportHandler): void;
}
