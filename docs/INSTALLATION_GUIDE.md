# Installation Guide - Radar Chart Widget

## Overview

This guide provides step-by-step instructions for installing, configuring, and deploying the Radar Chart Widget in your Mendix application.

## Prerequisites

### System Requirements

#### Mendix Platform
- **Mendix Studio Pro**: Version 9.0 or higher
- **Mendix Runtime**: Version 9.0 or higher
- **Target Platform**: Web applications only (not supported on mobile)

#### Browser Requirements
- **Chrome**: Version 70+
- **Firefox**: Version 65+
- **Safari**: Version 12+
- **Edge**: Version 79+
- **Internet Explorer**: Not supported

#### Development Environment
- **Node.js**: Version 16+ (for development builds)
- **NPM**: Version 7+ (for dependency management)

### Mendix Project Requirements

#### Required Modules
- **System module**: Standard Mendix system module
- **Data source**: Any module providing list data

#### Recommended Modules
- **Community Commons**: For enhanced utility functions
- **Mendix SSO**: For user authentication (if using personalized data)

## Installation Methods

### Method 1: Mendix Marketplace (Recommended)

#### Step 1: Access Marketplace
1. Open **Mendix Studio Pro**
2. Go to **Tools** → **Marketplace**
3. Search for "Radar Chart Widget"
4. Click **Download**

#### Step 2: Import Widget
1. The widget will be automatically imported into your project
2. Refresh your **Toolbox** in Studio Pro
3. Verify the widget appears under **Add-ons** or **Charts**

#### Step 3: Verify Installation
```
Project Explorer
├── App
│   └── widgets
│       └── RadarChartWidget.mpk ✓
└── Deployment
    └── widgets
        └── RadarChartWidget ✓
```

### Method 2: Manual Installation

#### Step 1: Download Widget Package
1. Download `RadarChartWidget.mpk` from the release
2. Save to your local machine

#### Step 2: Import to Studio Pro
1. In Studio Pro, go to **File** → **Import App Package**
2. Select the downloaded `.mpk` file
3. Choose **Import as widget**
4. Click **Import**

#### Step 3: Verify Installation
1. Check **Project Explorer** → **App** → **widgets**
2. Verify `RadarChartWidget.mpk` is present
3. Refresh **Toolbox** to see the widget

### Method 3: Development Installation

#### Step 1: Clone Repository
```bash
git clone https://github.com/your-org/radar-chart-widget.git
cd radar-chart-widget/radarChartWidget
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Build Widget
```bash
# Development build
npm run build

# Production build
npm run release
```

#### Step 4: Import Built Widget
1. Locate `dist/RadarChartWidget.mpk`
2. Import using Studio Pro (Method 2, Step 2)

## Configuration

### Step 1: Create Data Entity

#### Example Entity Structure
```
Entity: PerformanceMetric
Attributes:
├── Category (String) - Category name
├── Score (Decimal) - Numeric value (0-5 scale)
├── Description (String, Optional) - Additional context
└── CreatedDate (DateTime, Optional) - Timestamp
```

#### Domain Model Example
```
[Employee] 1-* [PerformanceMetric]
    │              │
    ├── Name       ├── Category
    ├── Department ├── Score  
    └── Position   └── Description
```

### Step 2: Create Data Source

#### Option A: Database Source
```sql
-- Example database view
CREATE VIEW EmployeePerformance AS
SELECT 
    emp.EmployeeId,
    'Communication' as Category, emp.CommunicationScore as Score
FROM Employees emp
UNION ALL
SELECT 
    emp.EmployeeId,
    'Technical Skills' as Category, emp.TechnicalScore as Score
FROM Employees emp;
```

#### Option B: Microflow Source
```javascript
// Microflow: GetPerformanceData
// Input: Employee (Object)
// Output: List of PerformanceMetric

// Sample implementation
function GetPerformanceData(employee) {
    const metrics = [
        createMetric('Communication', employee.CommunicationScore),
        createMetric('Leadership', employee.LeadershipScore),
        createMetric('Technical Skills', employee.TechnicalScore),
        createMetric('Problem Solving', employee.ProblemSolvingScore),
        createMetric('Teamwork', employee.TeamworkScore)
    ];
    
    return metrics;
}

