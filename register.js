// register.js — Formulaire public d'inscription d'un business
//
// Ce fichier gère la soumission du formulaire par un professionnel.
// La fiche est enregistrée avec active=false et verified=false :
// elle est invisible sur le site jusqu'à validation par l'admin.

const SUPABASE_URL     = 'https://htkfebopjkbkmquqjmwt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0a2ZlYm9wamtia21xdXFqbXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNzI2MjYsImV4cCI6MjA5Njk0ODYyNn0.eHfMJJUuUjBkLvJ-ZZasv-4GY0ga3sHIPItwgGeO2Ik';

const { createClient } = window.supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

var registerForm    = document.getElementById('register-form');
var successMessage  = document.getElementById('success-message');
var formError       = document.getElementById('form-error');
var btnSubmit       = document.getElementById('btn-submit');

registerForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  formError.classList.add('hidden');
  btnSubmit.textContent = 'Envoi en cours…';
  btnSubmit.disabled = true;

  var bizData = {
    name:           document.getElementById('biz-name').value,
    category:       document.getElementById('biz-category').value,
    city:           document.getElementById('biz-city').value,
    phone_whatsapp: document.getElementById('biz-phone').value,
    address:        document.getElementById('biz-address').value,
    hours:          document.getElementById('biz-hours').value,
    description:    document.getElementById('biz-description').value,
    // Ces deux champs sont toujours false à la soumission publique.
    // Seul l'admin peut les passer à true via l'interface admin.
    active:   false,
    verified: false,
    plan:     'base',
  };

  var { error } = await db.from('businesses').insert(bizData);

  if (error) {
    formError.textContent = 'Une erreur est survenue. Réessaie ou contacte-nous sur WhatsApp.';
    formError.classList.remove('hidden');
    btnSubmit.textContent = 'Envoyer ma demande';
    btnSubmit.disabled = false;
    return;
  }

  // Cacher le formulaire et afficher le message de succès
  registerForm.classList.add('hidden');
  successMessage.classList.remove('hidden');
});
