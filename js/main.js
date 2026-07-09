/* ============================================================
   MAYGEN — Script compartido (navegación, animaciones, catálogo)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  setYear();
  markActiveNav();
  initMobileMenu();
  initHeaderScroll();
  initReveal();
  initBackToTop();
  initContactForm();
});

function setYear() {
  var el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

function markActiveNav() {
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

function initMobileMenu() {
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.mobile-menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', function () {
    menu.classList.toggle('open');
  });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { menu.classList.remove('open'); });
  });
}

function initHeaderScroll() {
  var header = document.querySelector('header');
  if (!header) return;
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 12);
  });
}

function initReveal() {
  var items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12 });
  items.forEach(function (el) { obs.observe(el); });
}

function initBackToTop() {
  var btn = document.querySelector('.back-top');
  if (!btn) return;
  window.addEventListener('scroll', function () {
    btn.classList.toggle('show', window.scrollY > 420);
  });
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function showToast(msg) {
  var toast = document.querySelector('.toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(function () { toast.classList.remove('show'); }, 3200);
}

function initContactForm() {
  var form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.querySelector('[name="nombre"]').value.trim();
    var email = form.querySelector('[name="correo"]').value.trim();
    var phone = form.querySelector('[name="telefono"]').value.trim();
    var company = form.querySelector('[name="empresa"]').value.trim();
    var message = form.querySelector('[name="mensaje"]').value.trim();

    if (!name || !email || !message) {
      showToast('Por favor completa nombre, correo y mensaje.');
      return;
    }

    var body = 'Nombre: ' + name + '%0D%0ACorreo: ' + email +
      '%0D%0ATeléfono: ' + phone + '%0D%0AEmpresa: ' + company +
      '%0D%0A%0D%0AMensaje:%0D%0A' + encodeURIComponent(message);
    var subject = encodeURIComponent('Solicitud de cotización — ' + name);
    window.location.href = 'mailto:info@maygenhn.com?subject=' + subject + '&body=' + body;
    showToast('Abriendo tu cliente de correo para enviar el mensaje…');
  });
}

/* ---------------------------------------------------------------
   Catálogo de productos: render + filtro + búsqueda
   products = [{ name, cat, catLabel, img, size, best }]
   --------------------------------------------------------------- */
function productCard(p) {
  var wa = 'https://wa.me/50494398387?text=' +
    encodeURIComponent('Hola Maygen, quiero cotizar: ' + p.name + (p.size ? (' (' + p.size + ')') : ''));
  return '' +
    '<article class="prod-card reveal" data-cat="' + p.cat + '" data-name="' + p.name.toLowerCase() + '">' +
      (p.best ? '<span class="prod-badge">Más vendido</span>' : '') +
      '<div class="prod-media"><img src="' + p.img + '" alt="' + p.name + '" loading="lazy"></div>' +
      '<div class="prod-body">' +
        '<span class="prod-cat">' + p.catLabel + '</span>' +
        '<h3>' + p.name + '</h3>' +
        (p.size ? '<span class="prod-size">Presentación: ' + p.size + '</span>' : '') +
        '<div class="prod-foot">' +
          '<a href="contacto.html?producto=' + encodeURIComponent(p.name) + '" class="prod-quote">Cotizar</a>' +
          '<a href="' + wa + '" target="_blank" rel="noopener" class="prod-wa">WhatsApp</a>' +
        '</div>' +
      '</div>' +
    '</article>';
}

function renderProducts(list, gridEl) {
  gridEl.innerHTML = list.map(productCard).join('');
  initReveal();
}

function initCatalog(products) {
  var grid = document.getElementById('catalogGrid');
  if (!grid) return;
  var searchInput = document.getElementById('catalogSearch');
  var filterBtns = document.querySelectorAll('.filter-btn');
  var countEl = document.getElementById('catalogCount');
  var emptyEl = document.getElementById('catalogEmpty');
  var currentFilter = 'todos';

  function apply() {
    var term = (searchInput ? searchInput.value : '').toLowerCase().trim();
    var list = products.filter(function (p) {
      var matchCat = currentFilter === 'todos' || p.cat === currentFilter;
      var matchTerm = !term || p.name.toLowerCase().indexOf(term) !== -1;
      return matchCat && matchTerm;
    });
    renderProducts(list, grid);
    if (countEl) countEl.textContent = list.length + ' producto' + (list.length === 1 ? '' : 's') + ' encontrados';
    if (emptyEl) emptyEl.style.display = list.length ? 'none' : 'block';
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      apply();
    });
  });

  if (searchInput) searchInput.addEventListener('input', apply);

  apply();
}

function initBestsellers(products) {
  var grid = document.getElementById('bestsellerGrid');
  if (!grid) return;
  var best = products.filter(function (p) { return p.best; });
  renderProducts(best, grid);
}
