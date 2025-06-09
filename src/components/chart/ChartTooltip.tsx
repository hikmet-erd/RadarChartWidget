import { ReactElement, createElement } from "react";
import { TOOLTIP_CONFIG } from "../../constants/chartConstants";

export interface TooltipState {
    visible: boolean;
    x: number;
    y: number;
    value: number;
    name: string;
}

export interface ChartTooltipProps {
    tooltip: TooltipState;
}

/**
 * Optimized tooltip component for radar chart
 * Displays data point information on hover
 */
export function ChartTooltip({ tooltip }: ChartTooltipProps): ReactElement | null {
    if (!tooltip.visible) {
        return null;
    }

    return (
        <div
            className="radar-chart__tooltip"
            style={{
                position: "absolute",
                left: tooltip.x,
                top: tooltip.y,
                zIndex: TOOLTIP_CONFIG.Z_INDEX,
                backgroundColor: "#ffffff",
                border: "1px solid #E0E0E0",
                borderRadius: "6px",
                padding: "6px 10px",
                fontSize: "13px",
                fontWeight: "600",
                color: "#333333",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                pointerEvents: "none",
                whiteSpace: "nowrap",
                textAlign: "center"
            }}
        >
            {tooltip.value.toFixed(1)}
        </div>
    );
}

/**
 * Utility function to calculate optimal tooltip position
 * Prevents tooltip from overflowing container boundaries
 */
export function calculateTooltipPosition(
    mouseX: number,
    mouseY: number,
    containerRect: DOMRect
): { x: number; y: number } {
    const tooltipWidth = TOOLTIP_CONFIG.WIDTH;
    const tooltipHeight = TOOLTIP_CONFIG.HEIGHT;
    const margin = TOOLTIP_CONFIG.MARGIN;
    const rightOffset = TOOLTIP_CONFIG.RIGHT_OFFSET;

    let tooltipX = mouseX - tooltipWidth / 2 + rightOffset;
    let tooltipY = mouseY - tooltipHeight - margin;

    // Boundary checks with fallback positioning
    if (tooltipX + tooltipWidth > containerRect.width) {
        tooltipX = mouseX - tooltipWidth - margin;
    }
    if (tooltipX < 0) {
        tooltipX = mouseX + margin;
    }
    if (tooltipY < 0) {
        tooltipY = mouseY + margin;
    }

    return { x: tooltipX, y: tooltipY };
}
