//L'affichage de la boite de dialog
var msgBox = null;
//la scene du jeu
var sceneGame=null;
//text à afficher
var test_text_display=["Ceci est un message test", "totot"];
var spriteText;


//variable temporaire pour l'affichage du texte
var line = [];
var wordIndex = 0;
var lineIndex = 0;

//temps entre affichage des mots et des lignes suivantes
var wordDelay = 120;
var lineDelay = 400;


  export function showMessageBox(game, w = 100, h = 100, onmove=true) {

    sceneGame=game;
    line = [];
    wordIndex = 0;
    lineIndex = 0;
    
    if (msgBox !=null) {
        msgBox.destroy();
    }
    
    //pour ajouter la boite du dialog au niveau du personnage
    msgBox = game.add.container(game.container.x, game.container.y)
  
    //Pour se position en dessous du personnage
    var back = game.add.sprite(0,-50, "ground");
    //make a text field
    spriteText = game.add.text(-50,0, '');
  
    //set the textfeild to wrap if the text is too long
    spriteText.wordWrap = true;
    //make the width of the wrap 90% of the width 
    //of the message box
    spriteText.wordWrapWidth = w * .9;
 

    //set the width and height passed
    //in the parameters
    back.width = w;
    back.height = h;

   
    //add the elements to the group
    msgBox.add(back);
    msgBox.add(spriteText);   
    

    //Pour la gestion d'un bouton quitter
    //set the close button
    //in the center horizontally
    //and near the bottom of the box vertically
    //closeButton.x = back.width / 2 - closeButton.width / 2;
    //closeButton.y = back.height - closeButton.height;
    //enable the button for input
    //closeButton.inputEnabled = true;
    //add a listener to destroy the box when the button is pressed
    //closeButton.events.onInputDown.add(this.hideBox, this);
   
   
    
    //set the text in the middle of the message box
    //spriteText.x = back.width / 2;
    spriteText.y = back.height / 2 - spriteText.height / 2 - 10;

    back.x= back.width/2;
    back.y= back.height/2;
  
    //pour empecher le personnage de bouger
    game.container.body.moves = onmove;

    //pour afficher le texte
    nextLine();    

    //pour afficher le message que 5 secondes
    sceneGame.time.addEvent({ delay: 5000, callback: hideBox, callbackScope: this});

    //permet de supprimer l'association des touches
    // this.input.keyboard.removeAllKeys();
    //pour les touches http://labs.phaser.io/edit.html?src=src/input/keyboard/retro%20leaderboard.js
    //this.keys = this.input.keyboard.createCursorKeys();
    // var key3 = this.input.keyboard.addKey(Input.Keyboard.left);
    game.input.keyboard.on('keyupdown', testKeyboardLeft, this);


}
export function hideBox() {
    //destroy the box when the button is pressed
    msgBox.destroy();
    wordIndex = 0;
    lineIndex = 0;
   
    sceneGame.container.body.moves = true;

}

function  testKeyboardLeft () {
    console.log("testkeyboard");
    hideBox();
  }

function nextLine() {

   if (lineIndex === test_text_display.length)
  { 
      return;
  }

  //  Split the current line on spaces, so one word per array element
  line = test_text_display[lineIndex].split(' ');

  //  Reset the word index to zero (the first word in the line)
  wordIndex = 0;
  //  Advance to the next line
  sceneGame.time.addEvent({ delay: wordDelay, callback: nextWord, callbackScope: this,  repeat: line.length -1});
}

function nextWord() {
  
   //  Add the next word onto the text string, followed by a space
   spriteText.text = spriteText.text.concat(line[wordIndex] + " ");
   //  Advance the word index to the next word in the line
   wordIndex++;

    //  Last word?
    if (wordIndex === line.length )
    {
        //  Add a carriage return
        spriteText.text = spriteText.text.concat("\n");

        //passe à la ligne suivante
        lineIndex++;

        sceneGame.time.addEvent({ delay: lineDelay, callback:  nextLine, callbackScope: this, loop: false });      
    }
}

export default showMessageBox;