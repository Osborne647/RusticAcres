function toggleAbout() {
    const modal = document.getElementById('about-modal');
    if (modal) modal.classList.toggle('active');
}

function toggleContact() {
    const modal = document.getElementById('contact-modal');
    if (modal) modal.classList.toggle('active');
}

// Close modals when clicking the overlay background
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
        }
    });
});

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
