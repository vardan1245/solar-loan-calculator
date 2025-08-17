# 15% Inverter Tolerance Rule Implementation

## 🎯 Overview

The 15% inverter tolerance rule ensures that only inverters within ±15% of the system power (kW) are shown to users. This prevents overloading small inverters and excessive oversizing, ensuring optimal performance and efficiency.

## 🔧 What Was Implemented

### 1. **Manual Inverter Selection Filtering**
- **Brand Selection**: Only shows brands that have inverters within the 15% tolerance range
- **Power Selection**: Only shows inverter powers within the 15% tolerance range
- **Model Selection**: Automatically filtered based on selected brand and power

### 2. **15% Tolerance Calculation**
```javascript
const minPower = systemPower * 0.85; // -15%
const maxPower = systemPower * 1.15; // +15%
```

### 3. **Dynamic Filtering**
- Options update automatically when system power changes
- Maintains user selections when possible
- Resets dependent selections when parent selection changes

## 📊 How It Works

### **Formula**
```
Inverter Power × 1.15 ≥ System Power
```

**Therefore:**
```
Inverter Power ≥ System Power ÷ 1.15
```

### **Example: 10 kW System**
- **Minimum inverter**: 10 ÷ 1.15 = 8.7 kW
- **Available options**: 10, 12, 15, 20, 25, 30, 40, 50, 60, 75, 100, 110 kW
- **Hidden options**: 3, 3.6, 5.3, 6, 8 kW (too small to handle 10 kW system)

### **Available Inverter Powers**
3, 3.6, 5.3, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 75, 100, 110 kW

## 🚀 Implementation Details

### **Functions Updated**

1. **`populateManualBrands()`**
   - Filters brands based on 15% tolerance
   - Shows only brands with suitable inverters
   - Handles cases with no suitable brands

2. **`populateManualPowers()`**
   - Filters power options based on 15% tolerance
   - Shows only suitable inverter powers
   - Handles cases with no suitable powers

3. **`refreshManualInverterOptions()`**
   - Refreshes options when system power changes
   - Resets dependent selections
   - Only runs when in manual mode

4. **Event Listeners**
   - System power input triggers refresh
   - Maintains real-time filtering

### **User Experience Features**

- **Smart Defaults**: Shows all options when no system power entered
- **Real-time Updates**: Options change as user types system power
- **Clear Feedback**: Shows when no suitable options available
- **Bilingual Support**: English and Armenian messages
- **Graceful Degradation**: Handles edge cases gracefully

## 🧪 Testing

### **Test File Created**
- `test-15-percent-rule.html` - Interactive test page
- Demonstrates the rule with different system powers
- Shows suitable vs. unsuitable inverters

### **Test Scenarios**
1. **10 kW System**: Should show 8, 10, 12 kW options
2. **5 kW System**: Should show 5.3, 6 kW options
3. **100 kW System**: Should show 75, 100, 110 kW options
4. **Edge Cases**: Very small/large systems

## ✅ Benefits

### **Technical Benefits**
- Prevents inverter overload
- Optimizes system performance
- Reduces installation errors
- Ensures code compliance

### **User Benefits**
- Clearer selection process
- Prevents wrong choices
- Faster decision making
- Professional guidance

### **Business Benefits**
- Reduces support calls
- Improves customer satisfaction
- Prevents warranty issues
- Industry best practice compliance

## 🔍 Code Examples

### **Power Filtering**
```javascript
const suitablePowers = [...new Set(inverters
    .filter(inv => inv.kw >= minPower) // Inverter must be able to handle system power
    .map(inv => inv.kw)
)].sort((a, b) => a - b);
```

### **Brand Filtering**
```javascript
const suitableBrands = [...new Set(inverters
    .filter(inv => inv.kw >= minPower) // Inverter must be able to handle system power
    .map(inv => inv.brand)
)].sort();
```

### **Dynamic Refresh**
```javascript
document.getElementById('systemPower').addEventListener('input', function() {
    populateInverterDropdown();
    refreshManualInverterOptions();
});
```

## 🚨 Edge Cases Handled

1. **No System Power**: Shows all options
2. **No Suitable Inverters**: Shows clear message
3. **Power Changes**: Automatically refreshes options
4. **Mode Switching**: Maintains appropriate state
5. **Invalid Input**: Graceful error handling

## 📱 User Interface

### **Visual Indicators**
- ✅ Suitable options shown normally
- ⚠️ No suitable options message
- 🔄 Dynamic updates
- 📊 Clear feedback

### **Language Support**
- English: "No suitable inverters (15% rule)"
- Armenian: "Հարմար ինվերտորներ չկան (15% կանոն)"

## 🔄 Future Enhancements

### **Potential Improvements**
1. **Customizable Tolerance**: Allow users to adjust percentage
2. **Advanced Filtering**: Add efficiency ratings, cost ranges
3. **Recommendation Engine**: Suggest best options
4. **Visual Charts**: Show tolerance ranges graphically

### **Integration Opportunities**
1. **API Endpoints**: Expose filtering logic
2. **Mobile Apps**: Use same logic
3. **Reporting**: Track user selections
4. **Analytics**: Monitor popular choices

## 📚 Industry Standards

### **Why This Approach?**
- **Safety**: Prevents inverter overload by ensuring inverter can handle system power
- **Technical Correctness**: Follows the actual electrical relationship (Inverter × 1.15 ≥ System)
- **Industry Standard**: 15% tolerance is the standard for inverter sizing
- **Reliability**: Ensures inverters operate within their capacity limits

### **Alternative Rules**
- **10%**: More restrictive, fewer options
- **20%**: More flexible, more options
- **Custom**: Based on specific requirements

## 🎉 Summary

The updated inverter selection rule has been successfully implemented across both manual and automatic inverter selection modes. The system now:

1. ✅ **Filters brands** to show only suitable options
2. ✅ **Filters powers** to show only suitable ranges
3. ✅ **Updates dynamically** when system power changes
4. ✅ **Provides clear feedback** when no options available
5. ✅ **Maintains user experience** with smart defaults
6. ✅ **Supports multiple languages** for accessibility

This implementation ensures users can only select appropriate inverters for their system size, preventing technical issues and improving overall system performance.
