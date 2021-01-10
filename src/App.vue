<template>
  <Game />
</template>


<script>

// https://supernapie.com/blog/loading-assets-as-data-uri-in-phaser-3/

import Game from '@/components/Game'
export default {
  name: 'App',
  components: { Game }
}
</script>


<style lang="scss">
body {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}
</style>