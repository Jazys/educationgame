import Phaser from 'phaser'
import BootScene from './scenes/BootScene'
import PlayScene from './scenes/PlayScene'
import event from './events'


function launch(containerId, store) {
  const game =  new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: containerId,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
        debug: false
      }
    },
    scene: [BootScene, PlayScene],  
  })

  game.registry.events = event

    // append the Vuex store to EventEmitter
    game.registry.events.store = store
  
    // if there is no pre-existing game state, initialize it
    console.log(store.state.count)
    if (!store.state.count) {
      event.store.commit('increment', {
        gameName: 'exampleGame',
        prop: 'bounces',
        value: 0
      })
    }

  return game;
}

export default launch
export { launch }
