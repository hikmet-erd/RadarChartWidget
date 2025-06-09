import { RadarChartDataPoint } from "../types/RadarChartTypes";
import { VALIDATION_CONSTANTS } from "../constants/chartConstants";

/**
 * Comprehensive validation result containing processed data and diagnostic information.
 *
 * This interface provides complete feedback about data validation operations,
 * including success/failure status, detailed error information, non-blocking
 * warnings, and processed data ready for chart rendering.
 *
 * **Design Philosophy:**
 * - Clear separation between blocking errors and non-blocking warnings
 * - Detailed diagnostic information for debugging and user feedback
 * - Processed data available even when warnings exist
 * - Structured error types for programmatic handling
 *
 * @interface ValidationResult
 */
export interface ValidationResult {
    /**
     * Overall validation success status.
     * True when data can be safely rendered, false when critical errors exist.
     */
    isValid: boolean;

    /**
     * Array of critical errors that prevent chart rendering.
     * When any errors exist, isValid will be false and processedData will be undefined.
     */
    errors: ValidationError[];

    /**
     * Array of non-critical warnings about data quality.
     * Chart can still be rendered when only warnings exist, but user should be informed.
     */
    warnings: ValidationWarning[];

    /**
     * Validated and processed data ready for chart rendering.
     * Only available when isValid is true. May include corrections from warnings.
     */
    processedData?: RadarChartDataPoint[];
}

/**
 * Structured error information for validation failures.
 *
 * Provides detailed information about critical validation failures that prevent
 * chart rendering. Includes error categorization, human-readable messages, and
 * contextual information for debugging.
 *
 * **Error Categories:**
 * - MISSING_DATA: No data source or empty dataset
 * - INVALID_DATA_TYPE: Type mismatches or malformed data
 * - EMPTY_VALUES: All values are missing or invalid
 * - INVALID_RANGE: Values outside acceptable bounds (rarely used due to clamping)
 * - DUPLICATE_NAMES: Non-unique category names that would cause rendering issues
 *
 * @interface ValidationError
 */
export interface ValidationError {
    /**
     * Categorized error type for programmatic handling.
     * Allows UI to show appropriate error messages and recovery options.
     */
    type: "MISSING_DATA" | "INVALID_DATA_TYPE" | "EMPTY_VALUES" | "INVALID_RANGE" | "DUPLICATE_NAMES";

    /**
     * Human-readable error message for display to users.
     * Should be clear and actionable when possible.
     */
    message: string;

    /**
     * Optional field name where the error occurred.
     * Useful for highlighting specific configuration issues.
     */
    field?: string;

    /**
     * Optional zero-based index of the problematic data item.
     * Helps identify specific data points in large datasets.
     */
    index?: number;
}

/**
 * Structured warning information for data quality issues.
 *
 * Provides detailed information about non-critical data quality issues that
 * don't prevent chart rendering but may affect user experience or data accuracy.
 * Warnings typically indicate automatic corrections or suboptimal conditions.
 *
 * **Warning Categories:**
 * - DATA_CLAMPED: Values adjusted to fit within valid range
 * - EMPTY_NAME: Missing category names replaced with defaults
 * - SPECIAL_CHARACTERS: Names contain characters that may affect display
 * - LONG_NAME: Names exceed recommended length and may be truncated
 *
 * @interface ValidationWarning
 */
export interface ValidationWarning {
    /**
     * Categorized warning type for programmatic handling.
     * Allows different warning types to be handled appropriately in UI.
     */
    type: "DATA_CLAMPED" | "EMPTY_NAME" | "SPECIAL_CHARACTERS" | "LONG_NAME";

    /**
     * Human-readable warning message for display to users.
     * Should explain what was corrected and potential impact.
     */
    message: string;

    /**
     * Optional field name where the warning occurred.
     * Helps users identify which configuration may need attention.
     */
    field?: string;

    /**
     * Optional zero-based index of the data item that triggered the warning.
     * Useful for identifying specific problematic data points.
     */
    index?: number;
}

