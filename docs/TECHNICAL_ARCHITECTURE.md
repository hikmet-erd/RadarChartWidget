# Technical Architecture - Radar Chart Widget

## Overview

The Radar Chart Widget is a high-performance, accessible Mendix widget built with React, TypeScript, and modern web standards. This document provides a comprehensive technical overview of the widget's architecture, design patterns, and implementation details.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Radar Chart Widget                       │
├─────────────────────────────────────────────────────────────┤
│  Entry Point: RadarChartWidget.tsx                         │
│  ├── Props Validation & Configuration                       │
│  ├── Data Processing Pipeline                              │
│  └── Error Boundary & State Management                     │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Core Components                          │
├─────────────────────────────────────────────────────────────┤
│  RadarChart.tsx                                            │
│  ├── SVG Rendering Engine                                 │
│  ├── Animation System                                     │
│  ├── Interaction Handlers                                 │
│  └── Accessibility Layer                                  │
│                                                            │
│  Supporting Components:                                    │
│  ├── ErrorBoundary.tsx (Error Recovery)                   │
│  ├── SkeletonLoader.tsx (Loading States)                  │
│  └── EmptyState.tsx (No Data Handling)                    │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                     │
├─────────────────────────────────────────────────────────────┤
│  Custom Hooks:                                            │
│  ├── useRadarChartData.ts (Data Processing)               │
│  └── useChartCalculations.ts (Mathematical Operations)     │
│                                                            │
│  Utilities:                                               │
│  ├── validationUtils.ts (Data Validation)                 │
│  └── accessibilityUtils.ts (A11y Support)                 │
│                                                            │
│  Type System:                                             │
│  └── RadarChartTypes.ts (TypeScript Definitions)          │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Mendix Integration Layer                 │
├─────────────────────────────────────────────────────────────┤
│  Configuration:                                           │
│  ├── RadarChartWidget.xml (Studio Pro Configuration)      │
│  ├── RadarChartWidgetProps.d.ts (Type Definitions)        │
│  └── RadarChartWidget.editorConfig.ts (Validation)        │
│                                                            │
│  Studio Pro Integration:                                  │
│  └── RadarChartWidget.editorPreview.tsx (Preview)         │
└─────────────────────────────────────────────────────────────┘
```

## Core Architecture Principles

### 1. Component-Based Architecture

The widget follows React's component-based architecture with clear separation of concerns:

- **Container Component** ([`RadarChartWidget.tsx`](src/RadarChartWidget.tsx:1)): Main entry point handling props, state, and orchestration
- **Presentation Component** ([`RadarChart.tsx`](src/components/RadarChart.tsx:1)): Pure rendering logic with SVG generation
- **Utility Components**: Specialized components for error handling, loading states, and empty states

### 2. Custom Hooks Pattern

Business logic is encapsulated in custom hooks for reusability and testability:

- [`useRadarChartData`](src/hooks/useRadarChartData.ts:1): Data processing and validation
- [`useChartCalculations`](src/hooks/useChartCalculations.ts:1): Mathematical calculations for chart geometry

### 3. Performance Optimization Strategy

#### Memoization
- **React.useMemo** for expensive calculations
- **React.useCallback** for event handlers
- Dependency arrays optimized to prevent unnecessary re-renders

#### SVG Optimization
- Minimal DOM manipulation
- Efficient path generation
- Hardware-accelerated animations using CSS transforms

### 4. Error Handling & Resilience

Multi-layered error handling approach:

```typescript
// Error Boundary Pattern
<ErrorBoundary>
  <RadarChart />
</ErrorBoundary>

// Validation Layer
const validationResult = useRadarChartData(dataSource, ...);
if (!validationResult.isValid) {
  return <ErrorState />;
}

// Graceful Degradation
if (isDataSourceLoading(dataSource)) {
  return <SkeletonLoader />;
}
```

## Data Flow Architecture

### 1. Data Source Integration

```typescript
// Mendix Data Source → Widget Props
dataSource: ListValue
nameAttribute: ListAttributeValue<string>
valueAttribute: ListAttributeValue<Big>

