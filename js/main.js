// ===== ハンバーガーメニュー =====
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  nav.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    nav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// ===== Intersection Observer 共通設定 =====
const ioOpts = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };

// アニメーション②：セクションタイトル（横棒 → 英語 → 日本語）
const titleObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      titleObserver.unobserve(entry.target);
    }
  });
}, ioOpts);

document.querySelectorAll('.js-section-title').forEach(el => {
  titleObserver.observe(el);
});

// アニメーション③：コンテンツフェードイン（下から上）
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // グリッド内の兄弟要素は少しずつずらす
      const delay = entry.target.closest('.works__grid')
        ? Array.from(entry.target.parentNode.children).indexOf(entry.target) * 80
        : 0;
      setTimeout(() => {
        entry.target.classList.add('active');
      }, delay);
      fadeObserver.unobserve(entry.target);
    }
  });
}, ioOpts);

document.querySelectorAll('.fade-up').forEach(el => {
  fadeObserver.observe(el);
});

// アニメーション①：波線（stroke-dashoffset → 0）
const waveObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.wave-line, .wave-line2').forEach(path => {
        path.classList.add('active');
      });
      waveObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.js-wave').forEach(el => {
  waveObserver.observe(el);
});

// ===== Works フィルター（All / Web / Banner）=====
const filterBtns = document.querySelectorAll('.works__filter-btn');
const workItems = document.querySelectorAll('.works__item');

const worksGrid = document.getElementById('works-grid');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    if (worksGrid) {
      worksGrid.classList.toggle('works__grid--banner', filter === 'banner');
    }

    workItems.forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('hidden', !match);
    });
  });
});

// ===== トップへ戻るボタン =====
const pageTop = document.getElementById('page-top');
if (pageTop) {
  window.addEventListener('scroll', () => {
    pageTop.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });
  pageTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== ヘッダー：ヒーロー通過後に .scrolled クラスで白背景を付与 =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  const heroH = document.querySelector('.hero')?.offsetHeight ?? window.innerHeight;
  header.classList.toggle('scrolled', window.scrollY > heroH - 80);
}, { passive: true });


// ===== BANNER MODAL =====
(function () {
  const modal = document.getElementById('banner-modal');
  const modalImg = document.getElementById('modal-img');
  const modalCaption = document.getElementById('modal-caption');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');

  if (!modal) return;

  // バナーアイテムの画像をクリックでモーダル表示
  const bannerItems = document.querySelectorAll('.works__item[data-category="banner"]');

  bannerItems.forEach(function (item) {
    const img = item.querySelector('.works__item-img img');
    const title = item.querySelector('.works__item-title');

    if (!img) return;

    item.querySelector('.works__item-img').addEventListener('click', function () {
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      modalCaption.textContent = title ? title.textContent : '';
      openModal();
    });
  });

  function openModal() {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  modalOverlay.addEventListener('click', closeModal);
  modalClose.addEventListener('click', closeModal);

  // ESCキーで閉じる
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
})();

