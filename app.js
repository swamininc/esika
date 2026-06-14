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
    container.innerHTML = '<p class="businesses__empty">Aucun commerce disponible pour le moment.</p>';
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
          ${b.phone_whatsapp ? `<a class="biz-card__phone" href="https://wa.me/${b.phone_whatsapp.replace(/\D/g,'')}">WhatsApp</a>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// ---------------------------------------------------------------
// Lancement : on appelle fetchBusinesses() au chargement de la page
// ---------------------------------------------------------------
fetchBusinesses()
  .then(renderBusinesses)
  .catch(function(err) {
    var container = document.getElementById('businesses-list');
    container.innerHTML = '<p class="businesses__empty">Erreur de chargement. Réessaie plus tard.</p>';
    console.error(err);
  });
