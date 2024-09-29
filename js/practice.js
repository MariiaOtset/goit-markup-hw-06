document.addEventListener('DOMContentLoaded', function () {
  const orderBtn = document.getElementById('orderServiceBtn');
  const modal = document.getElementById('modalWindow');
  const closeIcon = document.getElementById('closeForm');
  const submitButton = document.getElementById('submitBtn');
  const burgerButton = document.getElementById('burgerBtn');
  const mobMenu = document.getElementById('mobileMenu');
  const closeMenu = document.getElementById('mobileMenuClose');

  function openModal() {
    modal.classList.add('is-open');
  }

  if (orderBtn) {
    orderBtn.addEventListener('click', openModal);
  }

  function closeModal() {
    modal.classList.remove('is-open');
  }

  if (closeIcon || submitButton) {
    closeIcon.addEventListener('click', closeModal);
    submitButton.addEventListener('click', closeModal);
  }

  function openBurger() {
    mobMenu.classList.add('is-open');
  }

  function closeBurger() {
    mobMenu.classList.remove('is-open');
  }

  if (burgerButton) {
    burgerButton.addEventListener('click', openBurger);
  }

  if (closeMenu) {
    closeMenu.addEventListener('click', closeBurger);
  }
});
