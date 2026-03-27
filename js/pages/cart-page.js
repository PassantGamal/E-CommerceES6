
const CART_KEY = 'SHOPCO_CART';

function getCart() {
  try {
    const data = localStorage.getItem(CART_KEY);

    if (!data) return [];

    const parsed = JSON.parse(data);

    if (!Array.isArray(parsed)) {
      localStorage.removeItem(CART_KEY); 
      return [];
    }

    return parsed;

  } catch (error) {
    localStorage.removeItem(CART_KEY);
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function updateBadge() {
  const badge = document.getElementById('cartCount');
  if (!badge) return;

  const items = getCart();

  
  const uniqueCount = items.length;

  badge.textContent = uniqueCount;
  badge.style.display = uniqueCount > 0 ? 'flex' : 'none';
}

window.addToCart = function(product) {
  let items = getCart();
  

  const existingIndex = items.findIndex(i => 
    i.name === product.name && 
    i.size === (product.size || 'Standard') && 
    i.color === (product.color || 'Default')
  );

  if (existingIndex > -1) {
  
    items[existingIndex].qty = (items[existingIndex].qty || 1) + (product.qty || 1);
  } else {
  
    items.push({
      ...product,
      qty: product.qty || 1,
      size: product.size || 'Standard',
      color: product.color || 'Default'
    });
  }

  saveCart(items);
  updateBadge();
  
  
  if (document.getElementById('cartItemsCol')) {
    renderCartPage();
  }
  
  showToast(`${product.name} added to cart!`);
};

window.removeCartItem = function(index) {
  const items = getCart();
  items.splice(index, 1);
  saveCart(items);
  renderCartPage();
  updateBadge();
};


window.changeQty = function(index, delta) {
  const items = getCart();
  if (!items[index]) return;
  items[index].qty = Math.max(1, (items[index].qty || 1) + delta);
  saveCart(items);
  renderCartPage();

  updateBadge(); 
};


const PROMOS = { SHOP20: 20, SAVE20: 20, WELCOME: 15, SUMMER10: 10 };
let appliedDiscount = 0;

window.applyPromo = function() {
  const input = document.getElementById('promoInput');
  const code  = input?.value.trim().toUpperCase();
  const pct   = PROMOS[code];

  if (!code) return showToast('Please enter a promo code.');
  if (!pct)  { showToast('Invalid promo code.'); appliedDiscount = 0; renderSummary(); return; }

  appliedDiscount = pct;
  showToast(` "${code}" applied — ${pct}% off!`);
  renderSummary();
};


function renderSummary() {
  const items    = getCart();
  const subtotal = items.reduce((s, i) => s + i.price * (i.qty || 1), 0);
  const discount = (subtotal * appliedDiscount) / 100;
  const delivery = subtotal > 0 ? 15 : 0;
  const total    = Math.max(0, subtotal - discount + delivery);

  setText('summarySubtotal', `$${subtotal.toFixed(2)}`);
  setText('summaryDiscount', appliedDiscount ? `-$${discount.toFixed(2)}` : '-$0.00');
  setText('summaryDelivery', delivery ? `$${delivery.toFixed(2)}` : 'Free');
  setText('summaryTotal',    `$${total.toFixed(2)}`);

  const discRow = document.querySelector('.summary-row .discount-val')?.closest('.summary-row');
  if (discRow) discRow.style.display = 'flex';
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}


function renderCartPage() {
  const col   = document.getElementById('cartItemsCol');
  const items = getCart();

  if (!col) return;

  if (!items.length) {
    col.innerHTML = `
      <div style="text-align:center;padding:80px 20px;">
        <i class="fas fa-shopping-cart" style="font-size:64px;color:#d9d9d9;display:block;margin-bottom:20px;"></i>
        <h2 style="font-size:24px;font-weight:700;margin-bottom:12px;">Your cart is empty</h2>
        <p style="color:#9b9b9b;margin-bottom:28px;">Looks like you haven't added anything yet.</p>
        <a href="category.html" style="display:inline-block;padding:14px 32px;background:#000;color:#fff;border-radius:62px;font-weight:700;text-decoration:none;">Shop Now</a>
      </div>`;
    renderSummary();
    return;
  }

  col.innerHTML = `
    <div class="cart-items-box" style="border:1px solid #f0f0f0; border-radius:20px; padding:20px;">
      ${items.map((item, i) => `
        <div class="cart-item" style="display:flex; gap:16px; align-items:center;">
          <img src="${item.image || ''}" alt="${item.name}"
               onerror="this.style.background='#f0f0f0';this.removeAttribute('src')"
               style="width:100px;height:100px;object-fit:cover;border-radius:12px;background:#f0f0f0;flex-shrink:0;" />
          <div class="cart-item-info" style="flex:1;min-width:0;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
              <span class="cart-item-name" style="font-weight:700;font-size:16px;line-height:1.3;">${item.name}</span>
              <button onclick="removeCartItem(${i})"
                style="background:none;border:none;cursor:pointer;color:#ff3333;font-size:18px;flex-shrink:0;padding:0;">
                <i class="fas fa-trash"></i>
              </button>
            </div>
            <div style="font-size:13px;color:#9b9b9b;margin-top:6px;">
              ${item.size  ? `<span>Size: <b>${item.size}</b></span>` : ''}
              ${item.size && item.color ? ' &nbsp;|&nbsp; ' : ''}
              ${item.color ? `<span>Color: <b>${item.color}</b></span>` : ''}
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;">
              <span style="font-size:20px;font-weight:700;">$${(item.price * (item.qty||1)).toFixed(2)}</span>
              <div class="qty-control" style="display:flex;align-items:center;gap:0;background:#f0f0f0;border-radius:62px;padding:6px 14px;">
                <button onclick="changeQty(${i}, -1)"
                  style="background:none;border:none;cursor:pointer;font-size:18px;padding:0 8px;line-height:1;">−</button>
                <span style="font-size:16px;font-weight:600;min-width:24px;text-align:center;">${item.qty || 1}</span>
                <button onclick="changeQty(${i}, 1)"
                  style="background:none;border:none;cursor:pointer;font-size:18px;padding:0 8px;line-height:1;">+</button>
              </div>
            </div>
          </div>
        </div>
        ${i < items.length - 1 ? '<div style="height:1px;background:#f0f0f0;margin:16px 0;"></div>' : ''}
      `).join('')}
    </div>`;

  renderSummary();
}


function showToast(msg) {
  let t = document.getElementById('globalToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'globalToast';
    Object.assign(t.style, {
      position:'fixed', bottom:'24px', left:'50%',
      transform:'translateX(-50%) translateY(20px)',
      background:'#000', color:'#fff', padding:'12px 24px',
      borderRadius:'62px', fontSize:'14px', fontWeight:'600',
      opacity:'0', transition:'all .3s', zIndex:'9999',
      whiteSpace:'nowrap', pointerEvents:'none'
    });
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity   = '1';
  t.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => {
    t.style.opacity   = '0';
    t.style.transform = 'translateX(-50%) translateY(20px)';
  }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  updateBadge();
  renderCartPage();

  document.getElementById('btnPromo')
    ?.addEventListener('click', window.applyPromo);

  document.getElementById('btnCheckout')
    ?.addEventListener('click', () => {
      window.location.href = 'checkout.html';
    });

  document.getElementById('promoInput')
    ?.addEventListener('keydown', e => {
      if (e.key === 'Enter') window.applyPromo();
    });
});