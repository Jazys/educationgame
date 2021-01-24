import { Scene, Math } from 'phaser'
import socket from '@/singleton/socket'

var platforms;
var player;
var cursors;
var stars;
var score = 0;
var scoreText;
var bombs;
var virtualGamePad;
var background ;

 // eslint-disable-next-line no-unused-vars
var button;

export default class PlayScene extends Scene {
  
  constructor () {
    super({ key: 'PlayScene' })
  }  

  create () {

    //pour faire bouger le monde en x
    //https://phaser.discourse.group/t/tilesprite-repeat-is-not-working-correctly/6892

    // pour l'attaque
    // https://phasertutorials.com/how-to-create-a-phaser-3-mmorpg-part-3/

    //pour l'animation de l'attaque
    //https://www.html5gamedevs.com/topic/35951-attacking-with-a-sword-like-older-zelda-games/

    //Pour suivre une ennemy
    //https://blog.ourcade.co/posts/2020/how-to-make-enemy-sprite-rotation-track-player-phaser-3/

    //https://www.html5gamedevs.com/topic/45134-fighting-game-hitboxes-implementation/

    //pour tirer
    // https://phaser.io/examples/v2/weapon/single-bullet

    /*
    this.add.image(400, 300, 'sky')

    const bomb = this.physics.add.image(400, 200, 'bomb')
    bomb.setCollideWorldBounds(true)
    bomb.body.onWorldBounds = true // enable worldbounds collision event
    bomb.setBounce(1)
    bomb.setVelocity(200, 20)

    this.sound.add('thud')
    this.physics.world.on('worldbounds', () => {
      this.registry.events.emit('bounce')
      this.sound.play('thud', { volume: 0.75 })
    })*/

    console.log(this.sys.game.canvas.width);
    //console.log(this.cameras);
    console.log(this.cameras.cameras[0].centerX +" "+this.cameras.cameras[0].centerY);

    

    //this.add.image(this.sys.game.canvas.width/2, this.sys.game.canvas.height/2, 'sky');
    //this.add.image(0, 0, 'sky');
    background=this.add.tileSprite(this.sys.game.canvas.width/2,this.sys.game.canvas.height/2,0,0,'sky').setScrollFactor(0);

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    platforms = this.physics.add.staticGroup();
    cursors = this.input.keyboard.createCursorKeys();
    player = this.physics.add.sprite(100, 450, 'dude').setInteractive().setOrigin(1,0);

    bombs = this.physics.add.group();
    //this.cameras.main.setBounds(0, 0, 720 * 2, 176);
    //this.cameras.main.setBounds(0, 0, 1600, 400);

      


    //on se fixe sur le joueur
    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0,0,Number.MAX_SAFE_INTEGER,0);
    


    //var self=this;

  this.input.on('pointerdown', function(){

    player.setVelocityX(300);
    player.setVelocityY(-530);
    player.anims.play('right', true);
    //self.scale.startFullscreen();
    // ...
 });


    this.physics.add.collider(bombs, platforms);

    this.physics.add.collider(player, bombs, this.hitBomb, null, this);

    platforms.create(40, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(60, 350, 'ground');
    platforms.create(750, 220, 'ground');    

    platforms.create(600, -100, 'ground');  

    //pour spécifier les collisions avec le monde 
    this.physics.world.setBoundsCollision(true, false, false, false);  
    player.setCollideWorldBounds(true);
    player.onWorldBounds = true;

    player.setBounce(0.2);
    

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 20,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 20,
        repeat: -1
    });

    this.physics.add.collider(player, platforms);

   

    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });
    
    stars.children.iterate(function (child) {
    
        child.setBounceY(Math.FloatBetween(0.4, 0.8));
    
    });

    this.physics.add.collider(stars, platforms);

    this.physics.add.overlap(player, stars, this.collectStar, null, this);

    this.registry.events.on('ATTACK',this.doAttack.bind(this));
    this.registry.events.on('MOVE',this.doMove.bind(this));

    socket.on('reply', (data) => {
      /* eslint-disable no-console */
      console.log('socket io message in game '+ data)
      // you can also do this.messages.push(data)
    });

    //var self=this;
    setInterval(function() {
      //console.log( "game "+self.registry.events.store.state.count)
                   }, 20);

  }

  doMove(type_move)
  {    
    if(type_move=='jump')
    {
      if (player.body.onFloor())
      {
          player.setVelocityY(-530);
      }
    }
    else 
    {
      virtualGamePad=type_move;
      console.log(virtualGamePad)
    
    }
  }

  actionOnClick()
  {
    console.log("ttoto")
    player.setVelocityX(300);  
    player.anims.play('right', true);
  }

  update () {    

    //console.log(this.cameras.cameras[0].centerX +" "+this.cameras.cameras[0].centerY);
    //console.log(background.tilePositionX);
    //console.log(player.y)
    //this.background.tilePositionX+=10


    if (virtualGamePad=='left_down'|| cursors.left.isDown)
    {
        player.setVelocityX(-160);

        
        background.tilePositionX=background.tilePositionX+1
        //this.cameras.cameras[0].x=this.cameras.cameras[0].x+1

        player.anims.play('left', true);
        //console.log(player.body)
        //Pour augmenter la taille de la box de touch
        player.body.setSize(32+15, player.body.height);
    }
    else if (cursors.right.isDown || virtualGamePad=='right_down')
    {
        player.setVelocityX(160);

        
        background.tilePositionX=background.tilePositionX-1  
        //this.cameras.cameras[0].x=this.cameras.cameras[0].x-1

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.onFloor())
    {
        player.setVelocityY(-530);
        background.tilePositionY=background.tilePositionY+10       
    }
 
    this.cameras.main.setBounds(0,player.y-this.sys.game.canvas.height+100,Number.MAX_SAFE_INTEGER,0);
    /*
    var scrol_x = player.x - 800;    
    var scrol_y = player.y - 300;    

     this.cameras.main.scrollX = scrol_x;    ///  scrollX - Х top left point of camera
     this.cameras.main.scrollY = scrol_y; */
  }

  doAttack(parameter)
  {
    /* eslint-disable no-console */
    console.log('you attacked the '+parameter.monster+' with a '+parameter.weapon);
  }

  collectStar (player, star)
  {
      star.disableBody(true, true);
      this.sound.play('thud', { volume: 0.75 })
      score += 10;
      scoreText.setText('Score: ' + score);

      if (stars.countActive(true) === 0)
      {
          stars.children.iterate(function (child) {
  
              child.enableBody(true, child.x, 0, true, true);
  
          });
  
          var x = (player.x < 400) ? Math.Between(400, 800) : Math.Between(0, 400);
  
          var bomb = bombs.create(x, 16, 'bomb');
          bomb.setBounce(1);
          bomb.setCollideWorldBounds(true);
          bomb.setVelocity(Math.Between(-200, 200), 20);
  
      }
  }

  hitBomb (player)
  {
      //this.physics.pause();

      player.setTint(0xff0000);

      player.anims.play('turn');

      //gameOver = true;
  }

  //window.addEventListener('resize', resize);
  //resize();
  resize() {
    var canvas = this.canvas, width = window.innerWidth, height = window.innerHeight;
    var wratio = width / height, ratio = canvas.width / canvas.height;
 
    if (wratio < ratio) {
        canvas.style.width = width + "px";
        canvas.style.height = (width / ratio) + "px";
    } else {
        canvas.style.width = (height * ratio) + "px";
        canvas.style.height = height + "px";
    }
}
}
