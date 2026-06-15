// admin.js — Interface d'administration Esika
//
// Ce fichier gère :
// 1. La connexion / déconnexion de l'admin via Supabase Auth
// 2. L'ajout de nouveaux commerces dans la base de données
// 3. La modification de commerces existants
// 4. L'affichage de la liste de tous les commerces (actifs et inactifs)

// ---------------------------------------------------------------
// CONNEXION SUPABASE
// On utilise ici la librairie supabase-js (chargée dans admin.html).
// Elle simplifie les appels à l'API par rapport au fetch() manuel.
// ---------------------------------------------------------------
const SUPABASE_URL = 'https://htkfebopjkbkmquqjmwt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0a2ZlYm9wamtia21xdXFqbXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNzI2MjYsImV4cCI6MjA5Njk0ODYyNn0.eHfMJJUuUjBkLvJ-ZZasv-4GY0ga3sHIPItwgGeO2Ik';

const { createClient } = window.supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---------------------------------------------------------------
// RÉFÉRENCES AUX ÉLÉMENTS HTML
// On "attrape" les éléments de la page une seule fois ici
// pour ne pas avoir à les chercher à chaque action.
// ---------------------------------------------------------------
const loginSection   = document.getElementById('login-section');
const adminSection   = document.getElementById('admin-section');
const btnLogout      = document.getElementById('btn-logout');
const loginForm      = document.getElementById('login-form');
const loginError     = document.getElementById('login-error');
const businessForm   = document.getElementById('business-form');
const formTitle      = document.getElementById('form-title');
const formError      = document.getElementById('form-error');
const formSuccess    = document.getElementById('form-success');
const btnSubmit      = document.getElementById('btn-submit');
const btnCancel      = document.getElementById('btn-cancel');
const adminBizList   = document.getElementById('admin-biz-list');

// ---------------------------------------------------------------
// GESTION DE LA SESSION
// onAuthStateChange est appelé automatiquement au chargement
// et à chaque connexion / déconnexion.
// ---------------------------------------------------------------
db.auth.onAuthStateChange(function(event, session) {
  if (session) {
    // Admin connecté → montrer le panneau, cacher le login
    loginSection.classList.add('hidden');
    adminSection.classList.remove('hidden');
    btnLogout.classList.remove('hidden');
    loadBusinesses();
  } else {
    // Non connecté → montrer le login, cacher le panneau
    loginSection.classList.remove('hidden');
    adminSection.classList.add('hidden');
    btnLogout.classList.add('hidden');
  }
});

// ---------------------------------------------------------------
// CONNEXION
// ---------------------------------------------------------------
loginForm.addEventListener('submit', async function(e) {
  e.preventDefault(); // empêche le rechargement de la page
  loginError.classList.add('hidden');

  var email    = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  var { error } = await db.auth.signInWithPassword({ email, password });

  if (error) {
    loginError.textContent = 'Email ou mot de passe incorrect.';
    loginError.classList.remove('hidden');
  }
});

// ---------------------------------------------------------------
// DÉCONNEXION
// ---------------------------------------------------------------
btnLogout.addEventListener('click', async function() {
  await db.auth.signOut();
});

// ---------------------------------------------------------------
// CHARGER LA LISTE DES COMMERCES
// Sépare les fiches en attente (soumises publiquement, non validées)
// des fiches actives/gérées par l'admin.
// ---------------------------------------------------------------
async function loadBusinesses() {
  var { data, error } = await db
    .from('businesses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    adminBizList.innerHTML = '<p class="form-error">Erreur de chargement.</p>';
    return;
  }

  if (data.length === 0) {
    adminBizList.innerHTML = '<p>Aucun commerce enregistré.</p>';
    return;
  }

  // Séparer les fiches en attente des fiches actives/inactives gérées
  var pending = data.filter(function(b) { return !b.active && !b.verified; });
  var managed = data.filter(function(b) { return b.active || b.verified; });

  var html = '';

  // Section fiches en attente de validation
  if (pending.length > 0) {
    html += `<h3 class="admin-subsection-title">⏳ En attente de validation (${pending.length})</h3>`;
    html += pending.map(function(b) {
      return `
        <div class="admin-biz-row admin-biz-row--pending">
          <div class="admin-biz-row__info">
            <strong>${b.name}</strong>
            <span>${b.category} — ${b.city}</span>
            <span>${b.phone_whatsapp || ''}</span>
          </div>
          <div class="admin-biz-row__actions">
            <button class="btn-approve" onclick="approveBusiness(${b.id})">Valider</button>
            <button class="btn-edit" onclick="editBusiness(${b.id})">Modifier</button>
          </div>
        </div>
      `;
    }).join('');
    html += '<hr class="admin-divider" />';
  }

  // Section fiches gérées
  if (managed.length === 0) {
    html += '<p>Aucune fiche validée pour le moment.</p>';
  } else {
    html += managed.map(function(b) {
      return `
        <div class="admin-biz-row ${b.active ? '' : 'admin-biz-row--inactive'}">
          <div class="admin-biz-row__info">
            <strong>${b.name}</strong>
            <span>${b.category} — ${b.city}</span>
            <span class="biz-card__plan biz-card__plan--${b.plan}">${b.plan}</span>
            <span class="badge-views">👁 ${b.views || 0} vue${b.views !== 1 ? 's' : ''}</span>
            ${!b.active ? '<span class="badge-inactive">Inactif</span>' : ''}
          </div>
          <button class="btn-edit" onclick="editBusiness(${b.id})">Modifier</button>
        </div>
      `;
    }).join('');
  }

  adminBizList.innerHTML = html;
}

