import { useMemo } from "react";
import { RadarChartDataPoint } from "../types/RadarChartTypes";
import { CHART_DEFAULTS, ANIMATION_CONFIG } from "../constants/chartConstants";

/**
 * 2D coordinate point for chart positioning calculations.
 *
 * Used throughout the chart system for positioning elements in SVG coordinate space.
 * All coordinates are relative to the SVG viewBox origin (top-left corner).
 *
 * @interface Point
 */
export interface Point {
    /** X coordinate in pixels from the left edge of the SVG */
    x: number;
    /** Y coordinate in pixels from the top edge of the SVG */
    y: number;
}

/**
 * Core chart dimensions and geometric properties.
 *
 * This interface encapsulates all the fundamental measurements and angles
 * needed for radar chart layout calculations. All derived geometric calculations
 * depend on these base dimensions.
 *
 * @interface ChartDimensions
 */
export interface ChartDimensions {
    /** X coordinate of the chart center point in SVG pixels */
    centerX: number;
    /** Y coordinate of the chart center point in SVG pixels */
    centerY: number;
    /**
     * Radius of the chart in pixels from center to edge.
     * Calculated as half the minimum dimension minus padding.
     */
    radius: number;
    /**
     * Number of spokes/sides in the polygon.
     * Always at least 5 to ensure readable visualization.
     */
    spokeCount: number;
    /**
     * Angular step between spokes in radians.
     * Calculated as 2π divided by spokeCount.
     */
    angleStep: number;
}

/**
 * Line coordinates for radial spokes extending from center to edge.
 *
 * Each spoke provides a reference line from the chart center to the perimeter,
 * helping users visually align data points with their corresponding labels.
 *
 * @interface SpokeData
 */
export interface SpokeData {
    /** X coordinate of spoke start point (chart center) */
    x1: number;
    /** Y coordinate of spoke start point (chart center) */
    y1: number;
    /** X coordinate of spoke end point (chart edge) */
    x2: number;
    /** Y coordinate of spoke end point (chart edge) */
    y2: number;
}

/**
 * Comprehensive chart calculations hook for radar chart geometry.
 *
 * This hook is the mathematical heart of the radar chart component, handling all
 * geometric calculations needed for proper chart rendering. It processes raw data
 * into SVG-ready coordinates and paths while maintaining optimal performance through
 * aggressive memoization.
 *
 * **Mathematical Operations:**
 * - Polar to Cartesian coordinate conversion
 * - Polygon generation for grid levels
 * - Smooth curve path generation using cubic Bézier curves
 * - Animation interpolation with progress scaling
 * - Data normalization to ensure minimum polygon sides
 *
 * **Performance Optimizations:**
 * - Comprehensive memoization of all expensive calculations
 * - Eliminated redundant data processing across components
 * - Single source of truth for chart geometry
 * - Optimized trigonometric calculations
 * - Minimal dependency arrays for efficient re-computation
 *
 * **Key Features:**
 * - Automatic minimum 5-sided polygon enforcement
 * - Smooth animation support with progress interpolation
 * - Grid level generation for visual reference
 * - Spoke positioning for radial guidelines
 * - Cubic Bézier path generation for smooth curves
 *
 * @param width - Chart width in pixels
 * @param height - Chart height in pixels
 * @param data - Array of radar chart data points
 * @param maxValue - Maximum value for scaling calculations
 * @param animationProgress - Animation progress from 0 to 1
 * @returns Complete set of chart geometry calculations
 *
 * @example
 * ```typescript
 * // Basic usage in a chart component
 * const {
 *   dimensions,
 *   gridPolygons,
 *   dataPoints,
 *   radarPath,
 *   spokes,
 *   normalizedData
 * } = useChartCalculations(400, 400, data, 5, 1.0);
 *
 * // Animated chart with progress
 * const [progress, setProgress] = useState(0);
 * const calculations = useChartCalculations(
 *   width, height, data, maxValue, progress
 * );
 * ```
 */
