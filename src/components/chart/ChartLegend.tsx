import React, { ReactElement, createElement, useMemo } from "react";
import { RadarChartDataPoint } from "../../types/RadarChartTypes";

export interface ChartLegendProps {
    data: RadarChartDataPoint[];
    strokeColor: string;
    textColor: string;
    legendPosition: "top" | "right" | "bottom" | "left";
    showLegend: boolean;
}

/**
 * Optimized legend component for radar chart
 * Renders chart legend with configurable positioning
 */
export function ChartLegend({
    data,
    strokeColor,
    textColor,
    legendPosition,
    showLegend
}: ChartLegendProps): ReactElement | null {
    // Memoized legend items
    const legendItems = useMemo(() => {
        if (!showLegend || data.length === 0) {
            return null;
        }

        return data.map((point, index) => (
            <div
                key={`legend-${index}`}
                className="radar-chart__legend-item"
                style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "4px"
                }}
            >
                <div
                    className="radar-chart__legend-color"
                    style={{
                        backgroundColor: strokeColor,
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        marginRight: "8px"
                    }}
                />
                <span
                    className="radar-chart__legend-label"
                    style={{
                        color: textColor,
                        fontSize: "12px"
                    }}
                >
                    {point.name}: {point.value.toFixed(1)}
                </span>
            </div>
        ));
    }, [data, strokeColor, textColor, showLegend]);

    // Memoized legend container style
    const legendStyle: React.CSSProperties = useMemo(
        () => ({
            display: "flex",
            flexDirection: legendPosition === "top" || legendPosition === "bottom" ? "row" : "column",
            flexWrap: "wrap",
            gap: "8px",
            padding: "12px",
            fontSize: "12px"
        }),
        [legendPosition]
    );

    if (!showLegend || !legendItems) {
        return null;
    }

    return (
        <div className="radar-chart__legend" style={legendStyle}>
            {legendItems}
        </div>
    );
}
