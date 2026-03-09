# TODO

## Controller

UserController {
  createCompte
  readCompte
  updateCompte
  deleteCompte
}

SalleController {
  createSalle
  readSalle
  updateSalle
  deleteSalle
  findByFilter : [filtres]
  reserverSalle : Creer un objet reservation et update la disponibilité de la salle
  annulerReservation : vérifier les 24h
  voirSesReservations : affiche les reservations en cours de l'user
}

## Model

User, Salle

User {
id,
nom,
prenom,
email,
password,
}

Salle {
nom,
capacité,
disponibilite: [date]
}

Reservation {
  
}

Filtres:

- nombre d'ordis etu
- Clim
- Capacité
- Postes enseignant

## Components

Button, Card, Form, Filtre, Tags

## Containers

Header, Footer, Home, Connexion, Compte,