// ---------------------------------------------------------------
// VALIDER UNE FICHE EN ATTENTE
// Active la fiche et la marque comme vérifiée d'un seul clic.
// ---------------------------------------------------------------
async function approveBusiness(id) {
  var { error } = await db
    .from('businesses')
    .update({ active: true, verified: true, plan: 'base' })
    .eq('id', id);

  if (error) {
    alert('Erreur lors de la validation : ' + error.message);
    return;
  }
  loadBusinesses();
}

// ---------------------------------------------------------------
// AJOUTER OU MODIFIER UN COMMERCE
// Le formulaire fonctionne en deux modes :
// - Mode "ajout"  : le champ biz-id est vide
// - Mode "édition": le champ biz-id contient l'id du commerce
// ---------------------------------------------------------------
businessForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  formError.classList.add('hidden');
  formSuccess.classList.add('hidden');

  var bizData = {
    name:          document.getElementById('biz-name').value,
    category:      document.getElementById('biz-category').value,
    city:          document.getElementById('biz-city').value,
    plan:          document.getElementById('biz-plan').value,
    phone_whatsapp:document.getElementById('biz-phone').value,
    hours:         document.getElementById('biz-hours').value,
    address:       document.getElementById('biz-address').value,
    description:   document.getElementById('biz-description').value,
    verified:      document.getElementById('biz-verified').checked,
    active:        document.getElementById('biz-active').checked,
  };

  var bizId = document.getElementById('biz-id').value;
  var result;

  if (bizId) {
    // Mode édition : on met à jour le commerce existant
    result = await db.from('businesses').update(bizData).eq('id', bizId);
  } else {
    // Mode ajout : on crée un nouveau commerce
    result = await db.from('businesses').insert(bizData);
  }

  if (result.error) {
    formError.textContent = 'Erreur : ' + result.error.message;
    formError.classList.remove('hidden');
    return;
  }

  formSuccess.textContent = bizId ? 'Commerce modifié avec succès.' : 'Commerce ajouté avec succès.';
  formSuccess.classList.remove('hidden');
  resetForm();
  loadBusinesses();
});

// ---------------------------------------------------------------
// REMPLIR LE FORMULAIRE POUR MODIFIER UN COMMERCE
// ---------------------------------------------------------------
async function editBusiness(id) {
  var { data, error } = await db
    .from('businesses')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return;

  // Remplir tous les champs avec les valeurs existantes
  document.getElementById('biz-id').value          = data.id;
  document.getElementById('biz-name').value        = data.name || '';
  document.getElementById('biz-category').value    = data.category || '';
  document.getElementById('biz-city').value        = data.city || '';
  document.getElementById('biz-plan').value        = data.plan || 'base';
  document.getElementById('biz-phone').value       = data.phone_whatsapp || '';
  document.getElementById('biz-hours').value       = data.hours || '';
  document.getElementById('biz-address').value     = data.address || '';
  document.getElementById('biz-description').value = data.description || '';
  document.getElementById('biz-verified').checked  = data.verified || false;
  document.getElementById('biz-active').checked    = data.active || false;

  // Passer en mode édition
  formTitle.textContent    = 'Modifier : ' + data.name;
  btnSubmit.textContent    = 'Enregistrer';
  btnCancel.classList.remove('hidden');

  // Remonter en haut du formulaire
  document.getElementById('business-form').scrollIntoView({ behavior: 'smooth' });
}

// ---------------------------------------------------------------
// ANNULER L'ÉDITION — réinitialise le formulaire
// ---------------------------------------------------------------
btnCancel.addEventListener('click', resetForm);

function resetForm() {
  businessForm.reset();
  document.getElementById('biz-id').value = '';
  formTitle.textContent   = 'Ajouter un commerce';
  btnSubmit.textContent   = 'Ajouter';
  btnCancel.classList.add('hidden');
  document.getElementById('biz-active').checked = true;
}
