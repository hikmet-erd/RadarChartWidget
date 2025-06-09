import { ReactElement, createElement } from "react";

import { parseInlineStyle } from "@mendix/pluggable-widgets-tools";

import { RadarChartWidgetPreviewProps } from "../typings/RadarChartWidgetProps";

function parentInline(node?: HTMLElement | null): void {
    // Temporary fix, the web modeler add a containing div, to render inline we need to change it.
    if (node && node.parentElement && node.parentElement.parentElement) {
        node.parentElement.parentElement.style.display = "inline-block";
    }
}

export function preview(props: RadarChartWidgetPreviewProps): ReactElement {
    const style = parseInlineStyle(props.style);
    const chartWidth = props.chartWidth || 400;
    const chartHeight = props.chartHeight || 400;

    return (
        <div ref={parentInline} className={props.className} style={style}>
            <div
                style={{
                    width: chartWidth,
                    height: chartHeight,
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: props.backgroundColor || "#f8f9fa",
                    color: props.textColor || "#6c757d",
                    fontSize: "14px",
                    textAlign: "center"
                }}
            >
                <div>
                    <div style={{ fontSize: "16px", marginBottom: "8px" }}>📊 Radar Chart Widget</div>
                    <div style={{ fontSize: "12px" }}>{props.chartTitle || "Radar Chart Preview"}</div>
                    <div style={{ fontSize: "11px", marginTop: "4px" }}>Configure data source to see chart</div>
                </div>
            </div>
        </div>
    );
}

export function getPreviewCss(): string {
    return require("./ui/RadarChartWidget.scss");
}
