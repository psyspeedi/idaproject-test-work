<template>
  <div v-if="isReady && !error" class="table-container">
    <div class="table-content">
      <h2>Table UI</h2>
      <TableHeader />
      <Table />
    </div>
  </div>
  <Loader v-else-if="!isReady" />
  <div v-else-if="error" class="error">
    <p style="font-size: 2.5rem">Something went wrong :(</p>
    <br />
    <p @click="init" style="color: #2196f3;font-size: 2rem; cursor: pointer">Try it again!</p>
  </div>
</template>

<script>
  import Table from '../components/Table'
  import TableHeader from '../components/TableHeader'
  import Loader from '../assets/Loader'
  import { mapGetters } from 'vuex'
  export default {
    components: {
      Table,
      TableHeader,
      Loader
    },
    data: () => ({
      isReady: false,
      error: false
    }),
    computed: {
      ...mapGetters(['perPage', 'defaultPage', 'firstItemTable', 'sortProducts'])
    },
    methods: {
      async init() {
        this.isReady = false
        this.error = false
        try {
          await this.$store.dispatch('fetchProduct')
          this.$store.commit('sortProducts', this.firstItemTable)
          this.$store.commit('setFilteredProductsPerPage', this.sortProducts)

          if (this.$route.query.page && this.$route.query.perPage) {
            this.$store.commit('setPerPage', this.$route.query.perPage)
            this.$store.commit('togglePerPageCount', this.perPage)
            this.$store.commit('setFilteredProductsPerPage', this.sortProducts)
            this.$router.push({
              name: 'Table',
              query: {
                perPage: String(this.$route.query.perPage),
                page: String(this.$route.query.page)
              }
            })
          } else {
            this.$router.push({
              name: 'Table',
              query: { perPage: String(this.perPage), page: String(this.defaultPage) }
            })
          }

          this.isReady = true
        } catch (e) {
          this.$message(e.error)
          this.isReady = true
          this.error = true
        }
      }
    },
    async mounted() {
      await this.init()
    }
  }
</script>

<style lang="scss">
  .table-container {
    width: 100%;
    min-height: 100vh;
    background: #fbfbfb;

    .table-content {
      width: 1140px;
      height: auto;
      margin: 0 auto;
      padding-bottom: 100px;

      h2 {
        font-weight: 600;
        font-size: 32px;
        line-height: 40px;
        color: #282136;
        padding-top: 32px;
        padding-bottom: 16px;
        width: 100%;
        text-align: left;
        border-bottom: 1px solid #ededed;
      }
    }
  }

  .error {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100vh;
  }
</style>
