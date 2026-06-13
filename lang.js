// lang.js — Gestion du trilinguisme : Français, Anglais, Lingala
//
// Comment ça marche :
// 1. Chaque texte de la page a un attribut data-i18n="clé" dans le HTML.
// 2. Ce fichier contient les traductions pour chaque clé dans les 3 langues.
// 3. La fonction applyTranslations() remplace le texte visible selon la langue choisie.
// 4. Le choix est sauvegardé dans localStorage pour être mémorisé à la prochaine visite.

const translations = {

  fr: {
    navCategories:    'Catégories',
    navCta:           'Inscrire mon business',
    heroTitle:        'Trouvez les meilleurs<br><span class="hero__title--accent">professionnels</span> près de vous',
    heroSubtitle:     'Avocats, cliniques, garages, pharmacies… vérifiés et recommandés en RDC.',
    searchCityDefault:'Toutes les villes',
    searchPlaceholder:'Médecin, garage, restaurant…',
    searchBtn:        'Rechercher',
    sectionTitle:     'Parcourir par catégorie',
    catLawyers:       'Avocats',
    catClinics:       'Cliniques',
    catDentists:      'Dentistes',
    catGarages:       'Garages',
    catGroceries:     'Épiceries',
    catPharmacies:    'Pharmacies',
    catRestaurants:   'Restaurants',
    catHotels:        'Hôtels',
    catSchools:       'Écoles',
    catChurches:      'Églises',
    footerBrand:      'esika — par Swamin Inc.',
  },

  en: {
    navCategories:    'Categories',
    navCta:           'List my business',
    heroTitle:        'Find the best<br><span class="hero__title--accent">professionals</span> near you',
    heroSubtitle:     'Lawyers, clinics, garages, pharmacies… verified and recommended in DRC.',
    searchCityDefault:'All cities',
    searchPlaceholder:'Doctor, garage, restaurant…',
    searchBtn:        'Search',
    sectionTitle:     'Browse by category',
    catLawyers:       'Lawyers',
    catClinics:       'Clinics',
    catDentists:      'Dentists',
    catGarages:       'Garages',
    catGroceries:     'Grocery stores',
    catPharmacies:    'Pharmacies',
    catRestaurants:   'Restaurants',
    catHotels:        'Hotels',
    catSchools:       'Schools',
    catChurches:      'Churches',
    footerBrand:      'esika — by Swamin Inc.',
  },

  // Lingala — langue parlée à Kinshasa et dans une grande partie de la RDC
  ln: {
    navCategories:    'Mitindo',
    navCta:           'Yebisa business na ngai',
    heroTitle:        'Koluka<br><span class="hero__title--accent">basali</span> ya malamu penepene na yo',
    heroSubtitle:     'Ba Avoka, Lopitalo, ba garage, Magazini Ya Kisi… bayebisami mpe bakitisami na RDC.',
    searchCityDefault:'Ba vile nyonso',
    searchPlaceholder:'Monganga, garage, Malewa…',
    searchBtn:        'Koluka',
    sectionTitle:     'Tala na mitindo',
    catLawyers:       'Ba Avoka',
    catClinics:       'Lopitalo',
    catDentists:      'Monganga Ya Mino',
    catGarages:       'Ba garage',
    catGroceries:     'Ba boutiki',
    catPharmacies:    'Magazini Ya Kisi',
    catRestaurants:   'Malewa',
    catHotels:        'Ba otele',
    catSchools:       'Eteyelo',
    catChurches:      'Eklezya',
    footerBrand:      'esika — na Swamin Inc.',
  },

};

// ---------------------------------------------------------------
// applyTranslations(lang) — applique les textes de la langue choisie
// ---------------------------------------------------------------
function applyTranslations(lang) {
  const t = translations[lang];
  if (!t) return;

  // 1. Éléments avec data-i18n : on remplace le texte simple (textContent)
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });

  // 2. Éléments avec data-i18n-html : on remplace le HTML interne (pour le titre
  //    qui contient un <span> coloré à l'intérieur)
  document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
    var key = el.getAttribute('data-i18n-html');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  // 3. Éléments avec data-i18n-ph : on change l'attribut placeholder des champs input
  document.querySelectorAll('[data-i18n-ph]').forEach(function(el) {
    var key = el.getAttribute('data-i18n-ph');
    if (t[key] !== undefined) el.placeholder = t[key];
  });

  // 4. Mettre à jour le bouton actif (celui surligné en jaune)
  document.querySelectorAll('.lang-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  // 5. Mettre à jour l'attribut lang de la page (bonne pratique accessibilité)
  document.documentElement.lang = lang;

  // 6. Mémoriser le choix pour la prochaine visite
  localStorage.setItem('esika-lang', lang);
}

// ---------------------------------------------------------------
// Brancher les boutons FR / EN / LIN
// ---------------------------------------------------------------
document.querySelectorAll('.lang-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    applyTranslations(btn.getAttribute('data-lang'));
  });
});

// ---------------------------------------------------------------
// Au chargement : utiliser la langue sauvegardée ou le français par défaut
// ---------------------------------------------------------------
var savedLang = localStorage.getItem('esika-lang') || 'fr';
applyTranslations(savedLang);
