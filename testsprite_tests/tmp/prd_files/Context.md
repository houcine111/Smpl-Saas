
1. VISION DU PROJET
Un Mini-eShop mobile-first ultra-léger pour les vendeurs marocains.

Objectif : Remplacer les sites e-commerce lourds par une vitrine style "Catalogue Visuel/Instagram" où l'achat se finalise sur WhatsApp.

Stack : Next.js (App Router), Supabase (Auth/DB/Storage), Tailwind CSS, Framer Motion.

Hébergement : Vercel.

2. CHARTE GRAPHIQUE (MODERNE, DOUCE & CONFORTABLE)
L'UI ne doit pas ressembler à une boutique classique, mais à un magazine de créateur.

Fond (Bg) : #FDFCF8 (Coton Doux)

Texte & Actions : #2D3436 (Anthracite Mat)

Accent (Cards) : #E3D5CA (Sable Rosé)

Succès (WhatsApp) : #8FA998 (Vert Sauge)

Bordures : #F4EFEA (Lin Clair)

Style : rounded-2xl (20px) pour tous les éléments, ombres très diffuses, typographie Serif pour les titres.

3. ARCHITECTURE TECHNIQUE & CLASSES

IMPORTANT : Pour l'implémentation technique, les relations entre tables et la structure des services, consulte impérativement le dossier /Diagramme à la racine du projet. Tu y trouveras l'image du diagramme de classe et le schéma de données détaillé à respecter scrupuleusement.
Points clés de la DB (Supabase) :
Profiles : Gestion des vendeurs (slug unique, numéro WhatsApp).

Products : Catalogue lié au vendeur.

Orders : Capture des données client (Nom, Tel, Ville) sans création de compte client.

Sécurité : Active le RLS (Row Level Security) : les vendeurs ne voient que leurs données, le public ne voit que les produits actifs.

4. INTERFACES À GÉNÉRER
A. Vitrine Publique (/[slug]) - "The Feed"
UI : Flux vertical de produits (Single Column). Grandes images (4:5).

Interaction : Clic sur image → Ouvre un Drawer (vaul) avec formulaire.

Formulaire : Nom, Ville, Téléphone. Pas de panier.

Action : Bouton "Commander via WhatsApp" → Enregistre en DB + Redirect WhatsApp.

B. Dashboard Vendeur (/dashboard)
Navigation : Barre d'onglets fixe en bas (Home, Produits, Commandes, Paramètres).
C'est l'espace où chaque commerçant gère son catalogue et ses ventes.

C. Platform Admin (/admin)
Accès : Uniquement si is_admin = true.
Fonctions :
- Liste et modération de tous les vendeurs.
- Création manuelle d'utilisateurs (Vendeur ou Admin) via formulaire.
- Statistiques globales et maintenance de la plateforme.
5. STRUCTURE DU CODE
/app : Routes dynamiques et protégées par Proxy.(Middleware)
    - `/(public)/[slug]` : Vitrine client.
    - `/(dashboard)` : Gestion vendeur (Home, Produits, Commandes).
    - `/admin` : Gestion globale.

/components : UI minimaliste respectant la palette Sable/Anthracite.
    - `/ui` : Atomes (buttons, inputs).
    - `/features` : Organismes (ProductCard, OrderDrawer avec Vaul).

/lib : Clients Supabase (Auth/DB/Storage).

/repositories : Abstraction des données (Pattern Repository).
    - `IRepository.ts`
    - `Supabase[Entity]Repository.ts`

/proxy.ts : Point d'entrée pour l'interception des requêtes (Next.js 16).

/services : Implémentation des interfaces de notification et métier.
    - `INotifier.ts` -> `WhatsAppService.ts`
    - `IOrderService.ts` -> `OrderService.ts`

/types : Définitions TypeScript globales.
/styles : Design System et variables CSS.
# SaaS de Gestion de Commandes (E-commerce / Vendors)

## Objectif
Développer une plateforme SaaS permettant à des vendeurs (**Vendors**) de proposer des produits (**Products**) et de recevoir des commandes (**Orders**). La plateforme intégrera une notification via **WhatsApp** pour confirmer les commandes.

## Architecture Technique (Basée sur le diagramme de classe)

### Entités principales
- **Platform Admin (Superuser)** : Gère l'ensemble de la plateforme. Peut créer des magasins (Vendors) ou d'autres administrateurs via un formulaire dédié avec une option `is_admin`.
- **Vendor** : Gère son propre magasin, ses produits et ses commandes.
- **Order** : Commande passée par un client pour un produit spécifique d'un vendeur.
    - États de commande (**OrderStatus**) : PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED.

### Principes Architecturaux
- **Couplage Faible (Low Coupling)** : Utilisation systématique d'interfaces (`IRepository`, `INotifier`, `IOrderService`). Le `OrderService` ne dépend pas d'une implémentation concrète (ex: `WhatsAppService`), ce qui permet de changer de fournisseur de notification ou de base de données sans modifier la logique métier.
- **Scalabilité** :
    - **Horizontale** : Les services sont sans état (stateless), facilitant le déploiement sur des fonctions Edge (Supabase Edge Functions).
    - **Flexibilité** : La structure permet d'ajouter facilement de nouveaux types de notifications (Email, SMS) ou de nouveaux types de stockage.
    - **Performance** : Utilisation de Supabase (Postgres) pour une gestion efficace des données à grande échelle.

## Technologies suggérées
- **Frontend** : Next.js / React (pour le SaaS).
- **Backend/Database** : Supabase (PostgreSQL + Auth + Storage).
- **Langage** : TypeScript (recommandé pour la cohérence avec le diagramme et les Promesses).

6. ÉTAT D'AVANCEMENT (MIS À JOUR LE 26/02/2026)

### Fondations & Sécurité ✅
- [x] Initialisation du schéma SQL complet (Profiles, Products, Orders).
- [x] **Validation Zod Intégrée** : Sécurité totale sur tous les formulaires et server actions.
- [x] **Proxy & Rôles** : Protection stricte des routes via `proxy.ts` (Next.js 16) et redirection intelligente.

### Gestion Produit ✅
- [x] CRUD complet avec Support Multi-images (5 URLs).
- [x] **Logique de Stock** : Gestion des quantités et des indicateurs de visibilité.
- [x] **Soft Delete** : Implémentation de la suppression sécurisée via `deleted_at`.

### Administration Plateforme ✅
- [x] Interface de gestion de tous les vendeurs.
- [x] Création manuelle de comptes avec rôles (Vendor/Admin).

### Documentation de bord
Quatre fichiers de suivi ont été créés à la racine pour une lecture rapide :
- `Task.md` : Suivi granulaire des phases.
- `Walkthrough.md` : Guide technique des implémentations.
- `Rules.md` : Standards de design et règles architecturales (Repository, Zod, etc.).
- `Next_Steps.md` : Vision pour le développement de la boutique publique.

---
**Focus Prochain** : Développement de la vitrine publique `/[slug]` et du flux de commande WhatsApp.
