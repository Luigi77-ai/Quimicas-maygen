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

/* ---------------------------------------------------------------
   Catálogo de productos Maygen (datos compartidos)
   --------------------------------------------------------------- */
var MAYGEN_PRODUCTS = [
  {
    "name": "GlaFresh Explosión Alegre",
    "cat": "ambientadores",
    "catLabel": "Ambientadores",
    "size": null,
    "img": "GlaFresh_Explosin Alegra.png",
    "best": false
  },
  {
    "name": "Jabón para Cristalería",
    "cat": "jabones",
    "catLabel": "Jabones y Manos",
    "size": "900 mL",
    "img": "Jabon Cristaleria 900 mL.png",
    "best": false
  },
  {
    "name": "Desinfectante Flores Exóticas",
    "cat": "desinfectantes",
    "catLabel": "Desinfectantes",
    "size": "900 mL",
    "img": "d flores exoticas 900 mL.png",
    "best": false
  },
  {
    "name": "Desinfectante Fruit Sensation",
    "cat": "desinfectantes",
    "catLabel": "Desinfectantes",
    "size": "450 mL",
    "img": "d fruit sensation 450 mL.png",
    "best": false
  },
  {
    "name": "Desinfectante Maderas Mágicas",
    "cat": "desinfectantes",
    "catLabel": "Desinfectantes",
    "size": "450 mL",
    "img": "d maderas magicas 450 mL.png",
    "best": false
  },
  {
    "name": "Silicón para Tablero",
    "cat": "carwash",
    "catLabel": "Car Wash",
    "size": "900 mL",
    "img": "silicon para tablero 900 mL.png",
    "best": false
  },
  {
    "name": "Alcohol Clínico",
    "cat": "desinfectantes",
    "catLabel": "Desinfectantes",
    "size": "60 mL",
    "img": "images/Alcohol Clínico 60 mL.png",
    "best": false
  },
  {
    "name": "Alcohol Etílico",
    "cat": "desinfectantes",
    "catLabel": "Desinfectantes",
    "size": "1 L",
    "img": "images/Alcohol etilico 1 L.png",
    "best": false
  },
  {
    "name": "Gla Clean Naranja",
    "cat": "limpieza",
    "catLabel": "Limpieza Profesional",
    "size": null,
    "img": "images/Gla Clean Naranja.png",
    "best": false
  },
  {
    "name": "Gla Jabón Trigo y Miel",
    "cat": "jabones",
    "catLabel": "Jabones y Manos",
    "size": null,
    "img": "images/Gla Jabón Trigo Miel.png",
    "best": false
  },
  {
    "name": "Gla Solution",
    "cat": "ambientadores",
    "catLabel": "Ambientadores",
    "size": "240 mL",
    "img": "images/Gla Solution 240 mL.png",
    "best": false
  },
  {
    "name": "Gla Solution",
    "cat": "ambientadores",
    "catLabel": "Ambientadores",
    "size": "900 mL",
    "img": "images/Gla Solution 900 mL.png",
    "best": true
  },
  {
    "name": "GlaFresh Brisa Marina",
    "cat": "ambientadores",
    "catLabel": "Ambientadores",
    "size": null,
    "img": "images/GlaFresh_BrisaMarina.png",
    "best": false
  },
  {
    "name": "GlaFresh Cereza Madura",
    "cat": "ambientadores",
    "catLabel": "Ambientadores",
    "size": null,
    "img": "images/GlaFresh_CerezaMadura.png",
    "best": false
  },
  {
    "name": "GlaFresh Corporativo",
    "cat": "ambientadores",
    "catLabel": "Ambientadores",
    "size": null,
    "img": "images/GlaFresh_Corporativo.png",
    "best": false
  },
  {
    "name": "GlaFresh Fruit Sensation",
    "cat": "ambientadores",
    "catLabel": "Ambientadores",
    "size": null,
    "img": "images/GlaFresh_FruitSensation.png",
    "best": false
  },
  {
    "name": "GlaFresh Lavanda",
    "cat": "ambientadores",
    "catLabel": "Ambientadores",
    "size": null,
    "img": "images/GlaFresh_Lavanda.png",
    "best": true
  },
  {
    "name": "Mágico Jabón Cherry",
    "cat": "jabones",
    "catLabel": "Jabones y Manos",
    "size": "450 mL",
    "img": "images/Magico Jabon Cherry 450 mL.png",
    "best": false
  },
  {
    "name": "Maxi Kill Insecticida",
    "cat": "otros",
    "catLabel": "Otros",
    "size": "240 mL",
    "img": "images/Maxi Kill 240 mL.png",
    "best": false
  },
  {
    "name": "Ospho Blanco",
    "cat": "industriales",
    "catLabel": "Industriales",
    "size": "1 L",
    "img": "images/Ospho Blanco 1 L.png",
    "best": true
  },
  {
    "name": "Sanitizante en Spray",
    "cat": "desinfectantes",
    "catLabel": "Desinfectantes",
    "size": "1 Galón",
    "img": "images/Sanitizante en Spray 1 g.png",
    "best": false
  },
  {
    "name": "Sanitizante en Spray",
    "cat": "desinfectantes",
    "catLabel": "Desinfectantes",
    "size": "300 mL",
    "img": "images/Sanitizante en Spray 300 mL.png",
    "best": false
  },
  {
    "name": "Sanitizante en Spray",
    "cat": "desinfectantes",
    "catLabel": "Desinfectantes",
    "size": "330 mL",
    "img": "images/Sanitizante en Spray 330 mL.png",
    "best": false
  },
  {
    "name": "Sanitizante en Spray",
    "cat": "desinfectantes",
    "catLabel": "Desinfectantes",
    "size": "450 mL",
    "img": "images/Sanitizante en Spray 450 mL.png",
    "best": true
  },
  {
    "name": "Sanitizante en Spray",
    "cat": "desinfectantes",
    "catLabel": "Desinfectantes",
    "size": "60 mL",
    "img": "images/Sanitizante en Spray 60 mL.png",
    "best": false
  },
  {
    "name": "Sauvel Mañana Primaveral",
    "cat": "ambientadores",
    "catLabel": "Ambientadores",
    "size": null,
    "img": "images/Sauvel Mañana Primaveral.png",
    "best": false
  },
  {
    "name": "Silicón para Tablero",
    "cat": "carwash",
    "catLabel": "Car Wash",
    "size": null,
    "img": "images/Silicon para tablero.png",
    "best": false
  },
  {
    "name": "Yuyo Action",
    "cat": "otros",
    "catLabel": "Otros",
    "size": "1 Galón",
    "img": "images/Yuyo Action bote 1 G.png",
    "best": false
  },
  {
    "name": "Ácido Acético",
    "cat": "industriales",
    "catLabel": "Industriales",
    "size": "1 Galón",
    "img": "images/acido acetico 1 g.png",
    "best": false
  },
  {
    "name": "Alcohol Clínico",
    "cat": "desinfectantes",
    "catLabel": "Desinfectantes",
    "size": "240 mL",
    "img": "images/alcohol clinico 240 mL.png",
    "best": false
  },
  {
    "name": "Alcohol Clínico",
    "cat": "desinfectantes",
    "catLabel": "Desinfectantes",
    "size": "900 mL",
    "img": "images/alcohol clinico 900 mL.png",
    "best": false
  },
  {
    "name": "Alcohol Etílico 70%",
    "cat": "desinfectantes",
    "catLabel": "Desinfectantes",
    "size": "100 mL",
    "img": "images/alcohol etilico 70% 100 mL.png",
    "best": false
  },
  {
    "name": "Alcohol Etílico 70%",
    "cat": "desinfectantes",
    "catLabel": "Desinfectantes",
    "size": "240 mL",
    "img": "images/alcohol etilico 70% 240 mL.png",
    "best": false
  },
  {
    "name": "Alcohol Etílico 70%",
    "cat": "desinfectantes",
    "catLabel": "Desinfectantes",
    "size": "900 mL",
    "img": "images/alcohol etilico 70% 900 mL.png",
    "best": true
  },
  {
    "name": "Alcohol Isopropílico",
    "cat": "desinfectantes",
    "catLabel": "Desinfectantes",
    "size": "900 mL",
    "img": "images/alcohol isopropilico 900 mL.png",
    "best": false
  },
  {
    "name": "Blanqueador de Sanitario",
    "cat": "limpieza",
    "catLabel": "Limpieza Profesional",
    "size": "1 L",
    "img": "images/blanqueador de sanitario 1 L.png",
    "best": false
  },
  {
    "name": "Cloro 10",
    "cat": "limpieza",
    "catLabel": "Limpieza Profesional",
    "size": "1000 mL",
    "img": "images/cloro 10 1000 mL.png",
    "best": true
  },
  {
    "name": "Cloro 3",
    "cat": "limpieza",
    "catLabel": "Limpieza Profesional",
    "size": "1 Galón",
    "img": "images/cloro 3 1g redondo.png",
    "best": false
  },
  {
    "name": "Cloro Económico",
    "cat": "limpieza",
    "catLabel": "Limpieza Profesional",
    "size": "1 Galón",
    "img": "images/cloro economico 1g.png",
    "best": false
  },
  {
    "name": "Desinfectante Brisa Marina",
    "cat": "desinfectantes",
    "catLabel": "Desinfectantes",
    "size": "900 mL",
    "img": "images/d brisa marina 900 mL.png",
    "best": false
  },
  {
    "name": "Desinfectante Corporativo",
    "cat": "desinfectantes",
    "catLabel": "Desinfectantes",
    "size": "1 Galón",
    "img": "images/d corporativo 1 g.png",
    "best": false
  },
  {
    "name": "Desinfectante Fabuloso",
    "cat": "desinfectantes",
    "catLabel": "Desinfectantes",
    "size": "900 mL",
    "img": "images/d fabuloso 900 mL.png",
    "best": false
  },
  {
    "name": "Desinfectante Manzana Verde",
    "cat": "desinfectantes",
    "catLabel": "Desinfectantes",
    "size": "450 mL",
    "img": "images/d manzana verde 450 mL.png",
    "best": false
  },
  {
    "name": "Jabón Cherry con Tapa",
    "cat": "jabones",
    "catLabel": "Jabones y Manos",
    "size": "330 mL",
    "img": "images/jabon cherry 330 mL cap.png",
    "best": false
  },
  {
    "name": "Jabón Cherry",
    "cat": "jabones",
    "catLabel": "Jabones y Manos",
    "size": "330 mL",
    "img": "images/jabon cherry 330 mL.png",
    "best": false
  },
  {
    "name": "Jabón Cherry",
    "cat": "jabones",
    "catLabel": "Jabones y Manos",
    "size": "480 mL",
    "img": "images/jabon cherry 480 mL.png",
    "best": true
  },
  {
    "name": "Jabón Industrial",
    "cat": "jabones",
    "catLabel": "Jabones y Manos",
    "size": "1000 mL",
    "img": "images/jabon industrial 1000 mL.png",
    "best": false
  },
  {
    "name": "Limpio Klin Canela",
    "cat": "limpieza",
    "catLabel": "Limpieza Profesional",
    "size": "1 Galón",
    "img": "images/limpio klin canela 1 G.png",
    "best": false
  },
  {
    "name": "Limpio Klin Floral",
    "cat": "limpieza",
    "catLabel": "Limpieza Profesional",
    "size": "1 Galón",
    "img": "images/limpio klin floral 1 G.png",
    "best": false
  },
  {
    "name": "Limpio Klin Fresas",
    "cat": "limpieza",
    "catLabel": "Limpieza Profesional",
    "size": "1 Galón",
    "img": "images/limpio klin fresas 1 G.png",
    "best": false
  },
  {
    "name": "Limpio Klin Lavanda",
    "cat": "limpieza",
    "catLabel": "Limpieza Profesional",
    "size": "1 Galón",
    "img": "images/limpio klin lavanda 1 G.png",
    "best": false
  },
  {
    "name": "Limpio Klin Limón",
    "cat": "limpieza",
    "catLabel": "Limpieza Profesional",
    "size": "1 Galón",
    "img": "images/limpio klin limon 1 G.png",
    "best": false
  },
  {
    "name": "Ospho Blanco",
    "cat": "industriales",
    "catLabel": "Industriales",
    "size": "1 Galón",
    "img": "images/ospho blanco 1 G.png",
    "best": false
  },
  {
    "name": "Ospho Comercial",
    "cat": "industriales",
    "catLabel": "Industriales",
    "size": "1 Galón",
    "img": "images/ospho comercial 1 g.png",
    "best": false
  },
  {
    "name": "Ospho Especial",
    "cat": "industriales",
    "catLabel": "Industriales",
    "size": "1 Galón",
    "img": "images/ospho especial 1 g.png",
    "best": false
  },
  {
    "name": "Sanitizante en Spray",
    "cat": "desinfectantes",
    "catLabel": "Desinfectantes",
    "size": "240 mL",
    "img": "images/sanitizante en spray 240 mL.png",
    "best": false
  },
  {
    "name": "Sanitizante Spray Scott",
    "cat": "desinfectantes",
    "catLabel": "Desinfectantes",
    "size": null,
    "img": "images/sanitizante en spry scott.png",
    "best": false
  },
  {
    "name": "Sanitizante en Gel",
    "cat": "desinfectantes",
    "catLabel": "Desinfectantes",
    "size": "1000 mL",
    "img": "images/sanitizante gel 1000 mL.png",
    "best": false
  },
  {
    "name": "Sanitizante en Gel",
    "cat": "desinfectantes",
    "catLabel": "Desinfectantes",
    "size": "480 mL",
    "img": "images/sanitizante gel 480 mL.png",
    "best": false
  },
  {
    "name": "Sanitizante en Gel",
    "cat": "desinfectantes",
    "catLabel": "Desinfectantes",
    "size": "60 mL",
    "img": "images/sanitizante gel 60 mL.png",
    "best": false
  },
  {
    "name": "Shampoo para Carro",
    "cat": "carwash",
    "catLabel": "Car Wash",
    "size": "1 Galón",
    "img": "images/shampoo para carro 1 g.png",
    "best": false
  },
  {
    "name": "Shampoo para Carro",
    "cat": "carwash",
    "catLabel": "Car Wash",
    "size": "900 mL",
    "img": "images/shampoo para carro 900 mL.png",
    "best": false
  },
  {
    "name": "Suavel Amarillo",
    "cat": "carwash",
    "catLabel": "Car Wash",
    "size": "1 Galón",
    "img": "images/suavel amarillo 1 g.png",
    "best": false
  },
  {
    "name": "Suavel Amarillo",
    "cat": "carwash",
    "catLabel": "Car Wash",
    "size": "900 mL",
    "img": "images/suavel amarillo 900 mL.png",
    "best": false
  },
  {
    "name": "Suavel Azul",
    "cat": "carwash",
    "catLabel": "Car Wash",
    "size": "5 Galones",
    "img": "images/suavel azul 5 g.png",
    "best": false
  },
  {
    "name": "Suavel Azul",
    "cat": "carwash",
    "catLabel": "Car Wash",
    "size": "900 mL",
    "img": "images/suavel azul 900 mL.png",
    "best": true
  },
  {
    "name": "Suavel Rosa",
    "cat": "carwash",
    "catLabel": "Car Wash",
    "size": "900 mL",
    "img": "images/suavel rosa 900 mL.png",
    "best": false
  },
  {
    "name": "Vidriol",
    "cat": "carwash",
    "catLabel": "Car Wash",
    "size": "700 mL",
    "img": "images/vidriol 700 mL sticker.png",
    "best": false
  },
  {
    "name": "Yuyo Action",
    "cat": "otros",
    "catLabel": "Otros",
    "size": "1000 mL",
    "img": "images/yuyo action 1000 mL.png",
    "best": false
  }
];
