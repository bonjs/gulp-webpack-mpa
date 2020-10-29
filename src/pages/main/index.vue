<template>
  <div>
    <div>this is {{ name }} component</div>
    <child></child>
  </div>
</template>
<script>
export default {
  data() {
    return {
      name: "main",
    };
  },
};
</script>