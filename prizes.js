document.addEventListener('DOMContentLoaded', () => {
    updateCoinsDisplay();
    displayInventory();
    updatePurchaseButtons();
});

function updateCoinsDisplay() {
    const coins = parseInt(localStorage.getItem('totalCoins')) || 0;
    document.getElementById('available-coins').textContent = coins;
}

function updatePurchaseButtons() {
    const inventory = JSON.parse(localStorage.getItem('prizeInventory')) || {};
    
    if (inventory['Dinner Date']) {
        const dinnerButton = document.querySelector('button[onclick="purchasePrize(\'Dinner Date\', 1000)"]');
        if (dinnerButton) {
            dinnerButton.textContent = 'Sold Out';
            dinnerButton.disabled = true;
            dinnerButton.classList.add('sold-out');
        }
    }
}

function purchasePrize(prizeName, cost) {
    let coins = parseInt(localStorage.getItem('totalCoins')) || 0;
    
    // Special case for Taylor Swift Tickets
    if (prizeName === 'Taylor Swift Tickets' && coins >= cost) {
        // Deduct coins first
        coins -= cost;
        localStorage.setItem('totalCoins', coins);
        updateCoinsDisplay();
        
        // Show error message in alert
        alert("ERROR: This feature hasn't been implemented yet");
        return;  // Exit the function after showing the message
    }
    
    // Check if Dinner Date is already purchased
    if (prizeName === 'DinnerDate') {
        const inventory = JSON.parse(localStorage.getItem('prizeInventory')) || {};
        if (inventory[prizeName]) {
            alert('This prize can only be purchased once!');
            return;
        }
    }
    
    if (coins >= cost) {
        // Regular purchase logic...
        coins -= cost;
        localStorage.setItem('totalCoins', coins);
        
        let inventory = JSON.parse(localStorage.getItem('prizeInventory')) || {};
        inventory[prizeName] = (inventory[prizeName] || 0) + 1;
        localStorage.setItem('prizeInventory', JSON.stringify(inventory));
        
        updateCoinsDisplay();
        displayInventory();
        updatePurchaseButtons();
        alert(`Congratulations! You got a ${prizeName}! please take a picture and send to Jack`);
    } else {
        alert('Not enough coins!');
    }
}

function displayInventory() {
    const inventory = JSON.parse(localStorage.getItem('prizeInventory')) || {};
    const inventoryDiv = document.getElementById('prize-inventory');
    inventoryDiv.innerHTML = '';
    
    for (const [prize, count] of Object.entries(inventory)) {
        if (count > 0) {
            const prizeElement = document.createElement('div');
            prizeElement.className = 'inventory-item';
            prizeElement.textContent = `${prize} x${count}`;
            inventoryDiv.appendChild(prizeElement);
        }
    }
    
    if (inventoryDiv.children.length === 0) {
        inventoryDiv.textContent = 'No prizes yet!';
    }
} 