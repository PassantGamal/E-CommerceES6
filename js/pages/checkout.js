let promoDiscount  = 0;
let shippingCost   = 0;
let currentPayment = 'card';

const PROMO_CODES = {
  SHOP20:   20,
  SAVE20:   20,
  WELCOME:  15,
  SUMMER10: 10,
};

const CART_KEY = 'SHOPCO_CART';

function getCartItems() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

function cartSubtotal() {
  return getCartItems().reduce(getCartItems().length);
}

function updateCartBadge() {
  const badge = document.getElementById('cartCount');
  if (!badge) return;
 const total = getCartItems().length;
  badge.textContent   = total;
  badge.style.display = total > 0 ? 'flex' : 'none';
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
  updateCartBadge();
  initCheckout();
});

function initCheckout() {
  const items = getCartItems();

  if (!items.length) {
    const empty = document.getElementById('emptyState');
    const grid  = document.getElementById('checkoutGrid');
    if (empty) empty.style.display  = 'block';
    if (grid)  grid.style.display   = 'none';
    return;
  }

  renderSummaryItems(items);
  updateTotals();
  initPaymentToggle();
  initShippingToggle();
  initCardFormatting();
  initFieldValidation();
}


function renderSummaryItems(items) {
  const container = document.getElementById('summaryItems');
  if (!container) return;

  container.innerHTML = items.map(item => `
    <div class="summary-item">
      <img src="${item.image || ''}" alt="${item.name}"
           onerror="this.style.background='#f0f0f0';this.removeAttribute('src')" />
      <div class="summary-item-info">
        <div class="summary-item-name">${item.name}</div>
        <div class="summary-item-meta">
          ${item.size  ? 'Size: '  + item.size  : ''}
          ${item.size && item.color ? ' · ' : ''}
          ${item.color ? 'Color: ' + item.color : ''}
        </div>
      </div>
      <div style="text-align:right;flex-shrink:0;">
        <div class="summary-item-price">$${(item.price * (item.qty||1)).toFixed(2)}</div>
        <div class="summary-item-qty">Qty: ${item.qty || 1}</div>
      </div>
    </div>
  `).join('');
}


function updateTotals() {
  const subtotal = cartSubtotal();
  const discount = (subtotal * promoDiscount) / 100;
  const total    = Math.max(0, subtotal - discount + shippingCost);

  setText('subtotalDisplay', `$${subtotal.toFixed(2)}`);
  setText('totalDisplay',    `$${total.toFixed(2)}`);
  setText('shippingDisplay', shippingCost ? `$${shippingCost.toFixed(2)}` : 'Free');

  const discRow = document.getElementById('discountRow');
  if (discRow) {
    discRow.style.display = promoDiscount > 0 ? 'flex' : 'none';
    setText('discountLabel',   promoDiscount);
    setText('discountDisplay', `-$${discount.toFixed(2)}`);
  }
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}


window.applyCheckoutPromo = function () {
  const input = document.getElementById('promoInput');
  const msgEl = document.getElementById('promoMsg');
  if (!input || !msgEl) return;

  const code = input.value.trim().toUpperCase();
  const pct  = PROMO_CODES[code];

  if (!code) {
    msgEl.textContent = 'Please enter a promo code.';
    msgEl.className   = 'promo-msg error';
    return;
  }
  if (!pct) {
    msgEl.textContent = ' Invalid promo code.';
    msgEl.className   = 'promo-msg error';
    promoDiscount     = 0;
    updateTotals();
    return;
  }

  promoDiscount     = pct;
  msgEl.textContent = ` "${code}" applied — ${pct}% off!`;
  msgEl.className   = 'promo-msg success';
  updateTotals();
};

function initPaymentToggle() {
  const radios     = document.querySelectorAll('input[name="payment"]');
  const cardFields = document.getElementById('cardFields');

  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      currentPayment = radio.value;
      document.querySelectorAll('input[name="payment"]').forEach(r => {
        r.closest('.payment-option').classList.remove('selected');
      });
      radio.closest('.payment-option').classList.add('selected');
      if (cardFields) cardFields.classList.toggle('show', currentPayment === 'card');
    });
  });
}


