import { Scene, Input } from 'phaser'
import Dungeon from "@mikewesthad/dungeon";

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
    const dungeon = new Dungeon({ 
      width: 50,
      height: 50,
      rooms: {
        width: { min: 7, max: 15 },
        height: { min: 7, max: 15 },
        maxRooms: 12
      }
    });

    // Create a blank tilemap with dimensions matching the dungeon
    const map = this.make.tilemap({
      tileWidth: 48,
      tileHeight: 48,
      width: dungeon.width,
      height: dungeon.height
    });
    const tileset = map.addTilesetImage("tiles", null, 48, 48, 1, 2); // 1px margin, 2px spacing
    const layer = map.createBlankDynamicLayer("Layer 1", tileset);

    // Get a 2D array of tile indices (using -1 to not render empty tiles) and place them into the
    // blank layer
    const mappedTiles = dungeon.getMappedTiles({ empty: -1, floor: 6, door: 6, wall: 20 });
    layer.putTilesAt(mappedTiles, 0, 0);
    layer.setCollision(20); // We only need one tile index (the walls) to be colliding for now

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
    this.physics.add.collider(this.container, layer);

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
}
