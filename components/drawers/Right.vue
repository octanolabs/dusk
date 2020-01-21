<template>
  <resizable-drawer side="right" :app="false" />
</template>

<script>
import ResizableDrawer from '@/components/drawers/Resizable'

export default {
  components: {
    ResizableDrawer
  },
  computed: {
    pending() {
      return this.$store.state.txpool.pending
    }
  }
}
</script>