// Props Processing → Validated Data
const validationResult = useRadarChartData(
  dataSource,
  nameAttribute, 
  valueAttribute,
  maxValue,
  retryKey
);

// Validated Data → Chart Configuration
const chartConfig: RadarChartConfig = {
  width, height, maxValue,
  fillColor, strokeColor, fillOpacity,
  // ... other config options
};
```

### 2. Mathematical Pipeline

The widget transforms data through several mathematical operations:

```typescript
// 1. Data Normalization
const normalizedValue = Math.max(0, Math.min(maxValue, dataPoint.value));

// 2. Coordinate Calculation
const angle = i * angleStep - Math.PI / 2;
const pointRadius = (radius * value * animationProgress) / maxValue;
const x = centerX + pointRadius * Math.cos(angle);
const y = centerY + pointRadius * Math.sin(angle);

// 3. Path Generation
const path = `M ${dataPoints[0].x} ${dataPoints[0].y}`;
// ... smooth curve generation with cubic bezier curves
```

### 3. Rendering Pipeline

```
Raw Data → Validation → Normalization → Geometry Calculation → SVG Generation → DOM Rendering
```

## Component Hierarchy

```
RadarChartWidget (Container)
├── ErrorBoundary
│   └── RadarChart (Presentation)
│       ├── SVG Grid Elements
│       ├── SVG Data Area
│       ├── SVG Data Points
│       ├── Category Labels
│       ├── Tooltip (Conditional)
│       └── Legend (Conditional)
├── SkeletonLoader (Loading State)
├── EmptyState (No Data State)
└── Error Display (Error State)
```

## State Management

### 1. Local Component State

```typescript
// Animation State
const [animationProgress, setAnimationProgress] = useState(0);

// Tooltip State
const [tooltip, setTooltip] = useState<TooltipState>({
  visible: false,
  x: 0, y: 0,
  value: 0, name: ''
});

// Retry Mechanism
const [retryKey, setRetryKey] = useState(0);
```

### 2. Derived State (useMemo)

```typescript
// Chart Configuration
const chartConfig = useMemo(() => ({
  width: chartWidth || 400,
  height: chartHeight || 400,
  maxValue: bigToNumber(maxValue, 5),
  // ... configuration object
}), [chartWidth, chartHeight, maxValue, /* ... dependencies */]);

// Processed Data
const validationResult = useRadarChartData(
  dataSource, nameAttribute, valueAttribute, maxValue, retryKey
);
```

## Type System Architecture

### 1. Core Types

```typescript
// Data Point Interface
interface RadarChartDataPoint {
  name: string;
  value: number;
}

// Configuration Interface
interface RadarChartConfig {
  width: number;
  height: number;
  maxValue: number;
  fillColor: string;
  strokeColor: string;
  // ... styling options
}
```

### 2. Mendix Integration Types

Generated from [`RadarChartWidget.xml`](src/RadarChartWidget.xml:1):

```typescript
// Container Props (Runtime)
interface RadarChartWidgetContainerProps {
  dataSource: ListValue;
  nameAttribute: ListAttributeValue<string>;
  valueAttribute: ListAttributeValue<Big>;
  // ... configuration props
}

