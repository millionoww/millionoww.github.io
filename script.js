const toggleBtn = document.getElementById('theme-toggle');
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  toggleBtn.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
});

// Всплывающее уведомление
function showPopup(message) {
  const popup = document.createElement('div');
  popup.textContent = message;
  popup.style.position = 'fixed';
  popup.style.bottom = '20px';
  popup.style.right = '20px';
  popup.style.background = '#00ffff';
  popup.style.color = '#000';
  popup.style.padding = '10px 20px';
  popup.style.borderRadius = '8px';
  popup.style.zIndex = '1000';
  popup.style.boxShadow = '0 4px 12px rgba(0,255,255,0.3)';
  popup.style.opacity = '0';
  popup.style.transition = 'opacity 0.5s ease';
  document.body.appendChild(popup);
  requestAnimationFrame(() => popup.style.opacity = '1');
  setTimeout(() => {
    popup.style.opacity = '0';
    setTimeout(() => popup.remove(), 500);
  }, 3000);
}

// Магазин
const cart = [];
const products = [
  { id: 1, name: 'Футболка "Казахстан"', price: 4500 },
  { id: 2, name: 'Блокнот для идей', price: 2500 },
  { id: 3, name: 'Кружка "Батыр"', price: 3000 }
];

document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const productId = parseInt(button.parentElement.dataset.id);
    const product = products.find(p => p.id === productId);
    cart.push(product);
    updateCart();
    showPopup(`Добавлено: ${product.name}`);
  });
});

function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const total = document.getElementById('total');
  if (!cartItems || !total) return;
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

// Форма заказа
const checkoutForm = document.getElementById('checkout');
if (checkoutForm) {
  checkoutForm.addEventListener('submit', function(e) {
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
}

// Поиск по блогу
const searchInput = document.getElementById('search');
if (searchInput) {
  searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    document.querySelectorAll('article').forEach(article => {
      const text = article.textContent.toLowerCase();
      article.style.display = text.includes(query) ? 'block' : 'none';
    });
  });
}

// Анимированный фон — частицы
const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = 'fixed';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.zIndex = '-1';

  let particles = [];
  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      dy: (Math.random() - 0.5) * 0.3
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;

      // отражение от краёв
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    }
    requestAnimationFrame(draw);
  }

  draw();
}

function sendToTelegram(name, phone, cartItems) {
  const token = '8173963061:AAHg9gCcrFnQWa1OiH6mZHLn927l6ZEGys4';
  const chatId = '-1002557717506';
  const message = `🛒 Новый заказ:\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n📦 Товары:\n${cartItems.map(i => `- ${i.name} (${i.price} ₸)`).join('\n')}`;

  const buttons = {
    inline_keyboard: [
      [
        { text: '📞 Позвонить клиенту', url: `tel:${phone}` },
        { text: '🌐 Открыть сайт', url: 'https://millionoww.github.io' }
      ],
      [
        { text: '✅ Подтвердить заказ', callback_data: 'confirm_order' }
      ]
    ]
  };
  
  fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message })
  });
}
