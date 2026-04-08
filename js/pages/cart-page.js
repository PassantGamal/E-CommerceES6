import { getCart, saveCart, removeFromCart, updateQuantity, updateCartCount, getCartTotal } from '../utils/cart.js';
import { renderNavbar, renderFooter } from '../utils/render.js';
import { showToast, initSearch, initHamburger } from '../utils/helpers.js';

renderNavbar();
renderFooter();
updateCartCount();
initSearch();
initHamburger();

const promoCodes = {
    'SHOP20': 20,
    'SAVE20': 20,
    'WELCOME': 15,
    'SUMMER10': 10
};

let appliedDiscount = 0;

function renderCart() {
    const container = document.getElementById('cartItemsCol');
    const cart = getCart();
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:80px 20px;">
                <i class="fas fa-shopping-cart" style="font-size:64px;color:#d9d9d9;"></i>
                <h2 style="font-size:24px;margin:20px 0 12px;">Your cart is empty</h2>
                <p style="color:#9b9b9b;margin-bottom:28px;">Looks like you haven't added anything yet.</p>
                <a href="category.html" class="btn-primary" style="display:inline-block;">Shop Now</a>
            </div>
        `;
        renderSummary();
        return;
    }
    
    container.innerHTML = `
        <div class="cart-items-box">
            ${cart.map((item, index) => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='images/placeholder.jpg'">
                    <div class="cart-item-info">
                        <div class="cart-item-top">
                            <span class="cart-item-name">${item.name}</span>
                            <button class="cart-item-delete" onclick="window.removeItem(${index})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        <div class="cart-item-meta">
                            ${item.size ? `Size: ${item.size}` : ''}
                            ${item.size && item.color ? ' | ' : ''}
                            ${item.color ? `Color: ${item.color}` : ''}
                        </div>
                        <div class="cart-item-bottom">
                            <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                            <div class="cart-item-qty">
                                <button class="qty-btn" onclick="window.changeQty(${index}, -1)">−</button>
                                <span class="qty-val">${item.quantity}</span>
                                <button class="qty-btn" onclick="window.changeQty(${index}, 1)">+</button>
                            </div>
                        </div>
                    </div>
                </div>
                ${index < cart.length - 1 ? '<div class="cart-divider"></div>' : ''}
            `).join('')}
        </div>
    `;
    
    renderSummary();
}

function renderSummary() {
    const cart = getCart();
    const subtotal = getCartTotal();
    const discount = (subtotal * appliedDiscount) / 100;
    const delivery = subtotal > 0 ? 15 : 0;
    const total = subtotal - discount + delivery;
    
    document.getElementById('summarySubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('summaryDiscount').textContent = appliedDiscount ? `-$${discount.toFixed(2)}` : '-$0.00';
    document.getElementById('summaryDelivery').textContent = delivery ? `$${delivery.toFixed(2)}` : 'Free';
    document.getElementById('summaryTotal').textContent = `$${total.toFixed(2)}`;
}

window.removeItem = function(index) {
    removeFromCart(index);
    renderCart();
};

window.changeQty = function(index, delta) {
    const cart = getCart();
    const newQty = (cart[index]?.quantity || 1) + delta;
    if (newQty >= 1) {
        updateQuantity(index, newQty);
        renderCart();
    }
};

window.applyPromo = function() {
    const input = document.getElementById('promoInput');
    const code = input?.value.trim().toUpperCase();
    
    if (!code) {
        showToast('Please enter a promo code', 'error');
        return;
    }
    
    if (promoCodes[code]) {
        appliedDiscount = promoCodes[code];
        showToast(`${code} applied! ${appliedDiscount}% off`);
        renderSummary();
    } else {
        showToast('Invalid promo code', 'error');
    }
};

document.getElementById('btnPromo')?.addEventListener('click', window.applyPromo);
document.getElementById('promoInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') window.applyPromo();
});

renderCart();