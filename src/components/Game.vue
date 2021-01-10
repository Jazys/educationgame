<template>
<v-container>
  <v-btn> state </v-btn>
  <div :id="containerId" v-if="downloaded" />
  <div class="placeholder" v-else>
    Downloading ...
  </div>
</v-container>
</template>


<script>
import io from 'socket.io-client';
//import serialPort from 'serialport'; // https://github.com/CaiBaoHong/serial-port-gui
//https://web.dev/serial/
//npm install --global --production windows-build-tools
const sp = require('serialport')

        
export default {
  name: 'Game',
  data() {
    return {
      downloaded: false,
      gameInstance: null,
      containerId: 'game-container',
      socket : io('localhost:5030',)
    }
  },
  async mounted() {

    sp.list(function (error, ports) {
        if (error) {
          console.log(error)
        } else {
          console.log(ports)
        }
      })

    if ("serial" in navigator) {
      // The Serial API is supported.
      console.log("cool")
    }

    //const ports = await navigator.serial.getPorts();

    const game = await import(/* webpackChunkName: "game" */ '@/game/game')
    this.downloaded = true  
    this.$nextTick(() => {
      this.gameInstance = game.launch(this.containerId, this.$store)
    })

    /*serialPort.list((err, ports) => {
      console.log('ports', ports);
      if (err) {
        console.log(err.message)
        return
      } else {
        console.log(err.message)
      }

      if (ports.length === 0) {
        console.log("no")
      }else
      {
        console.log(ports)
      }

    })*/

    this.socket.on('reply', (data) => {
            console.log('socket io message '+ data)
            // you can also do this.messages.push(data)
        });

  this.socket.emit('message', {
                user: 'tt', 
                message: 'this.message'
            })

    var self=this;
    setInterval(function() {
                        //console.log(self.$store.state.count)
                        self.gameInstance.registry.events.emit('ATTACK',{weapon:'sword',strength:5,monster:'pet'})
                   }, 1000);

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
</style>