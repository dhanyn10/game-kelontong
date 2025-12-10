// DOM Elements
const playerMoneyDisplay = document.getElementById('player-money');
const stockBerasDisplay = document.getElementById('stock-beras');
const stockTelurDisplay = document.getElementById('stock-telur');
const stockMinyakDisplay = document.getElementById('stock-minyak');
const sellButton = document.getElementById('sell-button');
const winMessage = document.getElementById('win-message');
const customerArea = document.getElementById('customer-area');
const customerDiv = document.getElementById('customer');
const orderBubble = document.getElementById('order-bubble');

// Game Variables
let playerMoney = 100000;
const winTarget = 500000;
let isGameActive = true;
let currentCustomer = null;

const items = {
    beras: { stock: 0, buyPrice: 10000, sellPrice: 12000, display: stockBerasDisplay },
    telur: { stock: 0, buyPrice: 2000, sellPrice: 2500, display: stockTelurDisplay },
    minyak: { stock: 0, buyPrice: 15000, sellPrice: 17000, display: stockMinyakDisplay }
};

// --- UI Update ---
function updateUI() {
    playerMoneyDisplay.textContent = playerMoney.toLocaleString();
    Object.values(items).forEach(item => item.display.textContent = item.stock);
}

// --- Buy Item Logic ---
document.getElementById('buy-beras').addEventListener('click', () => buyItem('beras'));
document.getElementById('buy-telur').addEventListener('click', () => buyItem('telur'));
document.getElementById('buy-minyak').addEventListener('click', () => buyItem('minyak'));

function buyItem(itemName) {
    if (!isGameActive) return;
    const item = items[itemName];
    if (playerMoney >= item.buyPrice) {
        playerMoney -= item.buyPrice;
        item.stock++;
        updateUI();
    } else {
        alert("Uang Anda tidak cukup!");
    }
}

// --- Customer Animation & Logic ---
function generateCustomer() {
    if (currentCustomer || !isGameActive) return;

    const itemNames = Object.keys(items);
    const randomItem = itemNames[Math.floor(Math.random() * itemNames.length)];
    const randomQuantity = Math.floor(Math.random() * 3) + 1;
    currentCustomer = { item: randomItem, quantity: randomQuantity };

    customerArea.addEventListener('animationend', onCustomerArrived, { once: true });

    customerDiv.classList.add('is-walking');
    customerArea.classList.add('move-in');
}

function onCustomerArrived(event) {
    if (event.animationName !== 'move-in' || !currentCustomer) return;

    customerDiv.classList.remove('is-walking');

    orderBubble.textContent = `Beli ${currentCustomer.quantity} ${currentCustomer.item}`;
    orderBubble.classList.remove('hidden');
    sellButton.disabled = false;
}

// --- Sell Item Logic ---
sellButton.addEventListener('click', () => {
    if (!currentCustomer) return;

    const item = items[currentCustomer.item];
    if (item.stock >= currentCustomer.quantity) {
        item.stock -= currentCustomer.quantity;
        playerMoney += item.sellPrice * currentCustomer.quantity;
        updateUI();

        orderBubble.classList.add('hidden');
        sellButton.disabled = true;

        customerArea.addEventListener('animationend', onCustomerLeft, { once: true });

        customerDiv.style.transform = 'scaleX(-1)';
        customerDiv.classList.add('is-walking');
        customerArea.classList.remove('move-in');
        customerArea.classList.add('move-out');

        currentCustomer = null;

        checkWinCondition();
    } else {
        alert("Stok tidak cukup!");
    }
});

function onCustomerLeft(event) {
    if (event.animationName !== 'move-out') return;

    customerDiv.classList.remove('is-walking');
    customerArea.classList.remove('move-out');
    customerDiv.style.transform = 'scaleX(1)';

    setTimeout(generateCustomer, Math.random() * 4000 + 2000);
}

// --- Win Condition ---
function checkWinCondition() {
    if (playerMoney >= winTarget) {
        isGameActive = false;
        winMessage.classList.remove('hidden');
        document.getElementById('buy-beras').disabled = true;
        document.getElementById('buy-telur').disabled = true;
        document.getElementById('buy-minyak').disabled = true;
        sellButton.disabled = true;
    }
}

// --- Initialize ---
updateUI();
setTimeout(generateCustomer, 2000);
