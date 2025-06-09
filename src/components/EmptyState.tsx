import { ReactElement, createElement } from "react";

/**
 * Props interface for the EmptyState component.
 *
 * Defines the configuration options for the empty state display,
 * including dimensions, messaging, visual elements, and interaction handlers.
 *
 * @interface EmptyStateProps
 */
export interface EmptyStateProps {
    /**
     * Width of the empty state container in pixels.
     * Should match the expected chart dimensions for consistent layout.
     */
    width: number;

    /**
     * Height of the empty state container in pixels.
     * Should match the expected chart dimensions for consistent layout.
     */
    height: number;

    /**
     * Optional title text for the empty state.
     * Provides a clear heading to explain the current state.
     *
     * @default "No Data Available"
     */
    title?: string;

    /**
     * Optional descriptive message explaining the empty state.
     * Should provide actionable guidance for users to resolve the situation.
     *
     * @default "Connect a data source to display your radar chart. Ensure your data source contains the required name and value attributes."
     */
    message?: string;

    /**
     * Optional icon or emoji to display with the empty state.
     * Provides visual context and makes the state more recognizable.
     *
     * @default "📊"
     */
    icon?: string;

    /**
     * Optional retry callback function for recovery actions.
     * When provided, displays a retry button that calls this function.
     */
    onRetry?: () => void;

    /**
     * Optional additional CSS class names for custom styling.
     * Allows for theme customization and integration with design systems.
     */
    className?: string;
}

/**
 * Empty state component for radar chart widgets.
 *
 * This component provides a user-friendly display when no data is available
 * for the radar chart. It offers clear messaging, visual cues, and optional
 * recovery actions to guide users toward successful chart configuration.
 *
 * **Key Features:**
 * - **Clear Messaging**: Explains why the chart is empty and what to do next
 * - **Visual Feedback**: Uses icons and structured layout for clarity
 * - **Accessibility Compliant**: Proper ARIA roles and screen reader support
 * - **Responsive Design**: Adapts to provided dimensions automatically
 * - **Action-Oriented**: Optional retry functionality for error recovery
 * - **Theme Integration**: Supports custom styling through CSS classes
 *
 * **User Experience Design:**
 * - **Informative**: Clear explanation of the current state
 * - **Actionable**: Provides guidance on how to resolve the situation
 * - **Professional**: Maintains visual consistency with the overall widget
 * - **Accessible**: Works well with assistive technologies
 * - **Recoverable**: Offers retry mechanisms when appropriate
 *
 * **Accessibility Features:**
 * - **role="status"**: Indicates current application state
 * - **aria-live="polite"**: Announces state changes to screen readers
 * - **Semantic Structure**: Uses headings and clear content hierarchy
 * - **Keyboard Accessible**: Retry button fully keyboard navigable
 * - **Screen Reader Friendly**: Clear, descriptive text content
 *
 * **Layout Strategy:**
 * - **Centered Content**: Visual elements centered within container
 * - **Hierarchical Information**: Icon → Title → Message → Actions
 * - **Consistent Spacing**: Matches chart widget visual rhythm
 * - **Responsive Sizing**: Adapts to different container dimensions
 *
 * **Common Use Cases:**
 * - **Missing Data Source**: When no data source is configured
 * - **Empty Dataset**: When data source returns no records
 * - **Configuration Errors**: When data attributes are misconfigured
 * - **Network Issues**: When data loading fails temporarily
 * - **Permission Issues**: When user lacks access to data
 *
 * @param props - Configuration options for the empty state display
 * @returns JSX element representing the empty state
 *
 * @example
 * ```tsx
 * // Basic empty state
 * <EmptyState width={400} height={400} />
 *
 * // Custom messaging
 * <EmptyState
 *   width={500}
 *   height={500}
 *   title="Configuration Required"
 *   message="Please configure your data source in the widget properties."
 *   icon="⚙️"
 * />
 *
 * // With retry functionality
 * <EmptyState
 *   width={400}
 *   height={400}
 *   title="Loading Failed"
 *   message="Unable to load chart data. Please try again."
 *   icon="⚠️"
 *   onRetry={() => reloadData()}
 * />
 * ```
 *
 * @example
 * ```typescript
 * // Usage in conditional rendering
 * function RadarChartContainer({ dataSource }) {
 *   const { data, isLoading, error } = useRadarChartData(dataSource);
 *
 *   if (isLoading) {
 *     return <SkeletonLoader width={400} height={400} />;
 *   }
 *
 *   if (error || !data || data.length === 0) {
 *     return (
 *       <EmptyState
 *         width={400}
 *         height={400}
 *         title={error ? "Loading Error" : "No Data"}
 *         message={error ? error.message : "No data available to display"}
 *         onRetry={error ? () => retryLoad() : undefined}
 *       />
 *     );
 *   }
 *
 *   return <RadarChart data={data} />;
 * }
 * ```
 */
export function EmptyState({
    width,
    height,
    title = "No Data Available",
    message = "Connect a data source to display your radar chart. Ensure your data source contains the required name and value attributes.",
    icon = "📊",
    onRetry,
    className = ""
}: EmptyStateProps): ReactElement {
    return (
        <div
            className={`radar-chart-widget__empty ${className}`}
            style={{ width, height }}
            role="status"
            aria-live="polite"
        >
            <div className="radar-chart-widget__empty__icon" aria-hidden="true">
                {icon}
            </div>
            <div className="radar-chart-widget__empty__title">{title}</div>
            <div className="radar-chart-widget__empty__message">{message}</div>
            {onRetry && (
                <div className="radar-chart-widget__empty__actions">
                    <button
                        type="button"
                        onClick={onRetry}
                        className="radar-chart-widget__error__retry-btn"
                        aria-label="Retry loading data"
                    >
                        Retry
                    </button>
                </div>
            )}
        </div>
    );
}
