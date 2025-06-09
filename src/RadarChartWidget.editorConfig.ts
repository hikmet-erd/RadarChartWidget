import { Properties } from "@mendix/pluggable-widgets-tools";
import { RadarChartWidgetPreviewProps } from "../typings/RadarChartWidgetProps";

export function getProperties(_values: RadarChartWidgetPreviewProps, defaultProperties: Properties): Properties {
    // Return default properties with optimized configuration
    // Additional property logic can be added here if needed
    return defaultProperties;
}

export function check(values: RadarChartWidgetPreviewProps): Problem[] {
    const errors: Problem[] = [];

    // Enhanced data source validation
    if (!values.dataSource) {
        errors.push({
            property: "dataSource",
            message: "A data source must be configured for the radar chart to display data.",
            severity: "error"
        });
    }

    // Enhanced attribute validation with better error messages
    if (values.dataSource) {
        if (!values.nameAttribute) {
            errors.push({
                property: "nameAttribute",
                message:
                    "Name attribute is required to display category labels. Select a string attribute for category names.",
                severity: "error"
            });
        }

        if (!values.valueAttribute) {
            errors.push({
                property: "valueAttribute",
                message:
                    "Score attribute is required to display data values. Select a numeric attribute (Integer, Long, or Decimal).",
                severity: "error"
            });
        }
    }

    // Enhanced chart dimensions validation
    if (values.chartWidth !== null && values.chartWidth !== undefined) {
        if (values.chartWidth < 200) {
            errors.push({
                property: "chartWidth",
                message: "Chart width should be at least 200 pixels for proper visibility.",
                severity: "warning"
            });
        } else if (values.chartWidth > 1000) {
            errors.push({
                property: "chartWidth",
                message: "Chart width exceeds 1000 pixels. Consider reducing for better performance.",
                severity: "warning"
            });
        }
    }

    if (values.chartHeight !== null && values.chartHeight !== undefined) {
        if (values.chartHeight < 200) {
            errors.push({
                property: "chartHeight",
                message: "Chart height should be at least 200 pixels for proper visibility.",
                severity: "warning"
            });
        } else if (values.chartHeight > 1000) {
            errors.push({
                property: "chartHeight",
                message: "Chart height exceeds 1000 pixels. Consider reducing for better performance.",
                severity: "warning"
            });
        }
    }

    // Enhanced max value validation
    if (values.maxValue !== null && values.maxValue !== undefined) {
        if (values.maxValue <= 0) {
            errors.push({
                property: "maxValue",
                message: "Maximum scale value must be greater than 0.",
                severity: "error"
            });
        } else if (values.maxValue > 100) {
            errors.push({
                property: "maxValue",
                message:
                    "Maximum scale value is very high (>100). Consider using a smaller scale for better readability.",
                severity: "warning"
            });
        }
    }

    // Enhanced fill opacity validation
    if (values.fillOpacity !== null && values.fillOpacity !== undefined) {
        if (values.fillOpacity < 0 || values.fillOpacity > 1) {
            errors.push({
                property: "fillOpacity",
                message: "Fill opacity must be between 0.0 (transparent) and 1.0 (opaque).",
                severity: "error"
            });
        } else if (values.fillOpacity < 0.1) {
            errors.push({
                property: "fillOpacity",
                message: "Fill opacity is very low (<0.1). Chart area may be barely visible.",
                severity: "warning"
            });
        }
    }

    // Enhanced color validation with better regex and error messages
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

    if (values.fillColor && !hexColorRegex.test(values.fillColor)) {
        errors.push({
            property: "fillColor",
            message: "Fill color must be a valid hex color code (e.g., #3498db or #39f).",
            severity: "error"
        });
    }

    if (values.strokeColor && !hexColorRegex.test(values.strokeColor)) {
        errors.push({
            property: "strokeColor",
            message: "Stroke color must be a valid hex color code (e.g., #2980b9 or #29b).",
            severity: "error"
        });
    }

    if (values.backgroundColor && !hexColorRegex.test(values.backgroundColor)) {
        errors.push({
            property: "backgroundColor",
            message: "Background color must be a valid hex color code (e.g., #ffffff or #fff).",
            severity: "error"
        });
    }

    if (values.textColor && !hexColorRegex.test(values.textColor)) {
        errors.push({
            property: "textColor",
            message: "Text color must be a valid hex color code (e.g., #333333 or #333).",
            severity: "error"
        });
    }

    if (values.gridColor && !hexColorRegex.test(values.gridColor)) {
        errors.push({
            property: "gridColor",
            message: "Grid color must be a valid hex color code (e.g., #e0e0e0 or #e0e).",
            severity: "error"
        });
    }

    // Accessibility and usability validations
    if (values.fillColor && values.backgroundColor && values.fillColor === values.backgroundColor) {
        errors.push({
            property: "fillColor",
            message: "Fill color and background color are identical. Chart area will not be visible.",
            severity: "warning"
        });
    }

    if (values.textColor && values.backgroundColor && values.textColor === values.backgroundColor) {
        errors.push({
            property: "textColor",
            message: "Text color and background color are identical. Labels will not be visible.",
            severity: "warning"
        });
    }

    // Performance validation
    if (values.showLegend && values.showValueLabels && values.showLabels) {
        errors.push({
            property: "showLegend",
            message:
                "All display options are enabled. Consider disabling some options for cleaner appearance on smaller charts.",
            severity: "info"
        });
    }

    return errors;
}

type Problem = {
    property?: string;
    message: string;
    url?: string;
    severity?: "error" | "warning" | "info";
};
