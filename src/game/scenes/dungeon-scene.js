import { Scene, Input, Utils, Phaser } from 'phaser'
import Dungeon from "@mikewesthad/dungeon";
import TILES from "./tile-mapping.js";

var map=null ;

/**
 * Scene that generates a new dungeon
 */
export default class DungeonScene extends Scene {
  constructor () {
    super({ key: 'DungeonScene' })
    this.container=null;
    this.attacking=false;
    this.left=false;
    this.up=false;
    this.down=false;
    this.right=false;
  }

  create() {
    // Generate a random world
    this.dungeon = new Dungeon({ 
      width: 50,
      height: 50,
      rooms: {
        width: { min: 7, max: 15 },
        height: { min: 7, max: 15 },
        maxRooms: 2
      }
    });

    // Create a blank tilemap with dimensions matching the dungeon
    map= this.make.tilemap({
      tileWidth: 48,
      tileHeight: 48,
      width: this.dungeon.width,
      height: this.dungeon.height
    });
    /*const tileset = map.addTilesetImage("tiles", null, 48, 48, 1, 2); // 1px margin, 2px spacing
    const layer = map.createBlankDynamicLayer("Layer 1", tileset);

    // Get a 2D array of tile indices (using -1 to not render empty tiles) and place them into the
    // blank layer
    const mappedTiles = dungeon.getMappedTiles({ empty: -1, floor: 6, door: 6, wall: 20 });
    layer.putTilesAt(mappedTiles, 0, 0);
    layer.setCollision(20); // We only need one tile index (the walls) to be colliding for now*/

    

    const tileset = map.addTilesetImage("tiles", null, 48, 48, 1, 2); // 1px margin, 2px spacing
    this.groundLayer = map.createBlankDynamicLayer("Ground", tileset);
    this.stuffLayer = map.createBlankDynamicLayer("Stuff", tileset);

    this.groundLayer.fill(TILES.BLANK);

    console.log(map)

    /*map.findObject('Ground', function(object) {

      console.log(object.type);

  }, this);*/

  var bombs = this.physics.add.group();

    // Use the array of rooms generated to place tiles in the map
    // Note: using an arrow function here so that "this" still refers to our scene
    this.dungeon.rooms.forEach(room => {
      const { x, y, width, height, left, right, top, bottom } = room;

      bombs.create(48*x +5*48, 48*y+5*48, 'bomb');

      // Fill the floor with mostly clean tiles
      this.groundLayer.weightedRandomize(x + 1, y + 1, width - 2, height - 2, TILES.FLOOR);

      // Place the room corners tiles
      this.groundLayer.putTileAt(TILES.WALL.TOP_LEFT, left, top);
      this.groundLayer.putTileAt(TILES.WALL.TOP_RIGHT, right, top);
      this.groundLayer.putTileAt(TILES.WALL.BOTTOM_RIGHT, right, bottom);
      this.groundLayer.putTileAt(TILES.WALL.BOTTOM_LEFT, left, bottom);

      // Fill the walls with mostly clean tiles
      this.groundLayer.weightedRandomize(left + 1, top, width - 2, 1, TILES.WALL.TOP);
      this.groundLayer.weightedRandomize(left + 1, bottom, width - 2, 1, TILES.WALL.BOTTOM);
      this.groundLayer.weightedRandomize(left, top + 1, 1, height - 2, TILES.WALL.LEFT);
      this.groundLayer.weightedRandomize(right, top + 1, 1, height - 2, TILES.WALL.RIGHT);

      // Dungeons have rooms that are connected with doors. Each door has an x & y relative to the
      // room's location. Each direction has a different door to tile mapping.
      var doors = room.getDoorLocations(); // → Returns an array of {x, y} objects
      for (var i = 0; i < doors.length; i++) {
        if (doors[i].y === 0) {
          this.groundLayer.putTilesAt(TILES.DOOR.TOP, x + doors[i].x - 1, y + doors[i].y);
        } else if (doors[i].y === room.height - 1) {
          this.groundLayer.putTilesAt(TILES.DOOR.BOTTOM, x + doors[i].x - 1, y + doors[i].y);
        } else if (doors[i].x === 0) {
          this.groundLayer.putTilesAt(TILES.DOOR.LEFT, x + doors[i].x, y + doors[i].y - 1);
        } else if (doors[i].x === room.width - 1) {
          this.groundLayer.putTilesAt(TILES.DOOR.RIGHT, x + doors[i].x, y + doors[i].y - 1);
        }
      }
    });

    // Not exactly correct for the tileset since there are more possible floor tiles, but this will
    // do for the example.
    this.groundLayer.setCollisionByExclusion([-1, 6, 7, 8, 26]);

    console.log(this.dungeon.rooms);

    const rooms = this.dungeon.rooms.slice();
    //const startRoom = rooms.shift();
    const endRoom = Utils.Array.RemoveRandomElement(rooms);
    const otherRooms = Utils.Array.Shuffle(rooms).slice(0, rooms.length * 0.9);

    // Place the stairs
    this.stuffLayer.putTileAt(TILES.STAIRS, endRoom.centerX, endRoom.centerY);

  

    // Place stuff in the 90% "otherRooms"
    otherRooms.forEach(room => {
      var rand = 0.25;
      console.log(room)
      if (rand <= 0.25) {
        // 25% chance of chest
        this.stuffLayer.putTileAt(TILES.CHEST, room.centerX, room.centerY);
        
        bombs.create(600, 700, 'bomb');
      } else if (rand <= 0.5) {
        // 50% chance of a pot anywhere in the room... except don't block a door!
        const x = Phaser.Math.Between(room.left + 2, room.right - 2);
        const y = Phaser.Math.Between(room.top + 2, room.bottom - 2);
        this.stuffLayer.weightedRandomize(x, y, 1, 1, TILES.POT);
      } else {
        // 25% of either 2 or 4 towers, depending on the room size
        if (room.height >= 9) {
          this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX - 1, room.centerY + 1);
          this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX + 1, room.centerY + 1);
          this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX - 1, room.centerY - 2);
          this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX + 1, room.centerY - 2);
        } else {
          this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX - 1, room.centerY - 1);
          this.stuffLayer.putTilesAt(TILES.TOWER, room.centerX + 1, room.centerY - 1);
        }
      }
    });

    this.stuffLayer.setCollisionByExclusion([-1, 6, 7, 8, 26]);


    this.dungeon.drawToConsole({
      empty: " ",
      emptyAttributes: "rgb(0, 0, 0)",
      wall: "#",
      wallAttributes: "rgb(255, 0, 0)",
      floor: "0",
      floorAttributes: "rgb(210, 210, 210)",
      door: "x",
      doorAttributes: "rgb(0, 0, 255)",
      containerAttributes: "15px"
    });

    this.anims.create({
      key: "player-walk",
      frames: this.anims.generateFrameNumbers("characters", { start: 46, end: 49 }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: "player-walk-back",
      frames: this.anims.generateFrameNumbers("characters", { start: 65, end: 68 }),
      frameRate: 8,
      repeat: -1
    });


    ///Pour ajouter le joueur, attention on le met en 0,0 car on va le mettre dans un container
    this.player = this.physics.add.sprite(0, -10, 'characters', 6);
    this.player.setSize(40, 40); 

    //on crée le containeur qui va contenir le joueur, nom et arme
    this.container = this.add.container(map.widthInPixels / 2, map.heightInPixels / 2); 
    //one lui donne une taille
    this.container.setSize(40, 40); 
    //Ajout d'on objet dans le monde
    this.physics.world.enable(this.container);

    //ona joute le player
    this.container.add(this.player);

    //creation d'une arme, attention l'origine
    this.weapon = this.physics.add.sprite(20, 0, 'sword');
    //this.weapon.setScale(0.5);
    this.weapon.setSize(30, 30);         
    
    this.physics.world.enable(this.weapon);

    //on ajoute le conteneur
    this.container.add(this.weapon);

    //Ajout du texte pour le nom du personnage
    var text = this.add.text(0, -30, 'Julien');
    text.font = "Arial";
    text.setOrigin(0.5, 0.5);
    this.container.add(text);

    //la camera suit le conteneur et on peut scroller partout
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.container);
    this.cameras.main.roundPixels = true;
      
    // don't go out of the map
    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;
    this.container.body.setCollideWorldBounds(true);
    
    // pour indiquer les collisions avec les murs
    this.physics.add.collider(this.container, this.groundLayer);
    this.physics.add.collider(this.container, this.stuffLayer);

    //met des monstre étoiles
    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: map.widthInPixels / 2, y: map.heightInPixels / 2+60, stepX: 70 }
    });

    //Pour ajouter un event quand on touche une étoile avec l'épée
    this.physics.add.overlap(this.weapon, this.stars, this.onMeetEnemy, null, this);

    //Quand le joueur collisionne l'étoile, on perds une vie par exemple
    this.physics.add.collider(this.player, this.stars, this.touchEnemy, false, this);
     
    this.keys = this.input.keyboard.createCursorKeys();
  }

  onMeetEnemy(weapon, star) {
    if (this.attacking) {
      console.log("supper" +weapon);
      star.disableBody(true, true);
    }
  }

  touchEnemy()
  {
    console.log("hurt me");
    this.testMessageBox();
  }

  update() {
    //this.player.update();
    const keys = this.keys;
    //var sprite = this.sprite;
    const speed = 80;
    const prevVelocity = this.container.body.velocity.clone();

    // Stop any previous movement from the last frame
    this.container.body.setVelocity(0);

    // Horizontal movement
    if (keys.left.isDown) {
        this.container.body.setVelocityX(-speed);

      this.player.setFlipX(true);
      this.weapon.setFlipX(true);

      //pour mettre l'épée en cohérence avec le player
      this.right=false;
      this.up=false;
      this.down=false;
      if(!this.left)
      {
        this.weapon.x=this.player.x-20;
        this.weapon.y=this.player.y+10;
        this.left=true;
      }

    } else if (keys.right.isDown) {
  
      this.container.body.setVelocityX(speed)
 
      this.player.setFlipX(false);
      this.weapon.setFlipX(false);

      //pour mettre l'épée en cohérence avec le player
      this.left=false;
      this.up=false;
      this.down=false;
      if(!this.right)
      {
        this.weapon.x=this.player.x+20;
        this.weapon.y=this.player.y+10;
        this.right=true;
      }
    }

    // Vertical movement
    if (keys.up.isDown) {
      this.container.body.setVelocityY(-speed)

      //pour mettre l'épée en cohérence avec le player
      this.down=false;
      this.right=false;
      this.left=false;
      if(!this.up)
      {
        this.weapon.y=this.player.y-15;
        this.weapon.x=this.player.x;
        this.up=true;
      }
    } else if (keys.down.isDown) {  
      this.container.body.setVelocityY(speed);

      //pour mettre l'épée en cohérence avec le player
      this.up=false;
      this.right=false;
      this.left=false;
      if(!this.down)
      {
        this.weapon.y=this.player.y+25;
        this.weapon.x=this.player.x;
        this.down=true;
      }
    }


    //Pour faire bouger l'épée si espace est appué
    if (Input.Keyboard.JustDown(keys.space) && !this.attacking) {
      this.attacking = true;
      this.showMessageBox('youyyu ');
      setTimeout(() => {
        this.attacking = false;
        this.weapon.angle = 0;
      }, 150);
    }

    //pour faire l'animation de l'épée
    if (this.attacking) {
      if (this.weapon.flipX) {
        this.weapon.angle -= 10;
      } else {
        this.weapon.angle += 10;
      }
    }

    // Normalize and scale the velocity so that sprite can't move faster along a diagonal
    this.container.body.velocity.normalize().scale(speed);

    // Update the animation last and give left/right/down animations precedence over up animations
    if (keys.left.isDown || keys.right.isDown || keys.down.isDown) {
      this.player.anims.play("player-walk", true);
    } else if (keys.up.isDown) {
      this.player.anims.play("player-walk-back", true);
    } else {
      this.player.anims.stop();

      // If we were moving & now we're not, then pick a single idle frame to use
      if (prevVelocity.y < 0) this.player.setTexture("characters", 65);
      else this.player.setTexture("characters", 46);
    }
  }

  testMessageBox() {
    //call this line of code when you want to show the message box
    //message, width and height
    this.showMessageBox("HELLO THERE! Put Some Text Here!", 300, 300);
}
  //
  //w=width
  //h=height
  //
  showMessageBox(text, w = 100, h = 100) {
      //just in case the message box already exists
      //destroy it
      console.log("test");
      if (this.msgBox) {
          this.msgBox.destroy();
      }
      //make a group to hold all the elements
      var msgBox = this.add.container(this.container.x, this.container.y)
      //make the back of the message box
      var back = this.add.sprite(0,0, "characters");
      //make the close button
      var closeButton = this.add.sprite(0,0, "sword");
      //make a text field
      var text1 = this.add.text(0,0, text);
      //set the textfeild to wrap if the text is too long
      text1.wordWrap = true;
      //make the width of the wrap 90% of the width 
      //of the message box
      text1.wordWrapWidth = w * .9;
      //
      //
      //set the width and height passed
      //in the parameters
      back.width = w;
      back.height = h;
      //
      //
      //
      //add the elements to the group
      msgBox.add(back);
      msgBox.add(closeButton);
      msgBox.add(text1);
      //
      //set the close button
      //in the center horizontally
      //and near the bottom of the box vertically
      closeButton.x = back.width / 2 - closeButton.width / 2;
      closeButton.y = back.height - closeButton.height;
      //enable the button for input
      closeButton.inputEnabled = true;
      //add a listener to destroy the box when the button is pressed
      //closeButton.events.onInputDown.add(this.hideBox, this);
      //
      //
      //set the message box in the center of the screen
      console.log(this.container.x+":"+this.container.y);
      
      //set the text in the middle of the message box
      text1.x = back.width / 2 - text1.width / 2;
      text1.y = back.height / 2 - text1.height / 2;
      //make a state reference to the messsage box
      this.msgBox = msgBox;
      this.container.body.moves = false;

      //permet de supprimer l'association des touches
      this.input.keyboard.removeAllKeys();

      //pour les touches http://labs.phaser.io/edit.html?src=src/input/keyboard/retro%20leaderboard.js

      //this.keys = this.input.keyboard.createCursorKeys();

     // var key3 = this.input.keyboard.addKey(Input.Keyboard.left);
      this.input.keyboard.on('keyup', this.testKeyboardLeft, this);
  }
  hideBox() {
      //destroy the box when the button is pressed
      this.msgBox.destroy();
  }

  testKeyboardLeft () {
    console.log("test")
}
}
