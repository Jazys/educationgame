<template>
<v-container class="pa-0 ma-0 mb-0">
  <div class="grid-container" :style="`--height: ${gridRowGamenHeight}`">   
    <div class="game" :id="containerId" v-if="downloaded" />
    <div class="placeholder" v-else>
      Downloading ...
    </div> 
   <div class="controller">
     <div class="jump">
      <button class="buttonAction" v-on:click="move('jump')" >
        Sauter
      </button>
      </div>
      <div class="move_left">
      <button class="buttonAction" @mousedown="move('left_down')" @mouseup="move('left_up')" @touchstart="touch_move('left_down')" @touchend="touch_move('left_down')">
        Gauche
      </button>
      </div>
      <div class="move_right">
      <button class="buttonAction" @mousedown="move('right_down')" @mouseup="move('right_up')" @touchstart="touch_move('right_down')" @touchend="touch_move('right_down')">
        Droite
      </button>
      </div>
   </div>
  </div>
</v-container>
</template>


<script>
import socket from '@/singleton/socket'
import {selectPort, init , listPort} from '@/singleton/serial'
import { isMobile } from 'mobile-device-detect';


        
export default {
  name: 'Game',
  data() {
    return {
      gameIsLaunchInMobile: isMobile,
      downloaded: false,
      gameInstance: null,
      containerId: 'game-container',
      gridRowGamenHeight:'90%',
      gameScreenHeight: window.innerHeight-(window.innerHeight/10),
      gameScreenWidth: window.innerWidth,
      useElectronWithSerialPort:false,
    }
  },
  async mounted() {

    //Pour la gestion du menu du bas
    if( (window.innerHeight/10) < 30)
    {
      this.gridRowGamenHeight="75%"
      this.gameScreenHeight=window.innerHeight-(window.innerHeight/30)
    }
    else if((window.innerHeight/10) < 40)
    {
      this.gridRowGamenHeight="80%"
      this.gameScreenHeight=window.innerHeight-(window.innerHeight/20)
    }
    else if((window.innerHeight/10) < 50)
    {
      this.gridRowGamenHeight="85%"
      this.gameScreenHeight=window.innerHeight-(window.innerHeight/15)
    }
    
    //Pour la gestion du port serie
    if (this.useElectronWithSerialPort)
    {             
      let allSerailPort = await listPort()
      console.log(allSerailPort)
      selectPort('COM10')
      init()

    }

    //Pour charger le jeu
    const game = await import(/* webpackChunkName: "game" */ '@/game/game')
    this.downloaded = true  
    this.$nextTick(() => {
      this.gameInstance = game.launch(this.containerId, this.$store, this.gameScreenHeight,this.gameScreenWidth)
    })


    //Socket IO pour l'un message provenant du serveur
    socket.on('reply', (data) => {
            /* eslint-disable no-console */
            console.log('socket io message '+ data)
            
            //Emission d'un event dans le jeu
            //self.gameInstance.registry.events.emit('ATTAK',{weapon:'sword',strength:5,monster:'pet'})
        });

    //Pour émettre un message
    socket.emit('message', {
                user: 'tt', 
                message: 'this.message'
            }) 

  },
   methods: {
    move: function (type_move) {      

      if(this.gameIsLaunchInMobile==false)
       this.gameInstance.registry.events.emit('MOVE',type_move)   
    },

    touch_move: function (type_move) {      
      if(this.gameIsLaunchInMobile)
       this.gameInstance.registry.events.emit('MOVE',type_move)   
    }
  },
  destroyed() {
    this.gameInstance.destroy(false)
  }
}
</script>


<style lang="scss" scoped>
.placeholder {
  font-size: 2rem;
  font-family: 'Courier New', Courier, monospace;
}

.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: var(--height) 10%;
  gap: 0px 0px;
  grid-template-areas:
    "game game game game"
    "controller controller controller controller";
}
.game { grid-area: game; }
.controller {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0px 0px;
  grid-template-areas:
    "jump move_left move_right"
    "jump move_left move_right";
  grid-area: controller;
}
.jump { grid-area: jump; }
.move_left { grid-area: move_left; }
.move_right { grid-area: move_right; }

.buttonAction {
  position: relative;
  display: inline-flex;
  font-size: 24px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  letter-spacing: 0.0892857143em;
  justify-content: center;
  text-indent: 0.0892857143em;
  text-transform: uppercase;
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;
  outline: none;
  color: #fff;
  background-color: #4c54af;
  border: none;
  border-radius: 15px;
  box-shadow: 0 9px #999;
}

.buttonAction:hover {background-color: #3e8e41}

.buttonAction:active {
  background-color: #3e8e41;
  box-shadow: 0 5px #666;
  transform: translateY(4px);
}


</style>