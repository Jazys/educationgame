import Phaser from 'phaser'
import BootScene from './scenes/BootScene'
import PlayScene from './scenes/PlayScene'
import DungeonScene from "./scenes/dungeon-scene.js";
import {BootSceneRPG,WorldScene} from './scenes/rpg/world'
import {BattleScene, UIScene} from './scenes/rpg/battle'
import event from './events'

//https://github.com/StackAbuse/creating-a-platformer-with-phaser-3
// un rpg https://phaser.discourse.group/t/wip-my-first-game-a-phaser-3-dungeon-crawler-rpg/8681
// 
// https://github.com/B3L7/phaser3-tilemap-pack  ==> interessant
// https://github.com/OlawaleJoseph/RPG-GAME/tree/develop/src/scenes

function launch(containerId, store, heigthGame, widthGame) {

  console.log(heigthGame +":"+ widthGame)
  const game =  new Phaser.Game({
    type: Phaser.AUTO,
    parent: containerId,      
    width: widthGame,
    height: heigthGame,    
    pixelArt: true,        
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: true
      }
    },
    //scene: [BootScene, PlayScene],
   scene: [BootScene, PlayScene, DungeonScene, BootSceneRPG, WorldScene, BattleScene, UIScene],  
   //scene: [BootSceneRPG, WorldScene, BattleScene,UIScene,BootScene, PlayScene, DungeonScene], 
  })

  game.registry.events = event

    // append the Vuex store to EventEmitter
    game.registry.events.store = store
  
    // if there is no pre-existing game state, initialize it
    /* eslint-disable no-console */
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
