/**
 * Environment-aware logging utilities for development and production modes.
 *
 * This module provides conditional logging functionality that respects the
 * current environment, preventing console output in production while maintaining
 * comprehensive debugging capabilities during development.
 *
 * **Features:**
 * - Environment-aware conditional logging
 * - Consistent log formatting and structure
 * - Type-safe error logging with context
 * - Performance optimized for production (no-ops)
 * - Extensible for different log levels and outputs
 */

import { getEnvironmentConfig } from "./envUtils";

/**
 * Environment configuration cached for performance.
 * Prevents repeated environment checks during logging operations.
 */
const envConfig = getEnvironmentConfig();

/**
 * Logs error messages conditionally based on environment configuration.
 *
 * In development mode, outputs detailed error information to console.
 * In production mode, performs no operation to avoid console pollution.
 *
 * @param message - Primary error message
 * @param error - Optional error object or additional context
 * @param context - Optional context information for debugging
 *
 * @example
 * ```typescript
 * // Basic error logging
 * logError("Failed to process radar chart data");
 *
 * // Error with exception object
 * try {
 *   processData();
 * } catch (error) {
 *   logError("Data processing failed", error);
 * }
 *
 * // Error with additional context
 * logError("Validation failed", error, { dataLength: data.length, maxValue });
 * ```
 */
export function logError(message: string, error?: any, context?: Record<string, any>): void {
    if (!envConfig.enableDebugLogs) {
        return; // No-op in production
    }

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [ERROR] RadarChart:`;

    if (context) {
        console.error(prefix, message, { error, context });
    } else if (error) {
        console.error(prefix, message, error);
    } else {
        console.error(prefix, message);
    }
}

/**
 * Logs warning messages conditionally based on environment configuration.
 *
 * @param message - Warning message
 * @param context - Optional context information
 *
 * @example
 * ```typescript
 * logWarning("Using fallback data due to empty data source");
 * logWarning("Performance optimization recommended", { dataPoints: data.length });
 * ```
 */
export function logWarning(message: string, context?: Record<string, any>): void {
    if (!envConfig.showWarnings) {
        return; // No-op when warnings disabled
    }

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [WARN] RadarChart:`;

    if (context) {
        console.warn(prefix, message, context);
    } else {
        console.warn(prefix, message);
    }
}

/**
 * Logs informational messages conditionally based on environment configuration.
 *
 * @param message - Information message
 * @param context - Optional context information
 *
 * @example
 * ```typescript
 * logInfo("Chart rendered successfully", { dataPoints: 8, animationDuration: 1200 });
 * ```
 */
export function logInfo(message: string, context?: Record<string, any>): void {
    if (!envConfig.enableDebugLogs) {
        return; // No-op in production
    }

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [INFO] RadarChart:`;

    if (context) {
        console.info(prefix, message, context);
    } else {
        console.info(prefix, message);
    }
}

/**
 * Logs debug messages conditionally based on environment configuration.
 *
 * @param message - Debug message
 * @param context - Optional context information
 *
 * @example
 * ```typescript
 * logDebug("Animation frame update", { progress: 0.75, timestamp });
 * ```
 */
export function logDebug(message: string, context?: Record<string, any>): void {
    if (!envConfig.enableDebugLogs) {
        return; // No-op in production
    }

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [DEBUG] RadarChart:`;

    if (context) {
        console.debug(prefix, message, context);
    } else {
        console.debug(prefix, message);
    }
}

/**
 * Performance monitoring utility for measuring execution times.
 * Only active in development mode with performance monitoring enabled.
 *
 * @param label - Label for the performance measurement
 * @returns Object with start and end methods for timing
 *
 * @example
 * ```typescript
 * const timer = performanceTimer("Data Processing");
 * // ... expensive operation
 * timer.end(); // Logs timing in development mode
 * ```
 */
export function performanceTimer(label: string): {
    end: () => void;
} {
    if (!envConfig.enablePerformanceMonitoring) {
        return {
            end: (): void => {
                // No-op in production - performance monitoring disabled
            }
        };
    }

    const startTime = performance.now();

    return {
        end: () => {
            const duration = performance.now() - startTime;
            logDebug(`Performance: ${label}`, { duration: `${duration.toFixed(2)}ms` });
        }
    };
}
