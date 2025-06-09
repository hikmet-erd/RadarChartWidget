import { Big } from "big.js";

/**
 * Core data structure representing a single point on the radar chart.
 *
 * This interface defines the fundamental data unit for radar chart visualization,
 * containing both the categorical identifier and the numeric value to be plotted.
 *
 * **Design Principles:**
 * - Simple, immutable structure for performance
 * - Clear semantic naming for developer understanding
 * - Compatible with Mendix data attribute patterns
 *
 * @interface RadarChartDataPoint
 *
 * @example
 * ```typescript
 * // Single performance metric
 * const performancePoint: RadarChartDataPoint = {
 *   name: "Communication Skills",
 *   value: 4.2
 * };
 *
 * // Array of team metrics
 * const teamData: RadarChartDataPoint[] = [
 *   { name: "Technical Skills", value: 4.5 },
 *   { name: "Problem Solving", value: 3.8 },
 *   { name: "Leadership", value: 4.1 },
 *   { name: "Collaboration", value: 4.3 }
 * ];
 * ```
 */
export interface RadarChartDataPoint {
    /**
     * Category name displayed around the chart perimeter.
     *
     * **Constraints:**
     * - Should be unique within the dataset
     * - Recommended maximum length: 20 characters
     * - Avoid special characters that may affect SVG rendering
     * - Empty names will be replaced with "Category N" format
     *
     * @example "Communication", "Technical Skills", "Leadership"
     */
    name: string;

    /**
     * Numeric value representing the score or measurement for this category.
     *
     * **Value Handling:**
     * - Automatically clamped to [0, maxValue] range during processing
     * - Supports decimal precision for fine-grained measurements
     * - Zero values are valid and will render as center points
     * - Invalid numbers are replaced with 0 during validation
     *
     * @example 4.2, 3.8, 5.0, 0
     */
    value: number;
}

/**
 * Comprehensive configuration interface for radar chart appearance and behavior.
 *
 * This interface centralizes all styling, layout, and functional options for the
 * radar chart component. It serves as the single source of truth for chart
 * customization and is generated from Mendix widget properties.
 *
 * **Configuration Categories:**
 * - **Dimensions**: Chart size and layout properties
 * - **Styling**: Colors, opacity, and visual appearance
 * - **Display**: What elements to show/hide (labels, grid, legend)
 * - **Content**: Title and textual content
 *
 * @interface RadarChartConfig
 *
 * @example
 * ```typescript
 * // Basic configuration
 * const basicConfig: RadarChartConfig = {
 *   width: 400,
 *   height: 400,
 *   maxValue: 5,
 *   fillColor: "#A084E7",
 *   strokeColor: "#7C5AC4",
 *   fillOpacity: 0.3,
 *   showLabels: true,
 *   showGridLines: true
 * };
 *
 * // Advanced dashboard configuration
 * const dashboardConfig: RadarChartConfig = {
 *   width: 600,
 *   height: 600,
 *   maxValue: 10,
 *   title: "Performance Dashboard",
 *   fillColor: "#2ecc71",
 *   strokeColor: "#27ae60",
 *   fillOpacity: 0.4,
 *   backgroundColor: "#f8f9fa",
 *   showLegend: true,
 *   legendPosition: "bottom",
 *   showValueLabels: true
 * };
 * ```
 */
export interface RadarChartConfig {
    // === Chart Dimensions ===

    /**
     * Chart width in pixels.
     *
     * **Recommendations:**
     * - Minimum: 200px for readability
     * - Optimal range: 300-600px for most use cases
     * - Maximum: 1000px to maintain performance
     */
    width: number;

    /**
     * Chart height in pixels.
     *
     * **Recommendations:**
     * - Should typically match width for circular charts
     * - Minimum: 200px for readability
     * - Consider legend space when positioning
     */
    height: number;

    // === Data Scaling ===

    /**
     * Maximum value on the radar chart scale.
     *
     * Determines the outer ring value and is used for normalizing all data points.
     * All values are scaled proportionally between 0 and this maximum.
     *
     * **Common Scales:**
     * - 5: Traditional 1-5 rating scale
     * - 10: Decimal or percentage-based scale
     * - 100: Percentage scale (0-100%)
     *
     * @default 5
     */
    maxValue: number;

    // === Color Configuration ===

    /**
     * Hex color code for the radar chart area fill.
     *
     * **Guidelines:**
     * - Use semi-transparent colors with fillOpacity
     * - Ensure sufficient contrast with background
     * - Consider color accessibility for visually impaired users
     *
     * @example "#A084E7", "#3498db", "#2ecc71"
     */
    fillColor: string;

    /**
     * Hex color code for the radar chart border line.
     *
     * **Best Practices:**
     * - Usually a darker shade of fillColor
     * - Should contrast well with both fill and background
     * - Maintain 2px stroke width for visibility
     *
     * @example "#7C5AC4", "#2980b9", "#27ae60"
     */
    strokeColor: string;

    /**
     * Opacity of the chart area fill (0.0 to 1.0).
     *
     * **Usage Guidelines:**
     * - 0.3-0.5: Good for overlapping charts or backgrounds
     * - 0.6-0.8: Standard visibility for single charts
     * - 1.0: Solid fill, use sparingly
     *
     * @default 0.3
     */
    fillOpacity: number;