/**
 * Validates and processes individual data point names with comprehensive error handling.
 *
 * This function handles all aspects of category name validation including type checking,
 * empty value handling, duplicate detection, length validation, and special character
 * detection. It ensures every data point has a valid, unique name for chart rendering.
 *
 * **Validation Rules:**
 * - Names must be strings (type validation)
 * - Empty names are replaced with generated defaults
 * - Duplicate names are detected and reported as errors
 * - Long names (>20 chars) trigger warnings
 * - Special characters (<>'"&) may affect SVG rendering
 *
 * **Processing Logic:**
 * - Trims whitespace from valid strings
 * - Generates fallback names for missing/invalid input
 * - Tracks seen names for duplicate detection
 * - Applies business rules for name constraints
 *
 * @param name - Raw name value from data source (may be null/undefined)
 * @param index - Zero-based index of data point for error reporting
 * @param seenNames - Set tracking already-used names for duplicate detection
 * @returns Validation result with processed name and diagnostic information
 *
 * @example
 * ```typescript
 * const seenNames = new Set<string>();
 * const result = validateDataPointName("Communication Skills", 0, seenNames);
 * // result.processedName: "Communication Skills"
 * // result.errors: []
 * // result.warnings: []
 *
 * const emptyResult = validateDataPointName("", 1, seenNames);
 * // emptyResult.processedName: "Category 2"
 * // emptyResult.warnings: [{ type: "EMPTY_NAME", message: "..." }]
 * ```
 */
function validateDataPointName(
    name: string | undefined | null,
    index: number,
    seenNames: Set<string>
): { processedName: string; errors: ValidationError[]; warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    let processedName = "";

    if (!name || typeof name !== "string") {
        errors.push({
            type: "INVALID_DATA_TYPE",
            message: `Name at index ${index} is missing or not a string`,
            field: "name",
            index
        });
        return { processedName: `Category ${index + 1}`, errors, warnings };
    }

    processedName = name.trim();

    if (processedName.length === 0) {
        warnings.push({
            type: "EMPTY_NAME",
            message: `Name at index ${index} is empty after trimming`,
            field: "name",
            index
        });
        processedName = `Category ${index + 1}`;
    }

    // Check for duplicates
    if (seenNames.has(processedName.toLowerCase())) {
        errors.push({
            type: "DUPLICATE_NAMES",
            message: `Duplicate name "${processedName}" found at index ${index}`,
            field: "name",
            index
        });
    } else {
        seenNames.add(processedName.toLowerCase());
    }

    // Check name length
    if (processedName.length > VALIDATION_CONSTANTS.MAX_NAME_LENGTH) {
        warnings.push({
            type: "LONG_NAME",
            message: `Name "${processedName}" is very long and may be truncated in display`,
            field: "name",
            index
        });
    }

    // Check for special characters
    if (VALIDATION_CONSTANTS.SPECIAL_CHAR_PATTERN.test(processedName)) {
        warnings.push({
            type: "SPECIAL_CHARACTERS",
            message: `Name "${processedName}" contains special characters that may affect display`,
            field: "name",
            index
        });
    }

    return { processedName, errors, warnings };
}

/**
 * Validates and processes individual data point values with range checking and clamping.
 *
 * This function handles comprehensive value validation including type checking, null
 * handling, NaN detection, and automatic range clamping. It ensures all values are
 * valid numbers within the acceptable range for chart rendering.
 *
 * **Validation Rules:**
 * - Values must be numbers (type validation)
 * - Null/undefined values are rejected as errors
 * - NaN values are rejected as errors
 * - Values outside [minValue, maxValue] are clamped with warnings
 *
 * **Clamping Logic:**
 * - Values below minValue are set to minValue
 * - Values above maxValue are set to maxValue
 * - Original out-of-range values are preserved in warning messages
 * - Clamping ensures chart rendering stability
 *
 * @param value - Raw value from data source (any type, needs validation)
 * @param index - Zero-based index of data point for error reporting
 * @param maxValue - Maximum allowed value for this chart
 * @param minValue - Minimum allowed value for this chart
 * @returns Validation result with processed value and diagnostic information
 *
 * @example
 * ```typescript
 * const result = validateDataPointValue(4.2, 0, 5, 0);
 * // result.processedValue: 4.2
 * // result.errors: []
 * // result.warnings: []
 *
 * const clampedResult = validateDataPointValue(7.5, 1, 5, 0);
 * // clampedResult.processedValue: 5
 * // clampedResult.warnings: [{ type: "DATA_CLAMPED", message: "..." }]
 * ```
 */
