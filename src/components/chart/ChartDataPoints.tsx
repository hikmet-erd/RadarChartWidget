import React, { ReactElement, createElement, useMemo, useCallback } from "react";
import { RadarChartDataPoint } from "../../types/RadarChartTypes";
import { Point } from "../../hooks/useChartCalculations";
import { DATA_POINT_CONFIG } from "../../constants/chartConstants";

/**
 * Props interface for the ChartDataPoints component.
 *
 * Defines the configuration options for rendering interactive data point
 * circles on the radar chart, including positioning, styling, and event handling.
 *
 * @interface ChartDataPointsProps
 */
export interface ChartDataPointsProps {
    /**
     * Array of calculated point positions for SVG rendering.
     * Each point contains x,y coordinates for circle placement.
     */
    dataPoints: Point[];

    /**
     * Array of normalized data point values with names and values.
     * Used for tooltip content and interaction handling.
     */
    normalizedData: RadarChartDataPoint[];

    /**
     * Color for data point circles and borders.
     * Should provide good contrast against the chart background.
     */
    strokeColor: string;

    /**
     * Current animation progress value between 0 and 1.
     * Controls opacity and visibility during chart entrance animation.
     */
    animationProgress: number;

    /**
     * Callback function for data point mouse enter events.
     * Receives the data point object and mouse event for tooltip positioning.
     *
     * @param dataPoint - The radar chart data point that was hovered
     * @param event - React mouse event containing position information
     */
    onDataPointMouseEnter: (dataPoint: RadarChartDataPoint, event: React.MouseEvent) => void;

    /**
     * Callback function for data point mouse leave events.
     * Typically used to hide tooltips when mouse exits data point area.
     */
    onDataPointMouseLeave: () => void;
}

/**
 * Optimized data points component for radar chart interaction.
 *
 * This component renders interactive circular markers at each data point
 * position on the radar chart. It provides hover interactions, tooltip
 * support, and smooth animations while maintaining excellent performance
 * through React optimization patterns.
 *
 * **Key Features:**
 * - **Interactive Circles**: Clickable/hoverable data point markers
 * - **Performance Optimized**: React.useMemo and useCallback for efficiency
 * - **Animation Support**: Smooth opacity transitions during chart entrance
 * - **Tooltip Integration**: Mouse event handling for tooltip positioning
 * - **Accessibility Ready**: Semantic structure and interaction patterns
 * - **Visual Consistency**: Consistent styling with chart theme
 *
 * **Interaction Design:**
 * - **Hover Effects**: Visual feedback on mouse enter/leave
 * - **Tooltip Triggers**: Provides data for contextual information display
 * - **Cursor Feedback**: Pointer cursor indicates interactivity
 * - **Touch Friendly**: Appropriately sized for mobile interaction
 * - **Smooth Transitions**: Animated opacity changes during chart loading
 *
 * **Performance Optimizations:**
 * - **Memoized Rendering**: Data point elements cached until props change
 * - **Stable Event Handlers**: useCallback prevents unnecessary re-renders
 * - **Efficient Filtering**: Only renders visible data points (value > 0)
 * - **Minimal DOM**: Single circle element per data point
 * - **Optimized Keys**: Stable keys prevent unnecessary DOM manipulation
 *
 * **Visual Design:**
 * - **Consistent Sizing**: Uses standardized radius from configuration
 * - **High Contrast**: White stroke ensures visibility on any background
 * - **Professional Appearance**: Clean, modern circular markers
 * - **Theme Integration**: Respects chart color scheme and styling
 *
 * **Data Handling:**
 * - **Null Safety**: Gracefully handles missing or invalid data points
 * - **Zero Value Filtering**: Skips rendering for zero/empty values
 * - **Index Matching**: Maintains proper correspondence between positions and data
 * - **Type Safety**: Full TypeScript integration with proper interfaces
 *
 * @param props - Configuration for data point rendering and interaction
 * @returns JSX element containing interactive data point circles
 *
 * @example
 * ```tsx
 * // Basic data points rendering
 * <ChartDataPoints
 *   dataPoints={calculatedPositions}
 *   normalizedData={processedData}
 *   strokeColor="#7C5AC4"
 *   animationProgress={1.0}
 *   onDataPointMouseEnter={(data, event) => showTooltip(data, event)}
 *   onDataPointMouseLeave={() => hideTooltip()}
 * />
 *
 * // With animation progress
 * <ChartDataPoints
 *   dataPoints={positions}
 *   normalizedData={data}
 *   strokeColor={theme.primary}
 *   animationProgress={animationValue}
 *   onDataPointMouseEnter={handleHover}
 *   onDataPointMouseLeave={handleLeave}
 * />
 * ```
 *
 * @example
 * ```typescript
 * // Usage within radar chart with tooltip
 * function RadarChart({ data }) {
 *   const { dataPoints } = useChartCalculations(data);
 *   const [tooltip, setTooltip] = useState({ visible: false });
 *
 *   const handleMouseEnter = (dataPoint, event) => {
 *     const rect = event.currentTarget.getBoundingClientRect();
 *     setTooltip({
 *       visible: true,
 *       x: rect.left,
 *       y: rect.top,
 *       data: dataPoint
 *     });
 *   };
 *
 *   return (
 *     <svg>
 *       <ChartDataPoints
 *         dataPoints={dataPoints}
 *         normalizedData={data}
 *         strokeColor="#7C5AC4"
 *         animationProgress={1}
 *         onDataPointMouseEnter={handleMouseEnter}
 *         onDataPointMouseLeave={() => setTooltip({ visible: false })}
 *       />
 *       {tooltip.visible && <Tooltip {...tooltip} />}
 *     </svg>
 *   );
 * }
 * ```
 */
export function ChartDataPoints({
    dataPoints,
    normalizedData,
    strokeColor,
    animationProgress,
    onDataPointMouseEnter,
    onDataPointMouseLeave
}: ChartDataPointsProps): ReactElement {
    // Optimized mouse enter handler with stable reference
    const handleMouseEnter = useCallback(
        (dataPoint: RadarChartDataPoint) => (event: React.MouseEvent) => {
            onDataPointMouseEnter(dataPoint, event);
        },
        [onDataPointMouseEnter]
    );

    // Memoized data point circles for optimal rendering performance
    const dataPointElements = useMemo(() => {
        return dataPoints
            .map((point, index) => {
                const dataPoint = normalizedData[index];

                // Skip rendering for missing or zero-value data points
                if (!dataPoint || dataPoint.value === 0) {
                    return null;
                }

                return (
                    <circle
                        key={`point-${index}`}
                        cx={point.x}
                        cy={point.y}
                        r={DATA_POINT_CONFIG.RADIUS}
                        fill={strokeColor}
                        stroke={DATA_POINT_CONFIG.STROKE_COLOR}
                        strokeWidth={DATA_POINT_CONFIG.STROKE_WIDTH}
                        className="radar-chart__data-point"
                        opacity={animationProgress}
                        style={{ cursor: "pointer" }}
                        onMouseEnter={handleMouseEnter(dataPoint)}
                        onMouseLeave={onDataPointMouseLeave}
                    />
                );
            })
            .filter(Boolean); // Remove null entries for clean rendering
    }, [dataPoints, normalizedData, strokeColor, animationProgress, handleMouseEnter, onDataPointMouseLeave]);

    return <g className="radar-chart__data-points">{dataPointElements}</g>;
}
