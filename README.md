# testgame

Le projet utillise VueJS, Phaser3, Electron (pour avoir une app PC), Cordova (pour une app Mobile).
Utilisation de socket.io pour la communcation vers un serveur (controlleur, rfid)
Utilisation de vuetify pour créer un joli design.

Ce projet peut servir de structure pour d'autres.

#Environnement
Visual Studio Code

Extensions suivantes :
Vue VS code Extension Pack
Debugger for chrome
https://github.com/microsoft/vscode-recipes/tree/master/vuejs-cli

Android Studio

#Cordova :
Suivre le lien suivant : https://jonathansblog.co.uk/adding-cordova-to-an-existing-vue-app

Pour ajouter la couche cordova :
vue add cordova puis choisir un nom d'app.
Choisir les plateformes souhaités (android, broswer, electron)

##Pour developper :

Il faut installer Java 8, Android Studio et Gradle

```
npm run cordova-serve-android
```
==> Permet de runner le projet en un apk de debug(par contre le fichier config.xml n'est pas bon)

```
npm run cordova-build-android
```
==> Permet de créer les fichiers pour le dossier www dans src-cordova mais aussi dans les assets de l'app android mais aussi délivre un apk-release

La procédure pour débugger :

faire un npm run cordova-build-android ==> crée les assets
faire un npm run cordova-serve-android ==> met à jour le dossier du projet Android
Le problème c'est que le fichier config.xml de src-cordova\platforms\android\app\src\main\res\xml contient une adresse IP.
Il faut cette ligne <content src="index.html" />
Donc on ouvre le projet dans Android studio, on change cette valeur et on fait un make project
Tadaa, on a un apk qui donne les fichiers locaux se trouvant dans les assets du projet

## Pour produire

Faire un npm run cordova-build-android et ensuite signer + aligner l'apk.


## Pour installer toutes les dépendances du projet

Attention la version d'electron est importante sinon le serialPort n'est plus buildable

```
npm install
```

### Pour généer un exe pour le dev
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
