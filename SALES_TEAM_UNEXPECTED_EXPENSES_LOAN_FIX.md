# Sales Team & Unexpected Expenses Loan Calculation Fix - CORRECT VERSION

## Problem
Sales Team (8%) and Unexpected Expenses (2%) were being calculated from the base system price, and then ADDED to the base price. This meant that after all deductions (bank commission, sales team, unexpected), the company was receiving LESS than the intended base system price.

**The requirement:** The company needs to receive the FULL base system price after ALL deductions (bank commission, sales team %, unexpected %).

## Solution - Working BACKWARDS from Target Amount
The calculation now works BACKWARDS from the base system price (what the company wants to keep) to determine the loan principal.

### Formula:
```
Loan Principal = Base System Price ÷ (1 - Bank Commission% - Sales Team% - Unexpected%)
```

Then from this loan principal:
- Bank takes their commission %
- Sales Team takes their %  
- Unexpected expenses take their %
- What remains = Base System Price (exactly what company needs) ✓

## Example Calculation

### Old Method (Incorrect)
```
Base System Price: 1,000,000 AMD
Sales Team (8%): 1,000,000 × 8% = 80,000 AMD
Unexpected (2%): 1,000,000 × 2% = 20,000 AMD
Before Bank Commission: 1,080,000 AMD
Bank Commission (21%): 1,080,000 ÷ (1-0.21) = 1,367,089 AMD

From 1,367,089 AMD:
- Bank takes: 287,089 AMD
- Company gets: 1,080,000 AMD
- Then pay sales team & unexpected from this
- Company ends up with LESS than 1,000,000 AMD ✗
```

### New Method (CORRECT - Working Backwards)
```
Base System Price (target): 1,000,000 AMD

Total deductions:
- Bank Commission: 25.2% (21% × 1.2 with tax)
- Sales Team: 8%
- Unexpected: 2%
- TOTAL: 35.2%

Loan Principal = 1,000,000 ÷ (1 - 0.352)
Loan Principal = 1,000,000 ÷ 0.648
Loan Principal = 1,543,210 AMD

From 1,543,210 AMD loan principal:
- Bank Commission (25.2%): 388,889 AMD
- Sales Team (8%): 123,457 AMD
- Unexpected (2%): 30,864 AMD
- Company receives: 1,000,000 AMD ✓ (EXACTLY the target!)

Customer pays interest on 1,543,210 AMD (but that doesn't affect company calculations)
```

## Files Modified

### 1. `index.html`
**Lines 1527-1574** - Updated loan options generation logic:
- Changed from forward calculation to **backward calculation**
- Formula: `Loan Principal = Base System Price ÷ (1 - Total Deductions%)`
- Total Deductions = Bank Commission + Sales Team % + Unexpected %
- From loan principal, calculate each deduction amount
- Verify that remaining amount equals target base system price

**Lines 3783-3868** - Updated English breakdown display:
- **Step 1**: Calculate Base System Price (What Company Keeps)
  - Shows all components: installation, profit, inverter, panels, battery
  - Shows sales discount if applicable
  - Final target amount company must receive
  
- **Step 2**: Calculate Loan Principal (Working Backwards)
  - Shows all deduction percentages
  - Shows formula: Loan Principal = Base ÷ (1 - Total Deductions)
  - Shows calculated loan principal
  
- **Step 3**: Breakdown of Deductions from Loan Principal
  - Bank Commission amount
  - Sales Team amount (8%)
  - Unexpected Expenses amount (2%)
  - **Verification**: Shows that company receives exact target amount ✓

**Lines 3894-3956** - Updated Armenian breakdown display:
- Քայլ 1: Բազային համակարգի գին (ինչ կպահի ընկերությունը)
- Քայլ 2: Վարկի գլխագումարի հաշվարկ (հակադարձ հաշվարկ)
- Քայլ 3: Նվազեցումների բաշխում վարկի գլխագումարից
- Removed old redundant Step 4

## Impact
- **Correct pricing** that ensures company receives the full base system price after ALL deductions
- **Working backwards** from target amount guarantees accurate cost recovery
- **No dependency on interest rate** - the customer's interest doesn't affect company calculations
- **Transparent breakdown** showing customers exactly how the loan principal is calculated
- **Verification included** - breakdown shows that company receives exactly the target amount

## Key Benefits
1. **Guaranteed Recovery**: Company always receives exactly the base system price
2. **Simple Logic**: One formula works for all scenarios
3. **Bank Commission Included**: All deductions (bank, sales, unexpected) are in the same calculation
4. **Interest Independent**: Customer's interest payments don't affect the company's revenue

## Testing
To test the changes:

1. **Refresh your browser** (Ctrl+Shift+R or Cmd+Shift+R)
2. Enter a system power (e.g., 10 kW)
3. Select a panel option
4. Click "Calculate Loan"
5. Click the "+" icon next to any loan option to expand the breakdown
6. **Verify** in the breakdown:
   - Step 1: Shows target base system price (what company wants to keep)
   - Step 2: Shows backward calculation with formula
   - Step 3: Shows deductions from loan principal
   - **Verification line**: "Company Receives = [calculated amount] ✓" matches target
   
## Example Verification
If base system price is 1,000,000 AMD:
- The breakdown should show loan principal (e.g., 1,543,210 AMD)
- Bank commission, sales team, and unexpected deductions are shown
- **Final line**: "Company Receives = 1,000,000 AMD ✓"
- This verification proves the calculation is correct!

## Notes
- Works the same for ALL bank options and interest rates
- Customer's interest rate only affects what THEY pay back
- Company calculations are independent of customer's interest
- The loan principal includes ALL deductions in one backward calculation

---

**Date**: February 2, 2026  
**Status**: ✅ Implemented and tested (CORRECT VERSION)
**Files Changed**: 1 file (index.html)  
**Key Formula**: `Loan Principal = Base System Price ÷ (1 - Bank Commission% - Sales Team% - Unexpected%)`
