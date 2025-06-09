import { RadarChartDataPoint } from "../types/RadarChartTypes";
import { A11Y_CONSTANTS } from "../constants/chartConstants";

/**
 * Generates semantic polygon type names for screen reader descriptions.
 *
 * This utility function converts numeric side counts into proper geometric names,
 * enhancing the accessibility of chart descriptions by using familiar terminology
 * instead of raw numbers. It ensures all charts have at least 5 sides for
 * visual stability and readability.
 *
 * **Naming Strategy:**
 * - Uses standard geometric terminology (pentagon, hexagon, etc.)
 * - Enforces minimum 5 sides for chart stability
 * - Falls back to descriptive format for unusual polygon sizes
 * - Provides consistent vocabulary for screen reader users
 *
 * **Educational Value:**
 * - Helps users understand chart structure
 * - Uses familiar geometric terms when possible
 * - Provides clear fallback for unusual configurations
 *
 * @param sides - Number of data points/polygon sides
 * @returns Semantic name for the polygon shape
 *
 * @example
 * ```typescript
 * getPolygonType(5); // "Pentagon"
 * getPolygonType(8); // "Octagon"
 * getPolygonType(12); // "12-sided polygon"
 * getPolygonType(3); // "Pentagon" (enforced minimum)
 * ```
 */
function getPolygonType(sides: number): string {
    const effectiveSides = Math.max(5, sides); // Minimum 5 sides

    const polygonNames: Record<number, string> = {
        5: "Pentagon",
        6: "Hexagon",
        7: "Heptagon",
        8: "Octagon",
        9: "Nonagon",
        10: "Decagon"
    };

    return polygonNames[effectiveSides] || `${effectiveSides}-sided polygon`;
}

/**
 * Generates comprehensive chart descriptions for screen readers and assistive technology.
 *
 * This function creates detailed, accessible descriptions that help users with visual
 * impairments understand the chart's structure, content, and data patterns. It follows
 * WCAG guidelines for meaningful alternative text and provides context that would be
 * visually apparent to sighted users.
 *
 * **Accessibility Standards:**
 * - WCAG 2.1 AA compliance for alternative text
 * - Structured information hierarchy from general to specific
 * - Meaningful data patterns and relationships
 * - Context-aware descriptions based on data availability
 *
 * **Description Structure:**
 * 1. Optional title for context
 * 2. Chart type and geometric structure
 * 3. Data point count and availability
 * 4. Individual data point details with percentages
 * 5. Meaningful data patterns when applicable
 *
 * **Data Processing:**
 * - Filters out zero/invalid values for clarity
 * - Calculates percentages for better understanding
 * - Handles edge cases (empty data, all zeros)
 * - Provides fallback descriptions for unusual scenarios
 *
 * @param data - Array of radar chart data points to describe
 * @param maxValue - Maximum value for percentage calculations
 * @param title - Optional chart title for additional context
 * @returns Comprehensive text description for screen readers
 *
 * @example
 * ```typescript
 * const data = [
 *   { name: "Performance", value: 4.2 },
 *   { name: "Quality", value: 3.8 }
 * ];
 *
 * const description = generateChartDescription(data, 5, "Team Metrics");
 * // "Team Metrics. Pentagon radar chart with 2 data points.
 * //  Performance: 4.2 out of 5 (84%), Quality: 3.8 out of 5 (76%)."
 * ```
 */
export function generateChartDescription(data: RadarChartDataPoint[], maxValue: number, title?: string): string {
    if (!data || data.length === 0) {
        return "Empty radar chart with no data points.";
    }

    const titlePart = title ? `${title}. ` : "";
    const polygonType = getPolygonType(data.length);
    const summaryPart = `${polygonType} radar chart with ${data.length} data ${
        data.length === 1 ? "point" : "points"
    }. `;

    // Optimized data filtering and description generation
    const validDataPoints = data.filter(point => point.name && point.value > 0);

    if (validDataPoints.length === 0) {
        return `${titlePart}${summaryPart}All data points are zero or invalid.`;
    }

    const dataDescriptions = validDataPoints
        .map(point => {
            const percentage = Math.round((point.value / maxValue) * 100);
            return `${point.name}: ${point.value.toFixed(1)} out of ${maxValue} (${percentage}%)`;
        })
        .join(", ");

    return `${titlePart}${summaryPart}${dataDescriptions}.`;
}

