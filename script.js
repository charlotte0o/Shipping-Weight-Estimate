document.addEventListener('DOMContentLoaded', () => {
    // Data
    const CATEGORIES = [
        {
            name: "Clothing & Accessories",
            items: [
                { id: 'shoes_no_box', name: 'Shoes (No Box)', weight: 1.2 },
                { id: 'shoes_with_box', name: 'Shoes (With Box)', weight: 1.5 },
                { id: 'tshirt', name: 'T-Shirt', weight: 0.3 },
                { id: 'hoodie', name: 'Hoodie', weight: 0.8 },
                { id: 'jacket', name: 'Jacket', weight: 1.2 },
                { id: 'down_jacket', name: 'Down Jacket', weight: 2.0 },
                { id: 'pants', name: 'Pants', weight: 0.7 },
                { id: 'jeans', name: 'Jeans', weight: 1.0 },
                { id: 'cap', name: 'Cap', weight: 0.2 },
                { id: 'belt', name: 'Belt', weight: 0.3 },
            ]
        },
        {
            name: "Bags & Others",
            items: [
                { id: 'backpack', name: 'Backpack', weight: 1.0 },
                { id: 'shoulder_bag', name: 'Shoulder Bag', weight: 0.6 },
                { id: 'socks', name: 'Socks (3–5 pairs)', weight: 0.3 },
                { id: 'underwear', name: 'Underwear', weight: 0.2 },
                { id: 'sunglasses', name: 'Sunglasses (with case)', weight: 0.3 },
                { id: 'watch', name: 'Watch', weight: 0.3 },
                { id: 'airpods', name: 'AirPods (with charging case)', weight: 0.2 },
            ]
        }
    ];

    // State
    let quantities = {};
    let otherWeight = 0;

    // DOM Elements
    const container = document.getElementById('categories-container');
    const totalWeightEl = document.getElementById('total-weight');
    const otherWeightDisplay = document.getElementById('other-weight-display');
    const otherWeightVal = document.getElementById('other-weight-val');

    // Initialize UI
    function init() {
        renderCategories();
        bindOtherItemsEvents();
        bindClearAllEvent();
        updateSummary();
    }

    function renderCategories() {
        container.innerHTML = '';
        
        CATEGORIES.forEach(category => {
            // Category Title
            const title = document.createElement('h2');
            title.className = 'category-title';
            title.textContent = category.name;
            container.appendChild(title);

            // Grid
            const grid = document.createElement('div');
            grid.className = 'items-grid';

            category.items.forEach(item => {
                const qty = quantities[item.id] || 0;
                
                const card = document.createElement('div');
                card.className = `item-card ${qty > 0 ? 'active' : ''}`;
                card.id = `card-${item.id}`;

                card.innerHTML = `
                    <div class="item-header">
                        <span class="item-name">${item.name}</span>
                        <span class="item-weight-badge">${item.weight.toFixed(1)} kg</span>
                    </div>
                    <div class="item-controls">
                        <span class="qty-label">Quantity</span>
                        <div class="qty-input-group">
                            <button class="qty-btn minus-btn" data-id="${item.id}" ${qty === 0 ? 'disabled' : ''}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            </button>
                            <input type="number" class="qty-input" data-id="${item.id}" min="0" value="${qty || ''}" placeholder="0">
                            <button class="qty-btn plus-btn" data-id="${item.id}">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            </button>
                        </div>
                    </div>
                `;
                grid.appendChild(card);
            });

            container.appendChild(grid);
        });

        bindItemEvents();
    }

    function bindItemEvents() {
        // Plus buttons
        document.querySelectorAll('.plus-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                updateQuantity(id, (quantities[id] || 0) + 1);
            });
        });

        // Minus buttons
        document.querySelectorAll('.minus-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                updateQuantity(id, Math.max(0, (quantities[id] || 0) - 1));
            });
        });

        // Inputs
        document.querySelectorAll('.qty-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const id = e.target.dataset.id;
                const val = e.target.value;
                if (val === '') {
                    updateQuantity(id, 0, true);
                } else {
                    const num = parseInt(val, 10);
                    if (!isNaN(num) && num >= 0) {
                        updateQuantity(id, num);
                    }
                }
            });
        });
    }

    function updateQuantity(id, newQty, isEmptyInput = false) {
        if (newQty === 0) {
            delete quantities[id];
        } else {
            quantities[id] = newQty;
        }

        // Update specific card UI without full re-render for better UX
        const card = document.getElementById(`card-${id}`);
        if (card) {
            const input = card.querySelector('.qty-input');
            const minusBtn = card.querySelector('.minus-btn');
            
            if (newQty > 0) {
                card.classList.add('active');
                input.value = newQty;
                minusBtn.disabled = false;
            } else {
                card.classList.remove('active');
                input.value = isEmptyInput ? '' : ''; // Keep empty if user deleted it
                minusBtn.disabled = true;
            }
        }

        updateSummary();
    }

    function bindOtherItemsEvents() {
        document.getElementById('add-50g').addEventListener('click', () => {
            otherWeight += 0.05;
            updateSummary();
        });

        document.getElementById('add-100g').addEventListener('click', () => {
            otherWeight += 0.1;
            updateSummary();
        });

        document.getElementById('clear-other').addEventListener('click', () => {
            otherWeight = 0;
            updateSummary();
        });
    }

    function bindClearAllEvent() {
        document.getElementById('clear-btn').addEventListener('click', () => {
            quantities = {};
            otherWeight = 0;
            renderCategories(); // Full re-render to reset all inputs
            updateSummary();
        });
    }

    function updateSummary() {
        // Calculate total weight
        let total = otherWeight;
        
        CATEGORIES.forEach(category => {
            category.items.forEach(item => {
                if (quantities[item.id]) {
                    total += quantities[item.id] * item.weight;
                }
            });
        });

        // Update UI
        totalWeightEl.textContent = total.toFixed(2);

        // Update other weight display
        if (otherWeight > 0) {
            otherWeightDisplay.style.display = 'flex';
            otherWeightVal.textContent = `${otherWeight.toFixed(2)} kg`;
        } else {
            otherWeightDisplay.style.display = 'none';
        }
    }

    // Run
    init();
});
