# Sales Office: Sales Team Percentage Control Feature

## Overview
A new feature has been added that allows **sales_office** role users to adjust the Sales Team percentage and see real-time impact on pricing calculations.

## Feature Access

### Who Can See This Feature:
- ✅ **Sales Office** role users (`sales_office`)
- ✅ **Admin** role users (`admin`)
- ❌ Regular users cannot see this control

### Current Sales Office Users:
1. **aram.mkoyan@icloud.com** - Sales Office
2. **edoavagyan0001@gmail.com** - Sales Office
3. **vardansargsyan97@gmail.com** - Admin (has access to all features)

## Feature Details

### Location
A minimal colored bar appears at the top of the calculator, after the "Sales Stage" dropdown:
- **Minimal Bar**: Just a thin purple-to-blue gradient bar (no text, no icons)
- **Full Panel**: Expands when clicked, showing all controls in a purple-highlighted box

### Interface States

#### 1. **Collapsed (Default)**
- Shows only a thin colored bar:
  - **Height**: 12px (0.75rem)
  - **Colors**: Purple-to-blue gradient
  - **No text, no icons, no labels**
  - **Hover effect**: Slightly darker gradient
- Completely minimal footprint
- Always visible to sales_office users

#### 2. **Expanded (When Clicked)**
- Bar becomes thinner (8px) and semi-transparent
- Full control panel slides down below
- Shows all adjustment controls
- Close button (X) in top-right corner of panel
- Click bar again or X to collapse

### Controls

#### 1. **Sales Team % Input Field**
- **Default Value**: 8.0%
- **Range**: 0% - 50%
- **Step**: 0.1% (allows decimals like 7.5%, 8.3%, etc.)
- **Action**: Changes the percentage used in loan calculations

#### 2. **Reset Button**
- **Label**: "Reset to Default (8%)"
- **Action**: Resets the percentage back to the standard 8%

## How It Works

### Calculation Logic

**Default Behavior (8%):**
```
Base System Price: 1,000,000 AMD
Sales Team (8%): Calculated from loan principal
Final Price: Higher
```

**Adjusted (e.g., 6%):**
```
Base System Price: 1,000,000 AMD
Sales Team (6%): Calculated from loan principal
Final Price: Lower (better for customer)
```

### Real-Time Updates
- Changes trigger automatic recalculation
- All loan options update with new percentage
- Calculation breakdown reflects the new percentage

## Usage Instructions

### For Sales Office Users:

1. **Log In** with your sales_office account
   - `aram.mkoyan@icloud.com` 
   - `edoavagyan0001@gmail.com`

2. **Locate the Colored Bar**
   - Look for the thin purple-to-blue gradient bar below "Sales Stage"
   - **Just a bar - no text or labels**
   - Subtle but clickable

3. **Open the Control Panel**
   - **Click anywhere on the colored bar** to expand controls
   - Panel slides down with full adjustment options
   - Bar becomes thinner when panel is open

4. **Adjust the Percentage**
   - Change the value in the input field
   - The calculator will automatically recalculate when you finish
   - No visible percentage display on the bar itself

5. **See the Results**
   - Loan options table updates with new prices
   - Monthly payments reflect the adjusted percentage
   - Calculation breakdown shows the custom percentage

6. **Reset When Needed**
   - Click "Reset to Default (8%)" to return to standard
   - System automatically recalculates with default value

7. **Close the Panel**
   - Click the colored bar again to collapse
   - Or click the X button in the panel
   - Panel stays closed until you need it again

## Use Cases

### Use Case 1: Competitive Pricing
**Scenario**: Customer is comparing quotes from multiple companies

**Action**: 
- Reduce Sales Team % from 8% to 6%
- Shows more competitive pricing
- Customer sees lower monthly payments

**Result**: More attractive offer for the customer

### Use Case 2: Special Promotions
**Scenario**: Running a limited-time promotion

**Action**:
- Temporarily reduce to 5% or 6%
- Generate promotional quotes
- Reset to 8% after promotion ends

### Use Case 3: VIP Customers
**Scenario**: Large commercial client or repeat customer

**Action**:
- Offer special rate of 7% instead of 8%
- Show appreciation for loyalty
- Still maintain profitability

## Technical Details

### Variables Updated:
- `customSalesTeamPct`: Global variable storing custom percentage
- When `null`: Uses database default (8%)
- When set: Uses custom value

### Impact on Calculations:
The percentage affects:
1. **Loan Principal Calculation**
   ```javascript
   Loan Principal = Base Price ÷ (1 - Bank Commission - Sales Team% - Unexpected%)
   ```

2. **Sales Team Amount**
   ```javascript
   Sales Team Amount = Loan Principal × Sales Team%
   ```

3. **Final Loan Amount**
   ```javascript
   All loan options recalculate with new percentage
   ```

### Calculation Flow:
```
1. User changes percentage (e.g., from 8% to 6%)
   ↓
2. customSalesTeamPct variable updates
   ↓
3. autoRecalculate() is triggered
   ↓
4. All loan options recalculate with new %
   ↓
5. Display updates with new prices
```

## Visual Design

