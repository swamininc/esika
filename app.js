// app.js — Connexion à Supabase et affichage des commerces
//
// Ce fichier fait trois choses :
// 1. Se connecte à Supabase avec l'URL du projet et la clé publique (anon)
// 2. Va chercher la liste des commerces actifs dans la base de données
// 3. Affiche chaque commerce sous forme de carte sur la page

// ---------------------------------------------------------------
// CONNEXION SUPABASE
// La clé "anon" est publique par conception — c'est la seule
// autorisée côté navigateur. Elle ne donne accès qu'en lecture
// grâce à la policy qu'on a créée dans Supabase.
// ---------------------------------------------------------------
const SUPABASE_URL = 'https://htkfebopjkbkmquqjmwt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0a2ZlYm9wamtia21xdXFqbXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNzI2MjYsImV4cCI6MjA5Njk0ODYyNn0.eHfMJJUuUjBkLvJ-ZZasv-4GY0ga3sHIPItwgGeO2Ik';

// ---------------------------------------------------------------
// ÉTAT DE LA RECHERCHE
//
// allBusinesses : la liste COMPLÈTE reçue de Supabase, jamais filtrée.
// activeCategory : la catégorie cliquée par l'utilisateur (ou null).
// On garde ces deux infos en mémoire pour pouvoir recalculer la
// liste affichée à chaque fois qu'un filtre change, sans refaire
// de requête à Supabase.
// ---------------------------------------------------------------
let allBusinesses = [];
let activeCategory = null;

// ---------------------------------------------------------------
// fetchBusinesses() — Va chercher les commerces dans Supabase
//
// "fetch" envoie une requête HTTP à l'API de Supabase.
// On filtre : active=eq.true (seulement les commerces actifs)
// On trie   : order=name (par ordre alphabétique)
// ---------------------------------------------------------------
async function fetchBusinesses() {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/businesses?active=eq.true&order=name`,
    {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    }
  );

  if (!response.ok) {
    throw new Error('Impossible de charger les commerces.');
  }

  return response.json();
}

// ---------------------------------------------------------------
// planLabel() — Traduit le code du plan en texte lisible
// ---------------------------------------------------------------
function planLabel(plan) {
  if (plan === 'pro')     return 'Pro';
  if (plan === 'premium') return 'Premium';
  return 'Base';
}

// ---------------------------------------------------------------
// renderBusinesses() — Affiche les commerces sur la page
//
// Pour chaque commerce reçu de Supabase, on crée un bloc HTML
// et on l'insère dans la div #businesses-list.
// ---------------------------------------------------------------
function renderBusinesses(businesses) {
  var container = document.getElementById('businesses-list');

  if (businesses.length === 0) {
    // Deux cas différents : soit la base est vide, soit le filtre
    // appliqué (ville/catégorie/recherche) n'a juste rien trouvé.
    container.innerHTML = allBusinesses.length === 0
      ? '<p class="businesses__empty">Aucun commerce disponible pour le moment.</p>'
      : '<p class="businesses__empty">Aucun résultat pour ce filtre.</p>';
    return;
  }

  container.innerHTML = businesses.map(function(b) {
    return `
      <div class="biz-card">
        <div class="biz-card__header">
          <h3 class="biz-card__name">${b.name}</h3>
          <span class="biz-card__plan biz-card__plan--${b.plan}">${planLabel(b.plan)}</span>
        </div>
        <p class="biz-card__desc">${b.description || ''}</p>
        <div class="biz-card__footer">
          <span class="biz-card__city">📍 ${b.city}</span>
          ${b.phone_whatsapp ? `<a class="biz-card__phone" href="https://wa.me/${b.phone_whatsapp.replace(/\D/g,'')}" onclick="countView(${b.id})">WhatsApp</a>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// ---------------------------------------------------------------
// applyFilters() — Recalcule la liste affichée à partir de
// allBusinesses, selon la ville choisie, le texte recherché et
// la catégorie cliquée. Appelée chaque fois qu'un filtre change.
// ---------------------------------------------------------------
function applyFilters() {
  var city  = document.getElementById('search-city').value;
  var query = document.getElementById('search-input').value.trim().toLowerCase();

  var filtered = allBusinesses.filter(function(b) {
    var matchCity     = !city || b.city === city;
    var matchCategory = !activeCategory || b.category === activeCategory;
    var matchQuery    = !query ||
      b.name.toLowerCase().includes(query) ||
      (b.description || '').toLowerCase().includes(query);
    return matchCity && matchCategory && matchQuery;
  });

  renderBusinesses(filtered);
  updateFilterStatus(filtered.length);
}

// ---------------------------------------------------------------
// updateFilterStatus() — Affiche ou cache la barre "Filtré par…"
// au-dessus de la liste, selon qu'un filtre est actif ou non.
// ---------------------------------------------------------------
function updateFilterStatus(count) {
  var statusBar  = document.getElementById('filter-status');
  var statusText = document.getElementById('filter-status-text');

  var city  = document.getElementById('search-city').value;
  var query = document.getElementById('search-input').value.trim();
  var hasFilter = activeCategory || city || query;

  if (!hasFilter) {
    statusBar.classList.add('hidden');
    return;
  }

  statusText.textContent = count + ' résultat' + (count !== 1 ? 's' : '');
  statusBar.classList.remove('hidden');
}

// ---------------------------------------------------------------
// countView() — Incrémente le compteur de visites d'un commerce
//
// Appelée quand un visiteur clique sur le bouton WhatsApp.
// "rpc" appelle une fonction SQL dans Supabase qui ajoute 1 au
// compteur views du commerce concerné.
// ---------------------------------------------------------------
async function countView(businessId) {
  await fetch(
    `${SUPABASE_URL}/rest/v1/rpc/increment_views`,
    {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ business_id: businessId })
    }
  );
}

// ---------------------------------------------------------------
// ÉVÉNEMENTS DE FILTRAGE
// ---------------------------------------------------------------

// La barre de recherche : on empêche le rechargement de la page
// (preventDefault) et on filtre directement dans le navigateur.
document.querySelector('.search').addEventListener('submit', function(e) {
  e.preventDefault();
  applyFilters();
});

// Les cartes de catégories : un clic filtre par catégorie et
// fait défiler la page jusqu'à la liste des commerces.
document.querySelectorAll('.card').forEach(function(card) {
  card.addEventListener('click', function(e) {
    e.preventDefault();
    activeCategory = card.dataset.category;
    applyFilters();
    document.getElementById('businesses').scrollIntoView({ behavior: 'smooth' });
  });
});

// Le bouton "Effacer le filtre" : remet tout à zéro.
document.getElementById('btn-clear-filter').addEventListener('click', function() {
  activeCategory = null;
  document.getElementById('search-city').value = '';
  document.getElementById('search-input').value = '';
  applyFilters();
});

// ---------------------------------------------------------------
// Lancement : on charge la liste complète une seule fois, puis on
// affiche le résultat du filtre (vide au départ = tout afficher).
// ---------------------------------------------------------------
fetchBusinesses()
  .then(function(data) {
    allBusinesses = data;
    applyFilters();
  })
  .catch(function(err) {
    var container = document.getElementById('businesses-list');
    container.innerHTML = '<p class="businesses__empty">Erreur de chargement. Réessaie plus tard.</p>';
    console.error(err);
  });
