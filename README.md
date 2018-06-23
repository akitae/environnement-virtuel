# Environnement Virtuel

Pour faire fonctionner le projet, placer le dans le dossier www de Wamp ou de votre serveur PHP.


Modifier le httpd-vhosts.conf de Apache.
Sous Wamp, clique gauche sur l'îcone dans la barre des tâches > Apache > httpd-vhosts.conf.

Ajouter les lignes suivante :
```
<VirtualHost *:80>
    ServerAdmin emailaddress@domain.com
    DocumentRoot "C:\wamp64\www\environnement-virtuel"
    ServerName environnement-virtuel.local
    ErrorLog "logs/env.log"
    CustomLog "logs/env-access.log" common
</VirtualHost>
```
**DocumentRoot** étant l'emplacement de votre projet.

Editer ensuite le fichier hosts de Windows situé à l'emplacement :
```
C:\Windows\System32\drivers\etc
```
Et ajoutez-y la ligne suivante :
```
127.0.0.1 environnement-virtuel.local
```
Où **environnement-virtuel.local** est le même nom que le **ServerName** mis précédemment dans Apache.

Il vous suffit de taper **environnement-virtuel.local** dans votre navigateur pour accéder au projet.
