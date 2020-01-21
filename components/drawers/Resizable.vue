<template>
  <v-navigation-drawer
    ref="drawer"
    :left="side === 'left'"
    :right="side != 'left'"
    :clipped="side === 'left'"
    :width="width"
    :value="show"
    :app="app"
    fixed
  >
    <slot></slot>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    side: {
      type: String,
      default() {
        return {}
      }
    },
    app: {
      type: Boolean,
      default() {
        return true
      }
    }
  },
  data: () => {
    return {
      shown: false,
      width: 372,
      borderSize: 3
    }
  },
  computed: {
    direction() {
      return this.$store.state.drawers[this.side] === false ? 'Open' : 'Closed'
    },
    show() {
      return this.$store.state.drawers[this.side]
    }
  },
  methods: {
    setBorderWidth() {
      const i = this.$refs.drawer.$el.querySelector(
        '.v-navigation-drawer__border'
      )
      i.style.width = this.borderSize + 'px'
      i.style.cursor = 'ew-resize'
    },
    setEvents() {
      const minSize = this.borderSize
      const el = this.$refs.drawer.$el
      const drawerBorder = el.querySelector('.v-navigation-drawer__border')
      const vm = this
      const direction = el.classList.contains('v-navigation-drawer--right')
        ? 'right'
        : 'left'

      function resize(e) {
        document.body.style.cursor = 'ew-resize'
        const f =
          direction === 'right'
            ? document.body.scrollWidth - e.clientX
            : e.clientX
        el.style.width = f + 'px'
      }

      drawerBorder.addEventListener(
        'mousedown',
        function(e) {
          if (e.offsetX < minSize) {
            el.style.transition = 'initial'
            document.addEventListener('mousemove', resize, false)
          }
        },
        false
      )

      document.addEventListener(
        'mouseup',
        function() {
          el.style.transition = ''
          vm.width = el.style.width
          document.body.style.cursor = ''
          document.removeEventListener('mousemove', resize, false)
        },
        false
      )
    }
  },
  mounted() {
    this.setBorderWidth()
    this.setEvents()
  }
}
</script>