    /**
     * Background color of the chart container.
     *
     * Provides the base color behind the entire chart including grid lines.
     * Should contrast well with all other chart elements.
     *
     * @default "#ffffff"
     */
    backgroundColor: string;

    /**
     * Color for all text elements (labels, titles, values).
     *
     * Must provide sufficient contrast against backgroundColor for accessibility.
     * Minimum contrast ratio: 4.5:1 for WCAG AA compliance.
     *
     * @default "#333333"
     */
    textColor: string;

    /**
     * Color for grid lines and radial spokes.
     *
     * Should be subtle enough not to interfere with data visualization
     * but visible enough to provide reference structure.
     *
     * @default "#e0e0e0"
     */
    gridColor: string;

    // === Display Options ===

    /** Whether to display category labels around the chart perimeter */
    showLabels: boolean;

    /** Whether to display grid lines and spokes for reference */
    showGridLines: boolean;

    /** Whether to display a legend with data point information */
    showLegend: boolean;

    /**
     * Position of the legend relative to the chart.
     *
     * **Layout Impact:**
     * - "top"/"bottom": Chart and legend stack vertically
     * - "left"/"right": Chart and legend arrange horizontally
     * - Consider available space when choosing position
     */
    legendPosition: "top" | "right" | "bottom" | "left";

    /** Whether to display numeric value labels on individual data points */
    showValueLabels: boolean;

    // === Content ===

    /**
     * Optional title displayed above the radar chart.
     *
     * **Accessibility Benefits:**
     * - Provides context for screen readers
     * - Improves chart comprehension
     * - Used in ARIA labels for better accessibility
     *
     * @example "Team Performance Assessment", "Q4 Metrics Overview"
     */
    title?: string;
}

/**
 * Safely converts Mendix Big.js values to JavaScript numbers.
 *
 * Mendix uses Big.js for precise decimal arithmetic, but chart calculations
 * require native JavaScript numbers. This utility provides safe conversion
 * with proper error handling and fallback values.
 *
 * **Error Handling:**
 * - Handles null/undefined values gracefully
 * - Catches conversion errors from invalid Big.js instances
 * - Always returns a valid number to prevent NaN propagation
 * - Uses defensive programming principles
 *
 * **Performance Optimization:**
 * - Early return for null/undefined (most common case)
 * - Minimal try/catch scope for performance
 * - Pure function with no side effects
 *
 * @param value - Big.js value from Mendix attribute or null/undefined
 * @param defaultValue - Fallback value when conversion fails
 * @returns Converted number or default value
 *
 * @example
 * ```typescript
 * // Safe conversion with default
 * const maxValue = bigToNumber(props.maxValue, 5);
 * const opacity = bigToNumber(props.fillOpacity, 0.3);
 *
 * // Handling potentially undefined values
 * const width = bigToNumber(props.chartWidth, 400);
 * const height = bigToNumber(props.chartHeight, 400);
 *
 * // Array processing
 * const processedData = rawData.map(item => ({
 *   name: item.name,
 *   value: bigToNumber(item.scoreAttribute, 0)
 * }));
 * ```
 */
export function bigToNumber(value: Big | undefined | null, defaultValue = 0): number {
    if (!value) {
        return defaultValue;
    }
    try {
        return value.toNumber();
    } catch {
        return defaultValue;
    }
}

/**
 * Generates default radar chart data for preview and fallback scenarios.
 *
 * This function provides semantically meaningful sample data that demonstrates
 * the radar chart's capabilities while being relevant to common business use cases.
 * The data represents organizational capability assessment categories.
 *
 * **Use Cases:**
 * - Studio Pro preview mode when no data source is configured
 * - Fallback when data source is temporarily unavailable
 * - Development and testing scenarios
 * - Documentation and example generation
 *
 * **Data Characteristics:**
 * - 8 data points creating an octagon shape
 * - Values range from 3.7 to 4.5 on a 5-point scale
 * - Realistic variance to show chart capabilities
 * - Business-relevant category names
 * - Demonstrates minimum 5-sided polygon with extra points
 *
 * **Performance:**
 * - Pure function with no side effects
 * - Returns new array instance each call (immutable)
 * - Optimized for frequent calls during preview
 * - Minimal memory allocation
 *
 * @returns Array of 8 sample data points for demonstration
 *
 * @example
 * ```typescript
 * // Preview mode fallback
 * const previewData = getDefaultRadarChartData();
 *
 * // Development testing
 * const testChart = (
 *   <RadarChart
 *     data={getDefaultRadarChartData()}
 *     config={defaultConfig}
 *   />
 * );
 *
 * // Documentation example
 * const exampleData = getDefaultRadarChartData();
 * console.log(exampleData);
 * // Output: [
 * //   { name: "Roles and Skills", value: 4.2 },
 * //   { name: "Agile Working", value: 3.8 },
 * //   ...
 * // ]
 * ```
 */
export function getDefaultRadarChartData(): RadarChartDataPoint[] {
    return [
        { name: "Roles and Skills", value: 4.2 },
        { name: "Agile Working", value: 3.8 },
        { name: "Training", value: 4.5 },
        { name: "Experts", value: 3.9 },
        { name: "Program Owner", value: 4.1 },
        { name: "Sponsorship", value: 4.3 },
        { name: "Technical Owner", value: 3.7 },
        { name: "Partners", value: 4.0 }
    ];
}