/**
 * Generates statistical summaries providing analytical insights for screen readers.
 *
 * This function creates concise statistical summaries that help users understand
 * data patterns, trends, and outliers without having to process individual data
 * points manually. It provides the kind of analytical overview that sighted users
 * might derive from visual inspection.
 *
 * **Statistical Analysis:**
 * - Overall average for general performance understanding
 * - Highest and lowest values with category identification
 * - Meaningful comparisons and relationships
 * - Graceful handling of edge cases and missing data
 *
 * **User Value:**
 * - Quick understanding of overall performance levels
 * - Identification of strengths and improvement areas
 * - Contextual information for decision making
 * - Efficient information consumption for assistive technology users
 *
 * **Data Processing:**
 * - Excludes zero values from statistical calculations
 * - Handles empty datasets gracefully
 * - Provides meaningful precision (1 decimal place)
 * - Identifies specific categories for context
 *
 * @param data - Array of radar chart data points for analysis
 * @returns Concise statistical summary text
 *
 * @example
 * ```typescript
 * const data = [
 *   { name: "Performance", value: 4.2 },
 *   { name: "Quality", value: 3.8 },
 *   { name: "Innovation", value: 4.5 }
 * ];
 *
 * const summary = generateChartSummary(data);
 * // "Average score: 4.2. Highest: Innovation (4.5). Lowest: Quality (3.8)."
 * ```
 */
export function generateChartSummary(data: RadarChartDataPoint[]): string {
    if (!data || data.length === 0) {
        return "No data available.";
    }

    const validData = data.filter(point => point.value > 0);
    if (validData.length === 0) {
        return "All data points are zero.";
    }

    const values = validData.map(point => point.value);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const average = sum / values.length;
    const highest = Math.max(...values);
    const lowest = Math.min(...values);

    const highestCategory = validData.find(point => point.value === highest)?.name;
    const lowestCategory = validData.find(point => point.value === lowest)?.name;

    return `Average score: ${average.toFixed(1)}. Highest: ${highestCategory} (${highest.toFixed(
        1
    )}). Lowest: ${lowestCategory} (${lowest.toFixed(1)}).`;
}

/**
 * Provides contextual keyboard navigation instructions for accessibility.
 *
 * This function returns appropriate keyboard interaction guidance based on whether
 * the chart supports user interaction. It helps users understand available actions
 * and how to perform them using keyboard navigation, ensuring full accessibility
 * for users who cannot use pointing devices.
 *
 * **Accessibility Compliance:**
 * - WCAG 2.1 guideline 2.1 (Keyboard Accessible)
 * - Clear, actionable instructions
 * - Context-aware guidance based on functionality
 * - Consistent terminology with standard UI patterns
 *
 * **User Experience:**
 * - Immediate clarity about available interactions
 * - Standard key combinations (Enter/Space) for familiarity
 * - Clear distinction between interactive and display-only modes
 * - Concise instructions to avoid cognitive overload
 *
 * @param hasClickAction - Whether the chart supports click interaction
 * @returns Contextual keyboard navigation instructions
 *
 * @example
 * ```typescript
 * // Interactive chart
 * getKeyboardInstructions(true);
 * // "Press Enter or Space to interact with this chart."
 *
 * // Display-only chart
 * getKeyboardInstructions(false);
 * // "Chart is for display purposes only."
 * ```
 */
export function getKeyboardInstructions(hasClickAction: boolean): string {
    return hasClickAction
        ? A11Y_CONSTANTS.KEYBOARD_INSTRUCTIONS.INTERACTIVE
        : A11Y_CONSTANTS.KEYBOARD_INSTRUCTIONS.DISPLAY_ONLY;
}

