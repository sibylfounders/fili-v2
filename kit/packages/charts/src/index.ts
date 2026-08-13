// @fili/charts — briques dataviz (SVG sur tokens @fili/tokens, interactions maison).
// Graphes responsives & animes avec survol/tactile (crosshair + infobulle), et widgets
// de reporting (StatCard adaptative, KpiGroup, ProgressCircle, UsageSummary).

// charts
export { AreaChart, type AreaChartProps } from "./charts/area-chart";
export { BarChart, type BarChartProps } from "./charts/bar-chart";
export { ComposedChart, type ComposedChartProps, type ComposedPoint } from "./charts/composed-chart";
export { LineChart, type LineSeries, type LineChartProps } from "./charts/line-chart";
export { DonutChart, type DonutChartProps, type DonutDatum } from "./charts/donut-chart";
export { Sparkline, type SparklineProps } from "./charts/sparkline";
export { ChartFrame, TipRow, type ChartFrameProps, type FrameCtx } from "./charts/chart-frame";

// widgets
export { StatCard, type StatCardProps, type StatDelta } from "./widgets/stat-card";
export { ChartCard, type ChartCardProps } from "./widgets/chart-card";
export { KpiGroup, type KpiGroupProps, type KpiItem } from "./widgets/kpi-group";
export { ProgressCircle, type ProgressCircleProps } from "./widgets/progress-circle";
export { UsageSummary, type UsageSummaryProps, type UsageRow } from "./widgets/usage-summary";

// helpers
export * from "./lib/format";
export * as geometry from "./lib/geometry";
export { cn } from "./lib/cn";
