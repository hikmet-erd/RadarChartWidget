import { ReactElement, createElement } from "react";

/**
 * Props interface for the SkeletonLoader component.
 *
 * Defines the configuration options for the skeleton loading animation,
 * including dimensions and optional styling customization.
 *
 * @interface SkeletonLoaderProps
 */
export interface SkeletonLoaderProps {
    /**
     * Width of the skeleton loader container in pixels.
     * Should match the expected chart width for seamless transition.
     */
    width: number;

    /**
     * Height of the skeleton loader container in pixels.
     * Should match the expected chart height for seamless transition.
     */
    height: number;

    /**
     * Optional additional CSS class names for custom styling.
     * Allows for theme customization and integration with design systems.
     */
    className?: string;
}

/**
 * Pre-generated stable skeleton widths for consistent loading animation.
 *
 * These widths are carefully chosen to simulate realistic category label
 * lengths without being too uniform. Using pre-generated values instead
 * of random calculations improves performance and provides consistent
 * visual appearance across renders.
 *
 * **Design Rationale:**
 * - Varied lengths (75px-96px) simulate realistic category names
 * - Static values prevent animation flickering on re-renders
 * - 8 widths provide enough variety for most use cases
 * - Lengths chosen to fit common category name patterns
 *
 * @constant
 */
const SKELETON_WIDTHS = ["85px", "92px", "78px", "96px", "82px", "89px", "75px", "94px"];

/**
 * Skeleton loading component for radar chart widgets.
 *
 * This component provides a smooth loading experience by displaying an animated
 * placeholder that mimics the structure and appearance of the radar chart.
 * It helps maintain visual continuity and provides user feedback during
 * data loading operations.
 *
 * **Key Features:**
 * - **Structural Mimicry**: Matches radar chart layout and proportions
 * - **Smooth Animations**: CSS-based animations with staggered timing
 * - **Accessibility Compliant**: Proper ARIA labels and screen reader support
 * - **Performance Optimized**: Lightweight implementation with minimal DOM
 * - **Responsive Design**: Adapts to provided dimensions automatically
 * - **Theme Integration**: Supports custom styling through CSS classes
 *
 * **Animation Strategy:**
 * - **Staggered Labels**: Each label has a slight animation delay for visual flow
 * - **Shimmer Effect**: CSS-based shimmer animation for loading indication
 * - **Circular Placeholder**: Represents the radar chart shape accurately
 * - **Performance Optimized**: Uses CSS transforms for hardware acceleration
 *
 * **Accessibility Features:**
 * - **role="status"**: Indicates dynamic content loading
 * - **aria-label**: Descriptive loading message for screen readers
 * - **Screen Reader Text**: Hidden text provides additional context
 * - **Reduced Motion**: Respects user motion preferences via CSS
 *
 * **Layout Calculations:**
 * - Chart placeholder sized to fit within provided dimensions
 * - Maximum size constraints prevent oversized placeholders
 * - 40px padding ensures labels don't get clipped at edges
 * - Circular aspect ratio maintained for authentic preview
 *
 * @param props - Configuration options for the skeleton loader
 * @returns JSX element representing the loading skeleton
 *
 * @example
 * ```tsx
 * // Basic skeleton loader
 * <SkeletonLoader width={400} height={400} />
 *
 * // With custom styling
 * <SkeletonLoader
 *   width={500}
 *   height={500}
 *   className="custom-skeleton-theme"
 * />
 *
 * // Responsive skeleton
 * <SkeletonLoader
 *   width={containerWidth}
 *   height={containerHeight}
 * />
 * ```
 *
 * @example
 * ```typescript
 * // Usage in data loading pattern
 * function RadarChartContainer({ dataSource }) {
 *   const { data, isLoading } = useRadarChartData(dataSource);
 *
 *   if (isLoading) {
 *     return <SkeletonLoader width={400} height={400} />;
 *   }
 *
 *   return <RadarChart data={data} />;
 * }
 * ```
 */
export function SkeletonLoader({ width, height, className = "" }: SkeletonLoaderProps): ReactElement {
    return (
        <div
            className={`radar-chart-widget__skeleton ${className}`}
            style={{ width, height }}
            role="status"
            aria-label="Loading chart data"
        >
            <div
                className="radar-chart-widget__skeleton__chart"
                style={{
                    width: Math.min(width - 40, height - 40),
                    height: Math.min(width - 40, height - 40),
                    maxWidth: 260,
                    maxHeight: 260
                }}
                aria-hidden="true"
            />
            <div className="radar-chart-widget__skeleton__labels" aria-hidden="true">
                {SKELETON_WIDTHS.map((labelWidth, index) => (
                    <div
                        key={`skeleton-label-${index}`}
                        className="radar-chart-widget__skeleton__label"
                        style={{
                            width: labelWidth,
                            animationDelay: `${index * 0.1}s`
                        }}
                    />
                ))}
            </div>
            <span className="sr-only">Loading chart data, please wait...</span>
        </div>
    );
}
