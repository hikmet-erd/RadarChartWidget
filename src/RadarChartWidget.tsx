import React, { ReactElement, createElement, useCallback, useMemo, useState } from "react";

import { RadarChartWidgetContainerProps } from "../typings/RadarChartWidgetProps";
import { RadarChart } from "./components/RadarChart";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { SkeletonLoader } from "./components/SkeletonLoader";
import { EmptyState } from "./components/EmptyState";
import { RadarChartConfig, bigToNumber } from "./types/RadarChartTypes";
import { CHART_DEFAULTS, COLOR_DEFAULTS } from "./constants/chartConstants";
import {
    formatValidationErrors,
    formatValidationWarnings,
    isDataSourceLoading,
    hasDataSourceError
} from "./utils/validationUtils";
import { useRadarChartData } from "./hooks/useRadarChartData";
import { isDevelopmentMode } from "./utils/envUtils";
import "./ui/RadarChartWidget.scss";

// Extract development mode flag outside component to avoid conditional hook detection
const DEV_MODE = isDevelopmentMode();

/**
 * Main radar chart widget component for Mendix applications.
 *
 * This is the primary entry point for the radar chart widget, providing a highly optimized
 * and accessible visualization component that automatically adapts to data size and handles
 * various states (loading, error, empty, success) gracefully.
 *
 * **Key Features:**
 * - Dynamic polygon shapes based on data points (minimum 5 sides)
 * - Comprehensive error handling with retry functionality
 * - Accessibility compliance with WCAG 2.1 standards
 * - Performance optimized with React memoization strategies
 * - Responsive design that adapts to container dimensions
 * - Development mode warnings for configuration issues
 *
 * **Performance Optimizations:**
 * - Aggressive memoization of expensive calculations
 * - Early returns for different widget states
 * - Streamlined rendering with minimal re-renders
 * - Efficient event handler management with useCallback
 *
 * @param props - Widget configuration properties from Mendix Studio Pro
 * @returns Rendered radar chart widget with appropriate state handling
 *
 * @example
 * ```tsx
 * // Basic usage in Mendix (configured via Studio Pro)
 * <RadarChartWidget
 *   dataSource={performanceMetrics}
 *   nameAttribute="category"
 *   valueAttribute="score"
 *   chartTitle="Team Performance"
 *   maxValue={5}
 *   showLabels={true}
 *   fillColor="#A084E7"
 *   strokeColor="#7C5AC4"
 * />
 * ```
 */
