//Pour la gestion des évènements sous phaser
const { Events } = require('phaser')
const events = new Events.EventEmitter()

//réception d'un évènement de phaser vers vueJS, en l'occurence le store
events.on('bounce', (data) => {
 
  events.store.commit('enableMessageBox', {  
    eventName: 'bounce',
    data
  })

  //events.emit("ATTACK",{weapon:'sword',strength:5,monster:'dragon'})
})

events.on('restart', (data) => {
 
  events.store.commit('restart', {  
    eventName: 'bounce',
    data
  })

  //events.emit("ATTACK",{weapon:'sword',strength:5,monster:'dragon'})
})

export default events