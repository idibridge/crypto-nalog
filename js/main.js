// КриптоСдача - shared interactivity

document.addEventListener('DOMContentLoaded', () => {

  // ---- Mobile menu toggle ----
  const menuBtn = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    // close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- FAQ accordion ----
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    if (q) {
      q.addEventListener('click', () => {
        const wasOpen = item.classList.contains('open');
        // Close all others
        document.querySelectorAll('.faq-item.open').forEach(other => {
          if (other !== item) other.classList.remove('open');
        });
        item.classList.toggle('open', !wasOpen);
      });
    }
  });

  // ---- Tax calculator ----
  const calcForm = document.querySelector('[data-calculator]');
  if (calcForm) {
    const buyPrice = calcForm.querySelector('[data-buy]');
    const sellPrice = calcForm.querySelector('[data-sell]');
    const status = calcForm.querySelector('[data-status]');
    const taxOut = calcForm.querySelector('[data-tax]');
    const profitOut = calcForm.querySelector('[data-profit]');
    const rateOut = calcForm.querySelector('[data-rate]');
    const baseOut = calcForm.querySelector('[data-base]');

    const formatRub = (n) => {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 0
      }).format(n);
    };

    // Russian progressive scale (НДФЛ 2025+) for residents.
    // Brackets in RUB: 13% to 2.4M, 15% to 5M, 18% to 20M, 20% to 50M, 22% above
    const calcProgressive = (base) => {
      if (base <= 0) return { tax: 0, effective: 0 };
      const brackets = [
        { limit: 2_400_000, rate: 0.13 },
        { limit: 5_000_000, rate: 0.15 },
        { limit: 20_000_000, rate: 0.18 },
        { limit: 50_000_000, rate: 0.20 },
        { limit: Infinity, rate: 0.22 }
      ];
      let tax = 0;
      let prev = 0;
      for (const b of brackets) {
        if (base > b.limit) {
          tax += (b.limit - prev) * b.rate;
          prev = b.limit;
        } else {
          tax += (base - prev) * b.rate;
          return { tax, effective: tax / base };
        }
      }
      return { tax, effective: tax / base };
    };

    const update = () => {
      const buy = parseFloat(buyPrice.value) || 0;
      const sell = parseFloat(sellPrice.value) || 0;
      const profit = Math.max(0, sell - buy);
      let tax = 0, rateLabel = '—';

      if (status.value === 'resident') {
        const { tax: t, effective } = calcProgressive(profit);
        tax = t;
        rateLabel = profit > 0
          ? `${(effective * 100).toFixed(2)}% (прогрессивная)`
          : '13–22%';
      } else if (status.value === 'nonresident') {
        tax = profit * 0.30;
        rateLabel = '30%';
      } else if (status.value === 'ip-usn') {
        tax = profit * 0.06;
        rateLabel = '6% УСН Доходы';
      } else if (status.value === 'ooo-osn') {
        tax = profit * 0.25;
        rateLabel = '25% налог на прибыль';
      }

      taxOut.textContent = formatRub(tax);
      profitOut.textContent = formatRub(profit);
      baseOut.textContent = formatRub(profit);
      rateOut.textContent = rateLabel;
    };

    [buyPrice, sellPrice, status].forEach(el => {
      el.addEventListener('input', update);
      el.addEventListener('change', update);
    });
    update();
  }

  // ---- Sticky header shadow on scroll ----
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = () => {
      header.style.boxShadow = window.scrollY > 8
        ? '0 1px 0 rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)'
        : 'none';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---- Reveal on scroll (IntersectionObserver) ----
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('rise');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
  }
});
