import {Scene, Math, GameObjects} from 'phaser'
import tile from '@/game/assets/map/spritesheet.png'
import map from '@/game/assets/map/map.json'
import dragonblue from '@/game/assets/dragonblue.png'
import dragonorrange from '@/game/assets/dragonorrange.png'
import player from '@/game/assets/RPG_assets.png'
import sword from '@/game/assets/sword.png'


export class BootSceneRPG extends Scene {
    constructor () {
      super({ key: 'BootSceneRPG' })
    }

   
    preload ()
    {
        // map tiles
        this.load.image('tiles',tile);
        
        // map in json format
        this.load.tilemapTiledJSON('map', map);
        
        // enemies
        this.load.image("dragonblue", dragonblue);
        this.load.image("dragonorrange", dragonorrange);

        this.load.image("sword", sword);
        
        // our two characters
        this.load.spritesheet('player', player, { frameWidth: 16, frameHeight: 16 });
    }

    create ()
    {
        // start the WorldScene
        this.scene.start('WorldScene');
    }
}

export class WorldScene extends Scene {
        constructor () {
          super({ key: 'WorldScene' })
          this.container=null;
        }

    preload ()
    {
        
    }

    create ()
    {
        // create the map
        var map = this.make.tilemap({ key: 'map' });
        
        // first parameter is the name of the tilemap in tiled
        var tiles = map.addTilesetImage('spritesheet', 'tiles');
        
        // creating the layers
        var grass = map.createStaticLayer('Grass', tiles, 0, 0);
        console.log(grass);
        var obstacles = map.createStaticLayer('Obstacles', tiles, 0, 0);
        
        // make all tiles in obstacles collidable
        obstacles.setCollisionByExclusion([-1]);
        
        //  animation with key 'left', we don't need left and right as we will use one and flip the sprite
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13]}),
            frameRate: 10,
            repeat: -1
        });
        
        // animation with key 'right'
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13] }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', { frames: [2, 8, 2, 14]}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', { frames: [ 0, 6, 0, 12 ] }),
            frameRate: 10,
            repeat: -1
        });        

        // our player sprite created through the phycis system
        this.player = this.physics.add.sprite(0, 0, 'player', 6);
        var weapon = this.physics.add.sprite(8, 0, 'sword');
        weapon.setScale(0.5);
        weapon.setSize(30, 30);

        this.container = this.add.container(this.player.x,this.player.y); 
        this.container.setSize(16, 16);    
        this.physics.world.enable(this.container);
        this.container.add(this.player);
        this.physics.world.enable(weapon);
        this.container.add(weapon);
       
   
         
        // don't go out of the map
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.container.body.setCollideWorldBounds(true);
        
        // don't walk on trees
        this.physics.add.collider(this.container, obstacles);

        

        // limit camera to map
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.container);
        this.cameras.main.roundPixels = true; // avoid tile bleed
    
        // user input
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // where the enemies will be
        this.spawns = this.physics.add.group({ classType: GameObjects.Zone });
        for(var i = 0; i < 30; i++) {
            var x = Math.RND.between(0, this.physics.world.bounds.width);
            var y = Math.RND.between(0, this.physics.world.bounds.height);
            // parameters are x, y, width, height
            this.spawns.create(x, y, 20, 20);            
        }        
        // add collider
        this.physics.add.overlap(this.container, this.spawns, this.onMeetEnemy, false, this);
        // we listen for 'wake' event
        this.sys.events.on('wake', this.wake, this);
    }

    wake() {
        this.cursors.left.reset();
        this.cursors.right.reset();
        this.cursors.up.reset();
        this.cursors.down.reset();
    }

    onMeetEnemy(zone) {        
        // we move the zone to some other location
        zone.x = Math.RND.between(0, this.physics.world.bounds.width);
        zone.y = Math.RND.between(0, this.physics.world.bounds.height);
        
        // shake the world
        this.cameras.main.shake(300);
        
        this.input.stopPropagation();
        // start battle 
        this.scene.switch('BattleScene');                
    }

    update ()
    {             
        this.container.body.setVelocity(0);
        
        // Horizontal movement
        if (this.cursors.left.isDown)
        {
            this.container.body.setVelocityX(-80);
        }
        else if (this.cursors.right.isDown)
        {
            this.container.body.setVelocityX(80);
        }
        // Vertical movement
        if (this.cursors.up.isDown)
        {
            this.container.body.setVelocityY(-80);
        }
        else if (this.cursors.down.isDown)
        {
            this.container.body.setVelocityY(80);
        }    

        // Update the animation last and give left/right animations precedence over up/down animations
        if (this.cursors.left.isDown)
        {
            this.player.anims.play('left', true);
            this.player.flipX = true;
        }
        else if (this.cursors.right.isDown)
        {
            this.player.anims.play('right', true);
            this.player.flipX = false;
        }
        else if (this.cursors.up.isDown)
        {
            this.player.anims.play('up', true);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.anims.play('down', true);
        }
        else
        {
            this.player.anims.stop();
        }
    }
    
}

