<template>
  <div>
    <div>this is {{ name }} component</div>
    <child></child>
  </div>
</template>
<script>
import child from "./child.vue";
export default {
  data() {
    return {
      name: "a",
    };
  },
  components: {
    child,
  },
};
</script>