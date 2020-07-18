<template>
  <div class="block-update">
   <p class="text" @click="$emit('update')">
      加载失败<br>(点击重新加载)
     </p>
  </div>
</template>

<script>
    export default {
        name: "update"
    }
</script>

<style lang="less" scoped>

</style>
