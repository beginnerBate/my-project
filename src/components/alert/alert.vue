<template>
  <div class="alert">
    <div class="alert-wrapper">
      <div class="alert-content" ref="alertwrapper">
        <header>
          <h1>{{title}}</h1>
          <ul>
            <li v-if="min" @click="changemin()"><span>最小化</span></li>
            <li v-if="max"><span>最大化</span></li>
            <li v-if="off"><span>关闭</span></li>
          </ul>
        </header>
        <div>
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '请点击所属区域登录'
    },
    min:{
       type: Boolean,
       default: false
    },
    max:{
       type:Boolean,
       default: false
    },
    off:{
      type:Boolean,
      default:false
    },
    type: {
      type: String,
      default: 'onclose' //  [onclose,close]
    }
  },
  data () {
    return {
      wrapper: ''
    }
  },
  mounted () {
    this.$nextTick(()=>{
      this._getWrapper()
    })
  },
  methods: {
    changemin () {
      this.wrapper.classList.add('min')
      console.log(this.wrapper)
    },
    _getWrapper () {
      this.wrapper = this.$refs.alertwrapper
    }
  }
}
</script>

<style lang="stylus">
.alert
  position fixed 
  top 0
  right 0
  bottom 0
  left 0
  background rgba(0,0,0,0.5)
  text-align center 
  white-space nowrap
  z-index 99
.alert:after
  content ''
  display inline-block
  height 100%
  vertical-align middle
.alert-wrapper
  display inline-block
  vertical-align middle
  border-radius 1px
  background-color #ffffff
  text-align left 
  white-space normal
  
.alert-content
  box-sizing border-box
  width 60vw
  height 80vh
  transition all 2s
  background-color #ffffff
.min
  position fixed
  left 0
  bottom 0
  width 400px
  height 60px
  transition all 0.5s
.alert-content header 
  display flex
</style>

