# Radar Chart Widget for Mendix

[![Mendix Version](https://img.shields.io/badge/Mendix-9.18%2B-blue)](https://www.mendix.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.0%2B-blue)](https://www.typescriptlang.org/)
[![Accessibility](https://img.shields.io/badge/WCAG-2.1%20AA-green)](https://www.w3.org/WAI/WCAG21/quickref/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

A high-performance, accessible radar chart widget for Mendix applications that transforms numerical data into engaging, interactive visualizations. Built with modern React, TypeScript, and comprehensive accessibility features.

## Key Features

### **Advanced Data Visualization**
- **Dynamic Polygon Shapes**: Automatically adapts from pentagon to complex polygons based on data size
- **Smooth Animations**: Cubic Bézier curves create fluid, professional transitions
- **Interactive Tooltips**: Hover effects with precise value display and intelligent positioning
- **Responsive Design**: Scales perfectly across desktop, tablet, and mobile devices

### **Comprehensive Customization**
- **Rich Color Palette**: Full color customization with accessibility-compliant defaults
- **Flexible Layout**: Configurable dimensions, padding, and label positioning
- **Legend Options**: Four-position legend with customizable styling
- **Grid Controls**: Adjustable grid levels and spoke visibility

### **Accessibility Excellence**
- **WCAG 2.1 AA Compliant**: Meets international accessibility standards
- **Screen Reader Optimized**: Detailed descriptions and statistical summaries
- **Keyboard Navigation**: Full functionality via Enter/Space key interaction
- **Live Regions**: Dynamic content updates for assistive technology
- **High Contrast Support**: Optimized for visual accessibility tools

### **Developer Experience**
- **TypeScript Support**: Full type safety with comprehensive interfaces
- **Performance Optimized**: Aggressive memoization and efficient rendering
- **Error Handling**: Graceful degradation with meaningful error messages
- **Development Mode**: Enhanced debugging and validation warnings

## Installation

### Manual Installation
1. Import into Mendix Studio Pro via **Project** > **Import App Store module**
3. Add the widget to your page from the **Toolbox**

## Quick Start

### Basic Setup
1. **Add the Widget**: Drag the Radar Chart Widget to your page
2. **Configure Data Source**: Connect to a list with name and value attributes
3. **Set Attributes**: Map your string attribute to **Name** and numeric attribute to **Value**
4. **Customize Appearance**: Adjust colors, dimensions, and display options

### Example Data Structure
```sql
-- Entity: PerformanceMetric
Name (String): "Communication", "Technical Skills", "Leadership"
Score (Decimal): 4.2, 3.8, 4.5
```

## Configuration Guide

### Data Source Configuration

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| **Data Source** | List | ✅ | Mendix list containing chart data |
| **Name Attribute** | String | ✅ | Attribute for category names (max 20 chars recommended) |
| **Value Attribute** | Number | ✅ | Numeric attribute for values (Decimal, Integer, Long) |
| **Max Value** | Number | ✅ | Maximum scale value (default: 5) |

### Appearance Settings

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| **Chart Title** | String | - | Optional title above chart |
| **Chart Width** | Number | 400 | Width in pixels (min: 200) |
| **Chart Height** | Number | 400 | Height in pixels (min: 200) |
| **Fill Color** | Color | #A084E7 | Chart area color |
| **Stroke Color** | Color | #7C5AC4 | Border line color |
| **Fill Opacity** | Number | 0.3 | Transparency (0.0-1.0) |
| **Background Color** | Color | #FFFFFF | Container background |
| **Text Color** | Color | #333333 | Labels and text |
| **Grid Color** | Color | #E0E0E0 | Grid lines and spokes |

### Display Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| **Show Labels** | Boolean | true | Category names around perimeter |
| **Show Grid Lines** | Boolean | true | Reference grid and spokes |
| **Show Legend** | Boolean | false | Data point legend |
| **Legend Position** | Enum | bottom | top, right, bottom, left |
| **Show Value Labels** | Boolean | false | Numeric values on data points |

### Interaction Settings

| Property | Type | Description |
|----------|------|-------------|
| **On Click Action** | Action | Optional action when chart is clicked |

## Usage Examples

### Employee Performance Dashboard
```typescript
// Data Structure
const performanceData = [
  { name: "Communication", value: 4.2 },
  { name: "Technical Skills", value: 3.8 },
  { name: "Problem Solving", value: 4.5 },
  { name: "Leadership", value: 3.9 },
  { name: "Teamwork", value: 4.3 }
];

// Widget Configuration
chartTitle: "Employee Performance Review"
maxValue: 5
showLegend: true
legendPosition: "bottom"
fillColor: "#2ecc71"
strokeColor: "#27ae60"
```

### Team Capability Matrix
```typescript
// Multiple charts for team comparison
const teamMembers = ["Alice", "Bob", "Charlie"];
const skills = ["Frontend", "Backend", "DevOps", "Testing", "Design"];

// Create one chart per team member
teamMembers.forEach(member => {
  // Configure chart with member-specific data
  chartTitle: `${member}'s Skills`
  fillColor: memberColors[member]
  onClickAction: navigateToMemberDetails
});
```

### Product Feature Analysis
```typescript
// Competitive analysis visualization
const features = [
  { name: "Performance", value: 8.5 },
  { name: "Usability", value: 7.2 },
  { name: "Reliability", value: 9.1 },
  { name: "Security", value: 8.8 },
  { name: "Scalability", value: 7.9 }
];

// Configuration for product comparison
maxValue: 10
chartTitle: "Product Feature Scores"
fillOpacity: 0.4
showValueLabels: true
```

## Accessibility Features

### Screen Reader Support
- **Detailed Descriptions**: Comprehensive chart summaries with statistical insights
- **Data Tables**: Alternative tabular representation for structured navigation
- **Live Regions**: Dynamic content updates announced to assistive technology
- **Contextual Instructions**: Clear guidance for keyboard interaction

### Keyboard Navigation
- **Enter/Space**: Activate click actions when configured
- **Tab Navigation**: Follows standard web accessibility patterns
- **Focus Indicators**: Clear visual focus states for keyboard users

### Visual Accessibility
- **High Contrast**: Optimized color combinations for visual impairments
- **Scalable Text**: Respects user font size preferences
- **Color Independence**: Information conveyed through multiple visual channels

## Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| **Chrome** | 70+ | ✅ Fully Supported |
| **Firefox** | 65+ | ✅ Fully Supported |
| **Safari** | 12+ | ✅ Fully Supported |
| **Edge** | 79+ | ✅ Fully Supported |
| **IE 11** | - | ⚠️ Requires Polyfills |

### Mobile Support
- **iOS Safari**: 12.0+
- **Chrome Mobile**: 70+
- **Samsung Internet**: 10.0+

## Development

### Prerequisites
- Node.js 14+
- Mendix Studio Pro 9.18+
- TypeScript 4.0+

### Building from Source
```bash
# Clone repository
git clone https://gitlab.rnd.mendix.com/online-platform/pathfinders/widgets/RadarChartWidget

# Install dependencies
npm install

# Build widget
npm run build

# Development mode with hot reload
npm run dev
```

## API Reference

### Data Types
```typescript
interface RadarChartDataPoint {
  name: string;    // Category name (max 20 chars recommended)
  value: number;   // Numeric value within [0, maxValue] range
}

interface RadarChartConfig {
  width: number;           // Chart width in pixels
  height: number;          // Chart height in pixels
  maxValue: number;        // Maximum scale value
  fillColor: string;       // Hex color for chart area
  strokeColor: string;     // Hex color for border
  showLabels: boolean;     // Display category labels
  showGridLines: boolean;  // Display reference grid
  title?: string;          // Optional chart title
}
```

### Validation Rules
- **Minimum Data Points**: 1 (automatically padded to 5 for polygon stability)
- **Maximum Data Points**: No hard limit (performance optimal up to 20)
- **Value Range**: Automatically clamped to [0, maxValue]
- **Name Length**: Warning at 20+ characters
- **Special Characters**: Detected and reported in development mode

## Troubleshooting

### Common Issues

#### Chart Not Displaying
- **Check Data Source**: Ensure data source contains items
- **Verify Attributes**: Confirm name/value attributes are mapped correctly
- **Check Permissions**: Ensure current user has read access to data

#### Performance Issues
- **Data Size**: Consider pagination for 50+ data points
- **Animation**: Disable animations for better performance if needed
- **Container Size**: Ensure parent container has defined dimensions

#### Accessibility Concerns
- **Screen Reader**: Verify ARIA labels are being announced
- **Keyboard**: Test Enter/Space key functionality
- **Contrast**: Check color combinations meet WCAG standards

### Development Mode Warnings
Enable development mode to see detailed warnings about:
- Data quality issues
- Configuration problems
- Performance optimizations
- Accessibility improvements

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:
- Code style and standards
- Testing requirements
- Accessibility compliance
- Pull request process

## Support

- **Documentation**: [Widget Documentation](https://docs.mendix.com/widgets/)
- **Community**: [Mendix Community Forum](https://forum.mendix.com/)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Enterprise Support**: Contact your Mendix Customer Success Manager

---

**Made with ❤️ for the Mendix Community**
