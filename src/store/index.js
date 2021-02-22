import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: -1,
    msgBox: { state: false, index: -1, sceneName:''},
  },

  mutations: {

    initMessageBox(state){
      state.count=0;     
    },

    enableMessageBox (state, value) {
      //console.log(state)
      console.log(value)
      state.msgBox.state=true;
      state.msgBox.index=10;
      state.msgBox.sceneName=value.data.sceneName;
      state.count++
    },

    disableMessageBox (state, value) {
      //console.log(state)
      console.log(value)
      state.msgBox.state=false;
      state.msgBox.index=10;
      state.msgBox.sceneName='';
      state.count++
    },
    
  },
  actions: {
  },
  modules: {
  }
})
