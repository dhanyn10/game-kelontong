// DOM Elements
const playerMoneyDisplay = document.getElementById('player-money');
const stockBerasDisplay = document.getElementById('stock-beras');
const stockTelurDisplay = document.getElementById('stock-telur');
const stockMinyakDisplay = document.getElementById('stock-minyak');
const sellButton = document.getElementById('sell-button');
const winMessage = document.getElementById('win-message');
const customerArea = document.getElementById('customer-area');
const orderBubble = document.getElementById('order-bubble');

// Game Variables
let playerMoney = 100000;
const winTarget = 500000;
let isGameActive = true;

const items = {
    beras: { stock: 0, buyPrice: 10000, sellPrice: 12000, display: stockBerasDisplay },
    telur: { stock: 0, buyPrice: 2000, sellPrice: 2500, display: stockTelurDisplay },
    minyak: { stock: 0, buyPrice: 15000, sellPrice: 17000, display: stockMinyakDisplay }
};

let currentCustomer = null;

// --- UI Update ---
function updateUI() {
    playerMoneyDisplay.textContent = playerMoney.toLocaleString();
    Object.values(items).forEach(item => {
        item.display.textContent = item.stock;
    });
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

// --- Customer and Animation Logic ---
function generateCustomer() {
    if (currentCustomer || !isGameActive) return;

    const itemNames = Object.keys(items);
    const randomItem = itemNames[Math.floor(Math.random() * itemNames.length)];
    const randomQuantity = Math.floor(Math.random() * 3) + 1;

    currentCustomer = { item: randomItem, quantity: randomQuantity };

    // Start enter animation
    customerArea.classList.add('customer-enter');

    // After animation, show order
    setTimeout(() => {
        if (!currentCustomer) return; // In case the sale happened very fast
        orderBubble.textContent = `Beli ${randomQuantity} ${randomItem}`;
        orderBubble.classList.remove('hidden');
        sellButton.disabled = false;
    }, 3000); // Corresponds to the CSS transition time
}

// --- Sell Item Logic ---
sellButton.addEventListener('click', () => {
    if (!currentCustomer) return;

    const item = items[currentCustomer.item];
    if (item.stock >= currentCustomer.quantity) {
        // Process sale
        item.stock -= currentCustomer.quantity;
        playerMoney += item.sellPrice * currentCustomer.quantity;
        updateUI();

        // Hide bubble and disable button
        orderBubble.classList.add('hidden');
        sellButton.disabled = true;

        // Start exit animation
        customerArea.classList.remove('customer-enter');
        customerArea.classList.add('customer-exit');

        currentCustomer = null; // Clear customer immediately

        // Reset customer position after exit animation
        setTimeout(() => {
            customerArea.classList.remove('customer-exit');
            // Schedule next customer
            setTimeout(generateCustomer, Math.random() * 4000 + 2000); // 2-6 seconds
        }, 3000); // Corresponds to the CSS transition time

        checkWinCondition();
    } else {
        alert("Stok tidak cukup!");
    }
});

// --- Win Condition Logic ---
function checkWinCondition() {
    if (playerMoney >= winTarget) {
        isGameActive = false;
        winMessage.classList.remove('hidden');
        // Disable all buy buttons
        document.getElementById('buy-beras').disabled = true;
        document.getElementById('buy-telur').disabled = true;
        document.getElementById('buy-minyak').disabled = true;
        sellButton.disabled = true;
    }
}

// Initialize the game
updateUI();
// Start the first customer generation
setTimeout(generateCustomer, 2000);
