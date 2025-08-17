# Updated Inverter Selection Rule - Summary

## 🎯 What Changed

The inverter selection rule has been updated from a **strict ±15% tolerance** to a **minimum 15% below system power with no upper limit**.

## 🔄 Before vs After

### **Before (Old Rule)**
```
System Power × 0.85 ≤ Inverter Power ≤ System Power × 1.15
```

**Example for 10 kW system:**
- ✅ Available: 8 kW, 10 kW, 12 kW
- ❌ Hidden: 3, 3.6, 5.3, 6, 15, 20, 25, 30, 40, 50, 60, 75, 100, 110 kW

### **After (New Rule)**
```
System Power × 0.85 ≤ Inverter Power (No upper limit)
```

**Example for 10 kW system:**
- ✅ Available: 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 75, 100, 110 kW
- ❌ Hidden: 3, 3.6, 5.3, 6 kW

## 🚀 Benefits of the New Rule

### **1. Prevents Under-sizing**
- Still maintains the 15% minimum to prevent inverter overload
- Ensures inverters can handle the system load

### **2. Allows Future Expansion**
- Users can choose larger inverters for future panel additions
- Supports system growth without inverter replacement

### **3. Better Efficiency Options**
- Larger inverters often have better efficiency curves
- Users can optimize for their specific needs

### **4. Industry Best Practice**
- Common approach in solar installations
- Balances safety with flexibility

## 🔧 Implementation Details

### **Functions Updated**
1. **`populateManualBrands()`** - Filters brands by minimum power
2. **`populateManualPowers()`** - Filters powers by minimum power  
3. **`populateInverterDropdown()`** - Auto-selection with new rule
4. **Event listeners** - Real-time updates when system power changes

### **Code Changes**
```javascript
// OLD: Strict range filtering
.filter(inv => inv.kw >= minPower && inv.kw <= maxPower)

// NEW: Minimum power only
.filter(inv => inv.kw >= minPower) // No upper limit
```

## 📊 Examples

### **5 kW System**
- **Minimum**: 5 × 0.85 = 4.25 kW
- **Available**: 5.3, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 75, 100, 110 kW
- **Hidden**: 3, 3.6 kW

### **20 kW System**
- **Minimum**: 20 × 0.85 = 17 kW
- **Available**: 20, 25, 30, 40, 50, 60, 75, 100, 110 kW
- **Hidden**: 3, 3.6, 5.3, 6, 8, 10, 12, 15 kW

### **100 kW System**
- **Minimum**: 100 × 0.85 = 85 kW
- **Available**: 100, 110 kW
- **Hidden**: All smaller inverters

## 🧪 Testing

### **Test File Updated**
- `test-15-percent-rule.html` now demonstrates the new rule
- Shows minimum power calculation
- Displays all available options above minimum

### **Manual Testing**
1. Enter system power (e.g., 10 kW)
2. Switch to manual inverter mode
3. Notice all brands/powers ≥ 8.5 kW are shown
4. Change system power to see dynamic updates

## ✅ What's Working

1. **Manual Mode**: Only suitable brands and powers shown
2. **Auto Mode**: Only suitable inverters in dropdown
3. **Dynamic Updates**: Options refresh when system power changes
4. **Bilingual Support**: English and Armenian messages
5. **Error Handling**: Clear feedback when no options available

## 🎉 Summary

The inverter selection system now provides:

- **Safety**: Prevents under-sizing with 15% minimum
- **Flexibility**: Allows all larger inverters for future growth
- **User Experience**: More options while maintaining guidance
- **Industry Compliance**: Follows common solar installation practices

This change makes the system more flexible while maintaining safety standards, allowing users to make informed decisions about their inverter sizing based on current needs and future plans.
