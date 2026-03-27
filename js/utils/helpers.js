export const renderStars = (rating) =>
  Array.from({ length: 5 }, (_, i) => {
    if (i < Math.floor(rating)) return `<i class="fas fa-star"></i>`;
    if (i < rating)             return `<i class="fas fa-star-half-alt"></i>`;
    return                             `<i class="far fa-star"></i>`;
  }).join('');


export const showToast = (message) => {
  document.querySelector('.toast')?.remove();

  const toast = Object.assign(document.createElement('div'), {
    className:   'toast',
    textContent: message
  });
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
};


export const initSearch = () => {
  document.querySelectorAll('.search-input').forEach(input => {
    input.addEventListener('keydown', ({ key }) => {
      if (key !== 'Enter') return;
      const q = input.value.trim();
      if (q) location.href = `category.html?q=${encodeURIComponent(q)}`;
    });
  });
};



export const initHamburger = () => {
  const btn     = document.getElementById('hamburger');
  const navList = document.querySelector('.nav-links');
  if (!btn || !navList) return;

 
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  const close = () => {
    navList.classList.remove('open');
    overlay.classList.remove('open');
    btn.innerHTML = '<i class="fas fa-bars"></i>';
  };

  btn.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('open');
    overlay.classList.toggle('open', isOpen);
    btn.innerHTML = isOpen
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
  });

  overlay.addEventListener('click', close);
};


let _scrollInterval = null;
let _scrollDelay    = null;

const _getCardWidth = () => {
  const grid = document.getElementById('testimonialsGrid');
  const card = grid?.querySelector('.testimonial-card');
  return card ? card.offsetWidth + 20 : 400;
};

const _move = (dir, amount) => {
  const grid = document.getElementById('testimonialsGrid');
  if (!grid) return;
  const atEnd   = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 5;
  const atStart = grid.scrollLeft <= 5;

  if      (dir > 0 && atEnd)   grid.scrollTo({ left: 0,                behavior: 'smooth' });
  else if (dir < 0 && atStart) grid.scrollTo({ left: grid.scrollWidth, behavior: 'smooth' });
  else                         grid.scrollBy({ left: dir * amount,      behavior: 'smooth' });
};

export const scrollTestimonials = (dir) => _move(dir, _getCardWidth());

export const startScroll = (dir) => {
  _move(dir, _getCardWidth());
  _scrollDelay = setTimeout(() => {
    _scrollInterval = setInterval(() => _move(dir, 8), 20);
  }, 300);
};

export const stopScroll = () => {
  clearTimeout(_scrollDelay);
  clearInterval(_scrollInterval);
  _scrollDelay = _scrollInterval = null;
};



export const initCounters = () => {
  const els     = document.querySelectorAll('.stat-num');
  const targets = [200, 2000, 30000];
  if (!els.length) return;

  const animate = (el, target) => {
    const step = target / (2000 / 16);
    let val = 0;
    const tick = () => {
      val += step;
      if (val >= target) { el.textContent = target.toLocaleString() + '+'; return; }
      el.textContent = Math.floor(val).toLocaleString() + '+';
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  new IntersectionObserver((entries, obs) => {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    els.forEach((el, i) => setTimeout(() => animate(el, targets[i]), i * 200));
  }, { threshold: 0.4 }).observe(els[0].closest('.hero-stats') ?? els[0]);
};


export const setActiveNav = () => {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === page);
  });
};