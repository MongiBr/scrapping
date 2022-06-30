
----- scrapping leboncoin ---------

	- Installer nodejs et vérifier avec la commande node -v
	- Installer la commande nodemon avec npm i -g nodemon pour lancer la partie nodejs
	- Executer la partie nodejs avec la commande npm run dev

	- Installer l'extension chrome Javascript & css auto injection 
	- ouvrir l'extension
	- Mettre le code de chaque script dans sa place.


Les Uri(s) de script

	https://www.leboncoin.fr/_immobilier_/offres
	.htm
	http://localhost:5000


Pour recuperer les numeros de téléphone il faut attender le script n1, quand il est terminé 
	http://localhost:5000/api/scrapping/annonce


NB : Il faut créer une fichier dans /public/static que nommé Announces.csv pour mettre les données de leboncoin dans ce fichier
(avec l'en tete : title,typeBiens,linkAnnonce,city,postalCode,phone,price)