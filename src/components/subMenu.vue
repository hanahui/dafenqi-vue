<template functional>
  <a-sub-menu :key="props.menuInfo.key">
    <span slot="title">
      <span class="anticon"><i class="icon iconfont" :class="props.menuInfo.imageUrl"></i></span>
      <span>{{props.menuInfo.name}}</span>
    </span>
    <template v-for="item in props.menuInfo.childMenus">
      <a-menu-item v-if="item.childMenus.length === 0" :key="item.url">
        <span class="anticon"><i class="icon iconfont" :class="item.imageUrl"></i></span>
        <span>{{item.name}}</span>
      </a-menu-item>
      <sub-menu v-else :key="item.url" :menu-info="item" />
    </template>
  </a-sub-menu>
</template>

<script>
    export default {
        props: ['menuInfo'],
        name: "subMenu",
        methods: {
            routerLink(url, resourceId){
                this.$router.push({path: url});
            }
        }
    }
</script>

<style scoped>

</style>
