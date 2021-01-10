import { Scene } from 'phaser'


export default class PlayScene extends Scene {
  constructor () {
    super({ key: 'PlayScene' })
  }

  create () {
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
    })

    this.registry.events.on('ATTACK',this.doAttack.bind(this));

    //var self=this;
    setInterval(function() {
      //console.log( "game "+self.registry.events.store.state.count)
                   }, 20);

  }

  update () {
  }

  doAttack(parameter)
{
  console.log('you attacked the '+parameter.monster+' with a '+parameter.weapon);
}
}
