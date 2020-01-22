<template>
  <v-navigation-drawer
    ref="drawer"
    :class="{
      'resizable-drawer': true,
      'resizable-drawer-right': side === 'right',
      'resizable-drawer-left': side === 'left'
    }"
    :left="side === 'left'"
    :right="side != 'left'"
    :clipped="side === 'left'"
    :width="width"
    :value="show"
    :app="app && expanded"
    fixed
  >
    <v-tooltip :left="left" :right="right">
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          @click.stop="toggle()"
          :class="{ 'drawer-handle': true, left: left, right: right }"
          color="secondary"
        >
          <v-icon
            v-if="expanded"
            :class="{
              'pl-0': left,
              'pr-2': left,
              'pl-2': right,
              'pr-0': right
            }"
          >
            {{ left ? 'mdi-chevron-left' : 'mdi-chevron-right' }}
          </v-icon>
          <v-icon
            v-else
            :class="{
              'pl-0': left,
              'pr-2': left,
              'pl-2': right,
              'pr-0': right
            }"
          >
            {{ left ? 'mdi-chevron-right' : 'mdi-chevron-left' }}
          </v-icon>
        </v-btn>
      </template>
      <span v-if="expanded">Hide</span>
      <span v-else>Expand</span>
    </v-tooltip>
    <v-sheet class="resizable-drawer-content">
      <slot></slot>
    </v-sheet>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    side: {
      type: String,
      default() {
        return 'right'
      }
    },
    app: {
      type: Boolean,
      default() {
        return true
      }
    },
    show: {
      type: Boolean,
      default() {
        return true
      }
    }
  },
  data: () => {
    return {
      shown: false,
      width: '372px',
      borderSize: 4
    }
  },
  computed: {
    expanded() {
      return this.width.slice(0, -2) > 20
    },
    left() {
      return this.side === 'left'
    },
    right() {
      return this.side === 'right'
    }
  },
  mounted() {
    this.setBorderWidth()
    this.setEvents()
  },
  methods: {
    toggle(e) {
      const el = this.$refs.drawer.$el
      let w = 372
      if (this.expanded) {
        w = 20
      }
      el.style.width = w + 'px'
      el.style.transition = 'initial'
      this.width = el.style.width
    },
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
  }
}
</script>
<style>
.resizable-drawer {
  min-width: 20px;
  background-color: rgba(0, 0, 0, 0) !important;
}

.resizable-drawer-left > .v-navigation-drawer__border {
  margin-right: 20px;
}

.resizable-drawer-right > .v-navigation-drawer__border {
  margin-left: 20px;
}

.resizable-drawer-left {
  padding-right: 20px;
}

.resizable-drawer-right {
  padding-left: 20px;
}

.resizable-drawer-content {
  width: 100%;
  height: 100%;
}

.drawer-handle {
  position: absolute;
  top: calc(50vh - 60px);
  z-index: 10 !important;
  height: 40px;
  width: 20px !important;
  min-width: 10px !important;
  padding: 0 !important;
  margin: 0 !important;
  opacity: 0.5;
  text-align: center;
  overflow: hidden;
}

.drawer-handle:hover {
  opacity: 1;
}

.drawer-handle .v-btn__content {
  overflow: hidden;
}

.drawer-handle.left {
  right: 0 !important;
  border-radius: 0 20px 20px 0;
}

.drawer-handle.right {
  left: 0 !important;
  border-radius: 20px 0 0 20px;
}
</style>