function validateDataPointValue(
    value: any,
    index: number,
    maxValue: number,
    minValue: number
): { processedValue: number; errors: ValidationError[]; warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    let processedValue = 0;

    if (value === undefined || value === null) {
        errors.push({
            type: "INVALID_DATA_TYPE",
            message: `Value at index ${index} is missing`,
            field: "value",
            index
        });
        return { processedValue: 0, errors, warnings };
    }

    if (typeof value !== "number" || isNaN(value)) {
        errors.push({
            type: "INVALID_DATA_TYPE",
            message: `Value at index ${index} is not a valid number`,
            field: "value",
            index
        });
        return { processedValue: 0, errors, warnings };
    }

    processedValue = value;

    // Check if value needs clamping
    if (processedValue < minValue) {
        warnings.push({
            type: "DATA_CLAMPED",
            message: `Value ${processedValue} at index ${index} is below minimum (${minValue}) and will be clamped`,
            field: "value",
            index
        });
        processedValue = minValue;
    } else if (processedValue > maxValue) {
        warnings.push({
            type: "DATA_CLAMPED",
            message: `Value ${processedValue} at index ${index} is above maximum (${maxValue}) and will be clamped`,
            field: "value",
            index
        });
        processedValue = maxValue;
    }

    return { processedValue, errors, warnings };
}

/**
 * Comprehensive validation and processing pipeline for radar chart data.
 *
 * This is the main validation entry point that orchestrates the complete data
 * validation process. It handles structural validation, individual data point
 * processing, and result aggregation to produce a complete validation result.
 *
 * **Validation Pipeline:**
 * 1. Structural validation (array existence, length)
 * 2. Individual data point validation (name and value processing)
 * 3. Duplicate detection across all data points
 * 4. Result aggregation and final validation status
 * 5. Processed data compilation for chart rendering
 *
 * **Error Handling Strategy:**
 * - Fail fast for structural issues (null/empty arrays)
 * - Continue processing through individual data point errors
 * - Aggregate all errors and warnings for comprehensive feedback
 * - Only mark as valid when all critical errors are resolved
 *
 * **Performance Optimizations:**
 * - Modular validation functions for maintainability
 * - Efficient duplicate detection using Set operations
 * - Early termination for structural failures
 * - Minimal data copying and transformation
 *
 * @param dataPoints - Array of raw data points to validate and process
 * @param maxValue - Maximum allowed value for scaling and clamping
 * @param minValue - Minimum allowed value for scaling and clamping
 * @returns Complete validation result with errors, warnings, and processed data
 *
 * @example
 * ```typescript
 * // Successful validation
 * const result = validateRadarChartData([
 *   { name: "Performance", value: 4.2 },
 *   { name: "Quality", value: 3.8 }
 * ], 5, 0);
 * // result.isValid: true
 * // result.processedData: [processed data points]
 *
 * // Validation with errors
 * const errorResult = validateRadarChartData(null, 5, 0);
 * // errorResult.isValid: false
 * // errorResult.errors: [{ type: "MISSING_DATA", ... }]
 * ```
 */
export function validateRadarChartData(
    dataPoints: RadarChartDataPoint[],
    maxValue = 5,
    minValue = 0
): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const processedData: RadarChartDataPoint[] = [];

    // Early validation - data existence check
    if (!dataPoints || !Array.isArray(dataPoints)) {
        errors.push({
            type: "MISSING_DATA",
            message: VALIDATION_CONSTANTS.NO_DATA_MESSAGE
        });
        return { isValid: false, errors, warnings };
    }

    if (dataPoints.length === 0) {
        errors.push({
            type: "EMPTY_VALUES",
            message: VALIDATION_CONSTANTS.EMPTY_DATA_MESSAGE
        });
        return { isValid: false, errors, warnings };
    }

    // Track seen names for duplicate detection
    const seenNames = new Set<string>();

    // Validate each data point with optimized individual validators
    dataPoints.forEach((point, index) => {
        if (!point || typeof point !== "object") {
            errors.push({
                type: "INVALID_DATA_TYPE",
                message: `Data point at index ${index} is not a valid object`,
                index
            });
            return;
        }

        // Validate name
        const nameValidation = validateDataPointName(point.name, index, seenNames);
        errors.push(...nameValidation.errors);
        warnings.push(...nameValidation.warnings);

        // Validate value
        const valueValidation = validateDataPointValue(point.value, index, maxValue, minValue);
        errors.push(...valueValidation.errors);
        warnings.push(...valueValidation.warnings);

        // Add processed data point if no critical errors
        if (nameValidation.processedName && !isNaN(valueValidation.processedValue)) {
            processedData.push({
                name: nameValidation.processedName,
                value: valueValidation.processedValue
            });
        }
    });

    // Final validation
    if (processedData.length === 0) {
        errors.push({
            type: "EMPTY_VALUES",
            message: "No valid data points found after processing"
        });
    }

    const isValid = errors.length === 0 && processedData.length > 0;

    return {
        isValid,
        errors,
        warnings,
        processedData: isValid ? processedData : undefined
    };
}

