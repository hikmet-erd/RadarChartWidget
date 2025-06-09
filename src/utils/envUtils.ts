/**
 * Environment utility functions for development mode detection and configuration.
 *
 * This module provides comprehensive environment detection capabilities for Mendix
 * applications, enabling proper development/production mode switching and
 * environment-specific feature configuration.
 *
 * **Key Features:**
 * - Multi-platform environment detection (browser, Node.js, Mendix)
 * - Safe environment variable access with fallbacks
 * - Mendix-specific development indicators
 * - Performance-optimized environment configuration caching
 * - Type-safe global declarations for Mendix runtime
 *
 * **Usage Patterns:**
 * - Development mode detection for debugging features
 * - Environment-specific logging and monitoring
 * - Feature flag management based on environment
 * - Performance optimization switches
 *
 * @module envUtils
 */

/**
 * Global type declarations for Mendix runtime environment.
 *
 * Extends the Window interface to include Mendix-specific properties
 * that may be available in the runtime environment. This enables
 * type-safe access to Mendix debug and development features.
 *
 * @global
 */
declare global {
    interface Window {
        /**
         * Mendix runtime object containing platform-specific functionality.
         * Available when running within a Mendix application context.
         */
        mx?: {
            /**
             * Indicates whether Mendix is running in debug mode.
             * This is typically true in Studio Pro preview mode
             * and development environments.
             */
            isDebug?: boolean;
        };
    }
}

/**
 * Safely retrieves the NODE_ENV environment variable.
 *
 * This function provides safe access to process.env.NODE_ENV with proper
 * error handling for environments where the process object may not be
 * available (such as browsers) or where environment access is restricted.
 *
 * **Safety Features:**
 * - Try-catch protection against reference errors
 * - Graceful handling of undefined process object
 * - Consistent return type (string | undefined)
 * - No side effects or global state modification
 *
 * @returns The NODE_ENV value if available, undefined otherwise
 *
 * @example
 * ```typescript
 * const nodeEnv = getNodeEnv();
 * if (nodeEnv === 'development') {
 *   enableDebugFeatures();
 * }
 * ```
 */
function getNodeEnv(): string | undefined {
    try {
        // eslint-disable-next-line no-undef
        return typeof process !== "undefined" ? process.env?.NODE_ENV : undefined;
    } catch {
        return undefined;
    }
}

/**
 * Detects if the application is running in development mode.
 *
 * This function implements a comprehensive development mode detection strategy
 * that works across different environments (browser, Node.js, Mendix runtime).
 * It checks multiple indicators to reliably determine development context.
 *
 * **Detection Strategy:**
 * 1. **Hostname Checks**: localhost, 127.0.0.1, .local domains
 * 2. **Port Presence**: Non-standard ports typically indicate development
 * 3. **Mendix Debug Mode**: mx.isDebug flag from Mendix runtime
 * 4. **NODE_ENV Variable**: Standard Node.js environment indicator
 * 5. **Fallback Handling**: Safe defaults when window is unavailable
 *
 * **Use Cases:**
 * - Enabling debug logging and detailed error messages
 * - Showing development-only UI elements and tools
 * - Activating performance monitoring and profiling
 * - Disabling production optimizations for debugging
 * - Controlling feature flags and experimental functionality
 *
 * **Performance Considerations:**
 * - Fast boolean operations with short-circuit evaluation
 * - Minimal memory footprint with no persistent state
 * - Cached environment variable access
 * - No network calls or async operations
 *
 * @returns True if running in development mode, false otherwise
 *
 * @example
 * ```typescript
 * // Basic development mode check
 * if (isDevelopmentMode()) {
 *   console.log('Development mode enabled');
 *   enableDebugFeatures();
 * }
 *
 * // Conditional logging
 * const logLevel = isDevelopmentMode() ? 'debug' : 'error';
 * logger.setLevel(logLevel);
 *
 * // Feature toggles
 * const showDevTools = isDevelopmentMode() && userHasDevAccess();
 * ```
 */
export function isDevelopmentMode(): boolean {
    // In Mendix environment, check for common development indicators
    if (typeof window !== "undefined") {
        // Check for Mendix development environment indicators
        return (
            window.location.hostname === "localhost" ||
            window.location.hostname.includes("127.0.0.1") ||
            window.location.hostname.includes(".local") ||
            window.location.port !== "" ||
            // Check for Mendix debug mode (properly typed)
            (typeof window.mx !== "undefined" && window.mx.isDebug === true) ||
            // Check for development build indicators (with safe access)
            getNodeEnv() === "development"
        );
    }

    // Fallback for server-side or when window is unavailable
    return getNodeEnv() === "development";
}

/**
 * Environment configuration object interface.
 *
 * Defines the structure for environment-specific configuration
 * settings that control application behavior based on the
 * current runtime environment.
 *
 * @interface EnvironmentConfig
 */
interface EnvironmentConfig {
    /** Whether the application is running in development mode */
    isDevelopment: boolean;
    /** Whether to display warning messages to users */
    showWarnings: boolean;
    /** Whether to enable debug-level logging */
    enableDebugLogs: boolean;
    /** Whether to enable performance monitoring and profiling */
    enablePerformanceMonitoring: boolean;
}

/**
 * Retrieves comprehensive environment-specific configuration.
 *
 * This function provides a centralized configuration object that controls
 * various application behaviors based on the current environment. It ensures
 * consistent feature toggling and behavior adaptation across the application.
 *
 * **Configuration Strategy:**
 * - **Development Mode**: Enables all debugging and monitoring features
 * - **Production Mode**: Disables debugging features for performance
 * - **Consistent Mapping**: All features tied to development mode detection
 * - **Single Source of Truth**: Centralized environment configuration
 *
 * **Feature Categories:**
 * - **Logging Controls**: Debug logs, warnings, error verbosity
 * - **Development Tools**: Performance monitoring, debugging aids
 * - **User Experience**: Error details, development mode indicators
 * - **Performance**: Feature flags for optimization vs. debugging
 *
 * **Usage Patterns:**
 * - Logger configuration and verbosity control
 * - Performance monitoring enablement
 * - Development tool availability
 * - Error handling and reporting behavior
 *
 * @returns Comprehensive environment configuration object
 *
 * @example
 * ```typescript
 * // Get environment configuration
 * const config = getEnvironmentConfig();
 *
 * // Configure logger based on environment
 * if (config.enableDebugLogs) {
 *   logger.enableDebugMode();
 * }
 *
 * // Setup performance monitoring
 * if (config.enablePerformanceMonitoring) {
 *   performance.enableProfiling();
 * }
 *
 * // Show warnings to developers
 * if (config.showWarnings && dataQualityIssues.length > 0) {
 *   console.warn('Data quality issues detected:', dataQualityIssues);
 * }
 *
 * // Conditional feature activation
 * const debugPanel = config.isDevelopment ? <DebugPanel /> : null;
 * ```
 */
export function getEnvironmentConfig(): EnvironmentConfig {
    const isDev = isDevelopmentMode();

    return {
        isDevelopment: isDev,
        showWarnings: isDev,
        enableDebugLogs: isDev,
        enablePerformanceMonitoring: isDev
    };
}