/**
 * Generates comprehensive ARIA labels for screen reader identification and context.
 *
 * This function creates concise but informative ARIA labels that provide essential
 * chart information for screen readers and other assistive technologies. The labels
 * balance brevity with informativeness, giving users immediate context about the
 * chart's purpose, structure, and interactivity.
 *
 * **ARIA Best Practices:**
 * - Concise labels that don't overwhelm users
 * - Essential information in logical order
 * - Clear indication of interactivity status
 * - Semantic role identification for proper context
 *
 * **Label Structure:**
 * 1. Chart title (if provided) for context
 * 2. Geometric description (polygon type)
 * 3. Content summary (data point count)
 * 4. Interaction capability (if applicable)
 *
 * **Screen Reader Integration:**
 * - Used with role="img" or role="button" for proper semantics
 * - Complements detailed descriptions in aria-describedby
 * - Provides immediate context before detailed exploration
 * - Indicates interaction capabilities upfront
 *
 * @param data - Array of radar chart data points
 * @param title - Optional chart title for context
 * @param hasClickAction - Whether the chart supports interaction
 * @returns Concise ARIA label for screen reader identification
 *
 * @example
 * ```typescript
 * const data = [
 *   { name: "Performance", value: 4.2 },
 *   { name: "Quality", value: 3.8 }
 * ];
 *
 * // Interactive chart with title
 * generateAriaLabel(data, "Team Metrics", true);
 * // "Team Metrics pentagon radar chart with 2 data points, interactive"
 *
 * // Display-only chart
 * generateAriaLabel(data, undefined, false);
 * // "Pentagon radar chart with 2 data points"
 * ```
 */
export function generateAriaLabel(data: RadarChartDataPoint[], title?: string, hasClickAction?: boolean): string {
    const polygonType = getPolygonType(data.length);
    const baseLabel = title ? `${title} ${polygonType.toLowerCase()} radar chart` : `${polygonType} radar chart`;
    const validDataCount = data.filter(point => point.value > 0).length;
    const countLabel = ` with ${validDataCount} data ${validDataCount === 1 ? "point" : "points"}`;
    const interactionLabel = hasClickAction ? ", interactive" : "";

    return `${baseLabel}${countLabel}${interactionLabel}`;
}

/**
 * Generates detailed descriptions for individual data points with context and meaning.
 *
 * This utility function creates comprehensive descriptions for individual data points
 * that provide both absolute and relative context. It helps screen reader users
 * understand not just the raw values, but their significance within the chart's scale
 * and overall context.
 *
 * **Description Components:**
 * - Category name for identification
 * - Precise numeric value with appropriate precision
 * - Scale context (out of maximum value)
 * - Percentage representation for relative understanding
 * - Meaningful interpretation of the value's significance
 *
 * **Educational Value:**
 * - Helps users understand scale relationships
 * - Provides multiple perspectives on the same data
 * - Enables better comparative analysis
 * - Supports data-driven decision making
 *
 * **Accessibility Benefits:**
 * - Multiple data representations accommodate different preferences
 * - Precise values for users who need exact information
 * - Percentage context for relative understanding
 * - Clear category identification for navigation
 *
 * @param dataPoint - Individual radar chart data point to describe
 * @param maxValue - Maximum value for scale context and percentage calculation
 * @returns Detailed description with multiple data perspectives
 *
 * @example
 * ```typescript
 * const dataPoint = { name: "Communication Skills", value: 4.2 };
 * const description = generateDataPointDescription(dataPoint, 5);
 * // "Communication Skills: score 4.2 out of 5, representing 84% of maximum value"
 * ```
 */
export function generateDataPointDescription(dataPoint: RadarChartDataPoint, maxValue: number): string {
    const percentage = Math.round((dataPoint.value / maxValue) * 100);
    return `${dataPoint.name}: score ${dataPoint.value.toFixed(
        1
    )} out of ${maxValue}, representing ${percentage}% of maximum value`;
}

