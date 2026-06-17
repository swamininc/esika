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
    bizSectionTitle:  'Commerces disponibles',
    footerBrand:      'esika — par Swamin Inc.',
    // Page d'inscription
    navBack:          '← Retour à l\'accueil',
    regTitle:         'Inscrire mon business',
    regSubtitle:      'Remplis ce formulaire pour apparaître sur Esika. Ton dossier sera examiné et activé sous 48h par notre équipe.',
    regName:          'Nom du business *',
    regCategory:      'Catégorie *',
    regCity:          'Ville *',
    regPlan:          'Plan souhaité',
    regPhone:         'Numéro WhatsApp *',
    regPhonePh:       '+243810000000',
    regAddress:       'Adresse',
    regAddressPh:     'Avenue, quartier, commune',
    regHours:         'Heures d\'ouverture',
    regHoursPh:       'Lun-Sam 8h-18h',
    regDesc:          'Description du business',
    regDescPh:        'Décris en quelques phrases ce que tu offres…',
    regNote:          'En soumettant ce formulaire, tu acceptes d\'être contacté par notre équipe pour confirmer ton inscription.',
    regSubmit:        'Envoyer ma demande',
    regSuccessTitle:  'Demande envoyée !',
    regSuccessText:   'Merci. Ton dossier sera examiné et activé sous 48h. On te contactera sur WhatsApp pour confirmer.',
    regBack:          'Retour à l\'accueil',
    stripeTitle:      'Active ta visibilité dès maintenant',
    stripeSubtitle:   'Paiement sécurisé via Stripe',
    stripeNote:       'Notre équipe activera ta fiche dès réception du paiement.',
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
    bizSectionTitle:  'Available businesses',
    footerBrand:      'esika — by Swamin Inc.',
    // Registration page
    navBack:          '← Back to home',
    regTitle:         'Register my business',
    regSubtitle:      'Fill in this form to appear on Esika. Your file will be reviewed and activated within 48 hours.',
    regName:          'Business name *',
    regCategory:      'Category *',
    regCity:          'City *',
    regPlan:          'Preferred plan',
    regPhone:         'WhatsApp number *',
    regPhonePh:       '+1 780 000 0000',
    regAddress:       'Address',
    regAddressPh:     'Street address, neighborhood',
    regHours:         'Opening hours',
    regHoursPh:       'Mon-Sat 8am-6pm',
    regDesc:          'Business description',
    regDescPh:        'Describe what you offer in a few sentences…',
    regNote:          'By submitting this form, you agree to be contacted by our team to confirm your registration.',
    regSubmit:        'Submit my request',
    regSuccessTitle:  'Request sent!',
    regSuccessText:   'Thank you. Your file will be reviewed and activated within 48 hours. We will contact you on WhatsApp to confirm.',
    regBack:          'Back to home',
    stripeTitle:      'Activate your visibility now',
    stripeSubtitle:   'Secure payment via Stripe',
    stripeNote:       'Our team will activate your listing upon receipt of payment.',
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
    bizSectionTitle:  'Biznesi oyo ezali',
    footerBrand:      'esika — na Swamin Inc.',
    // Lokasa ya koyebisa
    navBack:          '← Zongela na ebandeli',
    regTitle:         'Ko komisa Biznesi na ngai',
    regSubtitle:      'Koma na fomilele oyo mpo ozala na kati ya Esika. To Ko tanga yango sima nde o kozala na biso na mikolo mibale',
    regName:          'Nkombo ya biznesi *',
    regCategory:      'Ndenge *',
    regCity:          'Mboka *',
    regPlan:          'Plan oyo olingi',
    regPhone:         'Nimero ya WhatsApp *',
    regPhonePh:       '+243810000000',
    regAddress:       'Adresse',
    regAddressPh:     'Adresse, quartier',
    regHours:         'Ntango ya kozwana',
    regHoursPh:       'Lun-Sam 8h-18h',
    regDesc:          'Kolimbola biznesi',
    regDescPh:        'Limbola oyo oza kopesa…',
    regNote:          'Soki otindi fomilele oyo, o ndimi to solola na yo mpona ko komisa biznesi na yo.',
    regSubmit:        'Tinda demande na ngai',
    regSuccessTitle:  'Demande etindami !',
    regSuccessText:   'Merci. Biso toko sala dossier na yo na mikolo mibale mpe tokoyanola yo na WhatsApp na yo.',
    regBack:          'Zongela na ebandeli',
    stripeTitle:      'Bimisa yango sikoyo',
    stripeSubtitle:   'Mbongo na Stripe — ezali salama',
    stripeNote:       'Biso tokolongola fiche na yo soki biso tozwi mbongo.',
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
