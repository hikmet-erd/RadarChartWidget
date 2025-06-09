/**
 * Centralized constants for radar chart widget configuration and behavior.
 *
 * This file serves as the single source of truth for all configurable values,
 * default settings, and magic numbers used throughout the radar chart widget.
 * Centralizing these values ensures consistency, maintainability, and easy
 * customization of widget behavior.
 *
 * **Design Principles:**
 * - All constants are readonly using 'as const' assertion
 * - Logical grouping by functional area
 * - Semantic naming with clear purpose
 * - Reasonable defaults that work in most scenarios
 * - Easy to modify for customization needs
 *
 * **Usage Guidelines:**
 * - Import specific constant groups as needed
 * - Use TypeScript's const assertions for type safety
 * - Document any modifications with reasoning
 * - Consider backward compatibility when changing values
 */

/**
 * Core chart configuration defaults and constraints.
 *
 * These values define the fundamental behavior and appearance characteristics
 * of radar charts, including sizing, scaling, and layout properties.
 *
 * **Sizing Guidelines:**
 * - Minimum chart size should accommodate readable labels
 * - Padding ensures labels and interactive elements don't get clipped
 * - Default dimensions work well for most dashboard scenarios
 *
 * **Mathematical Constants:**
 * - MINIMUM_SPOKES ensures polygon stability and readability
 * - GRID_LEVELS provides sufficient reference without clutter
 * - MAX_VALUE follows common 1-5 rating scale conventions
 *
 * @constant
 */
export const CHART_DEFAULTS = {
    /** Default chart width in pixels - optimized for dashboard layouts */
    WIDTH: 400,
    /** Default chart height in pixels - matches width for circular charts */
    HEIGHT: 400,
    /** Default maximum value for data scaling - common 1-5 rating scale */
    MAX_VALUE: 5,
    /** Minimum allowed value for data points - prevents negative scaling */
    MIN_VALUE: 0,
    /** Default fill opacity for chart area - allows background visibility */
    FILL_OPACITY: 1.0,
    /** Minimum number of polygon sides for stable rendering and readability */
    MINIMUM_SPOKES: 5,
    /** Number of concentric grid levels for value reference */
    GRID_LEVELS: 5,
    /** Padding around chart edge for labels and interactive elements */
    PADDING: 60,
    /** Additional space between chart edge and label text */
    LABEL_RADIUS_OFFSET: 20,
    /** Maximum recommended characters for category names */
    LABEL_MAX_LENGTH: 20
} as const;

/**
 * Default color scheme following modern design principles.
 *
 * These colors provide a professional, accessible appearance with sufficient
 * contrast for readability and WCAG compliance. The purple theme is modern
 * and works well in both light and dark interfaces.
 *
 * **Color Strategy:**
 * - Primary colors (fill/stroke) use complementary purple shades
 * - Text colors ensure 4.5:1+ contrast ratio for accessibility
 * - Warning colors follow established UI conventions
 * - Neutral grays provide subtle backgrounds and borders
 *
 * **Accessibility Considerations:**
 * - All color combinations meet WCAG AA contrast requirements
 * - Warning colors are distinguishable for color-blind users
 * - Grid colors are subtle but visible for reference
 *
 * @constant
 */
export const COLOR_DEFAULTS = {
    /** Primary fill color - modern purple with good saturation */
    FILL: "#A084E7",
    /** Primary stroke color - darker purple for definition and contrast */
    STROKE: "#7C5AC4",
    /** Background color - pure white for maximum contrast and cleanliness */
    BACKGROUND: "#FFFFFF",
    /** Text color - dark gray for readability without harsh black */
    TEXT: "#333333",
    /** Grid color - light gray for subtle reference without interference */
    GRID: "#E0E0E0",
    /** Warning background - warm yellow for attention without alarm */
    WARNING_BG: "#fef3c7",
    /** Warning border - medium yellow for definition */
    WARNING_BORDER: "#fbbf24",
    /** Warning text - darker yellow for readability on light background */
    WARNING_TEXT: "#f59e0b"
} as const;

/**
 * Animation timing and easing configuration.
 *
 * These values control the chart's entrance animation, providing smooth and
 * professional visual transitions that enhance user experience without
 * being distracting or performance-intensive.
 *
 * **Animation Philosophy:**
 * - Smooth, natural-feeling transitions using cubic easing
 * - Duration long enough to be noticed but not disruptive
 * - Cubic Bézier curves for organic shape transitions
 * - Performance-optimized using requestAnimationFrame
 *
 * **Technical Details:**
 * - Cubic ease-out formula: 1 - Math.pow(1 - progress, EASING_FACTOR)
 * - Control points create smooth curves between data points
 * - Duration balances visibility with performance
 *
 * @constant
 */
export const ANIMATION_CONFIG = {
    /** Animation duration in milliseconds - balanced for visibility and performance */
    DURATION: 1200,
    /** Cubic easing factor for smooth ease-out animation curves */
    EASING_FACTOR: 3,
    /** Control point distance for smooth Bézier curves between data points */
    CONTROL_POINT_DISTANCE: 0.15
} as const;

