# Projet Fonctionnel

## Description
Ce projet est un exemple de tests unitaires pour un projet fonctionnel. Il inclut une base de données MySQL pour stocker les informations des utilisateurs.

## Prérequis
- Node.js
- npm (Node Package Manager) ou pnpm
- MySQL

## Installation
1. Clonez le dépôt :
    ```bash
    git clone https://github.com/KAYRAZZ/projet_fonctionnel.git
    ```
2. Accédez au répertoire du projet :
    ```bash
    cd projet_fonctionnel
    ```
3. Installez les dépendances :
    ```bash
    npm install
    ```

## Configuration de la base de données en MySQL
1. Assurez-vous que MySQL est installé et en cours d'exécution.
2. Créez une base de données pour le projet avec les tables, tout est dans le fichier 'bd.sql'.
 

## Configuration de l'environnement
1. Créez un fichier `.env` à la racine du projet et ajoutez les variables d'environnement suivantes :
    ```env
    DB_HOST=localhost
    DB_USER=votre_utilisateur
    DB_PASS=votre_mot_de_passe
    DB_NAME=projet_fonctionnel
    JWT_SECRET=your_jwt_secret
    ```
    - **DB_HOST** : L'adresse de l'hôte de la base de données (généralement `localhost`).
    - **DB_USER** : Le nom d'utilisateur MySQL que vous  crééavez.
    - **DB_PASS** : Le mot de passe de l'utilisateur MySQL.
    - **DB_NAME** : Le nom de la base de données que vous avez créée.
    - **JWT_SECRET** : Une clé secrète utilisée pour signer les tokens JWT. Assurez-vous qu'elle est suffisamment complexe et sécurisée.


## Lancer le projet et le serveur nodeJS
Pour lancer le serveur
```bash
node server.js
```

Pour lancer le projet
```bash
npm dev
```

## Lancer les tests
Pour exécuter les tests unitaires, utilisez la commande suivante :
```bash
npm test
```