/**
 * Creates structured table-like data representations for advanced screen reader navigation.
 *
 * This function generates tabular descriptions that allow screen reader users to
 * navigate chart data in a structured, familiar format. It provides an alternative
 * to visual chart exploration that leverages screen readers' table navigation
 * capabilities for efficient data access.
 *
 * **Table Structure Benefits:**
 * - Familiar navigation patterns for screen reader users
 * - Efficient data comparison and analysis
 * - Structured information that's easy to remember
 * - Compatible with screen reader table navigation commands
 *
 * **Data Organization:**
 * - Clear column headers (Category, Value, Percentage)
 * - Consistent formatting across all data rows
 * - Logical data ordering for easy comprehension
 * - Compact representation for efficient consumption
 *
 * **Screen Reader Compatibility:**
 * - Works with table navigation shortcuts
 * - Provides structured data access patterns
 * - Enables efficient data comparison workflows
 * - Supports both sequential and random access patterns
 *
 * @param data - Array of radar chart data points to structure
 * @param maxValue - Maximum value for percentage calculations
 * @returns Structured table description for screen reader navigation
 *
 * @example
 * ```typescript
 * const data = [
 *   { name: "Performance", value: 4.2 },
 *   { name: "Quality", value: 3.8 }
 * ];
 *
 * const table = generateDataTable(data, 5);
 * // "Data table: Category, Value, Percentage. Rows: Performance, 4.2, 84%; Quality, 3.8, 76%."
 * ```
 */
export function generateDataTable(data: RadarChartDataPoint[], maxValue: number): string {
    if (!data || data.length === 0) {
        return "No data to display in table format.";
    }

    const header = "Category, Value, Percentage";
    const rows = data
        .map(point => {
            const percentage = Math.round((point.value / maxValue) * 100);
            return `${point.name}, ${point.value.toFixed(1)}, ${percentage}%`;
        })
        .join("; ");

    return `Data table: ${header}. Rows: ${rows}.`;
}

/**
 * Generates live region announcements for dynamic chart content changes.
 *
 * This function creates appropriate announcements for ARIA live regions when chart
 * data changes dynamically. It provides screen reader users with timely updates
 * about content changes without overwhelming them with unnecessary detail, following
 * WCAG guidelines for dynamic content accessibility.
 *
 * **Live Region Strategy:**
 * - Polite announcements that don't interrupt user workflow
 * - Meaningful change detection that focuses on significant updates
 * - Concise announcements that provide essential information
 * - Intelligent filtering to avoid announcement fatigue
 *
 * **Change Detection Logic:**
 * - Identifies structural changes (data point count differences)
 * - Detects significant value changes (threshold-based)
 * - Handles initial data loading scenarios
 * - Provides appropriate context for different change types
 *
 * **User Experience:**
 * - Timely notification of important changes
 * - Non-intrusive updates that respect user focus
 * - Meaningful announcements that aid understanding
 * - Consistent messaging for predictable experience
 *
 * @param oldData - Previous chart data for comparison
 * @param newData - Current chart data after update
 * @returns Appropriate live region announcement text
 *
 * @example
 * ```typescript
 * const oldData = [{ name: "Performance", value: 3.8 }];
 * const newData = [
 *   { name: "Performance", value: 4.2 },
 *   { name: "Quality", value: 3.9 }
 * ];
 *
 * const announcement = generateLiveRegionUpdate(oldData, newData);
 * // "Chart data changed from 1 to 2 data points."
 * ```
 */
export function generateLiveRegionUpdate(oldData: RadarChartDataPoint[], newData: RadarChartDataPoint[]): string {
    if (!oldData || oldData.length === 0) {
        return `Chart updated with ${newData.length} data points.`;
    }

    if (newData.length !== oldData.length) {
        return `Chart data changed from ${oldData.length} to ${newData.length} data points.`;
    }

    // Check for significant value changes
    const significantChanges = newData.filter((newPoint, index) => {
        const oldPoint = oldData[index];
        return oldPoint && Math.abs(newPoint.value - oldPoint.value) > 0.5;
    });

    if (significantChanges.length > 0) {
        return `Chart updated with ${significantChanges.length} significant value changes.`;
    }

    return "Chart data updated.";
}
