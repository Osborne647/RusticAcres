// Populate size options based on tier selection
document.querySelectorAll('.tier-select').forEach(function(tierSelect) {
    tierSelect.addEventListener('change', function() {
        const form = this.closest('.order-form');
        const sizeSelect = form.querySelector('.tiered-price-select');
        const tier = this.value;
        const prices = JSON.parse(sizeSelect.getAttribute('data-prices-' + tier) || '{}');

        sizeSelect.innerHTML = '<option value="" disabled selected>Select size</option>';

        Object.entries(prices).forEach(([size, price]) => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size + '" - $' + price;
            sizeSelect.appendChild(option);
        });
    });
});

// Handle Add to Cart
document.querySelectorAll('.order-form').forEach(function(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const flavor = form.querySelector('[name="flavor"]');
        const quantity = form.querySelector('[name="quantity"]');
        const shape = form.querySelector('[name="shape"]');
        const message = form.querySelector('[name="message"]');

        if (!flavor.value || !quantity.value) return;

        // Determine price
        let price;
        const tieredSelect = form.querySelector('.tiered-price-select');
        const tierSelect = form.querySelector('.tier-select');

        if (tieredSelect && tierSelect && tierSelect.value) {
            const prices = JSON.parse(tieredSelect.getAttribute('data-prices-' + tierSelect.value) || '{}');
            price = parseFloat(prices[quantity.value]);
        } else if (tieredSelect && tieredSelect.getAttribute('data-prices')) {
            const prices = JSON.parse(tieredSelect.getAttribute('data-prices'));
            price = parseFloat(prices[quantity.value]);
        } else {
            price = parseFloat(form.dataset.price);
        }
}

       // Check for filling upcharge
const fillingSelect = form.querySelector('.filling-select');
let filling = 'none';
if (fillingSelect && fillingSelect.value !== 'none') {
    filling = fillingSelect.value;
    const fillingByQty = fillingSelect.getAttribute('data-prices-by-qty');

    if (fillingByQty) {
        const priceMap = JSON.parse(fillingByQty);
        const qtyPrices = priceMap[quantity.value];
        if (qtyPrices) {
            const fillingType = filling.startsWith('fruit') ? 'fruit' : 'mousse';
            const fillingUpcharge = parseFloat(qtyPrices[fillingType] || 0);
            price = (parseFloat(price) + fillingUpcharge).toFixed(2);
        }
    } else if (fillingSelect.getAttribute('data-prices')) {
        const fillingPrices = JSON.parse(fillingSelect.getAttribute('data-prices'));
        const fillingUpcharge = parseFloat(fillingPrices[filling] || 0);
        price = (parseFloat(price) + fillingUpcharge).toFixed(2);
    }
}


        const item = {
    product: form.dataset.product,
    price: price,
    unit: form.dataset.unit || 'item',
    flavor: flavor.value,
    quantity: quantity.value,
    shape: shape ? shape.value : '',
    tiers: tierSelect ? tierSelect.value : '',
    filling: filling,
    message: message.value,
    tiered: !!(tieredSelect)
};

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart));

        const btn = form.querySelector('.btn-add-cart');
        btn.textContent = '✓ Added';
        btn.disabled = true;
        btn.style.background = '#5a8a5a';

        setTimeout(function() {
            btn.textContent = 'Add to Cart';
            btn.disabled = false;
            btn.style.background = '';
            form.reset();
            // Reset size dropdown for tier-based forms
            if (tieredSelect && tierSelect) {
                tieredSelect.innerHTML = '<option value="" disabled selected>Select a tier first</option>';
            }
        }, 1500);

        updateCartBadge();
    });
});

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    badge.textContent = cart.length;
}

updateCartBadge();