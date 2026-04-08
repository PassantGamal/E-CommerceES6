import { getCart, saveCart, updateCartCount, getCartTotal } from '../utils/cart.js';
import { showToast } from '../utils/helpers.js';

updateCartCount();

const promoCodes = {
    'SHOP20': 20,
    'SAVE20': 20,
    'WELCOME': 15,
    'SUMMER10': 10
};

let promoDiscount = 0;
let shippingCost = 0;
let currentPayment = 'card';

function getCartItems() {
    return getCart();
}

function cartSubtotal() {
    return getCartTotal();
}

function clearCart() {
    saveCart([]);
    updateCartCount();
}

function renderSummaryItems() {
    const items = getCartItems();
    const container = document.getElementById('summaryItems');
    
    if (!container) return;
    
    if (items.length === 0) {
        document.getElementById('emptyState').style.display = 'block';
        document.getElementById('checkoutGrid').style.display = 'none';
        return;
    }
    
    container.innerHTML = items.map(item => `
        <div class="summary-item">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'">
            <div class="summary-item-info">
                <div class="summary-item-name">${item.name}</div>
                <div class="summary-item-meta">
                    ${item.size ? 'Size: ' + item.size : ''}
                    ${item.size && item.color ? ' · ' : ''}
                    ${item.color ? 'Color: ' + item.color : ''}
                </div>
            </div>
            <div style="text-align:right">
                <div class="summary-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <div class="summary-item-qty">Qty: ${item.quantity}</div>
            </div>
        </div>
    `).join('');
}

function updateTotals() {
    const subtotal = cartSubtotal();
    const discount = (subtotal * promoDiscount) / 100;
    const total = Math.max(0, subtotal - discount + shippingCost);
    
    document.getElementById('subtotalDisplay').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('totalDisplay').textContent = `$${total.toFixed(2)}`;
    document.getElementById('shippingDisplay').textContent = shippingCost ? `$${shippingCost.toFixed(2)}` : 'Free';
    
    const discountRow = document.getElementById('discountRow');
    if (discountRow) {
        discountRow.style.display = promoDiscount > 0 ? 'flex' : 'none';
        document.getElementById('discountLabel').textContent = promoDiscount;
        document.getElementById('discountDisplay').textContent = `-$${discount.toFixed(2)}`;
    }
}

window.applyCheckoutPromo = function() {
    const input = document.getElementById('promoInput');
    const msgEl = document.getElementById('promoMsg');
    const code = input?.value.trim().toUpperCase();
    
    if (!code) {
        msgEl.textContent = 'Please enter a promo code';
        msgEl.className = 'promo-msg error';
        return;
    }
    
    if (promoCodes[code]) {
        promoDiscount = promoCodes[code];
        msgEl.textContent = `${code} applied — ${promoDiscount}% off!`;
        msgEl.className = 'promo-msg success';
        updateTotals();
    } else {
        msgEl.textContent = 'Invalid promo code';
        msgEl.className = 'promo-msg error';
        promoDiscount = 0;
        updateTotals();
    }
};

function initPaymentToggle() {
    const radios = document.querySelectorAll('input[name="payment"]');
    const cardFields = document.getElementById('cardFields');
    
    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            currentPayment = radio.value;
            document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
            radio.closest('.payment-option').classList.add('selected');
            if (cardFields) {
                cardFields.classList.toggle('show', currentPayment === 'card');
            }
        });
    });
}

function initShippingToggle() {
    const radios = document.querySelectorAll('input[name="shipping"]');
    
    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            shippingCost = radio.value === 'express' ? 15 : 0;
            document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
            radio.closest('.payment-option').classList.add('selected');
            updateTotals();
        });
    });
}

function initCardFormatting() {
    const cardNumber = document.getElementById('cardNumber');
    const cardExpiry = document.getElementById('cardExpiry');
    
    if (cardNumber) {
        cardNumber.addEventListener('input', () => {
            let value = cardNumber.value.replace(/\D/g, '').slice(0, 16);
            cardNumber.value = value.replace(/(.{4})/g, '$1 ').trim();
        });
    }
    
    if (cardExpiry) {
        cardExpiry.addEventListener('input', () => {
            let value = cardExpiry.value.replace(/\D/g, '').slice(0, 4);
            if (value.length >= 3) {
                value = value.slice(0, 2) + ' / ' + value.slice(2);
            }
            cardExpiry.value = value;
        });
    }
}