/**
 * Interactive tooltip appearance and positioning configuration.
 *
 * These values ensure tooltips are readable, properly positioned, and don't
 * interfere with chart interaction. The configuration handles boundary
 * detection and optimal placement for user experience.
 *
 * **Positioning Strategy:**
 * - Small, focused tooltips that don't obscure chart data
 * - Intelligent boundary detection prevents overflow
 * - High z-index ensures visibility above all other elements
 * - Sufficient margins prevent edge clipping
 *
 * **Performance Considerations:**
 * - Minimal DOM impact with simple structure
 * - Efficient positioning calculations
 * - No animations for responsive feel
 *
 * @constant
 */
export const TOOLTIP_CONFIG = {
    /** Tooltip width in pixels - sized for typical numeric values */
    WIDTH: 80,
    /** Tooltip height in pixels - single line with padding */
    HEIGHT: 32,
    /** Margin from cursor/edges to prevent clipping */
    MARGIN: 10,
    /** Horizontal offset from cursor for better visibility */
    RIGHT_OFFSET: 20,
    /** Z-index ensuring tooltip appears above all chart elements */
    Z_INDEX: 1000
} as const;

/**
 * Data point visual styling configuration.
 *
 * These values control the appearance of individual data points on the chart,
 * ensuring they are visible, interactive, and aesthetically pleasing while
 * maintaining chart readability.
 *
 * **Visual Design:**
 * - Size large enough for easy interaction on touch devices
 * - White stroke provides definition against any background
 * - Sufficient stroke width for visibility at different zoom levels
 *
 * **Interaction Considerations:**
 * - Radius optimized for both mouse and touch interaction
 * - High contrast stroke for visibility
 * - Consistent sizing across different chart scales
 *
 * @constant
 */
export const DATA_POINT_CONFIG = {
    /** Data point circle radius in pixels - optimized for interaction */
    RADIUS: 3,
    /** Stroke width for data point borders - ensures visibility */
    STROKE_WIDTH: 2,
    /** Stroke color for data point borders - white for universal contrast */
    STROKE_COLOR: "#fff"
} as const;

/**
 * Grid lines and structural elements styling configuration.
 *
 * These values control the appearance of chart infrastructure elements
 * like grid polygons and radial spokes, ensuring they provide helpful
 * reference without interfering with data visualization.
 *
 * **Design Philosophy:**
 * - Subtle appearance that provides structure without distraction
 * - Consistent styling across all grid elements
 * - Optimized for both screen and print rendering
 *
 * **Technical Requirements:**
 * - String values for direct SVG attribute assignment
 * - Thin strokes to minimize visual weight
 * - Full opacity for clear reference lines
 *
 * @constant
 */
export const GRID_CONFIG = {
    /** Stroke width for grid lines - thin for subtle appearance */
    STROKE_WIDTH: "0.5",
    /** Opacity for grid elements - full visibility for reference */
    OPACITY: "1"
} as const;

/**
 * Data validation rules and error messaging configuration.
 *
 * These constants define the validation behavior for chart data, including
 * constraints, patterns, and user-facing error messages that help users
 * understand and resolve data quality issues.
 *
 * **Validation Strategy:**
 * - Reasonable limits that work for most use cases
 * - Clear, actionable error messages for users
 * - Pattern matching for common problematic characters
 * - Consistent messaging across validation scenarios
 *
 * **User Experience:**
 * - Messages guide users toward solutions
 * - Technical details hidden from end users
 * - Consistent tone and terminology
 *
 * @constant
 */
export const VALIDATION_CONSTANTS = {
    /** Maximum recommended length for category names to prevent layout issues */
    MAX_NAME_LENGTH: 20,
    /** Regular expression pattern for characters that may affect SVG rendering */
    SPECIAL_CHAR_PATTERN: /[<>'"&]/,
    /** User-friendly message for empty data scenarios */
    EMPTY_DATA_MESSAGE: "Data source is empty. Please add data to display the chart.",
    /** Technical error message for invalid data structure */
    NO_DATA_MESSAGE: "No data points provided or data is not an array"
} as const;

/**
 * Accessibility features and assistive technology configuration.
 *
 * These constants ensure the chart widget meets accessibility standards
 * and provides an excellent experience for users with assistive technologies
 * like screen readers and keyboard navigation.
 *
 * **Accessibility Standards:**
 * - WCAG 2.1 AA compliance for interactive elements
 * - Screen reader optimizations with appropriate timing
 * - Clear instructions for keyboard navigation
 * - Semantic roles and ARIA labels
 *
 * **Technical Implementation:**
 * - Debouncing prevents overwhelming screen readers
 * - Context-aware instructions based on interactivity
 * - Live regions for dynamic content updates
 *
 * @constant
 */
export const A11Y_CONSTANTS = {
    /** Debounce duration for screen reader announcements to prevent overwhelming */
    LOADING_DURATION_MS: 100,
    /** Keyboard navigation instructions for different interaction modes */
    KEYBOARD_INSTRUCTIONS: {
        /** Instructions when chart supports click interaction */
        INTERACTIVE: "Press Enter or Space to interact with this chart.",
        /** Instructions for display-only charts */
        DISPLAY_ONLY: "Chart is for display purposes only."
    }
} as const;
