<template>
  <div id="app">
    <alert :min="min" :max="max"></alert>
    <router-view/>
  </div>
</template>
<script>
import Alert from './components/alert/alert'
export default {
  data () {
    return {
      min: true,
      max: true
    }
  },
  components:{
    Alert
  }
}
</script>
