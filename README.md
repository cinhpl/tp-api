# Fonctionnalités ajoutées 
Pagination des produits
Si produits indisponible ils ne sont pas affichés 
Filtre par catégories disponibles
Produits triés en fonction de leur popularité
Authentification et authorisation des utilisateurs selon le profil
Ajouter des produits au panier (non enregistré en base de données) 
Ajouter, modifier la quantité ou supprimer du panier
Mise à jour du stocks des produits après ajout
Panier stocké en cookies (temps diffère selon la plateforme)
Valider le panier et créer une commande (le panier se supprime à la validation)
Commandes associés à un utilisateur et aux produits

# Module ajouté 
Cookie-parser pour gérer les cookies liés au panier.

# API Rest Site E-commerce
Projet réalisé dans le cadre du cours "Développement API" dans la formation Développeur Web B3 de MyDigitalSchool Annecy.

## Dépendances principales 
* NodeJS
* Express
* MySQL

## Installation de l'environnement en local
1. Installation des packages : `npm install`
2. Créer une base de données sur son serveur MySQL
3. Copier le fichier `.env.example` sous le nom `.env` et y insérer ses informations de connexion à MySQL
4. Lancer le serveur : `npm run start`