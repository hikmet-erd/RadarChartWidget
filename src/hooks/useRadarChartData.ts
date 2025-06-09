import { useMemo } from "react";
import { RadarChartDataPoint, bigToNumber, getDefaultRadarChartData } from "../types/RadarChartTypes";
import { CHART_DEFAULTS } from "../constants/chartConstants";
import {
    validateRadarChartData,
    isDataSourceLoading,
    isDataSourceAvailable,
    hasDataSourceError,
    ValidationResult
} from "../utils/validationUtils";
import { logError } from "../utils/loggerUtils";

/**
 * Comprehensive data processing hook for Mendix radar chart data sources.
 *
 * This hook serves as the primary data processing pipeline, handling the complete
 * lifecycle of data transformation from Mendix data sources to validated chart-ready
 * data points. It manages all aspects of data loading, validation, error handling,
 * and retry functionality.
 *
 * **Core Responsibilities:**
 * - Mendix data source state management (loading, available, error)
 * - Data extraction and transformation from Mendix attributes
 * - Comprehensive data validation with error and warning collection
 * - Retry functionality for transient failures
 * - Performance optimization through strategic memoization
 * - Graceful degradation with default data when appropriate
 *
 * **Data Processing Pipeline:**
 * 1. Data source state validation (configuration, loading, errors)
 * 2. Raw data extraction from Mendix ListValue and attributes
 * 3. Type conversion from Mendix types to JavaScript types
 * 4. Comprehensive validation with error/warning collection
 * 5. Processed data preparation for chart rendering
 * 6. Result caching for optimal performance
 *
 * **Error Handling Strategy:**
 * - Early termination for configuration errors
 * - Graceful handling of loading and error states
 * - Comprehensive validation with detailed diagnostics
 * - Retry support for transient network or data issues
 * - Fallback to default data in appropriate scenarios
 *
 * **Performance Optimizations:**
 * - Strategic memoization with carefully chosen dependencies
 * - Early returns for common failure cases
 * - Efficient data transformation pipelines
 * - Minimal object creation and memory allocation
 * - Dependency array optimization to prevent unnecessary recalculations
 *
 * @param dataSource - Mendix ListValue containing chart data
 * @param nameAttribute - Mendix ListAttributeValue for category names
 * @param valueAttribute - Mendix ListAttributeValue for numeric values
 * @param maxValue - Maximum value for scaling (Mendix Big.js format)
 * @returns Complete validation result with processed data or error information
 *
 * @example
 * ```typescript
 * // Basic usage in widget component
 * const validationResult = useRadarChartData(
 *   dataSource,
 *   nameAttribute,
 *   valueAttribute,
 *   maxValue
 * );
 *
 * if (validationResult.isValid) {
 *   return <RadarChart data={validationResult.processedData} />;
 * } else {
 *   return <ErrorDisplay errors={validationResult.errors} />;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Note: Retry functionality should be handled by the parent component
 * // by triggering re-renders through state changes in the data source
 * const result = useRadarChartData(dataSource, nameAttr, valueAttr, maxVal);
 * ```
 */
export function useRadarChartData(
    dataSource: any,
    nameAttribute: any,
    valueAttribute: any,
    maxValue: any
): ValidationResult {
    return useMemo(() => {
        /**
         * Early validation phase - configuration and basic setup checks.
         * Handles fundamental configuration issues before attempting data processing.
         */

        // Critical error: No data source configured in Studio Pro
        if (!dataSource) {
            return {
                isValid: false,
                errors: [{ type: "MISSING_DATA", message: "No data source configured" }],
                warnings: [],
                processedData: undefined
            };
        }

        /**
         * Data source state handling - manages Mendix asynchronous data loading.
         * Different states require different handling strategies for optimal UX.
         */

        // Loading state: Data is being fetched from server or microflow
        if (isDataSourceLoading(dataSource)) {
            return {
                isValid: false,
                errors: [],
                warnings: [],
                processedData: [] // Empty array signals loading state to parent
            };
        }

        // Error state: Data source failed to load (network, server, or logic errors)
        if (hasDataSourceError(dataSource)) {
            return {
                isValid: false,
                errors: [{ type: "MISSING_DATA", message: "Data source is unavailable" }],
                warnings: [],
                processedData: undefined
            };
        }

        // Unavailable state: Data source not ready but not in error (e.g., context not set)
        // Gracefully degrade to default data for preview/demo purposes
        if (!isDataSourceAvailable(dataSource)) {
            return {
                isValid: true,
                errors: [],
                warnings: [],
                processedData: getDefaultRadarChartData()
            };
        }

        /**
         * Data processing phase - transformation and validation of actual data.
         * Handles extraction from Mendix objects and conversion to chart format.
         */
        try {
            // Extract raw items from Mendix ListValue, with defensive fallback
            const rawItems = dataSource.items || [];

            // Transform Mendix data items into RadarChartDataPoint objects
            const dataPoints: RadarChartDataPoint[] = rawItems.map((item: any) => {
                // Extract display value for name (handles localization and formatting)
                const name = nameAttribute?.get(item)?.displayValue || "Unknown";

                // Extract raw value (Big.js format from Mendix)
                const rawValue = valueAttribute?.get(item)?.value;

                // Convert to JavaScript number with safe fallback
                const value = bigToNumber(rawValue, 0);

                return { name, value };
            });

            // Convert max value from Mendix Big.js format with sensible default
            const maxVal = bigToNumber(maxValue, CHART_DEFAULTS.MAX_VALUE);

            // Run comprehensive validation pipeline
            return validateRadarChartData(dataPoints, maxVal);
        } catch (error) {
            /**
             * Error recovery for data processing failures.
             * Catches unexpected errors during data transformation and provides
             * meaningful feedback for debugging and user guidance.
             */

            // Log detailed error information for developers using environment-aware logging
            logError("Error processing radar chart data", error, {
                hasDataSource: !!dataSource,
                hasNameAttribute: !!nameAttribute,
                hasValueAttribute: !!valueAttribute,
                maxValue
            });

            // Return user-friendly error state
            return {
                isValid: false,
                errors: [
                    {
                        type: "INVALID_DATA_TYPE",
                        message: "Error processing data source. Please check your data configuration."
                    }
                ],
                warnings: [],
                processedData: undefined
            };
        }
    }, [dataSource, nameAttribute, valueAttribute, maxValue]);
    // Note: Retry functionality should be handled by the parent component
    // through state changes in the data source or component re-mounting
}

// Note: The useStaticRadarChartData function has been removed as it was identified
// as dead code during the refactoring analysis. If static data validation is needed
// in the future, it can be re-implemented or the validation utilities can be used directly.
