import { Scene, Math } from 'phaser'
import socket from '@/singleton/socket'

var platforms;
var player;
var cursors;
var stars;
var score = 0;
var scoreText;
var bombs;

 // eslint-disable-next-line no-unused-vars
var button;

export default class PlayScene extends Scene {
  
  constructor () {
    super({ key: 'PlayScene' })
  }  

  create () {

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

    this.add.image(400, 300, 'sky');

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    platforms = this.physics.add.staticGroup();
    cursors = this.input.keyboard.createCursorKeys();
    player = this.physics.add.sprite(100, 450, 'dude').setInteractive();

    bombs = this.physics.add.group();

    player.on('pointerdown', function () {

    player.setVelocityX(300);
    player.anims.play('right', true);

  });

  this.input.on('pointerdown', function(){

    player.setVelocityX(300);
    player.anims.play('right', true);
    // ...
 });


    this.physics.add.collider(bombs, platforms);

    this.physics.add.collider(player, bombs, this.hitBomb, null, this);

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');    

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
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
        frameRate: 10,
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

  actionOnClick()
  {
    console.log("ttoto")
    player.setVelocityX(300);
    player.anims.play('right', true);
  }

  update () {

    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-530);
    }
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
}
