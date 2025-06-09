# API Reference - Radar Chart Widget

## Overview

This document provides a comprehensive API reference for the Radar Chart Widget, including all configuration properties, data requirements, events, and code examples.

## Widget Properties

### Data Source Properties

#### `dataSource`
- **Type**: `ListValue`
- **Required**: Yes
- **Description**: The Mendix data source containing radar chart data points
- **Usage**: Must return a list of objects with name and value attributes

```javascript
// Example: Microflow returning performance data
// Entity: PerformanceMetric
// Attributes: Category (String), Score (Decimal)
```

#### `nameAttribute`
- **Type**: `ListAttributeValue<string>`
- **Required**: Yes
- **Description**: String attribute containing category names for each data point
- **Constraints**: 
  - Must be a String attribute
  - Maximum recommended length: 20 characters
  - Special characters `<>'"&` may affect display

```javascript
// Example mapping
nameAttribute: "Category" // Maps to Category attribute of PerformanceMetric
```

#### `valueAttribute`
- **Type**: `ListAttributeValue<Big>`
- **Required**: Yes
- **Description**: Numeric attribute containing score values
- **Supported Types**: Decimal, Integer, Long
- **Value Range**: Typically 0 to maxValue (default 0-5)
- **Validation**: Values outside range are automatically clamped

```javascript
// Example mapping
valueAttribute: "Score" // Maps to Score attribute of PerformanceMetric
```

### Chart Configuration Properties

#### `chartTitle`
- **Type**: `string`
- **Required**: No
- **Default**: Empty (no title)
- **Description**: Optional title displayed above the radar chart
- **Usage**: Provides context and improves accessibility

```xml
<!-- Example configuration in Studio Pro -->
<property key="chartTitle" value="Team Performance Assessment" />
```

#### `maxValue`
- **Type**: `Big` (Decimal)
- **Required**: No
- **Default**: `5`
- **Description**: Maximum value on the radar chart scale
- **Constraints**: Must be greater than 0
- **Recommendation**: Keep under 100 for readability

```javascript
// Example: Using a 10-point scale
maxValue: 10
// Results in scale: 0, 2, 4, 6, 8, 10
```

#### `showLabels`
- **Type**: `boolean`
- **Required**: No
- **Default**: `true`
- **Description**: Whether to display category labels around the chart perimeter

#### `showGridLines`
- **Type**: `boolean`
- **Required**: No  
- **Default**: `true`
- **Description**: Whether to display grid lines and spokes on the chart

### Appearance Properties

#### Chart Dimensions

##### `chartWidth`
- **Type**: `number` (Integer)
- **Required**: No
- **Default**: `400`
- **Unit**: Pixels
- **Range**: Minimum 200px, Maximum 1000px (recommended)

##### `chartHeight`
- **Type**: `number` (Integer)
- **Required**: No
- **Default**: `400`
- **Unit**: Pixels
- **Range**: Minimum 200px, Maximum 1000px (recommended)

```javascript
// Example: Large chart for dashboard
chartWidth: 600
chartHeight: 600
```

#### Color Properties

