# Salle

Ce repository est une application web destinée à proposer un service de réservation de salle.

## Fonctionnalité

La page d'accueil est une page de connexion. Un utilisateur normal peut accéder aux pages `Profil`
et `Réservation`. Un utilisateur administrateur peut accéder au `Dashboard`, lui donnant au crud
complet sur les entitées de l'application.

## Installation

```
git clone https://github.com/remabd/Salle.git
cd Salle
npm run dev
```

Cette application utilise le local storage comme base de donnée. Un sample est disponible dans le
dossier [migration](https://github.com/remabd/Salle/tree/main/src/migration). Les clefs à utiliser
sont `users`, `reservations` et `salles`

Pour se connecter, les mots de passe de tous les utilisateur sont `test`