export function useChartCalculations(
    width: number,
    height: number,
    data: RadarChartDataPoint[],
    maxValue: number,
    animationProgress: number
): {
    dimensions: ChartDimensions;
    gridPolygons: string[];
    dataPoints: Point[];
    radarPath: string;
    spokes: SpokeData[];
    normalizedData: RadarChartDataPoint[];
} {
    /**
     * Data normalization to ensure minimum polygon requirements.
     *
     * Radar charts require at least 5 sides to be visually readable and mathematically
     * stable. This processing step pads insufficient data with zero-value points to
     * meet the minimum requirement while preserving original data integrity.
     *
     * **Processing Rules:**
     * - Maintains original data order and values
     * - Adds zero-value padding points only when needed
     * - Generates semantic names for padding points
     * - Ensures consistent polygon shape across different data sizes
     */
    const normalizedData = useMemo(() => {
        const processedData = [...data];

        // Ensure minimum required spokes for proper polygon rendering
        while (processedData.length < CHART_DEFAULTS.MINIMUM_SPOKES) {
            processedData.push({
                name: `Point ${processedData.length + 1}`,
                value: 0
            });
        }

        return processedData;
    }, [data]);

    /**
     * Base chart dimensions calculation.
     *
     * Computes the fundamental geometric properties needed for all subsequent
     * chart calculations. Centers the chart within the available space and
     * calculates the maximum radius while accounting for padding and labels.
     */
    const dimensions: ChartDimensions = useMemo(() => {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - CHART_DEFAULTS.PADDING;
        const spokeCount = normalizedData.length;
        const angleStep = (2 * Math.PI) / spokeCount;

        return { centerX, centerY, radius, spokeCount, angleStep };
    }, [width, height, normalizedData.length]);

    /**
     * Grid polygon generation for visual reference levels.
     *
     * Creates concentric polygons at regular intervals from the center to the edge,
     * providing visual reference for value estimation. Each level represents a
     * proportional value step based on the maximum value setting.
     *
     * **Algorithm:**
     * - Generates CHART_DEFAULTS.GRID_LEVELS concentric polygons
     * - Each polygon has vertices at spoke positions
     * - Radius scales linearly from center to edge
     * - Returns SVG polygon point strings for rendering
     */
    const gridPolygons = useMemo(() => {
        const polygons: string[] = [];
        const { centerX, centerY, radius, spokeCount, angleStep } = dimensions;

        for (let level = 1; level <= CHART_DEFAULTS.GRID_LEVELS; level++) {
            const levelRadius = (radius * level) / CHART_DEFAULTS.GRID_LEVELS;
            const points: string[] = [];

            for (let spoke = 0; spoke < spokeCount; spoke++) {
                const angle = spoke * angleStep - Math.PI / 2;
                const x = centerX + levelRadius * Math.cos(angle);
                const y = centerY + levelRadius * Math.sin(angle);
                points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
            }

            polygons.push(points.join(" "));
        }

        return polygons;
    }, [dimensions]);

    /**
     * Static data point calculations (without animation).
     *
     * Pre-calculates angle and maximum radius for each data point to avoid
     * redundant trigonometric calculations during animation frames.
     */
    const staticDataPoints = useMemo(() => {
        const { centerX, centerY, radius, angleStep } = dimensions;

        return normalizedData.map((dataPoint, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const clampedValue = Math.max(0, Math.min(maxValue, dataPoint.value));
            const maxPointRadius = (radius * clampedValue) / maxValue;

            return {
                angle,
                maxRadius: maxPointRadius,
                centerX,
                centerY,
                cos: Math.cos(angle),
                sin: Math.sin(angle)
            };
        });
    }, [dimensions, normalizedData, maxValue]);

    /**
     * Animated data point coordinates.
     *
     * Applies animation progress to pre-calculated static values for optimal performance.
     * Only recalculates final positions, not angles or trigonometric functions.
     */
    const dataPoints = useMemo(() => {
        return staticDataPoints.map(({ centerX, centerY, maxRadius, cos, sin }) => {
            const animatedRadius = maxRadius * animationProgress;

            return {
                x: centerX + animatedRadius * cos,
                y: centerY + animatedRadius * sin
            };
        });
    }, [staticDataPoints, animationProgress]);

    /**
     * Smooth radar path generation using cubic Bézier curves.
     *
     * Creates a closed SVG path that connects all data points with smooth curves
     * instead of straight lines. Uses cubic Bézier control points to create
     * visually appealing, organic-looking shapes that are easier to read.
     *
     * **Path Algorithm:**
     * - Starts with moveTo command for first point
     * - Uses curveTo commands with calculated control points
     * - Applies consistent control point distance for smooth curves
     * - Closes path with 'Z' command for proper fill rendering
     * - Handles edge cases for insufficient data gracefully
     */
    const radarPath = useMemo(() => {
        if (dataPoints.length === 0) {
            return "";
        }

        let path = `M ${dataPoints[0].x.toFixed(2)} ${dataPoints[0].y.toFixed(2)}`;

        for (let i = 0; i < dataPoints.length; i++) {
            const current = dataPoints[i];
            const next = dataPoints[(i + 1) % dataPoints.length];

            // Optimized control points calculation
            const dx = next.x - current.x;
            const dy = next.y - current.y;

            const cp1x = current.x + dx * ANIMATION_CONFIG.CONTROL_POINT_DISTANCE;
            const cp1y = current.y + dy * ANIMATION_CONFIG.CONTROL_POINT_DISTANCE;
            const cp2x = next.x - dx * ANIMATION_CONFIG.CONTROL_POINT_DISTANCE;
            const cp2y = next.y - dy * ANIMATION_CONFIG.CONTROL_POINT_DISTANCE;

            path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${next.x.toFixed(
                2
            )} ${next.y.toFixed(2)}`;
        }

        return `${path} Z`;
    }, [dataPoints]);

    /**
     * Radial spoke generation for grid structure.
     *
     * Creates straight lines extending from the chart center to the edge at
     * each data point angle. These spokes provide visual structure and help
     * users align data points with their corresponding category labels.
     *
     * **Generation Process:**
     * - One spoke per data category at calculated angles
     * - All spokes start at chart center coordinates
     * - End points calculated using trigonometric functions
     * - Coordinates optimized for SVG line element rendering
     */
    const spokes = useMemo(() => {
        const spokesData: SpokeData[] = [];
        const { centerX, centerY, radius, spokeCount, angleStep } = dimensions;

        for (let i = 0; i < spokeCount; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const endX = centerX + radius * Math.cos(angle);
            const endY = centerY + radius * Math.sin(angle);

            spokesData.push({
                x1: centerX,
                y1: centerY,
                x2: endX,
                y2: endY
            });
        }

        return spokesData;
    }, [dimensions]);

    return {
        dimensions,
        gridPolygons,
        dataPoints,
        radarPath,
        spokes,
        normalizedData
    };
}

/**
 * Lightweight hook for basic chart dimension calculations.
 *
 * Provides a simplified version of chart calculations when only basic geometric
 * properties are needed without the overhead of full chart geometry processing.
 * Useful for layout calculations, sizing, and positioning operations.
 *
 * **Use Cases:**
 * - Layout calculations for legend positioning
 * - Preliminary sizing before data is available
 * - Component positioning relative to chart dimensions
 * - Performance optimization when full calculations aren't needed
 *
 * **Performance Benefits:**
 * - Minimal computational overhead
 * - No complex geometric calculations
 * - Reduced memory allocation
 * - Faster re-computation for dimension changes
 *
 * @param width - Chart width in pixels
 * @param height - Chart height in pixels
 * @param spokeCount - Number of spokes/data points for angle calculation
 * @returns Basic chart dimension properties
 *
 * @example
 * ```typescript
 * // Layout calculations
 * const dimensions = useChartDimensions(400, 400, 6);
 * const legendWidth = dimensions.radius * 0.4;
 *
 * // Positioning elements relative to chart
 * const titleY = dimensions.centerY - dimensions.radius - 20;
 * ```
 */
export function useChartDimensions(width: number, height: number, spokeCount: number): ChartDimensions {
    return useMemo(() => {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - CHART_DEFAULTS.PADDING;
        const actualSpokeCount = Math.max(CHART_DEFAULTS.MINIMUM_SPOKES, spokeCount);
        const angleStep = (2 * Math.PI) / actualSpokeCount;

        return {
            centerX,
            centerY,
            radius,
            spokeCount: actualSpokeCount,
            angleStep
        };
    }, [width, height, spokeCount]);
}
