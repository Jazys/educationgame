<template>
<v-container class="pa-0 ma-0 mb-0">
  <div class="grid-container" :style="`--height: ${gridRowGamenHeight}`">   
    <div class="game" :id="containerId" v-if="downloaded" />
    <div class="placeholder" v-else>
      Downloading ...
    </div> 
   <div class="controller" ref="toto">
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

   <v-dialog
      v-model="dialog"
      class="mx-auto "      
      v-on:keyup="keymonitor" 
    >
      <v-card>
        <v-card-title class="headline">
          Question pour un champion !
        </v-card-title>

        <v-card-text>
          Ici il faut créer une question vis à vis du coffre ouvert. A chaque bonne réponse tu gagnes des points

          <v-row class="mx-auto"
              no-gutters>
            <v-col class="mx-auto" no-gutters  
            md="6"
              >
                <v-btn
                  color="green darken-1"
                  text
                  focus
                  ref="answer1"
                  @click="dialog = false"
                >
                Réponse 1
              </v-btn>
              <v-btn
                color="green darken-1"
                text
                focus
                ref="answer2"
                @click="dialog = false"
              >
                Réponse 2
              </v-btn>
            </v-col>
          </v-row>
           <v-row class="mx-auto" 
              no-gutters>
          <v-col class="mx-auto" no-gutters
            md="6">
           <v-btn
            color="green darken-1"
            text
            ref="answer3"
            @click="dialog = false"
          >
            Réponse 3
          </v-btn>

           <v-btn
            color="green darken-1"
            text
            ref="answer4"
            @click="dialog = false"
          >
            Réponse 4
          </v-btn>
          </v-col>
          
          </v-row>  

          
        </v-card-text>
        <v-card-actions>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</v-container>
</template>


<script>
import {selectPort, init , listPort} from '@/singleton/serial'
import { isMobile } from 'mobile-device-detect';
import socket from '@/singleton/socket'


        
export default {
  name: 'Game',
  data() {
    return {
      gameIsLaunchInMobile: isMobile,
      downloaded: false,
      gameInstance: null,
      containerId: 'game-container',
      //gridRowGamenHeight:'100%',
      //gameScreenHeight: window.innerHeight-(window.innerHeight/10),
      gridRowGamenHeight:'90%',
      gameScreenHeight: window.innerHeight-(window.innerHeight/10),
      gameScreenWidth: window.innerWidth,
      useElectronWithSerialPort:false,
      dialog:false,
    }
  },

  //permet de scruter les changements d'état du store
  watch: {

    '$store.state.msgBox.state': function() {
      if( this.$store.state.msgBox.state)
      {
        //met la scene en pause
        this.gameInstance.scene.pause(this.$store.state.msgBox.sceneName) 

        //Pour jouer avec les scenes
        //this.gameInstance.scene.sleep("DungeonScene") 
        //this.gameInstance.scene.start("PlayScene")
        //this.gameInstance.scene.stop("PlayScene") 
        //this.gameInstance.scene.wake("DungeonScene") 
        //this.gameInstance.scene.switch("DungeonScene")


        //affiche la boite de dialoge
        this.dialog=true;
        const self = this;
        setTimeout(function () {
          console.log(self.$refs.answer1);
          self.$refs.answer1.$el.focus()
        }, 100)
      }      
     
    },

    '$store.state.restart': async function() {
      
      //Pour recharger brutalement le jeu car le restart ne fonctionne pas pour le dungeon
      if( this.$store.state.restart==1)
      {      
        //met la scene en pause
        //const game = await import(/* webpackChunkName: "game" */ '@/game/game')
        //this.gameInstance = game.launch(this.containerId, this.$store, this.gameScreenHeight,this.gameScreenWidth)
        //this.gameInstance.scene.switch("PlayScene")
        //this.gameInstance.scene.stop("PlayScene") 
        //this.gameInstance.scene.start("DungeonScene") 
        //Pour jouer avec les scenes
        window.location.reload();
       
      }      
     
    },

    'dialog': function() {
      if( this.dialog==false)
      {
        //pour remettre le jeu en marche
        this.gameInstance.scene.wake(this.$store.state.msgBox.sceneName);
        this.$store.commit('disableMessageBox','');        
      }      
     
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


    socket.onerror = function() {
        console.log('Connection Error');
    };

    socket.onopen = function() {
        console.log('WebSocket Client Connected');

        /*function sendNumber() {
            if (client.readyState === client.OPEN) {
                var number = Math.round(Math.random() * 0xFFFFFF);
                client.send(number.toString());
                setTimeout(sendNumber, 1000);
            }
        }
        sendNumber();*/
    };

    socket.onclose = function() {
        console.log('echo-protocol Client Closed');
    };  

    var self=this;

    socket.onmessage = function(e) {
        if (typeof e.data === 'string') {
            console.log("Received: '" + e.data + "'");
            self.gameInstance.registry.events.emit('MOVE',e.data)   
        }
    };

  },
   methods: {
     move: async function (type_move) {      

      if(this.gameIsLaunchInMobile==false)
       this.gameInstance.registry.events.emit('MOVE',type_move)    
  
    },

    touch_move: function (type_move) {      
      if(this.gameIsLaunchInMobile)
       this.gameInstance.registry.events.emit('MOVE',type_move)   

     
      
    },

    keymonitor: function(event) {
      console.log(event.key);
       if(event.key == "Enter")
       {
         console.log("enter key was pressed!");
       }
    },
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