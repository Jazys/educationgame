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
      ref="test1"
    >
      <v-card>
        <v-card-title class="headline" ref="test2">
          Use Google's location service?
        </v-card-title>

        <v-card-text>
          Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.

          <v-row class="mx-auto"
              no-gutters>
            <v-col class="mx-auto" no-gutters  
            md="6"
              >
                <v-btn
                  color="green darken-1"
                  text
                  focus
                  ref="supertest"
                  @click="dialog = false"
                >
                Disagree
              </v-btn>
              <v-btn
                color="green darken-1"
                text
                focus
                ref="supertest"
                @click="dialog = false"
              >
                Disagree
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
            @click="dialog = false"
          >
            Agree
          </v-btn>

           <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            Agree
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
      gridRowGamenHeight:'90%',
      gameScreenHeight: window.innerHeight-(window.innerHeight/10),
      gameScreenWidth: window.innerWidth,
      useElectronWithSerialPort:false,
      dialog:false,
    }
  },
  watch: {

    '$store.state.msgBox.state': function() {
      if( this.$store.state.msgBox.state)
      {
       
        this.gameInstance.scene.pause(this.$store.state.msgBox.sceneName) 
        this.dialog=true;
        const self = this;
        setTimeout(function () {
          console.log(self.$refs.supertest);
          self.$refs.supertest.$el.focus()
        }, 100)
      }      
     
     
      console.log(this.$store.state.count)
    },

    'dialog': function() {
      if( this.dialog==false)
      {
        this.gameInstance.scene.wake(this.$store.state.msgBox.sceneName);
        this.$store.commit('disableMessageBox','');        
      }      
     
     
      console.log(this.$store.state.count)
    }
  },
  async mounted() {


    console.log(this.$store.state)

    console.log(this.$refs)

   

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
    move: function (type_move) {      

      if(this.gameIsLaunchInMobile==false)
       this.gameInstance.registry.events.emit('MOVE',type_move)  

       if(type_move=='right_up')
       {
      this.gameInstance.scene.sleep("DungeonScene") 
      this.gameInstance.scene.start("PlayScene") 
       }

       if(type_move=='left_up')
       {
      this.gameInstance.scene.stop("PlayScene") 
      this.gameInstance.scene.wake("DungeonScene") 
       }
    },

    touch_move: function (type_move) {      
      if(this.gameIsLaunchInMobile)
       this.gameInstance.registry.events.emit('MOVE',type_move)   
       this.gameInstance.scene.sleep("PlayScene") 
       this.gameInstance.scene.switch("DungeonScene")
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