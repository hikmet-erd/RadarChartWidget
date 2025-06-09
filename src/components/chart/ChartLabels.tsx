import { ReactElement, createElement, useMemo } from "react";
import { RadarChartDataPoint } from "../../types/RadarChartTypes";
import { ChartDimensions } from "../../hooks/useChartCalculations";
import { CHART_DEFAULTS } from "../../constants/chartConstants";

export interface ChartLabelsProps {
    normalizedData: RadarChartDataPoint[];
    dimensions: ChartDimensions;
    textColor: string;
    showLabels: boolean;
}

/**
 * Optimized labels component for radar chart
 * Renders category labels around the chart perimeter
 */
export function ChartLabels({
    normalizedData,
    dimensions,
    textColor,
    showLabels
}: ChartLabelsProps): ReactElement | null {
    // Memoized category labels with optimized positioning
    const categoryLabels = useMemo(() => {
        if (!showLabels) {
            return null;
        }

        const labels: ReactElement[] = [];
        const labelRadius = dimensions.radius + CHART_DEFAULTS.LABEL_RADIUS_OFFSET;
        const { centerX, centerY, angleStep } = dimensions;

        normalizedData.forEach((dataPoint, index) => {
            if (!dataPoint.name) {
                return;
            }

            const angle = index * angleStep - Math.PI / 2;
            const x = centerX + labelRadius * Math.cos(angle);
            const y = centerY + labelRadius * Math.sin(angle);

            // Smart text anchor positioning based on label position
            let textAnchor: "start" | "middle" | "end" = "middle";
            if (x < centerX - 10) {
                textAnchor = "end";
            } else if (x > centerX + 10) {
                textAnchor = "start";
            }

            labels.push(
                <text
                    key={`label-${index}`}
                    x={x}
                    y={y + 4}
                    fontSize="12"
                    fill={textColor}
                    textAnchor={textAnchor}
                    fontWeight="500"
                    className="radar-chart__category-label"
                    style={{ fill: textColor }}
                >
                    {dataPoint.name}
                </text>
            );
        });

        return labels;
    }, [showLabels, normalizedData, dimensions, textColor]);

    if (!showLabels || !categoryLabels) {
        return null;
    }

    return <g className="radar-chart__labels">{categoryLabels}</g>;
}
