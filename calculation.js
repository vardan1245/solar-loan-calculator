// Tiamat Solar CRM - Calculation Logic
// This file contains all the calculation and business logic functions

// Global variables for data storage
let banks = [];
let inverters = [];
let panels = [];
let allLoanOptions = [];
let isDataLoaded = false;
let selectedPanelOption = null;
let selectedPanelInfo = '';
let currentLanguage = 'en';
let currentSortField = 'monthlyPayment';
let currentSortDirection = 'asc';
let isAdminLoggedIn = false;

// Database data storage
let dbInstallationCosts = {};
let dbProfitMargins = {};
let dbSalesCommissions = {};
let dbUnanticipatedExpenses = {};

// Configuration
const CONFIG = {
    ADMIN_PASSWORD: 'Gordzara!12',
    BANK_CONFIGURATIONS: [
        {
            name: 'ArmEconomBank',
            options: [
                { interestRate: 0, commission: 0.21, periods: [36] },
                { interestRate: 0, commission: 0.32, periods: [60] },
                { interestRate: 0, commission: 0.41, periods: [84] },
                { interestRate: 0.03, commission: 0.18, periods: [36] },
                { interestRate: 0.03, commission: 0.27, periods: [60] },
                { interestRate: 0.03, commission: 0.34, periods: [84] },
                { interestRate: 0.05, commission: 0.16, periods: [36] },
                { interestRate: 0.05, commission: 0.23, periods: [60] },
                { interestRate: 0.05, commission: 0.3, periods: [84] },
                { interestRate: 0.09, commission: 0.1, periods: [36] },
                { interestRate: 0.09, commission: 0.15, periods: [60] },
                { interestRate: 0.09, commission: 0.19, periods: [84] },
                { interestRate: 0.12, commission: 0.06, periods: [36] },
                { interestRate: 0.12, commission: 0.09, periods: [60] },
                { interestRate: 0.12, commission: 0.11, periods: [84] },
                { interestRate: 0.15, commission: 0.02, periods: [36] },
                { interestRate: 0.15, commission: 0.03, periods: [60] },
                { interestRate: 0.15, commission: 0.04, periods: [84] }
            ]
        },
        {
            name: 'ACBA Bank',
            options: [
                { interestRate: 0.11, commission: 0.04, periods: [96] }
            ]
        }
    ],
    INVERTERS: [
        { kw: 3, price: 201600 },
        { kw: 3.6, price: 208800 },
        { kw: 5.3, price: 237600 },
        { kw: 6, price: 396000 },
        { kw: 8, price: 417600 },
        { kw: 10, price: 432000 },
        { kw: 12, price: 446400 },
        { kw: 15, price: 460800 },
        { kw: 20, price: 532800 },
        { kw: 25, price: 576000 },
        { kw: 30, price: 936000 },
        { kw: 40, price: 1036800 },
        { kw: 50, price: 1094400 },
        { kw: 60, price: 1180800 },
        { kw: 75, price: 1260000 },
        { kw: 100, price: 1648800 },
        { kw: 110, price: 1728000 }
    ],
    PERCENTAGES: {
        salesTeam: 0.06,
        unexpectedExpenses: 0.02
    }
};

// Language switching functionality
function switchLanguage(language) {
    currentLanguage = language;
    localStorage.setItem('loanCalculatorLanguage', language);
    
    // Update all elements with data-en and data-hy attributes
    document.querySelectorAll('[data-en][data-hy]').forEach(element => {
        if (language === 'en') {
            element.textContent = element.getAttribute('data-en');
        } else {
            element.textContent = element.getAttribute('data-hy');
        }
    });
    
    // Update specific elements that don't use data attributes
    updateLanguageSpecificElements();
}

function updateLanguageSpecificElements() {
    // Update result count display
    if (allLoanOptions.length > 0) {
        updateResultCount(allLoanOptions.length);
    }
    
    // Update selected panel info if exists
    if (selectedPanelInfo) {
        updateSelectedPanelInfo(selectedPanelOption);
    }
}

// Database loading functions
async function fetchSystemCostSettings() {
    try {
        console.log('🔍 fetchSystemCostSettings: Starting to fetch data...');
        
        // Fetch all data in parallel
        const [systemCostResult, invertersResult, panelsResult, banksResult] = await Promise.all([
            fetch('/api/system-cost-settings').then(res => res.json()),
            fetch('/api/inverters').then(res => res.json()),
            fetch('/api/panels').then(res => res.json()),
            fetch('/api/banks').then(res => res.json())
        ]);
        
        console.log('🔍 fetchSystemCostSettings: All API calls completed');
        
        // Process system cost settings
        if (systemCostResult.success && systemCostResult.data) {
            dbInstallationCosts = systemCostResult.data.installationCosts;
            dbProfitMargins = systemCostResult.data.profitMargins;
            dbSalesCommissions = systemCostResult.data.salesCommissions;
            dbUnanticipatedExpenses = systemCostResult.data.unanticipatedExpenses;
            
            console.log('🔍 fetchSystemCostSettings: System cost data processed:', {
                installationCosts: Object.keys(dbInstallationCosts.data || {}).length,
                profitMargins: Object.keys(dbProfitMargins.data || {}).length,
                salesCommissions: Object.keys(dbSalesCommissions.data || {}).length,
                unanticipatedExpenses: Object.keys(dbUnanticipatedExpenses.data || {}).length
            });
        }
        
        // Process inverters
        if (invertersResult.success && invertersResult.data) {
            inverters = invertersResult.data.inverters;
            console.log('🔍 fetchSystemCostSettings: Inverters loaded:', inverters.length);
        }
        
        // Process panels
        if (panelsResult.success && panelsResult.data) {
            panels = panelsResult.data.panels;
            console.log('🔍 fetchSystemCostSettings: Panels loaded:', panels.length);
        }
        
        // Process banks
        if (banksResult.success && banksResult.data) {
            banks = banksResult.data.banks;
            console.log('🔍 fetchSystemCostSettings: Banks loaded:', banks.length);
        }
        
        // Mark data as loaded
        isDataLoaded = true;
        console.log('🔍 fetchSystemCostSettings: All data loaded successfully');
        
        // Initialize UI components
        initializeUIComponents();
        
    } catch (error) {
        console.error('❌ fetchSystemCostSettings: Error loading data:', error);
        isDataLoaded = false;
    }
}

