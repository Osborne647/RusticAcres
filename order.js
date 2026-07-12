document.querySelectorAll('.order-form').forEach(function(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const flavor = form.querySelector('[name="flavor"]');
        const quantity = form.querySelector('[name="quantity"]');
        const shape = form.querySelector('[name="shape"]');
        const message = form.querySelector('[name="message"]');

        if (!flavor.value || !quantity.value) {
            return;
        }

        const item = {
            product: form.dataset.product,
            price: form.dataset.price,
            unit: form.dataset.unit,
            flavor: flavor.value,
            quantity: quantity.value,
            shape: shape ? shape.value : '',
            message: message.value
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