function validateField(id) {
    const input = document.getElementById(id);
    const errorSpan = document.getElementById(`err${id.charAt(0).toUpperCase() + id.slice(1)}`);
    
    if (!input) return true;
    
    const value = input.value.trim();
    let isValid = true;
    let errorMsg = 'Required';
    
    if (!value) {
        isValid = false;
    } else if (id === 'email' && !/^\S+@\S+\.\S+$/.test(value)) {
        isValid = false;
        errorMsg = 'Enter a valid email';
    }
    
    input.classList.toggle('error', !isValid);
    if (errorSpan) {
        errorSpan.textContent = errorMsg;
        errorSpan.classList.toggle('show', !isValid);
    }
    
    return isValid;
}

function validateCard() {
    if (currentPayment !== 'card') return true;
    
    let isValid = true;
    
    const cardName = document.getElementById('cardName');
    const cardNumber = document.getElementById('cardNumber');
    const cardExpiry = document.getElementById('cardExpiry');
    const cardCvv = document.getElementById('cardCvv');
    
    if (!cardName.value.trim()) {
        cardName.classList.add('error');
        document.getElementById('errCardName')?.classList.add('show');
        isValid = false;
    } else {
        cardName.classList.remove('error');
        document.getElementById('errCardName')?.classList.remove('show');
    }
    
    const numberClean = cardNumber.value.replace(/\s/g, '');
    if (numberClean.length !== 16) {
        cardNumber.classList.add('error');
        document.getElementById('errCardNumber')?.classList.add('show');
        isValid = false;
    } else {
        cardNumber.classList.remove('error');
        document.getElementById('errCardNumber')?.classList.remove('show');
    }
    
    if (cardExpiry.value.replace(/\D/g, '').length !== 4) {
        cardExpiry.classList.add('error');
        document.getElementById('errCardExpiry')?.classList.add('show');
        isValid = false;
    } else {
        cardExpiry.classList.remove('error');
        document.getElementById('errCardExpiry')?.classList.remove('show');
    }
    
    if (!cardCvv.value.trim() || cardCvv.value.length < 3) {
        cardCvv.classList.add('error');
        document.getElementById('errCardCvv')?.classList.add('show');
        isValid = false;
    } else {
        cardCvv.classList.remove('error');
        document.getElementById('errCardCvv')?.classList.remove('show');
    }
    
    return isValid;
}

function validateAll() {
    const fields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'country'];
    const shippingValid = fields.every(id => validateField(id));
    const cardValid = validateCard();
    return shippingValid && cardValid;
}

window.placeOrder = function() {
    if (!validateAll()) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    const btn = document.getElementById('placeOrderBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing…';
    
    setTimeout(() => {
        const orderNumber = 'SHOP-' + Math.random().toString(36).substr(2, 8).toUpperCase();
        document.getElementById('orderNumber').textContent = orderNumber;
        
        document.getElementById('step3').classList.add('active', 'done');
        document.getElementById('step4').classList.add('active', 'done');
        document.getElementById('div2').classList.add('active');
        document.getElementById('div3').classList.add('active');
        
        document.querySelector('#step3 .step-num').innerHTML = '<i class="fas fa-check step-done-icon"></i>';
        document.querySelector('#step4 .step-num').innerHTML = '<i class="fas fa-check step-done-icon"></i>';
        
        clearCart();
        document.getElementById('successOverlay').classList.add('show');
        
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-lock"></i> Place Order';
    }, 1500);
};

document.addEventListener('DOMContentLoaded', () => {
    const items = getCartItems();
    
    if (items.length === 0) {
        document.getElementById('emptyState').style.display = 'block';
        document.getElementById('checkoutGrid').style.display = 'none';
        return;
    }
    
    renderSummaryItems();
    updateTotals();
    initPaymentToggle();
    initShippingToggle();
    initCardFormatting();
    
    const fields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'country'];
    fields.forEach(id => {
        document.getElementById(id)?.addEventListener('blur', () => validateField(id));
    });
});