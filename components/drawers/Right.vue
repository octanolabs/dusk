<template>
  <resizable-drawer :app="false" side="right" />
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
