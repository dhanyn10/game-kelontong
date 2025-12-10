// DOM Elements
const playerMoneyDisplay = document.getElementById('player-money');
const stockBerasDisplay = document.getElementById('stock-beras');
const stockTelurDisplay = document.getElementById('stock-telur');
const stockMinyakDisplay = document.getElementById('stock-minyak');
const customerOrderDisplay = document.getElementById('customer-order');
const sellButton = document.getElementById('sell-button');
const winMessage = document.getElementById('win-message');

// Game Variables
let playerMoney = 100000;
const winTarget = 500000;

const items = {
    beras: {
        stock: 0,
        buyPrice: 10000,
        sellPrice: 12000,
        display: stockBerasDisplay
    },
    telur: {
        stock: 0,
        buyPrice: 2000,
        sellPrice: 2500,
        display: stockTelurDisplay
    },
    minyak: {
        stock: 0,
        buyPrice: 15000,
        sellPrice: 17000,
        display: stockMinyakDisplay
    }
};

let currentCustomer = null;

// Initial UI Update
function updateUI() {
    playerMoneyDisplay.textContent = playerMoney.toLocaleString();
    items.beras.display.textContent = items.beras.stock;
    items.telur.display.textContent = items.telur.stock;
    items.minyak.display.textContent = items.minyak.stock;
}

// --- Buy Item Logic ---
document.getElementById('buy-beras').addEventListener('click', () => buyItem('beras'));
document.getElementById('buy-telur').addEventListener('click', () => buyItem('telur'));
document.getElementById('buy-minyak').addEventListener('click', () => buyItem('minyak'));

function buyItem(itemName) {
    const item = items[itemName];
    if (playerMoney >= item.buyPrice) {
        playerMoney -= item.buyPrice;
        item.stock++;
        updateUI();
    } else {
        alert("Uang Anda tidak cukup!");
    }
}

// --- Customer Logic ---
function generateCustomer() {
    if (currentCustomer) return; // Don't generate a new customer if one is already waiting

    const itemNames = Object.keys(items);
    const randomItem = itemNames[Math.floor(Math.random() * itemNames.length)];
    const randomQuantity = Math.floor(Math.random() * 3) + 1;

    currentCustomer = {
        item: randomItem,
        quantity: randomQuantity
    };

    customerOrderDisplay.innerHTML = `<p>Pelanggan ingin membeli ${randomQuantity} ${randomItem}.</p>`;
    sellButton.disabled = false;
}

// --- Sell Item Logic ---
sellButton.addEventListener('click', () => {
    if (!currentCustomer) return;

    const item = items[currentCustomer.item];
    if (item.stock >= currentCustomer.quantity) {
        item.stock -= currentCustomer.quantity;
        playerMoney += item.sellPrice * currentCustomer.quantity;

        customerOrderDisplay.innerHTML = `<p>Berhasil menjual ${currentCustomer.quantity} ${currentCustomer.item}!</p>`;
        currentCustomer = null;
        sellButton.disabled = true;

        // Set a timeout to clear the success message and wait for a new customer
        setTimeout(() => {
            customerOrderDisplay.innerHTML = `<p>Belum ada pelanggan.</p>`;
            // Start the timer for the next customer
            setTimeout(generateCustomer, Math.random() * 5000 + 2000); // Random time between 2-7 seconds
        }, 2000);

        updateUI();
        checkWinCondition();
    } else {
        alert("Stok tidak cukup!");
    }
});


// --- Win Condition Logic ---
function checkWinCondition() {
    if (playerMoney >= winTarget) {
        winMessage.classList.remove('hidden');
        // Disable all buttons to stop the game
        sellButton.disabled = true;
        document.getElementById('buy-beras').disabled = true;
        document.getElementById('buy-telur').disabled = true;
        document.getElementById('buy-minyak').disabled = true;
    }
}

// Initialize the game
updateUI();
// Start the customer generation loop
setTimeout(generateCustomer, Math.random() * 5000 + 2000); // First customer arrives after 2-7 seconds
