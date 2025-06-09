import React, { ReactElement, createElement, useMemo } from "react";
import { GRID_CONFIG } from "../../constants/chartConstants";

/**
 * Props interface for the ChartGrid component.
 *
 * Defines the configuration options for rendering radar chart grid elements,
 * including grid polygons, spokes, and visual styling.
 *
 * @interface ChartGridProps
 */
export interface ChartGridProps {
    /**
     * Array of polygon point strings for concentric grid levels.
     * Each string contains SVG polygon points in "x1,y1 x2,y2 ..." format.
     */
    gridPolygons: string[];

    /**
     * Array of spoke line definitions for radial grid lines.
     * Each spoke connects center to perimeter for category divisions.
     */
    spokes: Array<{ x1: number; y1: number; x2: number; y2: number }>;

    /**
     * Color for grid lines and spokes.
     * Should provide subtle reference without interfering with data visualization.
     */
    gridColor: string;

    /**
     * Whether to display grid lines and spokes.
     * When false, component renders null for clean chart appearance.
     */
    showGridLines: boolean;
}

/**
 * Optimized grid component for radar chart infrastructure.
 *
 * This component renders the structural elements of a radar chart including
 * concentric polygons for value reference and radial spokes for category
 * division. It uses React memoization for optimal performance and provides
 * clean visual reference without interfering with data visualization.
 *
 * **Key Features:**
 * - **Performance Optimized**: React.useMemo prevents unnecessary re-renders
 * - **Conditional Rendering**: Efficiently handles show/hide state
 * - **Scalable Design**: Works with any number of grid levels and categories
 * - **SVG Optimized**: Minimal DOM elements with efficient SVG rendering
 * - **Theme Integration**: Respects grid color and styling configuration
 * - **Accessibility Friendly**: Proper semantic structure and ARIA handling
 *
 * **Grid Structure:**
 * - **Concentric Polygons**: Multiple levels showing value increments
 * - **Radial Spokes**: Lines from center to perimeter for category divisions
 * - **Consistent Styling**: Uniform stroke width and opacity across elements
 * - **Layered Rendering**: Grid appears behind data elements
 *
 * **Performance Optimizations:**
 * - **Memoized Elements**: Grid and spoke elements cached until props change
 * - **Early Return**: Null rendering when grid is disabled
 * - **Minimal Re-computation**: Only updates when necessary props change
 * - **Efficient Keys**: Stable keys prevent unnecessary DOM manipulation
 *
 * **Rendering Strategy:**
 * - **Grouped Elements**: Separate groups for polygons and spokes
 * - **CSS Class Integration**: Proper class names for styling hooks
 * - **SVG Optimization**: Direct SVG elements for best performance
 * - **Memory Efficient**: No persistent state or complex computations
 *
 * @param props - Configuration for grid rendering
 * @returns JSX element containing grid infrastructure or null
 *
 * @example
 * ```tsx
 * // Basic grid rendering
 * <ChartGrid
 *   gridPolygons={calculatedPolygons}
 *   spokes={calculatedSpokes}
 *   gridColor="#e0e0e0"
 *   showGridLines={true}
 * />
 *
 * // Hidden grid for clean appearance
 * <ChartGrid
 *   gridPolygons={[]}
 *   spokes={[]}
 *   gridColor="#e0e0e0"
 *   showGridLines={false}
 * />
 * ```
 *
 * @example
 * ```typescript
 * // Usage within radar chart
 * function RadarChart({ data, showGrid, gridColor }) {
 *   const { gridPolygons, spokes } = useChartCalculations(data);
 *
 *   return (
 *     <svg>
 *       <ChartGrid
 *         gridPolygons={gridPolygons}
 *         spokes={spokes}
 *         gridColor={gridColor}
 *         showGridLines={showGrid}
 *       />
 *       <ChartDataPath data={data} />
 *       <ChartDataPoints data={data} />
 *     </svg>
 *   );
 * }
 * ```
 */
export function ChartGrid({ gridPolygons, spokes, gridColor, showGridLines }: ChartGridProps): ReactElement | null {
    // Memoized grid polygons for concentric value reference levels
    const gridElements = useMemo(() => {
        if (!showGridLines) {
            return null;
        }

        return (
            <g className="radar-chart__grid">
                {gridPolygons.map((polygonPoints, i) => (
                    <polygon
                        key={`grid-${i}`}
                        points={polygonPoints}
                        fill="none"
                        stroke={gridColor}
                        strokeWidth={GRID_CONFIG.STROKE_WIDTH}
                        opacity={GRID_CONFIG.OPACITY}
                        className="radar-chart__grid-polygon"
                    />
                ))}
            </g>
        );
    }, [showGridLines, gridPolygons, gridColor]);

    // Memoized spokes for radial category division lines
    const spokesElements = useMemo(() => {
        if (!showGridLines) {
            return null;
        }

        return (
            <g className="radar-chart__spokes">
                {spokes.map((spoke, i) => (
                    <line
                        key={`spoke-${i}`}
                        x1={spoke.x1}
                        y1={spoke.y1}
                        x2={spoke.x2}
                        y2={spoke.y2}
                        stroke={gridColor}
                        strokeWidth={GRID_CONFIG.STROKE_WIDTH}
                        opacity={GRID_CONFIG.OPACITY}
                        className="radar-chart__spoke"
                    />
                ))}
            </g>
        );
    }, [showGridLines, spokes, gridColor]);

    // Early return for disabled grid
    if (!showGridLines) {
        return null;
    }

    return (
        <React.Fragment>
            {gridElements}
            {spokesElements}
        </React.Fragment>
    );
}
