let isModalOpen = false;
function toggleModal() {
  if (isModalOpen) {
    isModalOpen = false;
    return document.body.classList.remove("modal--open");
  }
  isModalOpen = true;
  document.body.classList += " modal--open";
}

function contact(event) {
  event.preventDefault();
  const loading = document.querySelector(".modal__overlay--loading");
  const success = document.querySelector(".modal__overlay--success");
  loading.classList += " modal__overlay--visible";
  emailjs
    .sendForm(
      "service_nmt0ayn",
      "template_qn46w2i",
      event.target,
      "fuFqHm5g0Wi-p1K6a",
    )
    .then(() => {
      loading.classList.remove("modal__overlay--visible");
      success.classList += " modal__overlay--visible";
    })
    .catch(() => {
      loading.classList.remove("modal__overlay--visible");
      alert(
        "The email service is temporarily unavailable. Please contact me directly at omnicodesolution@gmail.com",
      );
    });
}

document.addEventListener('DOMContentLoaded', function() {
  var slides = document.querySelectorAll('.gallery__slide');
  var current = 0;
  var total = slides.length;

  setInterval(function() {
    slides[current].classList.remove('active');
    current = (current + 1) % total;
    slides[current].classList.add('active');
  }, 5000);
});

document.querySelectorAll('.order__form').forEach(function(form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const flavor = form.querySelector('[name="flavor"]');
        const quantity = form.querySelector('[name="quantity"]');
        const shape = form.querySelector('[name="shape"]');
        const message = form.querySelector('[name="message"]');

        if (!flavor.value || !quantity.value || !shape.value) {
            return;
        }

        const item = {
            product: form.dataset.product,
            price: form.dataset.price,
            unit: form.dataset.unit,
            flavor: flavor.value,
            quantity: quantity.value,
            shape: shape.value,
            message: message.value
        };

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart));

        const btn = form.querySelector('.add-to-cart-btn');
        btn.textContent = '✓';
        btn.disabled = true;

        setTimeout(function() {
            btn.textContent = 'Add to Cart';
            btn.disabled = false;
            flavor.value = '';
            quantity.value = '';
            shape.value = '';
            message.value = '';
        }, 1000);

       if (typeof updateCartBadge === 'function') updateCartBadge();
    });
});

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const badge = document.getElementById('cart__badge');
    if (cart.length > 0) {
        badge.textContent = cart.length;
        badge.classList.add('active');
    } else {
        badge.textContent = '0';
        badge.classList.remove('active');
    }
}

// Run on page load
updateCartBadge();