function initShippingToggle() {
  document.querySelectorAll('input[name="shipping"]').forEach(radio => {
    radio.addEventListener('change', () => {
      shippingCost = radio.value === 'express' ? 15 : 0;
      document.querySelectorAll('input[name="shipping"]').forEach(r => {
        r.closest('.payment-option').classList.remove('selected');
      });
      radio.closest('.payment-option').classList.add('selected');
      updateTotals();
    });
  });
}


function initCardFormatting() {
  const numInput    = document.getElementById('cardNumber');
  const expiryInput = document.getElementById('cardExpiry');
  const brandIcon   = document.getElementById('cardBrandIcon');
  if (!numInput) return;

  numInput.addEventListener('input', () => {
    let val = numInput.value.replace(/\D/g,'').slice(0,16);
    numInput.value = val.replace(/(.{4})/g,'$1 ').trim();
    if (brandIcon) {
      if      (/^4/.test(val))       brandIcon.className = 'fab fa-cc-visa card-brand-icon';
      else if (/^5[1-5]/.test(val)) brandIcon.className = 'fab fa-cc-mastercard card-brand-icon';
      else if (/^3[47]/.test(val))  brandIcon.className = 'fab fa-cc-amex card-brand-icon';
      else                           brandIcon.className = 'fas fa-credit-card card-brand-icon';
    }
  });

  if (expiryInput) {
    expiryInput.addEventListener('input', () => {
      let val = expiryInput.value.replace(/\D/g,'').slice(0,4);
      if (val.length >= 3) val = val.slice(0,2) + ' / ' + val.slice(2);
      expiryInput.value = val;
    });
  }
}


function initFieldValidation() {
  ['firstName','lastName','email','phone','address','city','country'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('blur', () => validateField(id));
  });
}

function validateField(id) {
  const el  = document.getElementById(id);
  const key = 'err' + id.charAt(0).toUpperCase() + id.slice(1);
  const err = document.getElementById(key);
  if (!el) return true;

  const val = el.value.trim();
  let valid = !!val;
  let msg   = 'Required';

  if (val && id === 'email' && !/^\S+@\S+\.\S+$/.test(val)) {
    valid = false; msg = 'Enter a valid email';
  }

  el.classList.toggle('error', !valid);
  if (err) { err.textContent = msg; err.classList.toggle('show', !valid); }
  return valid;
}

function validateCard() {
  let ok = true;
  [
    { id:'cardName',   errId:'errCardName',   test: v => v.length > 0,                    msg:'Required' },
    { id:'cardNumber', errId:'errCardNumber', test: v => v.replace(/\s/g,'').length===16, msg:'Enter valid 16-digit number' },
    { id:'cardExpiry', errId:'errCardExpiry', test: v => v.length >= 7,                   msg:'Invalid date' },
    { id:'cardCvv',    errId:'errCardCvv',    test: v => v.length >= 3,                   msg:'Required' },
  ].forEach(({ id, errId, test, msg }) => {
    const el  = document.getElementById(id);
    const err = document.getElementById(errId);
    if (!el) return;
    const valid = test(el.value.trim());
    el.classList.toggle('error', !valid);
    if (err) { err.textContent = msg; err.classList.toggle('show', !valid); }
    if (!valid) ok = false;
  });
  return ok;
}

function validateAll() {
  const fields = ['firstName','lastName','email','phone','address','city','country'];
  const shipOk = fields.every(id => validateField(id));
  const cardOk = currentPayment === 'card' ? validateCard() : true;
  return shipOk && cardOk;
}


window.placeOrder = function () {
  if (!validateAll()) {
    showToast('⚠️ Please fill in all required fields.');
    const firstErr = document.querySelector('input.error, select.error');
    if (firstErr) firstErr.scrollIntoView({ behavior:'smooth', block:'center' });
    return;
  }

  const btn = document.getElementById('placeOrderBtn');
  if (!btn) return;
  btn.disabled  = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing…';

  setTimeout(() => {
    const orderNum = 'SHOP-' + Math.random().toString(36).substr(2,8).toUpperCase();
    setText('orderNumber', orderNum);

    ['step3','step4'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.add('active','done');
      const num = el.querySelector('.step-num');
      if (num) num.innerHTML = '<i class="fas fa-check step-done-icon"></i>';
    });
    ['div2','div3'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('active');
    });

    clearCart();

    const overlay = document.getElementById('successOverlay');
    if (overlay) overlay.classList.add('show');
  }, 1800);
};