##### `fillColor`
- **Type**: `string`
- **Required**: No
- **Default**: `"#A084E7"` (Primary purple)
- **Format**: Hex color code (#RRGGBB or #RGB)
- **Description**: Color for the radar chart area fill

##### `strokeColor`
- **Type**: `string`
- **Required**: No
- **Default**: `"#7C5AC4"` (Darker purple)
- **Format**: Hex color code (#RRGGBB or #RGB)
- **Description**: Color for the radar chart border line

##### `fillOpacity`
- **Type**: `Big` (Decimal)
- **Required**: No
- **Default**: `0.3`
- **Range**: 0.0 (transparent) to 1.0 (opaque)
- **Description**: Opacity of the chart area fill

```javascript
// Example: Semi-transparent blue chart
fillColor: "#3498db"
strokeColor: "#2980b9"
fillOpacity: 0.5
```

##### `backgroundColor`
- **Type**: `string`
- **Required**: No
- **Default**: `"#ffffff"` (White)
- **Format**: Hex color code
- **Description**: Background color of the chart container

##### `textColor`
- **Type**: `string`
- **Required**: No
- **Default**: `"#333333"` (Dark gray)
- **Format**: Hex color code
- **Description**: Color for chart labels and text

##### `gridColor`
- **Type**: `string`
- **Required**: No
- **Default**: `"#e0e0e0"` (Light gray)
- **Format**: Hex color code
- **Description**: Color for grid lines and spokes

#### Legend Properties

##### `showLegend`
- **Type**: `boolean`
- **Required**: No
- **Default**: `false`
- **Description**: Whether to display a legend with data point information

##### `legendPosition`
- **Type**: `LegendPositionEnum`
- **Required**: No
- **Default**: `"right"`
- **Options**: `"top"`, `"right"`, `"bottom"`, `"left"`
- **Description**: Position of the legend relative to the chart

##### `showValueLabels`
- **Type**: `boolean`
- **Required**: No
- **Default**: `true`
- **Description**: Whether to display value labels on data points

### Events

#### `onClickAction`
- **Type**: `ActionValue` (Optional)
- **Required**: No
- **Description**: Action to trigger when the chart is clicked
- **Accessibility**: Enables keyboard navigation (Enter/Space)

## Data Requirements

### Data Structure

The widget expects data in the following format:

```typescript
interface RadarChartDataPoint {
  name: string;    // Category name (from nameAttribute)
  value: number;   // Score value (from valueAttribute)
}
```

### Example Data Sources

#### Microflow Example

```javascript
// Microflow: GetPerformanceData
// Returns: List of PerformanceMetric

Entity: PerformanceMetric
Attributes:
- Category (String): "Communication", "Teamwork", "Technical Skills"
- Score (Decimal): 4.2, 3.8, 4.5
```

#### Database Example

```sql
-- Sample database query
SELECT 
    'Communication' as Category, 4.2 as Score
UNION ALL
SELECT 
    'Teamwork' as Category, 3.8 as Score
UNION ALL
SELECT 
    'Technical Skills' as Category, 4.5 as Score
```

### Data Validation Rules

#### Automatic Validation

1. **Empty Names**: Replaced with "Category N" format
2. **Out of Range Values**: Clamped to [0, maxValue] range
3. **Duplicate Names**: Error displayed to user
4. **Invalid Types**: Error displayed with guidance
5. **Minimum Data Points**: Automatically padded to 5 points (pentagon)

#### Error Messages

```typescript
// Common validation errors
{
  type: 'MISSING_DATA',
  message: 'Data source is not properly configured.'
}

{
  type: 'DUPLICATE_NAMES', 
  message: 'Some category names are duplicated.'
}

{
  type: 'INVALID_DATA_TYPE',
  message: 'Value at index 2 is not a valid number.'
}
```

## Chart Behavior

### Dynamic Shape Adaptation

The chart automatically adapts its shape based on data points:

```javascript
// Shape determination logic
const dataPointCount = Math.max(5, data.length);

// Examples:
// 3 data points → Pentagon (5 sides) - minimum shape
// 5 data points → Pentagon
// 6 data points → Hexagon  
// 8 data points → Octagon
// 12 data points → Dodecagon
```

### Animation System

```typescript
// Animation configuration
const animationConfig = {
  duration: 1200,           // milliseconds
  easing: 'ease-out-cubic', // smooth deceleration
  property: 'path-length'   // animated property
};
```

### Interactive Features

#### Hover Tooltips

```typescript
// Tooltip content
interface TooltipContent {
  visible: boolean;
  name: string;      // Category name
  value: number;     // Formatted score value
  position: {x, y};  // Cursor position
}
```

#### Click Interactions

```typescript
// Click handler integration
const handleChartClick = () => {
  if (onClickAction?.canExecute) {
    onClickAction.execute();
  }
};
```

## Accessibility Features

### ARIA Support

```html
<!-- Generated ARIA attributes -->
<div 
  role="img"
  aria-label="Performance hexagon radar chart with 6 data points"
  tabindex="0"
>
  <div class="sr-only" aria-live="polite">
    <p>Hexagon radar chart with 6 data points. Communication: 4.2 out of 5 (84%), Teamwork: 3.8 out of 5 (76%), Technical Skills: 4.5 out of 5 (90%).</p>
    <p>Average score: 4.2. Highest: Technical Skills (4.5). Lowest: Teamwork (3.8).</p>
  </div>
</div>
```

### Keyboard Navigation

```typescript
// Keyboard event handling
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleChartClick();
  }
}}
```

### Screen Reader Support

```typescript
// Generated descriptions
const descriptions = {
  chartDescription: "Performance hexagon radar chart with 6 data points...",
  chartSummary: "Average score: 4.2. Highest: Technical Skills (4.5)...",
  keyboardInstructions: "Press Enter or Space to interact with this chart."
};
```

## Usage Examples

### Basic Implementation

```xml
<!-- Widget configuration in Studio Pro -->
<widget>
  <dataSource>$currentObject/PerformanceMetrics</dataSource>
  <nameAttribute>Category</nameAttribute>
  <valueAttribute>Score</valueAttribute>
  <chartTitle>Team Performance</chartTitle>
  <maxValue>5</maxValue>
  <showLabels>true</showLabels>
  <showGridLines>true</showGridLines>
  <chartWidth>400</chartWidth>
  <chartHeight>400</chartHeight>
</widget>
```

### Advanced Styling

```xml
<!-- Custom styled widget -->
<widget>
  <dataSource>$currentObject/KPIMetrics</dataSource>
  <nameAttribute>KPIName</nameAttribute>
  <valueAttribute>Value</valueAttribute>
  <chartTitle>Key Performance Indicators</chartTitle>
  <maxValue>10</maxValue>
  
  <!-- Custom colors -->
  <fillColor>#2ecc71</fillColor>
  <strokeColor>#27ae60</strokeColor>
  <fillOpacity>0.4</fillOpacity>
  <backgroundColor>#f8f9fa</backgroundColor>
  <textColor>#2c3e50</textColor>
  <gridColor>#bdc3c7</gridColor>
  
  <!-- Legend configuration -->
  <showLegend>true</showLegend>
  <legendPosition>bottom</legendPosition>
  <showValueLabels>true</showValueLabels>
  
  <!-- Interaction -->
  <onClickAction>CallMicroflow</onClickAction>
</widget>
```

### Microflow Integration

```javascript
// Microflow: ProcessChartClick
// Called when user clicks the chart

// Input: Current object context
// Actions:
// 1. Log chart interaction
// 2. Navigate to detail page
// 3. Show success message

export function ProcessChartClick(context) {
  // Access current object
  const currentObject = context.getContext();
  
  // Log interaction
  console.log('Chart clicked for object:', currentObject.getGuid());
  
  // Navigate to detail page
  mx.ui.openPage('DetailPage', {
    context: context,
    callback: () => {
      mx.ui.info('Navigated to detail view');
    }
  });
}
```

### Dynamic Data Loading

```javascript
// Microflow: LoadChartData
// Returns dynamic performance data

export function LoadChartData(params) {
  const performanceData = [
    { Category: 'Communication', Score: 4.2 },
    { Category: 'Problem Solving', Score: 3.8 },
    { Category: 'Creativity', Score: 4.5 },
    { Category: 'Leadership', Score: 3.9 },
    { Category: 'Technical Skills', Score: 4.1 },
    { Category: 'Teamwork', Score: 4.3 }
  ];
  
  return performanceData;
}
```

## Error Handling

### Validation Errors

```typescript
// Error handling patterns
try {
  const processedData = processChartData(rawData);
  return <RadarChart data={processedData} />;
} catch (error) {
  return <ErrorDisplay 
    message="Unable to process chart data"
    details={error.message}
    onRetry={handleRetry}
  />;
}
```

### Common Error Scenarios

1. **Empty Data Source**: Shows empty state with guidance
2. **Invalid Attributes**: Configuration error in Studio Pro
3. **Network Issues**: Retry mechanism with loading state
4. **Data Type Mismatches**: Clear error messages with field names

## Performance Considerations

### Optimal Data Ranges

```javascript
// Performance recommendations
const recommendations = {
  dataPoints: '5-12 points optimal', // Beyond 12 may crowd labels
  chartSize: '300-600px optimal',    // Balance visibility and performance
  animationDuration: '800-1500ms',   // Smooth but not slow
  updateFrequency: 'Max 1/second'    // Prevent animation conflicts
};
```

### Memory Usage

```typescript
// Memory optimization
const optimizations = {
  memoization: 'React.useMemo for expensive calculations',
  eventHandlers: 'React.useCallback for stable references',
  domElements: 'Minimal SVG nodes for efficient rendering',
  dataProcessing: 'Stream processing for large datasets'
};
```

## Browser Compatibility

### Supported Browsers

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 70+ | Full support |
| Firefox | 65+ | Full support |
| Safari | 12+ | Full support |
| Edge | 79+ | Full support |
| IE | Not supported | Modern features required |

### Feature Detection

```typescript
// Browser capability checks
const browserSupport = {
  svg: !!document.createElementNS,
  css3: 'transform' in document.documentElement.style,
  es6: typeof Symbol !== 'undefined'
};
```

## Integration Patterns

### Common Use Cases

1. **Performance Dashboards**: Employee/team performance metrics
2. **Product Analysis**: Feature comparison charts
3. **Financial Reports**: Multi-dimensional financial indicators
4. **Quality Metrics**: Process quality measurements
5. **Survey Results**: Multi-category survey visualizations

### Best Practices

```typescript
// Configuration best practices
const bestPractices = {
  dataPoints: 'Use 5-8 categories for optimal readability',
  colors: 'Ensure sufficient contrast (4.5:1 minimum)',
  labels: 'Keep category names under 15 characters',
  scale: 'Use consistent scales across related charts',
  accessibility: 'Always provide meaningful titles and descriptions'
};
```

This API reference provides comprehensive coverage of all widget properties, methods, and usage patterns for effective implementation of the Radar Chart Widget in Mendix applications.