function createMetric(category, score) {
    const metric = mendix.lib.MxObject.create('PerformanceMetric');
    metric.set('Category', category);
    metric.set('Score', score);
    return metric;
}
```

#### Option C: REST Service
```javascript
// REST service configuration
Service URL: https://api.example.com/performance/{employeeId}
Method: GET
Response format: JSON

// Expected response
[
    {"category": "Communication", "score": 4.2},
    {"category": "Leadership", "score": 3.8},
    {"category": "Technical Skills", "score": 4.5}
]
```

### Step 3: Add Widget to Page

#### Page Structure Example
```
Page: EmployeeDashboard
├── Data View (Employee)
│   ├── Text (Employee Name)
│   ├── Text (Department)
│   └── Radar Chart Widget ⭐
└── Action Buttons
    ├── Edit Performance
    └── Export Report
```

#### Widget Placement
1. Drag **Radar Chart Widget** from Toolbox
2. Place inside **Data View** with Employee context
3. Configure data source and properties

### Step 4: Configure Widget Properties

#### Basic Configuration
```
Data Source Tab:
├── Data source: $currentObject/PerformanceMetrics
├── Name attribute: Category
└── Score attribute: Score

Chart Configuration Tab:
├── Chart title: "Employee Performance"
├── Maximum scale value: 5
├── Show labels: Yes
└── Show grid lines: Yes

Appearance Tab:
├── Chart width: 400
├── Chart height: 400
├── Fill color: #A084E7
├── Stroke color: #7C5AC4
├── Fill opacity: 0.3
└── Background color: #FFFFFF
```

#### Advanced Configuration
```
Legend Tab:
├── Show legend: Yes
├── Legend position: Right
└── Show value labels: Yes

Colors Tab:
├── Text color: #333333
├── Grid color: #E0E0E0
├── Background color: #FFFFFF
└── Custom CSS class: (optional)

Events Tab:
└── On click action: NavigateToDetails
```

## Data Source Setup

### Database Entity Configuration

#### Step 1: Create Entity
```
Entity Name: RadarChartData
Persistable: Yes
Table Name: radar_chart_data

Attributes:
├── ID (AutoNumber, Primary Key)
├── Category (String, Length: 50)
├── Value (Decimal, Precision: 3.2)
├── EntityReference (String, Optional)
└── LastUpdated (DateTime)

Indexes:
├── IDX_Category (Category)
└── IDX_EntityRef (EntityReference)
```

#### Step 2: Data Access Rules
```
Access Rules:
├── User Role: User
│   ├── Allow Read: Yes
│   ├── Allow Create: No
│   ├── Allow Update: No
│   └── Allow Delete: No
└── XPath Constraint: [EntityReference = '[%CurrentUser%]']
```

### Microflow Configuration

#### Sample Microflow Structure
```
Microflow: DS_GetRadarData
├── Input: ContextObject
├── Activity: Retrieve RadarChartData
│   └── XPath: [EntityReference = $ContextObject/ID]
├── Activity: Sort by Category
└── Output: List of RadarChartData
```

#### Error Handling
```
Microflow: DS_GetRadarDataWithFallback
├── Try Block:
│   └── Call DS_GetRadarData
├── Catch Block:
│   ├── Log Error
│   └── Return Default Data
└── Return Result
```

### REST Service Configuration

#### Service Definition
```
REST Operation: GetPerformanceData
├── HTTP Method: GET
├── Location: /api/performance/{id}
├── Authentication: API Key
└── Response: List of PerformanceData