/**
 * Formats validation errors into user-friendly messages with intelligent grouping.
 *
 * This function transforms technical validation errors into clear, actionable messages
 * that users can understand and act upon. It groups similar errors to avoid message
 * repetition and provides appropriate context for different error types.
 *
 * **Formatting Strategy:**
 * - Groups errors by type to avoid repetitive messages
 * - Uses clear, non-technical language for user display
 * - Provides actionable guidance when possible
 * - Handles pluralization appropriately for count-based messages
 *
 * **Error Type Handling:**
 * - MISSING_DATA: Configuration guidance
 * - EMPTY_VALUES: Data availability guidance
 * - INVALID_DATA_TYPE: Data format guidance with counts
 * - DUPLICATE_NAMES: Uniqueness requirement explanation
 * - INVALID_RANGE: Range constraint explanation
 *
 * @param errors - Array of validation errors to format
 * @returns Single formatted message string for user display
 *
 * @example
 * ```typescript
 * const errors = [
 *   { type: "INVALID_DATA_TYPE", message: "Value at index 0..." },
 *   { type: "INVALID_DATA_TYPE", message: "Value at index 2..." },
 *   { type: "DUPLICATE_NAMES", message: "Duplicate name..." }
 * ];
 *
 * const message = formatValidationErrors(errors);
 * // "2 data points have invalid format. Some category names are duplicated."
 * ```
 */
export function formatValidationErrors(errors: ValidationError[]): string {
    if (errors.length === 0) {
        return "";
    }

    const errorsByType = errors.reduce((acc, error) => {
        if (!acc[error.type]) {
            acc[error.type] = [];
        }
        acc[error.type].push(error);
        return acc;
    }, {} as Record<string, ValidationError[]>);

    const messages: string[] = [];

    if (errorsByType.MISSING_DATA) {
        messages.push("Data source is not properly configured.");
    }

    if (errorsByType.EMPTY_VALUES) {
        messages.push("No data is available to display.");
    }

    if (errorsByType.INVALID_DATA_TYPE) {
        const count = errorsByType.INVALID_DATA_TYPE.length;
        messages.push(`${count} data ${count === 1 ? "point has" : "points have"} invalid format.`);
    }

    if (errorsByType.DUPLICATE_NAMES) {
        messages.push("Some category names are duplicated.");
    }

    if (errorsByType.INVALID_RANGE) {
        messages.push("Some values are outside the valid range.");
    }

    return messages.join(" ");
}

/**
 * Formats validation warnings into user-friendly message array.
 *
 * This function extracts human-readable warning messages for display to users
 * in development mode or configuration interfaces. Unlike errors, warnings are
 * presented as individual messages since they typically require specific attention.
 *
 * **Design Rationale:**
 * - Warnings are less critical and can be shown individually
 * - Each warning may require different user action
 * - Simple extraction maintains warning context and specificity
 * - Array format allows flexible UI presentation
 *
 * @param warnings - Array of validation warnings to format
 * @returns Array of formatted warning message strings
 *
 * @example
 * ```typescript
 * const warnings = [
 *   { type: "DATA_CLAMPED", message: "Value 7.5 clamped to 5" },
 *   { type: "LONG_NAME", message: "Name 'Very Long Category' truncated" }
 * ];
 *
 * const messages = formatValidationWarnings(warnings);
 * // ["Value 7.5 clamped to 5", "Name 'Very Long Category' truncated"]
 * ```
 */
export function formatValidationWarnings(warnings: ValidationWarning[]): string[] {
    return warnings.map(warning => warning.message);
}

/**
 * Utility functions for Mendix data source state detection.
 *
 * These functions provide type-safe checks for Mendix ListValue data source states,
 * handling the asynchronous nature of Mendix data loading and error conditions.
 * They enable appropriate UI state management and user feedback.
 */

/**
 * Determines if a Mendix data source is currently loading.
 *
 * @param dataSource - Mendix ListValue data source
 * @returns True when data is being fetched from the server
 */
export function isDataSourceLoading(dataSource: any): boolean {
    return dataSource && dataSource.status === "loading";
}

/**
 * Determines if a Mendix data source has successfully loaded data.
 *
 * @param dataSource - Mendix ListValue data source
 * @returns True when data is available and ready for processing
 */
export function isDataSourceAvailable(dataSource: any): boolean {
    return dataSource && dataSource.status === "available" && dataSource.items;
}

/**
 * Determines if a Mendix data source has encountered an error.
 *
 * @param dataSource - Mendix ListValue data source
 * @returns True when data source is in an error state
 */
export function hasDataSourceError(dataSource: any): boolean {
    return dataSource && dataSource.status === "unavailable";
}
