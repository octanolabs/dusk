<template>
  <div>
    <h1>Dashboard</h1>
    <p>
      You are now logged in, woo!
    </p>
  </div>
</template>

<script>
export default {
  middleware: 'auth'
}
</script>
