// App principale
const navigationService = new NavigationService(SHOPS_DATA);

// Elementi DOM
const searchSection = document.getElementById('searchSection');
const loadingSection = document.getElementById('loadingSection');
const routeSection = document.getElementById('routeSection');

const startShopInput = document.getElementById('startShop');
const endShopInput = document.getElementById('endShop');
const startSuggestions = document.getElementById('startSuggestions');
const endSuggestions = document.getElementById('endSuggestions');
const calculateBtn = document.getElementById('calculateBtn');
const errorMessage = document.getElementById('errorMessage');
const backBtn = document.getElementById('backBtn');

const routeStartShop = document.getElementById('routeStartShop');
const routeEndShop = document.getElementById('routeEndShop');
const routeStartFloor = document.getElementById('routeStartFloor');
const routeEndFloor = document.getElementById('routeEndFloor');
const routeSteps = document.getElementById('routeSteps');
const stepsContainer = document.getElementById('stepsContainer');

let selectedStartShop = null;
let selectedEndShop = null;

// Gestione autocomplete
function setupAutocomplete(input, suggestionsDiv, onSelect) {
    input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        
        if (query.length < 2) {
            suggestionsDiv.classList.remove('show');
            return;
        }

        const matches = SHOPS_DATA.filter(shop => 
            shop.name.toLowerCase().includes(query)
        ).slice(0, 10);

        if (matches.length === 0) {
            suggestionsDiv.classList.remove('show');
            return;
        }

        suggestionsDiv.innerHTML = matches.map(shop => `
            <div class="suggestion-item" data-shop-id="${shop.id}">
                <div class="suggestion-name">${shop.name}</div>
                <div class="suggestion-details">
                    Piano ${shop.floor} • ${getZoneLabel(shop.zone)} • Pos. ${shop.position}
                </div>
            </div>
        `).join('');

        suggestionsDiv.classList.add('show');

        // Gestione click sui suggerimenti
        suggestionsDiv.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const shopId = item.dataset.shopId;
                const shop = SHOPS_DATA.find(s => s.id === shopId);
                if (shop) {
                    input.value = shop.name;
                    onSelect(shop);
                    suggestionsDiv.classList.remove('show');
                }
            });
        });
    });

    // Chiudi suggerimenti quando si clicca fuori
    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !suggestionsDiv.contains(e.target)) {
            suggestionsDiv.classList.remove('show');
        }
    });
}

function getZoneLabel(zone) {
    const labels = {
        'OUTER': 'Anello Esterno',
        'ISLAND_SX': 'Isola Sinistra',
        'ISLAND_DX': 'Isola Destra',
        'ISLAND_CENTER': 'Isola Centrale'
    };
    return labels[zone] || zone;
}

// Setup autocomplete per entrambi i campi
setupAutocomplete(startShopInput, startSuggestions, (shop) => {
    selectedStartShop = shop;
    checkCanCalculate();
});

setupAutocomplete(endShopInput, endSuggestions, (shop) => {
    selectedEndShop = shop;
    checkCanCalculate();
});

function checkCanCalculate() {
    calculateBtn.disabled = !selectedStartShop || !selectedEndShop;
}

// Calcola percorso
calculateBtn.addEventListener('click', () => {
    if (!selectedStartShop || !selectedEndShop) return;

    // Mostra loading
    searchSection.style.display = 'none';
    loadingSection.style.display = 'block';
    errorMessage.classList.remove('show');

    // Simula un piccolo delay per UX
    setTimeout(() => {
        const result = navigationService.findShortestPath(
            selectedStartShop.name,
            selectedEndShop.name
        );

        if (result.error) {
            showError(result.error);
            loadingSection.style.display = 'none';
            searchSection.style.display = 'block';
            return;
        }

        showRoute(result);
        loadingSection.style.display = 'none';
        routeSection.style.display = 'block';
    }, 500);
});

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}

function showRoute(result) {
    // Header info
    routeStartShop.textContent = result.startShop.name;
    routeEndShop.textContent = result.endShop.name;
    routeStartFloor.textContent = `Piano ${result.startShop.floor}`;
    routeEndFloor.textContent = `Piano ${result.endShop.floor}`;
    routeSteps.textContent = `${result.stepsCount} passaggi`;

    // Steps
    stepsContainer.innerHTML = '';
    result.steps.forEach((step, index) => {
        if (step.type === 'shop') {
            const isStart = index === 0;
            const isEnd = index === result.steps.length - 1;
            stepsContainer.appendChild(createShopStepCard(step.shop, index + 1, isStart, isEnd));
        } else if (step.type === 'stair') {
            stepsContainer.appendChild(createStairCard(step.instruction, step.isGoingUp));
        }
    });
}

function createShopStepCard(shop, stepNumber, isStart, isEnd) {
    const card = document.createElement('div');
    card.className = 'step-card';
    if (isStart) card.classList.add('start');
    if (isEnd) card.classList.add('end');

    let badge = '';
    if (isStart) {
        badge = '<span class="step-badge badge-start">PARTENZA</span>';
    } else if (isEnd) {
        badge = '<span class="step-badge badge-end">ARRIVO</span>';
    }

    card.innerHTML = `
        <div class="step-number">${isStart ? '🏁' : isEnd ? '🎯' : stepNumber}</div>
        <div class="step-content">
            <div class="step-name">${shop.name}</div>
            <div class="step-details">
                <span>Piano ${shop.floor}</span>
                <span>•</span>
                <span>${getZoneLabel(shop.zone)}</span>
                ${badge}
            </div>
        </div>
    `;

    return card;
}

function createStairCard(instruction, isGoingUp) {
    const card = document.createElement('div');
    card.className = `stair-card ${isGoingUp ? 'up' : 'down'}`;

    card.innerHTML = `
        <div class="stair-icon">${isGoingUp ? '🔼' : '🔽'}</div>
        <div class="stair-instruction">${instruction}</div>
    `;

    return card;
}

// Torna indietro
backBtn.addEventListener('click', () => {
    routeSection.style.display = 'none';
    searchSection.style.display = 'block';
    
    // Reset form
    startShopInput.value = '';
    endShopInput.value = '';
    selectedStartShop = null;
    selectedEndShop = null;
    errorMessage.classList.remove('show');
    checkCanCalculate();
});

// Inizializzazione
checkCanCalculate();

console.log('✅ Navigatore Porta di Roma caricato!');
console.log(`📊 ${SHOPS_DATA.length} negozi disponibili`);
