<template>
  <div>
    注册
  </div>

</template>

<script>
export default {
  mpType: 'page',
  data: () => ({
    searchText: '',
    username: '',
    password: ''
  }),
  mounted () {

  },
  methods: {},
  computed: {
    mallTitle () {
      return this.$store.state.Run.mallTitle
    }
  }
}
</script>

<style scoped>
.swiper-img {
  width: 100%;
}
</style>
