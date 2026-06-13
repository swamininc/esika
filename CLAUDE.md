# ESIKA — Brief projet pour Claude Code

## Ce qu'est Esika
Application web (PWA) de répertoire des professionnels en RDC : avocats, cliniques,
dentistes, garages, épiceries, pharmacies, restaurants, hôtels. Les habitants et
visiteurs cherchent un professionnel de confiance ; les professionnels paient un
abonnement mensuel pour leur visibilité (Base 10 $ / Pro 25 $ / Premium 50 $ US,
encaissé manuellement par Mobile Money en phase 1).

Esika est un produit de Swamin Inc. (Alberta Corporate Access 2025444544).
Le prototype HTML validé (esika-prototype.html) est la référence visuelle :
bleu profond #0b6e8f, jaune #f5b32a, polices Sora + Nunito Sans, pin-constellation.

## Qui dirige
Serge — fondateur, débutant en code, apprend en lisant le code produit.
RÈGLES ABSOLUES pour Claude Code :
- 100 % d'honnêteté, zéro flatterie. Signaler tout risque clairement.
- Expliquer chaque fichier créé en 2-3 phrases simples : son rôle, pourquoi il existe.
- Une étape à la fois. Jamais plus de 3 fichiers nouveaux par session sans pause-test.
- Après chaque fonctionnalité : dire exactement comment Serge la teste dans le navigateur.
- Français par défaut ; code et noms de variables en anglais (standard du métier).
- Commits git fréquents avec messages clairs — Serge apprend le flux git en le voyant.

## Stack technique (décidée, ne pas remettre en question sans raison forte)
- Front : HTML/CSS/JavaScript vanilla d'abord (aligné sur l'apprentissage de Serge).
  Migration éventuelle vers un framework plus tard, quand Serge saura lire le JS.
- Backend : Supabase (PostgreSQL + Auth + Storage, plan gratuit).
- Hébergement : Cloudflare Pages (gratuit, rapide à Kinshasa comme à Edmonton).
- Pas de framework CSS — styles maison repris du prototype.

## Modèle de données (v1)
- businesses : id, name, category, city, description, services (array),
  address, phone_whatsapp, hours, plan (base|pro|premium), verified (bool),
  active (bool), created_at
- categories : fixes en v1 (8 catégories du prototype)
- cities : Kinshasa, Lubumbashi, Goma, Matadi, Kisangani (extensible)
- PAS de comptes utilisateurs publics en v1. PAS de paiement en ligne en v1.
- Un seul admin (Serge) via Supabase Auth pour gérer les fiches.

## Phases (ne pas sauter d'étapes)
- Phase 0 — Fondations : projet git, page d'accueil statique reprenant le
  prototype, déploiement Cloudflare Pages. Objectif : un lien public qui marche.
- Phase 1 — Lecture seule : connexion Supabase, les fiches s'affichent depuis la
  base de données. Serge saisit les données directement dans l'interface Supabase.
- Phase 2 — Admin : petit écran protégé par mot de passe pour créer/modifier les
  fiches sans passer par Supabase.
- Phase 3 — Croissance : formulaire public « inscrire mon business » (avec
  validation manuelle), statistiques de visites par fiche.
- Phase 4 (post-financement) : paiements Mobile Money automatisés via agrégateur
  (CinetPay / Flutterwave), comptes professionnels, app native si justifié.

## Définition du succès v1
20 à 30 vrais commerces de Kinshasa en ligne, fiches consultées via des liens
WhatsApp partagés, premiers abonnements encaissés manuellement. Ces chiffres
alimentent le dossier de financement (FPI ou autre).

## Ce que Claude Code ne doit JAMAIS faire
- Exposer une clé API secrète dans le code front (la clé "anon" Supabase est
  publique par conception, c'est la seule autorisée côté client).
- Ajouter des dépendances sans expliquer pourquoi à Serge.
- Construire la phase N+1 avant que Serge ait testé et validé la phase N.
