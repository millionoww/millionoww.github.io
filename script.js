const toggleBtn = document.getElementById('theme-toggle');
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  toggleBtn.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
});

// Корзина
const cart = [];
const products = [
  { id: 1, name: 'Футболка "Казахстан"', price: 4500 },
  { id: 2, name: 'Блокнот для идей', price: 2500 },
  { id: 3, name: 'Кружка "Нихуя"', price: 3000 }
];

document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const productId = parseInt(button.parentElement.dataset.id);
    const product = products.find(p => p.id === productId);
    cart.push(product);
    updateCart();
  });
});

function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const total = document.getElementById('total');
  cartItems.innerHTML = '';
  let sum = 0;
  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} — ${item.price} ₸`;
    cartItems.appendChild(li);
    sum += item.price;
  });
  total.textContent = `Итого: ${sum} ₸`;
}

// Всплывающее уведомление
function showPopup(message) {
  const popup = document.createElement('div');
  popup.textContent = message;
  popup.style.position = 'fixed';
  popup.style.bottom = '20px';
  popup.style.right = '20px';
  popup.style.background = '#0077ff';
  popup.style.color = '#fff';
  popup.style.padding = '10px 20px';
  popup.style.borderRadius = '8px';
  popup.style.zIndex = '1000';
  popup.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
  popup.style.opacity = '0';
  popup.style.transition = 'opacity 0.5s ease';
  document.body.appendChild(popup);
  requestAnimationFrame(() => popup.style.opacity = '1');
  setTimeout(() => {
    popup.style.opacity = '0';
    setTimeout(() => popup.remove(), 500);
  }, 3000);
}

// Добавление товара
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const productId = parseInt(button.parentElement.dataset.id);
    const product = products.find(p => p.id === productId);
    cart.push(product);
    updateCart();
    showPopup(`Добавлено: ${product.name}`);
  });
});

// Обработка формы
document.getElementById('checkout').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  if (cart.length === 0) {
    showPopup('Корзина пуста!');
    return;
  }
  document.getElementById('order-status').textContent = `Спасибо, ${name}! Ваш заказ принят. Мы свяжемся по номеру ${phone}.`;
  cart.length = 0;
  updateCart();
});