function initializeUIComponents() {
    if (isDataLoaded) {
        // Populate inverter dropdown
        populateInverterDropdown();
        
        // Populate manual inverter options
        refreshManualInverterOptions();
        
        // Initialize manual inverter dropdowns if manual mode is enabled
        const manualToggle = document.getElementById('manualInverterToggle');
        if (manualToggle && manualToggle.checked) {
            populateManualBrands();
            populateManualPowers();
        }
        
        console.log('🔍 initializeUIComponents: UI components initialized');
    }
}

// Core calculation functions
function calculatePanelRequirements() {
    const systemPower = parseFloat(document.getElementById('systemPower').value) || 0;
    
    if (systemPower <= 0) {
        document.getElementById('panelSuggestions').innerHTML = '';
        updateSelectedPanelInfo(null);
        return;
    }
    
    if (!panels || panels.length === 0) {
        console.log('⚠️ calculatePanelRequirements: No panels loaded');
        return;
    }
    
    console.log('🔍 calculatePanelRequirements: Calculating for system power:', systemPower);
    
    // Calculate panel requirements for each panel type
    const panelOptions = [];
    
    panels.forEach(panel => {
        const { wattage, price, price_per_watt } = panel;
        const targetQuantity = Math.round((systemPower * 1000) / wattage);
        
        // Generate quantities around the target (minQuantity - 2 to maxQuantity + 2)
        const minQuantity = Math.max(1, targetQuantity - 2);
        const maxQuantity = targetQuantity + 2;
        
        // Use Set to ensure unique quantities
        const quantities = new Set();
        for (let q = minQuantity; q <= maxQuantity; q++) {
            quantities.add(q);
        }
        
        // Calculate options for each quantity
        quantities.forEach(quantity => {
            const actualPower = (quantity * wattage) / 1000;
            const totalPrice = quantity * price;
            
            // Calculate how close this option is to the target system power
            const powerDifference = Math.abs(actualPower - systemPower);
            const powerAccuracy = Math.max(0, 100 - (powerDifference / systemPower) * 100);
            
            panelOptions.push({
                brand: panel.brand,
                wattage: wattage,
                quantity: quantity,
                actualPower: actualPower,
                totalPrice: totalPrice,
                pricePerWatt: price_per_watt,
                powerAccuracy: powerAccuracy,
                brand_wattage_quantity: `${panel.brand}_${wattage}_${quantity}`
            });
        });
    });
    
    // Sort by power accuracy (closest to target first)
    panelOptions.sort((a, b) => b.powerAccuracy - a.powerAccuracy);
    
    // Remove duplicates based on brand_wattage_quantity
    const seenOptions = new Set();
    const uniquePanelOptions = panelOptions.filter(option => {
        if (seenOptions.has(option.brand_wattage_quantity)) {
            return false;
        }
        seenOptions.add(option.brand_wattage_quantity);
        return true;
    });
    
    // Take the best 9 options
    const bestOptions = uniquePanelOptions.slice(0, 9);
    
    console.log('🔍 calculatePanelRequirements: Panel Type Quantities:', panelOptions.length);
    console.log('🔍 calculatePanelRequirements: Final Panel Options (before slicing):', panelOptions.length);
    console.log('🔍 calculatePanelRequirements: Unique Panel Options (after deduplication):', uniquePanelOptions.length);
    console.log('🔍 calculatePanelRequirements: Best Panel Options (after slicing):', bestOptions.length);
    
    // Pre-calculate price range for labels
    const prices = bestOptions.map(option => option.totalPrice);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const firstMinIndex = bestOptions.findIndex(option => option.totalPrice === minPrice);
    const firstMaxIndex = bestOptions.findIndex(option => option.totalPrice === maxPrice);
    const hasPriceVariation = minPrice !== maxPrice;
    
    console.log('🔍 calculatePanelRequirements: Price Range for Labels:', { minPrice, maxPrice, firstMinIndex, firstMaxIndex, hasPriceVariation });
    console.log('🔍 calculatePanelRequirements: All Panel Option Prices:', prices);
    
    // Display panel suggestions
    const suggestionsContainer = document.getElementById('panelSuggestions');
    suggestionsContainer.innerHTML = '';
    
    bestOptions.forEach((option, index) => {
        const { brand, wattage, quantity, actualPower, totalPrice, powerAccuracy } = option;
        
        // Determine accuracy label
        let accuracyLabel = '';
        let labelClass = '';
        
        if (powerAccuracy >= 95) {
            accuracyLabel = currentLanguage === 'en' ? 'Perfect match' : 'Կատարյալ համապատասխանություն';
            labelClass = 'bg-green-100 text-green-800';
        } else if (powerAccuracy >= 90) {
            accuracyLabel = currentLanguage === 'en' ? 'Very close' : 'Շատ մոտ';
            labelClass = 'bg-blue-100 text-blue-800';
        } else if (powerAccuracy >= 80) {
            accuracyLabel = currentLanguage === 'en' ? 'Close' : 'Մոտ';
            labelClass = 'bg-yellow-100 text-yellow-800';
        } else {
            accuracyLabel = currentLanguage === 'en' ? 'Acceptable' : 'Ընդունելի';
            labelClass = 'bg-gray-100 text-gray-800';
        }
        
        // Determine price label
        let priceLabel = '';
        if (index === firstMinIndex && hasPriceVariation) {
            priceLabel = currentLanguage === 'en' ? 'Lowest price' : 'Ամենացածր գին';
        } else if (index === firstMaxIndex && hasPriceVariation) {
            priceLabel = currentLanguage === 'en' ? 'Highest price' : 'Ամենաբարձր գին';
        }
        
        console.log(`🔍 calculatePanelRequirements: Option ${index} Price Label:`, { index, totalPrice, priceLabel });
        
        // Create price label HTML
        const priceLabelHtml = priceLabel ? 
            `<span class="inline-block px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 ml-2">${priceLabel}</span>` : '';
        
        console.log('🔍 calculatePanelRequirements: Final Label Assignment Summary:', { index, accuracyLabel, priceLabel });
        
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow';
        card.onclick = () => updateSelectedPanelInfo(option);
        
        card.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <span class="font-semibold text-gray-800">${quantity} × ${brand} ${wattage}W = ${actualPower.toFixed(2)} kW</span>
                <span class="text-sm font-medium text-gray-600">${powerAccuracy.toFixed(1)}%</span>
            </div>
            <div class="flex items-center justify-between">
                <span class="inline-block px-2 py-1 text-xs font-medium rounded-full ${labelClass}">${accuracyLabel}</span>
                ${priceLabelHtml}
            </div>
            <div class="mt-2 text-sm text-gray-600">
                <span data-en="Total Price:" data-hy="Ընդհանուր գին:">Total Price:</span> 
                <span class="font-semibold text-green-600">${totalPrice.toLocaleString()} AMD</span>
            </div>
        `;
        
        suggestionsContainer.appendChild(card);
    });
    
    // Auto-select the first (best) option
    if (bestOptions.length > 0) {
        updateSelectedPanelInfo(bestOptions[0]);
    }
    
    console.log('🔍 calculatePanelRequirements: Panel suggestions displayed successfully');
}

// Inverter selection functions
function populateInverterDropdown() {
    if (!inverters || inverters.length === 0) {
        console.log('⚠️ populateInverterDropdown called but inverters not loaded yet');
        return;
    }
    
    const systemPower = parseFloat(document.getElementById('systemPower').value) || 0;
    if (systemPower <= 0) return;
    
    const inverterSelect = document.getElementById('inverterSelect');
    if (!inverterSelect) return;
    
    // Clear existing options
    inverterSelect.innerHTML = '';
    
    // Find suitable inverters (15% rule: inverter power >= system power / 1.15)
    const minPower = systemPower / 1.15;
    const suitableInverters = inverters.filter(inv => inv.kw >= minPower);
    
    if (suitableInverters.length === 0) {
        console.log('⚠️ populateInverterDropdown: No suitable inverters found for system power:', systemPower);
        return;
    }
    
    // Sort by power (smallest first)
    suitableInverters.sort((a, b) => a.kw - b.kw);
    
    // Add options to dropdown
    suitableInverters.forEach(inverter => {
        const option = document.createElement('option');
        option.value = inverter.kw;
        option.textContent = `${inverter.brand} ${inverter.model} ${inverter.kw} kW`;
        inverterSelect.appendChild(option);
    });
    
    // Set default selection to smallest suitable inverter
    inverterSelect.value = suitableInverters[0].kw;
    
    console.log('🔍 populateInverterDropdown: Populated with', suitableInverters.length, 'suitable inverters');
}

function updateInverterAutoSelection(systemPower) {
    const manualToggle = document.getElementById('manualInverterToggle');
    if (manualToggle.checked) {
        console.log('🔍 updateInverterAutoSelection: Manual mode enabled, skipping auto-update');
        return;
    }
    
    console.log('🔍 updateInverterAutoSelection: Updating inverter selection for system power:', systemPower);
    
    if (!inverters || inverters.length === 0) {
        console.log('⚠️ updateInverterAutoSelection: No inverters loaded');
        return;
    }
    
    let bestInverter = null;
    const minPower = systemPower / 1.15;
    
    for (let i = 0; i < inverters.length; i++) {
        if (inverters[i].kw >= minPower) {
            bestInverter = inverters[i];
            break;
        }
    }
    
    if (bestInverter) {
        const inverterSelect = document.getElementById('inverterSelect');
        if (inverterSelect) {
            const targetOption = Array.from(inverterSelect.options).find(option => 
                parseFloat(option.value) === bestInverter.kw
            );
            
            if (targetOption) {
                inverterSelect.value = targetOption.value;
                console.log('🔍 updateInverterAutoSelection: Updated to inverter:', {
                    brand: bestInverter.brand,
                    model: bestInverter.model,
                    kw: bestInverter.kw,
                    power: targetOption.value
                });
            } else {
                console.log('⚠️ updateInverterAutoSelection: Target inverter option not found in dropdown');
            }
        }
    } else {
        console.log('⚠️ updateInverterAutoSelection: No suitable inverter found for system power:', systemPower);
    }
}

// Manual inverter selection functions
function refreshManualInverterOptions() {
    if (!inverters || inverters.length === 0) return;
    
    populateManualBrands();
    populateManualPowers();
}

function populateManualBrands() {
    if (!inverters || inverters.length === 0) return;
    
    const manualBrand = document.getElementById('manualBrand');
    if (!manualBrand) return;
    
    // Get unique brands
    const brands = [...new Set(inverters.map(inv => inv.brand))];
    
    // Clear existing options
    manualBrand.innerHTML = '<option value="">Select Brand</option>';
    
    // Add brand options
    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        manualBrand.appendChild(option);
    });
}

function populateManualPowers() {
    if (!inverters || inverters.length === 0) return;
    
    const manualBrand = document.getElementById('manualBrand').value;
    const manualPower = document.getElementById('manualPower');
    
    if (!manualPower) return;
    
    // Clear existing options
    manualPower.innerHTML = '<option value="">Select Power</option>';
    
    if (!manualBrand) return;
    
    // Get powers for selected brand
    const brandInverters = inverters.filter(inv => inv.brand === manualBrand);
    const powers = [...new Set(brandInverters.map(inv => inv.kw))];
    
    // Add power options
    powers.forEach(power => {
        const option = document.createElement('option');
        option.value = power;
        option.textContent = `${power} kW`;
        manualPower.appendChild(option);
    });
}

// Panel selection functions
function updateManualPanelInfo() {
    const brand = document.getElementById('manualPanelBrand').value;
    const wattage = parseFloat(document.getElementById('manualPanelWattage').value) || 0;
    const quantity = parseInt(document.getElementById('manualPanelQuantity').value) || 0;
    
    if (brand && wattage > 0 && quantity > 0) {
        const actualPower = (quantity * wattage) / 1000;
        document.getElementById('systemPower').value = actualPower.toFixed(2);
        
        // Update inverter auto-selection for the new system power
        updateInverterAutoSelection(actualPower);
        
        console.log('🔍 updateManualPanelInfo: Updated system power to:', actualPower);
    }
}

function updateSelectedPanelInfo(panelOption) {
    if (!panelOption) {
        selectedPanelOption = null;
        selectedPanelInfo = '';
        
        // Remove highlighting from all cards
        const allCards = document.querySelectorAll('#panelSuggestions .bg-white');
        allCards.forEach(card => {
            card.classList.remove('ring-2', 'ring-tiamat-blue', 'bg-blue-50');
            card.classList.add('bg-white');
        });
        return;
    }
    
    // Store the selected panel option globally
    selectedPanelOption = panelOption;
    
    // Update the selectedPanelInfo for display
    const { brand, wattage, quantity, actualPower } = panelOption;
    selectedPanelInfo = currentLanguage === 'en'
        ? `${quantity} × ${brand} ${wattage}W = ${actualPower} kW`
        : `${quantity} × ${brand} ${wattage}Վտ = ${actualPower} կՎտ`;
    
    // Remove highlighting from all cards first
    const allCards = document.querySelectorAll('#panelSuggestions .bg-white, #panelSuggestions .bg-blue-50');
    allCards.forEach(card => {
        card.classList.remove('ring-2', 'ring-tiamat-blue', 'bg-blue-50');
        card.classList.add('bg-white');
    });
    
    // Find and highlight the selected card
    const selectedCard = Array.from(document.querySelectorAll('#panelSuggestions .bg-white')).find(card => {
        const cardText = card.textContent;
        const { brand, wattage, quantity, actualPower } = panelOption;
        const expectedText = `${quantity} × ${brand} ${wattage}W = ${actualPower} kW`;
        return cardText.includes(expectedText);
    });
    
    if (selectedCard) {
        selectedCard.classList.remove('bg-white');
        selectedCard.classList.add('ring-2', 'ring-tiamat-blue', 'bg-blue-50');
    }
    
    // Force recalculation when panel selection changes
    forceRecalculate();
}

// Auto-recalculation functions
function autoRecalculate() {
    // Check if we have all required data
    const systemPower = parseFloat(document.getElementById('systemPower').value) || 0;
    
    if (systemPower > 0 && isDataLoaded) {
        // Check if we have either a selected panel OR manual selections
        const hasPanelSelection = selectedPanelOption || 
            (document.getElementById('manualPanelToggle').checked && 
             document.getElementById('manualPanelBrand').value && 
             document.getElementById('manualPanelWattage').value);
        
        // Check if we have inverter selection (either auto or manual)
        const hasInverterSelection = !document.getElementById('manualInverterToggle').checked || 
            (document.getElementById('manualBrand').value && document.getElementById('manualPower').value);
        
        if (hasPanelSelection && hasInverterSelection) {
            // Small delay to prevent rapid recalculations
            clearTimeout(window.autoRecalculateTimer);
            window.autoRecalculateTimer = setTimeout(() => {
                calculateLoan();
            }, 500); // 500ms delay for better performance
        }
    }
}

function forceRecalculate() {
    // Clear any existing timer
    clearTimeout(window.autoRecalculateTimer);
    
    // Debug logging for inverter selection
    const isManualMode = document.getElementById('manualInverterToggle').checked;
    const manualBrand = document.getElementById('manualBrand').value;
    const manualPower = document.getElementById('manualPower').value;
    
    console.log('🔍 forceRecalculate - Inverter Debug:', {
        isManualMode,
        manualBrand,
        manualPower,
        isDataLoaded,
        timestamp: new Date().toISOString()
    });
    
    // Force immediate recalculation
    if (isDataLoaded) {
        console.log('🔍 forceRecalculate - Calling calculateLoan()');
        calculateLoan();
    } else {
        console.log('🔍 forceRecalculate - Data not loaded yet, skipping calculation');
    }
}

// Main loan calculation function
function calculateLoan() {
    // Validate panel selection
    if (!selectedPanelOption) {
        const message = currentLanguage === 'en' 
            ? 'Please select a panel option first.'
            : 'Խնդրում ենք նախ ընտրել պանելի տարբերակը:';
        
        document.getElementById('results').innerHTML = `
            <div class="space-y-3">
                <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div class="flex items-center">
                        <span class="w-5 h-5 text-red-400 mr-2 text-xl font-bold">✕</span>
                        <span class="text-red-800 font-medium">${message}</span>
                    </div>
                </div>
            </div>
        `;
        return;
    }
    
    // Initialize selectedPanelInfo
    let selectedPanelInfo = selectedPanelOption ? 
        `${selectedPanelOption.quantity} × ${selectedPanelOption.brand} ${selectedPanelOption.wattage}W = ${selectedPanelOption.actualPower} kW` : 
        'Auto-selected';
    
    // Get input values
    const systemPower = parseFloat(document.getElementById('systemPower').value) || 0;
    const warrantyYears = parseInt(document.getElementById('warrantyYears').value) || 12;
    const installationType = document.getElementById('installationType').value || 'onRoof';
    
    if (systemPower <= 0) {
        const message = currentLanguage === 'en' 
            ? 'Please enter a valid system power.'
            : 'Խնդրում ենք մուտքագրել վավեր համակարգի հզորություն:';
        
        document.getElementById('results').innerHTML = `
            <div class="space-y-3">
                <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div class="flex items-center">
                        <span class="w-5 h-5 text-red-400 mr-2 text-xl font-bold">✕</span>
                        <span class="text-red-800 font-medium">${message}</span>
                    </div>
                </div>
            </div>
        `;
        return;
    }
    
    // Check if manual inverter mode is enabled
    const isManualInverterMode = document.getElementById('manualInverterToggle').checked;
    
    let selectedInverter = null;
    
    if (isManualInverterMode) {
        // Manual inverter selection
        const selectedBrand = document.getElementById('manualBrand').value;
        const selectedPower = parseFloat(document.getElementById('manualPower').value) || 0;
        
        if (!selectedBrand || !selectedPower) {
            const message = currentLanguage === 'en' 
                ? 'Please select both brand and power in manual mode.'
                : 'Խնդրում ենք ընտրել և՛ բրենդը, և՛ հզորությունը ձեռքով ռեժիմում:';
            
            document.getElementById('results').innerHTML = `
                <div class="space-y-3">
                    <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div class="flex items-center">
                            <span class="w-5 h-5 text-red-400 mr-2 text-xl font-bold">✕</span>
                            <span class="text-red-800 font-medium">${message}</span>
                        </div>
                    </div>
                </div>
            `;
            return;
        }
        
        // Find the selected inverter from the database
        selectedInverter = inverters.find(inv => inv.brand === selectedBrand && inv.kw === selectedPower);
        
        if (!selectedInverter) {
            const message = currentLanguage === 'en' 
                ? 'No inverter found with selected brand and power!'
                : 'Ընտրված բրենդով և հզորությամբ փոխակերպիչ չի գտնվել:';
            
            document.getElementById('results').innerHTML = `
                <div class="space-y-3">
                    <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div class="flex items-center">
                            <span class="w-5 h-5 text-red-400 mr-2 text-xl font-bold">✕</span>
                            <span class="text-red-800 font-medium">${message}</span>
                        </div>
                    </div>
                </div>
            `;
            return;
        }
    } else {
        // Auto inverter selection
        const selectedInverterKw = parseFloat(document.getElementById('inverterSelect').value) || 0;
        
        if (selectedInverterKw <= 0) {
            const message = currentLanguage === 'en' 
                ? 'Please select an inverter.'
                : 'Խնդրում ենք ընտրել փոխակերպիչ:';
            
            document.getElementById('results').innerHTML = `
                <div class="space-y-3">
                    <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div class="flex items-center">
                            <span class="w-5 h-5 text-red-400 mr-2 text-xl font-bold">✕</span>
                            <span class="text-red-800 font-medium">${message}</span>
                        </div>
                    </div>
                </div>
            `;
            return;
        }
        
        // Find the selected inverter from the dropdown (no more auto option)
        selectedInverter = inverters.find(inv => inv.kw == selectedInverterKw);
        
        if (!selectedInverter) {
            const message = currentLanguage === 'en' 
                ? 'Selected inverter not found!'
                : 'Ընտրված փոխակերպիչը չի գտնվել:';
            
            document.getElementById('results').innerHTML = `
                <div class="space-y-3">
                    <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div class="flex items-center">
                            <span class="w-5 h-5 text-red-400 mr-2 text-xl font-bold">✕</span>
                            <span class="text-red-800 font-medium">${message}</span>
                        </div>
                    </div>
                </div>
            `;
            return;
        }
    }
    
    // Get database values
    const installationCostPerKw = dbInstallationCosts.data?.[`${installationType}_cost_per_kw`]?.value || 0;
    const profitPerKw = dbProfitMargins.data?.[`profit_per_kw_${warrantyYears}Y`]?.value || 0;
    const salesTeamPct = dbSalesCommissions.data?.sales_team_pct?.value || 6;
    const unanticipatedExpensesPct = dbUnanticipatedExpenses.data?.unanticipated_expenses_pct?.value || 2;
    
    // Convert percentages to decimals
    const salesTeamPctDecimal = salesTeamPct / 100;
    const unanticipatedExpensesPctDecimal = unanticipatedExpensesPct / 100;
    
    // Calculate costs
    const baseInstallationCost = systemPower * installationCostPerKw;
    const profitAmount = systemPower * profitPerKw;
    const inverterCost = selectedInverter.price;
    const panelCost = selectedPanelOption.totalPrice;
    
    // Calculate total system price
    const totalSystemPrice = baseInstallationCost + profitAmount + inverterCost + panelCost;
    
    // Calculate sales team and unanticipated expenses
    const salesTeamAmount = totalSystemPrice * salesTeamPctDecimal;
    const unexpectedExpensesAmount = totalSystemPrice * unanticipatedExpensesPctDecimal;
    
    // Calculate final total
    const finalTotal = totalSystemPrice + salesTeamAmount + unexpectedExpensesAmount;
    
    // Generate loan options
    generateLoanOptions(finalTotal);
    
    // Display results
    displayResults({
        systemPower,
        selectedPanelInfo,
        selectedInverter,
        baseInstallationCost,
        profitAmount,
        inverterCost,
        panelCost,
        totalSystemPrice,
        salesTeamAmount,
        unexpectedExpensesAmount,
        finalTotal,
        installationCostPerKw,
        profitPerKw,
        salesTeamPct,
        unanticipatedExpensesPct
    });
}

// Loan options generation
function generateLoanOptions(loanAmount) {
    allLoanOptions = [];
    
    banks.forEach(bank => {
        bank.options.forEach(option => {
            option.periods.forEach(period => {
                const monthlyRate = option.interestRate / 12;
                const totalPayments = period;
                
                let monthlyPayment, totalInterest, totalAmount;
                
                if (option.interestRate === 0) {
                    // 0% interest loan
                    monthlyPayment = loanAmount / period;
                    totalInterest = 0;
                    totalAmount = loanAmount;
                } else {
                    // Interest-bearing loan
                    if (monthlyRate === 0) {
                        monthlyPayment = loanAmount / period;
                        totalInterest = 0;
                        totalAmount = loanAmount;
                    } else {
                        monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, period)) / 
                                       (Math.pow(1 + monthlyRate, period) - 1);
                        totalAmount = monthlyPayment * period;
                        totalInterest = totalAmount - loanAmount;
                    }
                }
                
                allLoanOptions.push({
                    bankName: bank.name,
                    interestRate: option.interestRate,
                    commission: option.commission,
                    loanPeriod: period,
                    loanAmount: loanAmount,
                    monthlyPayment: monthlyPayment,
                    totalInterest: totalInterest,
                    totalAmount: totalAmount
                });
            });
        });
    });
    
    // Sort by monthly payment (lowest first)
    allLoanOptions.sort((a, b) => a.monthlyPayment - b.monthlyPayment);
    
    // Display loan options
    displayLoanOptions(allLoanOptions);
    updateResultCount(allLoanOptions.length);
}

// Display functions
function displayResults(data) {
    const resultsContainer = document.getElementById('results');
    
    const adminBreakdown = isAdminLoggedIn ? `
        <div class="bg-gray-50 p-4 rounded-md space-y-3 text-sm">
            <h4 class="font-semibold text-gray-800" data-en="Admin: Detailed Breakdown" data-hy="Ադմին: Մանրամասն բաժանում">Admin: Detailed Breakdown</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                    <div class="flex justify-between">
                        <span data-en="Step 1: Base Installation" data-hy="Քայլ 1: Բազային տեղադրում">Step 1: Base Installation</span>
                        <span class="font-mono">${data.baseInstallationCost.toLocaleString()} AMD</span>
                    </div>
                    <div class="flex justify-between text-xs text-gray-600">
                        <span>(${data.installationCostPerKw.toLocaleString()} AMD/kW × ${data.systemPower} kW)</span>
                    </div>
                    
                    <div class="flex justify-between">
                        <span data-en="Step 2: Profit Margin" data-hy="Քայլ 2: Շահույթի մարժա">Step 2: Profit Margin</span>
                        <span class="font-mono">${data.profitAmount.toLocaleString()} AMD</span>
                    </div>
                    <div class="flex justify-between text-xs text-gray-600">
                        <span>(${data.profitPerKw.toLocaleString()} AMD/kW × ${data.systemPower} kW)</span>
                    </div>
                    
                    <div class="flex justify-between">
                        <span data-en="Step 3: Inverter Selection" data-hy="Քայլ 3: Փոխակերպիչի ընտրություն">Step 3: Inverter Selection</span>
                        <span class="font-mono spoiler" onclick="toggleSpoiler(this)" data-value="${data.inverterCost.toLocaleString()} AMD">████████████</span>
                    </div>
                    <div class="flex justify-between text-xs text-gray-600">
                        <span>${data.selectedInverter.brand} ${data.selectedInverter.model} ${data.selectedInverter.kw} kW</span>
                    </div>
                    
                    <div class="flex justify-between">
                        <span data-en="Step 4: Panel Selection" data-hy="Քայլ 4: Պանելի ընտրություն">Step 4: Panel Selection</span>
                        <span class="font-mono">${data.panelCost.toLocaleString()} AMD</span>
                    </div>
                    <div class="flex justify-between text-xs text-gray-600">
                        <span>${data.selectedPanelInfo}</span>
                    </div>
                </div>
                
                <div class="space-y-2">
                    <div class="flex justify-between">
                        <span data-en="Subtotal (Base + Profit + Inverter + Panels)" data-hy="Ենթագումար (Բազա + Շահույթ + Փոխակերպիչ + Պանելներ)">Subtotal (Base + Profit + Inverter + Panels):</span>
                        <span class="font-semibold">${data.totalSystemPrice.toLocaleString()} AMD</span>
                    </div>
                    
                    <div class="flex justify-between">
                        <span data-en="+ Sales Team Commission" data-hy="+ Վաճառքի թիմի կոմիսիա">+ Sales Team Commission:</span>
                        <span class="font-mono">${data.salesTeamAmount.toLocaleString()} AMD</span>
                    </div>
                    <div class="flex justify-between text-xs text-gray-600">
                        <span>(${data.salesTeamPct}% of total system price)</span>
                    </div>
                    
                    <div class="flex justify-between">
                        <span data-en="+ Unanticipated Expenses" data-hy="+ Անսպասելի ծախսեր">+ Unanticipated Expenses:</span>
                        <span class="font-mono">${data.unexpectedExpensesAmount.toLocaleString()} AMD</span>
                    </div>
                    <div class="flex justify-between text-xs text-gray-600">
                        <span>(${data.unanticipatedExpensesPct}% of total system price)</span>
                    </div>
                    
                    <div class="border-t pt-2">
                        <div class="flex justify-between font-semibold text-lg">
                            <span data-en="Final Total" data-hy="Վերջնական ընդհանուր">Final Total:</span>
                            <span class="text-tiamat-blue">${data.finalTotal.toLocaleString()} AMD</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ` : '';
    
    resultsContainer.innerHTML = `
        <div class="space-y-4">
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-lg font-semibold mb-4 text-tiamat-blue" data-en="Calculation Results" data-hy="Հաշվարկի արդյունքները">Calculation Results</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-3">
                        <div class="flex justify-between">
                            <span data-en="System Power:" data-hy="Համակարգի հզորությունը:">System Power:</span>
                            <span class="font-semibold">${data.systemPower} kW</span>
                        </div>
                        
                        <div class="flex justify-between">
                            <span data-en="Selected Panels:" data-hy="Ընտրված պանելները:">Selected Panels:</span>
                            <span class="font-semibold">${data.selectedPanelInfo}</span>
                        </div>
                        
                        <div class="flex justify-between">
                            <span data-en="Selected Inverter:" data-hy="Ընտրված փոխակերպիչը:">Selected Inverter:</span>
                            <span class="font-semibold">${data.selectedInverter.brand} ${data.selectedInverter.model} ${data.selectedInverter.kw} kW</span>
                        </div>
                        
                        <div class="border-t pt-3">
                            <div class="flex justify-between font-semibold text-lg">
                                <span data-en="System Value for Cash:" data-hy="Համակարգի արժեքը կանխիկի համար:">System Value for Cash:</span>
                                <span class="text-tiamat-blue">${data.finalTotal.toLocaleString()} AMD</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="space-y-3">
                        <div class="bg-blue-50 p-3 rounded-md">
                            <h4 class="font-medium text-blue-800 mb-2" data-en="Loan Options Available" data-hy="Հասանելի վարկային տարբերակները">Loan Options Available</h4>
                            <p class="text-sm text-blue-700" data-en="Scroll down to see all loan options with different banks, interest rates, and payment periods." data-hy="Ոլորեք ներքև՝ բոլոր վարկային տարբերակները տարբեր բանկերով, տոկոսադրույքներով և վճարման ժամկետներով:">Scroll down to see all loan options with different banks, interest rates, and payment periods.</p>
                        </div>
                    </div>
                </div>
                
                ${adminBreakdown}
            </div>
        </div>
    `;
}

// Loan options display functions
function displayLoanOptions(loanOptions) {
    const container = document.getElementById('loanOptionsResults');
    if (!container) return;
    
    if (loanOptions.length === 0) {
        container.innerHTML = '<div class="text-center text-gray-500 py-8">No loan options available</div>';
        return;
    }
    
    container.innerHTML = `
        <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold mb-4 text-tiamat-blue" data-en="Loan Options" data-hy="Վարկային տարբերակները">Loan Options</h3>
            
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onclick="sortResults('bankName')" data-en="Bank" data-hy="Բանկ">Bank</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onclick="sortResults('interestRate')" data-en="Interest Rate" data-hy="Տոկոսադրույք">Interest Rate</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onclick="sortResults('loanPeriod')" data-en="Period" data-hy="Ժամկետ">Period</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onclick="sortResults('monthlyPayment')" data-en="Monthly Payment" data-hy="Ամսական վճար">Monthly Payment</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onclick="sortResults('totalAmount')" data-en="Total Amount" data-hy="Ընդհանուր գումար">Total Amount</th>
                            ${isAdminLoggedIn ? '<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-en="Commission" data-hy="Կոմիսիա">Commission</th>' : ''}
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${loanOptions.map(option => `
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${option.bankName}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(option.interestRate * 100).toFixed(1)}%</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${option.loanPeriod} ${currentLanguage === 'en' ? 'months' : 'ամիս'}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">${option.monthlyPayment.toLocaleString()} AMD</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${option.totalAmount.toLocaleString()} AMD</td>
                                ${isAdminLoggedIn ? `<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(option.commission * 100).toFixed(1)}%</td>` : ''}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="mt-4 text-sm text-gray-600">
                <span id="resultCount" data-en="Showing all results" data-hy="Ցուցադրվում են բոլոր արդյունքները">Showing all results</span>
            </div>
        </div>
    `;
}

function updateResultCount(count) {
    const resultCount = document.getElementById('resultCount');
    if (resultCount) {
        if (currentLanguage === 'en') {
            resultCount.textContent = `Showing ${count} loan options`;
        } else {
            resultCount.textContent = `Ցուցադրվում են ${count} վարկային տարբերակները`;
        }
    }
}

// Sorting functions
function sortResults(field) {
    if (currentSortField === field) {
        currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortField = field;
        currentSortDirection = 'asc';
    }
    
    allLoanOptions.sort((a, b) => {
        let aVal = a[field];
        let bVal = b[field];
        
        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }
        
        if (currentSortDirection === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });
    
    displayLoanOptions(allLoanOptions);
}

// Admin panel functions
function showAdminPanel() {
    // This function can be expanded to show additional admin features
    console.log('🔍 Admin panel shown');
}

function showAdminDetails() {
    // This function can be expanded to show additional admin details
    console.log('🔍 Admin details shown');
}

function updateAdminButton() {
    const adminButton = document.getElementById('adminButton');
    const adminButtonContainer = document.getElementById('adminButtonContainer');
    
    if (adminButton && adminButtonContainer) {
        // Show the admin button container
        adminButtonContainer.classList.remove('hidden');
        
        if (isAdminLoggedIn) {
            adminButton.textContent = currentLanguage === 'en' ? 'Logout Admin' : 'Դուրս գալ ադմինից';
            adminButton.onclick = logoutAdmin;
            adminButton.className = 'px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors';
        } else {
            adminButton.textContent = currentLanguage === 'en' ? 'Admin Login' : 'Ադմին մուտք';
            adminButton.onclick = showAdminLogin;
            adminButton.className = 'px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors';
        }
    }
}

function showCommissionColumn() {
    // This function can be expanded to show commission column in loan options
    console.log('🔍 Commission column shown');
}

function hideCommissionColumn() {
    // This function can be expanded to hide commission column in loan options
    console.log('🔍 Commission column hidden');
}

function showProfitPerKwDisplay() {
    // This function can be expanded to show profit per kW display
    console.log('🔍 Profit per kW display shown');
}

function hideProfitPerKwDisplay() {
    // This function can be expanded to hide profit per kW display
    console.log('🔍 Profit per kW display hidden');
}

// Panel dropdown population functions
function populatePanelDropdown() {
    if (!panels || panels.length === 0) {
        console.log('⚠️ populatePanelDropdown: No panels available');
        return;
    }
    
    if (!isDataLoaded) {
        console.log('⚠️ populatePanelDropdown: Waiting for all data to load...');
        return;
    }
    
    console.log('✅ populatePanelDropdown: All data loaded, proceeding with panel suggestions');
    calculatePanelRequirements();
}

// Manual panel dropdown population
function populateManualPanelBrands() {
    if (!panels || panels.length === 0) return;
    
    const manualPanelBrand = document.getElementById('manualPanelBrand');
    if (!manualPanelBrand) return;
    
    // Get unique brands
    const brands = [...new Set(panels.map(panel => panel.brand))];
    
    // Clear existing options
    manualPanelBrand.innerHTML = '<option value="">Select Brand</option>';
    
    // Add brand options
    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        manualPanelBrand.appendChild(option);
    });
}

function populateManualPanelWattages() {
    if (!panels || panels.length === 0) return;
    
    const manualPanelBrand = document.getElementById('manualPanelBrand').value;
    const manualPanelWattage = document.getElementById('manualPanelWattage');
    
    if (!manualPanelWattage) return;
    
    // Clear existing options
    manualPanelWattage.innerHTML = '<option value="">Select Wattage</option>';
    
    if (!manualPanelBrand) return;
    
    // Get wattages for selected brand
    const brandPanels = panels.filter(panel => panel.brand === manualPanelBrand);
    const wattages = [...new Set(brandPanels.map(panel => panel.wattage))];
    
    // Add wattage options
    wattages.forEach(wattage => {
        const option = document.createElement('option');
        option.value = wattage;
        option.textContent = `${wattage}W`;
        manualPanelWattage.appendChild(option);
    });
}

// Admin functionality
function showAdminLogin() {
    document.getElementById('adminModal').classList.remove('hidden');
    document.getElementById('adminPassword').focus();
}

function hideAdminLogin() {
    document.getElementById('adminModal').classList.add('hidden');
    document.getElementById('adminPassword').value = '';
}

function loginAdmin() {
    const password = document.getElementById('adminPassword').value;
    if (password === CONFIG.ADMIN_PASSWORD) {
        isAdminLoggedIn = true;
        hideAdminLogin();
        showAdminPanel();
        showAdminDetails();
        updateAdminButton();
        showCommissionColumn();
        showProfitPerKwDisplay();
        
        // Recalculate to show detailed breakdown
        if (allLoanOptions.length > 0) {
            calculateLoan();
        }
    } else {
        alert('Incorrect password');
    }
}

function logoutAdmin() {
    isAdminLoggedIn = false;
    hideAdminDetails();
    updateAdminButton();
    hideCommissionColumn();
    hideProfitPerKwDisplay();
    
    // Recalculate to hide detailed breakdown
    if (allLoanOptions.length > 0) {
        calculateLoan();
    }
}

// Utility functions
function toggleInverterSelection() {
    const manualToggle = document.getElementById('manualInverterToggle');
    const autoSection = document.getElementById('autoInverterSection');
    const manualSection = document.getElementById('manualInverterSection');
    
    if (manualToggle.checked) {
        autoSection.classList.add('hidden');
        manualSection.classList.remove('hidden');
        refreshManualInverterOptions();
    } else {
        autoSection.classList.remove('hidden');
        manualSection.classList.add('hidden');
        populateInverterDropdown();
    }
    
    // Clear calculation results when switching modes
    clearCalculationResults();
}

function togglePanelSelection() {
    const manualToggle = document.getElementById('manualPanelToggle');
    const autoSection = document.getElementById('autoPanelSection');
    const manualSection = document.getElementById('manualPanelSection');
    
    if (manualToggle.checked) {
        autoSection.classList.add('hidden');
        manualSection.classList.remove('hidden');
    } else {
        autoSection.classList.remove('hidden');
        manualSection.classList.add('hidden');
        calculatePanelRequirements();
    }
    
    // Clear calculation results when switching modes
    clearCalculationResults();
}

function clearCalculationResults() {
    document.getElementById('results').innerHTML = '';
    allLoanOptions = [];
    selectedPanelOption = null;
    selectedPanelInfo = '';
}

// Export functions for use in HTML
window.calculateLoan = calculateLoan;
window.calculatePanelRequirements = calculatePanelRequirements;
window.switchLanguage = switchLanguage;
window.toggleInverterSelection = toggleInverterSelection;
window.togglePanelSelection = togglePanelSelection;
window.updateManualPanelInfo = updateManualPanelInfo;
window.showAdminLogin = showAdminLogin;
window.hideAdminLogin = hideAdminLogin;
window.loginAdmin = loginAdmin;
window.logoutAdmin = logoutAdmin;

// Export additional functions for use in HTML
window.displayLoanOptions = displayLoanOptions;
window.updateResultCount = updateResultCount;
window.sortResults = sortResults;
window.showAdminPanel = showAdminPanel;
window.showAdminDetails = showAdminDetails;
window.updateAdminButton = updateAdminButton;
window.showCommissionColumn = showCommissionColumn;
window.hideCommissionColumn = hideCommissionColumn;
window.showProfitPerKwDisplay = showProfitPerKwDisplay;
window.hideProfitPerKwDisplay = hideProfitPerKwDisplay;
window.populatePanelDropdown = populatePanelDropdown;
window.populateManualPanelBrands = populateManualPanelBrands;
window.populateManualPanelWattages = populateManualPanelWattages;