Import Mapping:
├── Root Element: PerformanceDataList
├── Child Element: PerformanceData
│   ├── category → Category (String)
│   └── score → Value (Decimal)
```

## Styling and Theming

### CSS Customization

#### Custom CSS Class
```css
/* Add to theme/web/css/custom.css */
.radar-chart-custom {
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    padding: 20px;
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.radar-chart-custom .radar-chart__title {
    color: #2c3e50;
    font-weight: 700;
    margin-bottom: 16px;
}
```

#### Theme Integration
```css
/* Corporate theme colors */
.radar-chart-corporate {
    --primary-color: #1e3a8a;
    --secondary-color: #3b82f6;
    --accent-color: #60a5fa;
    --text-color: #1f2937;
    --grid-color: #e5e7eb;
}
```

### Responsive Design

#### Mobile Optimization
```css
@media (max-width: 768px) {
    .radar-chart-widget {
        width: 100% !important;
        max-width: 350px;
        margin: 0 auto;
    }
    
    .radar-chart__legend {
        flex-direction: column;
        align-items: center;
    }
}
```

## Security Configuration

### Data Access Security

#### Entity Security
```
Entity: PerformanceMetric
├── Read Access: User, Manager, Admin
├── Create Access: Manager, Admin
├── Update Access: Manager, Admin
└── Delete Access: Admin only

XPath Constraints:
├── User: [Owner = '[%CurrentUser%]']
├── Manager: [Owner/Department = '[%CurrentUser%]/Department']
└── Admin: (no constraints)
```

#### Microflow Security
```
Microflow: GetPerformanceData
├── Allowed Roles: User, Manager, Admin
├── Apply Entity Access: Yes
└── Security Level: Protected
```

### Input Validation

#### Server-Side Validation
```javascript
// Validation microflow
function ValidatePerformanceData(data) {
    const errors = [];
    
    // Category validation
    if (!data.Category || data.Category.trim().length === 0) {
        errors.push('Category is required');
    }
    
    // Score validation
    if (isNaN(data.Score) || data.Score < 0 || data.Score > 5) {
        errors.push('Score must be between 0 and 5');
    }
    
    return errors.length === 0;
}
```

## Performance Optimization

### Data Loading Optimization

#### Lazy Loading Configuration
```
Data Source Configuration:
├── Retrieval: By XPath
├── XPath: [EntityRef = $CurrentObject/ID]
├── Sort: Category ASC
├── Limit: 20 (recommended maximum)
└── Refresh in client: Yes
```

#### Caching Strategy
```javascript
// Client-side caching
const cacheConfig = {
    cacheDuration: 300000, // 5 minutes
    cacheKey: 'radar-chart-' + entityId,
    refreshOnFocus: true,
    refreshOnUpdate: true
};
```

### Widget Performance

#### Chart Optimization
```javascript
// Performance settings
const performanceConfig = {
    maxDataPoints: 12,        // Optimal for readability
    animationDuration: 1000,  // Balance smooth vs. fast
    debounceDelay: 250,       // Prevent excessive updates
    renderOnDemand: true      // Only render when visible
};
```

## Testing and Validation

### Unit Testing

#### Test Data Setup
```javascript
// Test microflow: CreateTestData
function CreateTestData() {
    const testData = [
        {category: 'Communication', score: 4.2},
        {category: 'Leadership', score: 3.8},
        {category: 'Technical', score: 4.5},
        {category: 'Problem Solving', score: 3.9},
        {category: 'Teamwork', score: 4.1}
    ];
    
    return testData.map(item => createPerformanceMetric(item));
}
```

#### Validation Tests
```javascript
// Test scenarios
const testScenarios = [
    {
        name: 'Valid data',
        data: validTestData,
        expectedResult: 'success'
    },
    {
        name: 'Empty data',
        data: [],
        expectedResult: 'empty_state'
    },
    {
        name: 'Invalid scores',
        data: invalidScoreData,
        expectedResult: 'validation_error'
    }
];
```

### Integration Testing

#### Page Testing
```
Test Page: TestRadarChart
├── Test Scenario 1: Basic Functionality
│   ├── Load page with valid data
│   ├── Verify chart renders correctly
│   └── Test click interactions
├── Test Scenario 2: Error Handling
│   ├── Load page with invalid data
│   ├── Verify error messages
│   └── Test retry functionality
└── Test Scenario 3: Responsive Design
    ├── Test on mobile viewport
    ├── Verify legend positioning
    └── Check touch interactions
```

## Deployment

### Pre-Deployment Checklist

#### Code Review
- [ ] Widget configuration validated
- [ ] Data source properly configured
- [ ] Security rules applied
- [ ] Performance optimizations implemented
- [ ] Error handling tested
- [ ] Accessibility features verified

#### Testing Checklist
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] User acceptance testing completed
- [ ] Cross-browser testing completed
- [ ] Performance testing completed
- [ ] Security testing completed

### Production Deployment

#### Deployment Steps
1. **Package Application**
   ```bash
   # Create deployment package
   Build → Create Deployment Package
   ```

2. **Deploy to Environment**
   ```bash
   # Cloud deployment
   Deploy → Production Environment
   
   # On-premise deployment
   Copy .mda to application server
   ```

3. **Verify Deployment**
   - Test widget functionality
   - Verify data loading
   - Check error handling
   - Validate performance

#### Post-Deployment Monitoring
```javascript
// Monitoring setup
const monitoring = {
    errorTracking: 'Enable error logging',
    performanceMetrics: 'Monitor render times',
    userInteractions: 'Track click events',
    dataValidation: 'Monitor validation errors'
};
```

## Troubleshooting

### Common Installation Issues

#### Issue 1: Widget Not Appearing in Toolbox
**Symptoms**: Widget imported but not visible in toolbox
**Solution**:
1. Refresh toolbox (F5)
2. Check widget compatibility with Mendix version
3. Verify `.mpk` file integrity
4. Restart Studio Pro

#### Issue 2: Build Errors During Development
**Symptoms**: NPM build fails with errors
**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version # Should be 16+

# Run with verbose logging
npm run build --verbose
```

#### Issue 3: Runtime Errors
**Symptoms**: Widget fails to load in browser
**Solution**:
1. Check browser console for JavaScript errors
2. Verify data source configuration
3. Check network requests for data loading
4. Validate attribute mappings

### Data Configuration Issues

#### Issue 1: Empty Chart Display
**Symptoms**: Chart shows "No data available"
**Diagnosis**:
```javascript
// Debug checklist
1. Verify data source returns data
2. Check attribute mappings
3. Validate data types
4. Review security settings
```

**Solution**:
```javascript
// Debug microflow
function DebugDataSource(context) {
    const data = retrieveDataSource();
    console.log('Data count:', data.length);
    console.log('Sample data:', data[0]);
    return data;
}
```

#### Issue 2: Incorrect Chart Shape
**Symptoms**: Chart doesn't match expected polygon
**Solution**:
1. Check data point count (minimum 5 required)
2. Verify all data points have valid values
3. Review data source XPath constraints

### Performance Issues

#### Issue 1: Slow Chart Rendering
**Symptoms**: Chart takes long to load or animate
**Diagnosis**:
- Check data source size (>20 points may cause slowdown)
- Monitor browser performance tools
- Review animation settings

**Solution**:
```javascript
// Optimization settings
chartConfig = {
    maxDataPoints: 12,
    animationDuration: 800,
    enableAnimations: false // for very large datasets
};
```

#### Issue 2: Memory Leaks
**Symptoms**: Browser memory usage increases over time
**Solution**:
1. Implement proper cleanup in useEffect
2. Use React.memo for expensive components
3. Optimize re-render cycles

## Support and Resources

### Documentation
- [Technical Architecture](TECHNICAL_ARCHITECTURE.md)
- [API Reference](API_REFERENCE.md)
- [Performance Guide](PERFORMANCE_OPTIMIZATION.md)

### Community Support
- **Mendix Community Forum**: Ask questions and share solutions
- **GitHub Issues**: Report bugs and feature requests
- **Stack Overflow**: Tag questions with `mendix` and `radar-chart`

### Professional Support
- **Mendix Support**: For platform-related issues
- **Widget Maintainer**: For widget-specific issues
- **Custom Development**: For advanced customizations

This installation guide provides comprehensive coverage of all aspects needed to successfully install, configure, and deploy the Radar Chart Widget in production Mendix applications.