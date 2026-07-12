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

// Update filling labels dynamically when quantity changes
document.querySelectorAll('.tiered-price-select').forEach(function(qtySelect) {
    qtySelect.addEventListener('change', function() {
        const form = this.closest('.order-form');
        const fillingSelect = form.querySelector('.filling-select');
        if (!fillingSelect) return;

        const pricesByQty = fillingSelect.getAttribute('data-prices-by-qty');
        if (!pricesByQty) return;

        const priceMap = JSON.parse(pricesByQty);
        const qty = this.value;
        const qtyPrices = priceMap[qty];
        if (!qtyPrices) return;

        fillingSelect.querySelectorAll('optgroup').forEach(function(group) {
            const type = group.querySelector('option').value.startsWith('fruit') ? 'fruit' : 'mousse';
            const price = qtyPrices[type];
            group.label = type === 'mousse'
                ? 'Mousse (+$' + price + ')'
                : 'Fruit/Curd (+$' + price + ')';
        });
    });
});

// Handle Add to Cart
document.querySelectorAll('.order-form').forEach(function(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const tieredSelect = form.querySelector('.tiered-price-select');
        const tierSelect = form.querySelector('.tier-select');

        // Get all form field values and their visible text
        const flavor = form.querySelector('[name="flavor"]');
        const quantity = form.querySelector('[name="quantity"]');
        const shape = form.querySelector('[name="shape"]');
        const message = form.querySelector('[name="message"]');
        const style = form.querySelector('[name="style"]');
        const icing = form.querySelector('[name="icing"]');
        const size = form.querySelector('[name="size"]');
        const addonSelect = form.querySelector('.addon-select');
        const fillingSelect = form.querySelector('.filling-select');

        // Validation
        if (flavor && !flavor.value) return;
        if (quantity && !quantity.value) return;
        if (tieredSelect && !tieredSelect.value) return;
        if (tierSelect && !tierSelect.value) return;
        if (style && !style.value) return;
        if (icing && !icing.value) return;

        // Helper: get selected option text
        function getSelectedText(select) {
            if (!select || !select.value) return '';
            return select.options[select.selectedIndex].textContent.trim();
        }

        // Determine base price
        let price;
        if (tieredSelect && tierSelect && tierSelect.value) {
            const prices = JSON.parse(tieredSelect.getAttribute('data-prices-' + tierSelect.value) || '{}');
            price = parseFloat(prices[tieredSelect.value]);
        } else if (tieredSelect && tieredSelect.getAttribute('data-prices')) {
            const prices = JSON.parse(tieredSelect.getAttribute('data-prices'));
            price = parseFloat(prices[tieredSelect.value]);
        } else {
            price = parseFloat(form.dataset.price);
        }

        // Is tiered select the quantity field?
        const tieredIsQuantity = tieredSelect && tieredSelect.getAttribute('name') === 'quantity';

        // Check for filling upcharge
        let filling = 'none';
        let fillingText = '';
        let fillingUpcharge = 0;
        if (fillingSelect && fillingSelect.value !== 'none') {
            filling = fillingSelect.value;
            fillingText = getSelectedText(fillingSelect);
            const fillingByQty = fillingSelect.getAttribute('data-prices-by-qty');

            if (fillingByQty) {
                const priceMap = JSON.parse(fillingByQty);
                const qtyKey = quantity ? quantity.value : (tieredSelect ? tieredSelect.value : '');
                const qtyPrices = priceMap[qtyKey];
                if (qtyPrices) {
                    const fillingType = filling.startsWith('fruit') ? 'fruit' : 'mousse';
                    fillingUpcharge = parseFloat(qtyPrices[fillingType] || 0);
                }
            } else if (fillingSelect.getAttribute('data-prices')) {
                const fillingPrices = JSON.parse(fillingSelect.getAttribute('data-prices'));
                fillingUpcharge = parseFloat(fillingPrices[filling] || 0);
            }
        }

        price = parseFloat(price) + fillingUpcharge;

        // Check for addon
        let addonQty = 0;
        let addonTotal = 0;
        if (addonSelect && parseInt(addonSelect.value) > 0) {
            addonQty = parseInt(addonSelect.value);
            const addonPrice = parseFloat(addonSelect.dataset.addonPrice || 0);
            addonTotal = addonPrice * addonQty;
            price = price + addonTotal;
        }

        price = parseFloat(price).toFixed(2);

        // Build item with ALL info
        const item = {
            product: form.dataset.product,
            price: price,
            unit: form.dataset.unit || 'item',
            flavor: flavor ? getSelectedText(flavor) : '',
            quantity: quantity ? quantity.value : '1',
            quantityText: quantity ? getSelectedText(quantity) : '',
            shape: shape ? getSelectedText(shape) : '',
            tiers: tierSelect ? getSelectedText(tierSelect) : '',
            tiersValue: tierSelect ? tierSelect.value : '',
            size: size ? getSelectedText(size) : '',
            sizeValue: size ? size.value : '',
            style: style ? getSelectedText(style) : '',
            styleValue: style ? style.value : '',
            icing: icing ? getSelectedText(icing) : '',
            filling: filling,
            fillingText: fillingText,
            fillingUpcharge: fillingUpcharge.toFixed(2),
            extraIcing: addonQty,
            extraIcingTotal: addonTotal.toFixed(2),
            message: message ? message.value : '',
            tiered: tieredIsQuantity || !!(tierSelect),
            sizeLabel: tieredSelect ? getSelectedText(tieredSelect) : ''
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
            if (tieredSelect && tierSelect) {
                tieredSelect.innerHTML = '<option value="" disabled selected>Select a tier first</option>';
            }
            const fillingEl = form.querySelector('.filling-select');
            if (fillingEl) {
                fillingEl.querySelectorAll('optgroup').forEach(function(group) {
                    const type = group.querySelector('option').value.startsWith('fruit') ? 'fruit' : 'mousse';
                    group.label = type === 'mousse' ? 'Mousse' : 'Fruit/Curd';
                });
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