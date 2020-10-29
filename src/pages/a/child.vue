<template>
  <div style="border: 1px red solid">this is {{name}} component</div>
</template>
<script>
export default {
  data() {
    return {
      name: 'child'
    }
  }
}
</script>