// Preview Props (Studio Pro)
interface RadarChartWidgetPreviewProps {
  dataSource: {} | { caption: string } | { type: string } | null;
  nameAttribute: string;
  valueAttribute: string;
  // ... preview-specific props
}
```

## Performance Characteristics

### 1. Computational Complexity

- **Data Processing**: O(n) where n = number of data points
- **SVG Generation**: O(n) for paths and elements
- **Animation**: 60fps using `requestAnimationFrame`

### 2. Memory Usage

- **Memoization**: Cached calculations prevent redundant operations
- **Event Handlers**: Stable references via `useCallback`
- **DOM Nodes**: Minimal SVG elements for optimal rendering

### 3. Bundle Size Optimization

- **No External Dependencies**: Self-contained implementation
- **Tree Shaking**: ES modules for optimal bundling
- **CSS Optimization**: SCSS with optimized selectors

## Security Considerations

### 1. Input Validation

```typescript
// Comprehensive data validation
export function validateRadarChartData(
  dataPoints: RadarChartDataPoint[], 
  maxValue: number = 5,
  minValue: number = 0
): ValidationResult {
  // Type checking, range validation, sanitization
}
```

### 2. XSS Prevention

- **HTML Escaping**: All user inputs are safely rendered
- **SVG Safety**: No dynamic script injection in SVG elements
- **Attribute Sanitization**: Color values validated with regex

### 3. Error Information Disclosure

- **Production Mode**: Minimal error details exposed
- **Development Mode**: Detailed error information for debugging

## Accessibility Architecture

### 1. ARIA Implementation

```typescript
// Screen Reader Support
<div 
  role={onClickAction ? "button" : "img"}
  aria-label={generateAriaLabel(data, title, hasClickAction)}
  tabIndex={onClickAction ? 0 : undefined}
>
  <div className="sr-only" aria-live="polite">
    <p>{chartDescription}</p>
    <p>{chartSummary}</p>
  </div>
</div>
```

### 2. Keyboard Navigation

```typescript
// Keyboard Event Handling
onKeyDown={onClickAction ? (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    onClickAction();
  }
} : undefined}
```

### 3. Color Accessibility

- **High Contrast Support**: CSS media queries for contrast preferences
- **Color Independence**: Information not dependent solely on color
- **Focus Indicators**: Visible focus rings for keyboard navigation

## Integration Architecture

### 1. Mendix Platform Integration

```xml
<!-- Widget Configuration -->
<widget id="mendix.radarchartwidget.RadarChartWidget" 
        pluginWidget="true" 
        needsEntityContext="true" 
        offlineCapable="true"
        supportedPlatform="Web">
```

### 2. Build System Integration

```json
// Package Configuration
{
  "scripts": {
    "build": "pluggable-widgets-tools build:web",
    "dev": "pluggable-widgets-tools start:web",
    "lint": "pluggable-widgets-tools lint"
  }
}
```

### 3. Editor Integration

- **Studio Pro Preview**: Custom preview component
- **Property Validation**: Runtime validation in editor
- **Error Display**: Immediate feedback on configuration errors

## Extension Points

The architecture provides several extension points for customization:

### 1. Styling System

```scss
// SCSS Variables for Customization
$colors: (
  primary: #A084E7,
  primary-dark: #7C5AC4,
  // ... customizable color palette
);
```

### 2. Animation System

```typescript
// Configurable Animation Parameters
const duration = 1200; // ms
const easing = (progress) => 1 - Math.pow(1 - progress, 3); // ease-out-cubic
```

### 3. Validation System

```typescript
// Custom Validation Rules
interface ValidationRule {
  validate: (data: any) => boolean;
  message: string;
  severity: 'error' | 'warning' | 'info';
}
```

## Future Architecture Considerations

### 1. Scalability

- **Large Datasets**: Virtualization for 100+ data points
- **Real-time Updates**: WebSocket integration capability
- **Multi-series Support**: Architecture for multiple data series

### 2. Platform Extensions

- **Mobile Optimization**: Touch gesture support
- **Native Apps**: React Native compatibility layer
- **PWA Support**: Offline capability enhancement

### 3. Advanced Features

- **3D Rendering**: WebGL integration potential
- **Animation Library**: Custom animation framework
- **Theming System**: Runtime theme switching

## Conclusion

The Radar Chart Widget architecture emphasizes performance, accessibility, maintainability, and extensibility. The modular design allows for easy testing, debugging, and future enhancements while maintaining compatibility with the Mendix platform ecosystem.