<template>
  <div ref="modal" class="container" :style="{ top: this.top + 45 + 'px', left: this.left + 'px' }">
    <div class="label-wrap" v-for="v in valuesArr" :key="v">
      <label :for="v">
        <input type="radio" :value="v" :id="v" v-model="value" @change="togglePerPageHandler(v)" />
        <span class="custom-radio"></span>
        <span class="text">{{ v }} per page</span>
      </label>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'TableModalSelectPerPage',
    props: {
      left: {
        type: Number,
        required: true
      },
      top: {
        type: Number,
        required: true
      }
    },
    data: () => ({
      value: undefined,
      valuesArr: [10, 15, 20]
    }),
    computed: { ...mapGetters(['perPage', 'filteredProductsPerPage', 'products']) },
    methods: {
      closeHandler() {
        this.$emit('closeModal')
      },
      togglePerPageHandler(count) {
        this.$store.commit('togglePerPageCount', count)
        this.$store.commit('setFilteredProductsPerPage', this.products)

        if (this.filteredProductsPerPage.length < this.$route.query.page) {
          return this.$router.push({
            name: 'Table',
            query: {
              perPage: String(this.perPage),
              page: String(this.filteredProductsPerPage.length)
            }
          })
        }

        this.$router.push({
          name: 'Table',
          query: { perPage: String(this.perPage), page: String(this.$route.query.page) }
        })
      },
      close(e) {
        if (
          e.target !== this.$refs.modal &&
          e.target.parentNode.parentNode.parentNode !== this.$refs.modal
        ) {
          this.closeHandler()
        }
      }
    },
    mounted() {
      this.value = this.perPage
      document.addEventListener('click', this.close)
    },
    destroyed() {
      document.removeEventListener('click', this.close)
    }
  }
</script>

<style scoped lang="scss">
  .container {
    position: absolute;
    z-index: 10;
    width: 120px;
    height: 100px;
    padding: 10px;
    background: #ffffff;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.16);
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .label-wrap {
      width: 100%;
      label {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        position: relative;
        cursor: pointer;

        input {
          opacity: 0;
        }

        .custom-radio {
          position: absolute;
          left: 0;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 1px solid #c6cbd4;
        }

        input[type='radio']:checked + .custom-radio {
          background: #00a11e;
          border-color: #00a11e;
        }

        input[type='radio']:checked + .custom-radio:after {
          position: absolute;
          content: '';
          width: 4px;
          height: 4px;
          border-radius: 50%;
          top: 4px;
          left: 4px;
          background: #ffffff;
        }
      }
    }
  }
</style>