export function RadarChartWidget(props: RadarChartWidgetContainerProps): ReactElement {
    const {
        dataSource,
        nameAttribute,
        valueAttribute,
        chartTitle,
        maxValue,
        showLabels,
        showGridLines,
        chartWidth,
        chartHeight,
        fillColor,
        strokeColor,
        fillOpacity,
        backgroundColor,
        textColor,
        gridColor,
        showLegend,
        legendPosition,
        showValueLabels,
        onClickAction,
        style,
        class: className
    } = props;

    // State for forcing component re-renders on retry attempts
    const [, forceUpdate] = useState(0);

    // Process and validate radar chart data with comprehensive error handling
    // This hook handles all data transformation, validation, and error states
    const validationResult = useRadarChartData(dataSource, nameAttribute, valueAttribute, maxValue);

    /**
     * Memoized chart configuration object that consolidates all styling and display options.
     * Combines user-provided props with sensible defaults from constants.
     *
     * Uses bigToNumber utility to safely convert Mendix Big.js values to JavaScript numbers.
     * Applies defensive defaults to prevent runtime errors from invalid configurations.
     */
    const chartConfig: RadarChartConfig = useMemo(
        () => ({
            width: chartWidth || CHART_DEFAULTS.WIDTH,
            height: chartHeight || CHART_DEFAULTS.HEIGHT,
            maxValue: bigToNumber(maxValue, CHART_DEFAULTS.MAX_VALUE),
            fillColor: fillColor || COLOR_DEFAULTS.FILL,
            strokeColor: strokeColor || COLOR_DEFAULTS.STROKE,
            fillOpacity: bigToNumber(fillOpacity, CHART_DEFAULTS.FILL_OPACITY),
            backgroundColor: backgroundColor || COLOR_DEFAULTS.BACKGROUND,
            textColor: textColor || COLOR_DEFAULTS.TEXT,
            gridColor: gridColor || COLOR_DEFAULTS.GRID,
            showLabels: showLabels !== false,
            showGridLines: showGridLines !== false,
            showLegend: showLegend === true,
            legendPosition: legendPosition || "right",
            showValueLabels: showValueLabels !== false,
            title: chartTitle || undefined
        }),
        [
            chartWidth,
            chartHeight,
            maxValue,
            fillColor,
            strokeColor,
            fillOpacity,
            backgroundColor,
            textColor,
            gridColor,
            showLabels,
            showGridLines,
            showLegend,
            legendPosition,
            showValueLabels,
            chartTitle
        ]
    );

    /**
     * Handles chart click interactions when an onClickAction is configured.
     * Uses defensive programming to check if the action can be executed before calling it.
     * Memoized with useCallback to prevent unnecessary re-renders of child components.
     */
    const handleClickAction = useCallback(() => {
        if (onClickAction?.canExecute) {
            onClickAction.execute();
        }
    }, [onClickAction]);

    /**
     * Handles retry functionality by triggering component re-render.
     * This forces the useRadarChartData hook to re-run data processing and validation
     * through natural React state changes rather than artificial retry keys.
     * Used in error states to allow users to attempt recovery from transient issues.
     */
    const handleRetry = useCallback(() => {
        forceUpdate(prev => prev + 1);
    }, []);

    /**
     * Memoized base container properties to ensure consistent styling and accessibility.
     * Conditionally adds interactive ARIA attributes when click action is available.
     * Prevents unnecessary recalculation on every render.
     */
    const baseContainerProps = useMemo(
        () => ({
            className: `radar-chart-widget ${className}`,
            style,
            role: onClickAction ? "button" : undefined,
            tabIndex: onClickAction ? 0 : undefined
        }),
        [className, style, onClickAction]
    );

    /**
     * Handles keyboard interactions for accessibility compliance.
     * Enables Enter and Space key activation when click action is available.
     * Prevents default browser behavior to avoid scrolling on Space key.
     * Memoized to maintain stable reference for event handler.
     */
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (onClickAction && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                handleClickAction();
            }
        },
        [onClickAction, handleClickAction]
    );

    // Early return for loading state - shows skeleton loader while data is being fetched
    if (isDataSourceLoading(dataSource)) {
        return (
            <div
                {...baseContainerProps}
                className={`${baseContainerProps.className} radar-chart-widget--compact`}
                role="status"
                aria-label="Loading chart"
            >
                {chartTitle && <div className="radar-chart-widget__title">{chartTitle}</div>}
                <SkeletonLoader width={chartConfig.width} height={chartConfig.height} />
            </div>
        );
    }

    // Early return for error state - displays user-friendly error message with retry option
    if (!validationResult.isValid && validationResult.errors.length > 0) {
        const errorMessage = formatValidationErrors(validationResult.errors);

        return (
            <ErrorBoundary>
                <div {...baseContainerProps}>
                    <div
                        className="radar-chart-widget__error"
                        style={{
                            width: chartConfig.width,
                            height: chartConfig.height
                        }}
                    >
                        <div className="radar-chart-widget__error__icon">⚠️</div>
                        <div className="radar-chart-widget__error__title">Unable to display chart</div>
                        <div className="radar-chart-widget__error__message">
                            {errorMessage || "Please check your data source configuration"}
                        </div>
                        <div className="radar-chart-widget__error__actions">
                            <button
                                className="radar-chart-widget__error__retry-btn"
                                onClick={handleRetry}
                                type="button"
                                aria-label="Retry loading chart"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </ErrorBoundary>
        );
    }

    // Development warnings will be rendered directly in JSX to eliminate hook conditional usage

    // Early return for empty state - shows user-friendly empty state component
    if (!validationResult.processedData || validationResult.processedData.length === 0) {
        return (
            <div {...baseContainerProps}>
                <EmptyState
                    width={chartConfig.width}
                    height={chartConfig.height}
                    onRetry={hasDataSourceError(dataSource) ? handleRetry : undefined}
                />
            </div>
        );
    }

    /**
     * Main render path for successful data display.
     * Wraps the chart in an ErrorBoundary to catch any runtime errors during rendering.
     * Applies keyboard navigation support and accessibility attributes when interactive.
     * Conditionally displays development warnings above the chart.
     */
    return (
        <ErrorBoundary>
            <div
                {...baseContainerProps}
                onKeyDown={onClickAction ? handleKeyDown : undefined}
                aria-label={onClickAction ? `Interactive radar chart: ${chartTitle || "Chart"}` : undefined}
            >
                {DEV_MODE && validationResult.warnings.length > 0 && (
                    <div
                        className="radar-chart-widget__warnings"
                        role="alert"
                        aria-live="polite"
                        style={{
                            fontSize: "12px",
                            color: COLOR_DEFAULTS.WARNING_TEXT,
                            marginBottom: "8px",
                            padding: "4px 8px",
                            backgroundColor: COLOR_DEFAULTS.WARNING_BG,
                            borderRadius: "4px",
                            border: `1px solid ${COLOR_DEFAULTS.WARNING_BORDER}`
                        }}
                    >
                        <strong>Warnings:</strong> {formatValidationWarnings(validationResult.warnings).join(", ")}
                    </div>
                )}
                <RadarChart
                    data={validationResult.processedData}
                    config={chartConfig}
                    onClickAction={onClickAction ? handleClickAction : undefined}
                />
            </div>
        </ErrorBoundary>
    );
}
