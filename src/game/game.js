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

//menu
//https://phasertutorials.com/creating-a-phaser-3-template-part-3/

//doc sur phaser 
// https://github.com/samme/phaser3-faq/wiki#how-do-scenes-work

function launch(containerId, store, heigthGame, widthGame, sceneStart) {

  

  //Par défaut, on démarre le donjon
  let nameSceneStart='DungeonScene';

  //Le jeu en lui même
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
  })

  if(sceneStart!="")
    nameSceneStart=sceneStart

  console.log(heigthGame +":"+ widthGame+ ': '+nameSceneStart);

  //Ajout de toutes les scenes possibles
  game.scene.add("BootScene",BootScene,true, { startnamescene : nameSceneStart});
  game.scene.add("PlayScene",PlayScene,false);
  game.scene.add("DungeonScene",DungeonScene,false);
  game.scene.add("BootSceneRPG",BootSceneRPG,false);
  game.scene.add("WorldScene",WorldScene,false);
  game.scene.add("BattleScene",BattleScene,false);
  game.scene.add("UIScene",UIScene,false);


  game.registry.events = event

    // append the Vuex store to EventEmitter
    game.registry.events.store = store
  
    // if there is no pre-existing game state, initialize it
    /* eslint-disable no-console */
    console.log(store.state.count)
    if (!store.state.count) {
      event.store.commit('initMessageBox', {
        gameName: 'exampleGame',
        prop: 'bounces',
        value: 0
      })
    }

  return game;
}

export default launch
export { launch }
