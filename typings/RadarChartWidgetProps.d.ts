/**
 * This file was generated from RadarChartWidget.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ActionValue, ListValue, ListAttributeValue } from "mendix";
import { Big } from "big.js";

export type LegendPositionEnum = "top" | "right" | "bottom" | "left";

export interface RadarChartWidgetContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    dataSource: ListValue;
    nameAttribute: ListAttributeValue<string>;
    valueAttribute: ListAttributeValue<Big>;
    chartTitle: string;
    maxValue: Big;
    showLabels: boolean;
    showGridLines: boolean;
    chartWidth: number;
    chartHeight: number;
    fillColor: string;
    strokeColor: string;
    fillOpacity: Big;
    backgroundColor: string;
    textColor: string;
    gridColor: string;
    showLegend: boolean;
    legendPosition: LegendPositionEnum;
    showValueLabels: boolean;
    onClickAction?: ActionValue;
}

export interface RadarChartWidgetPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    renderMode: "design" | "xray" | "structure";
    translate: (text: string) => string;
    dataSource: {} | { caption: string } | { type: string } | null;
    nameAttribute: string;
    valueAttribute: string;
    chartTitle: string;
    maxValue: number | null;
    showLabels: boolean;
    showGridLines: boolean;
    chartWidth: number | null;
    chartHeight: number | null;
    fillColor: string;
    strokeColor: string;
    fillOpacity: number | null;
    backgroundColor: string;
    textColor: string;
    gridColor: string;
    showLegend: boolean;
    legendPosition: LegendPositionEnum;
    showValueLabels: boolean;
    onClickAction: {} | null;
}