### Color Scheme:
- **Minimal Bar (Collapsed)**: Purple-to-blue gradient (`from-purple-400 to-blue-400`)
- **Minimal Bar (Hover)**: Darker gradient (`from-purple-500 to-blue-500`)
- **Minimal Bar (Expanded)**: Thinner, 50% opacity
- **Panel Background**: Light purple-to-blue gradient (`from-purple-50 to-blue-50`)
- **Border**: Purple (2px) on panel
- **Input**: Purple border with focus ring
- **Labels**: Purple text

### Responsive Design:
- **Minimal Bar**: Full-width, extremely thin (12px height)
- **Collapsed State**: Absolute minimal space usage - just a line
- **Expanded Panel**: Single column, clean layout
- **Animation**: Smooth slide-down transition
- **Bar Changes**: Becomes thinner when panel opens

### User Experience:
- **Ultra-Minimal**: Just a colored bar, no text or icons
- **Hidden by Default**: Panel collapsed to save space
- **One-Click Access**: Click anywhere on bar to expand
- **No Visual Clutter**: Clean interface when not in use
- **Subtle Presence**: Always available but doesn't distract
- **Clear State Change**: Bar thins and fades when panel opens

## Security & Access Control

### Role Check:
```javascript
const isSalesOffice = (currentUser.app_metadata?.role === 'sales_office') ||
                     (currentUser.user_metadata?.role === 'sales_office');

if (isSalesOffice || isAdmin) {
    showSalesOfficeControls();
}
```

### Validation:
- ✅ Minimum: 0%
- ✅ Maximum: 50%
- ✅ Resets invalid values automatically
- ✅ Prevents negative numbers

## Example Scenarios

### Scenario 1: Standard Quote (8%)
```
System: 10 kW
Base Price: 6,500,000 AMD
Sales Team (8%): ~520,000 AMD
Monthly Payment: Higher
```

### Scenario 2: Competitive Quote (6%)
```
System: 10 kW
Base Price: 6,500,000 AMD
Sales Team (6%): ~390,000 AMD
Monthly Payment: Lower ✓
```

### Scenario 3: Promotional Quote (5%)
```
System: 10 kW
Base Price: 6,500,000 AMD
Sales Team (5%): ~325,000 AMD
Monthly Payment: Much Lower ✓✓
```

## Benefits

### For Sales Office Staff:
- ✅ **Flexibility**: Adjust pricing on-the-fly
- ✅ **Transparency**: See exact impact of changes
- ✅ **Speed**: No need to ask admin for custom quotes
- ✅ **Control**: Empower sales team to close deals

### For Customers:
- ✅ **Better Prices**: Potential for lower monthly payments
- ✅ **Competitive**: Can match or beat competitor pricing
- ✅ **Transparent**: Still see breakdown of costs

### For Company:
- ✅ **Sales Enablement**: Faster quote generation
- ✅ **Flexibility**: Respond to market conditions
- ✅ **Tracking**: See which percentages are used
- ✅ **Profitability**: Still maintain 5-8% range

## Toggle Behavior

### Default State:
- **Panel is Collapsed**: Only minimal colored bar visible
- **Ultra-Minimal Footprint**: Just a thin line (12px height)
- **No Text or Icons**: Completely clean interface
- **No Current Value Display**: Nothing shown on bar itself

### Expand/Collapse:
- **Click to Open**: Click anywhere on the colored bar to expand panel
- **Click to Close**: Click bar again or X button to collapse
- **Smooth Animation**: Panel slides down/up with transition
- **Bar Transformation**: Bar becomes thinner (8px) and semi-transparent when open

### Visual State Changes:
- **Collapsed Bar**: 12px height, full opacity, vibrant gradient
- **Expanded Bar**: 8px height, 50% opacity, indicates panel is open
- **Hover Effect**: Darker gradient to indicate clickability
- **No Text Updates**: Bar appearance is the only indicator

## Notes

1. **Minimal Design**: Just a colored bar with no text - ultra-clean
2. **Panel Hidden by Default**: Keeps interface clean when not in use
3. **Default is Still 8%**: Standard quotes use 8% unless explicitly changed
4. **Doesn't Affect Database**: Changes are session-only, don't modify DB
5. **Resets on Page Refresh**: Custom percentage clears on reload
6. **Admin Access**: Admins can also use this feature
7. **Real-Time**: All changes take effect immediately
8. **State Memory**: Panel state (open/closed) doesn't persist on page refresh
9. **Accessibility**: Bar has aria-label for screen readers

## Future Enhancements

Potential future features:
- 📊 **Analytics**: Track which percentages convert best
- 💾 **Saved Presets**: Quick buttons for 6%, 7%, 8%
- 📧 **Quote History**: Save quotes with custom percentages
- 🔔 **Notifications**: Alert when using non-standard rates
- 📈 **Reporting**: Monthly report on percentage usage

---

**Date**: February 2, 2026  
**Status**: ✅ Implemented and Ready  
**File Modified**: `index.html`  
**Roles with Access**: `sales_office`, `admin`  
**Default Value**: 8.0%  
**Range**: 0% - 50%
