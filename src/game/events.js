const { Events } = require('phaser')
const events = new Events.EventEmitter()

events.on('bounce', () => {
  let value = events.store.count;
  value++

  events.store.commit('increment', {
    gameName: 'exampleGame',
    prop: 'bounces',
    value
  })

  events.emit("ATTACK",{weapon:'sword',strength:5,monster:'dragon'})
})

export default events