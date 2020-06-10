<template>
  <Loader v-if="isLoading" />
  <div v-else class="container">
    <div class="content-left">
      <span><strong>Sorting by:</strong></span>
      <ul>
        <li
          @click="toggleFirstItemTable(i)"
          v-show="t.checked"
          :class="i === firstItemTable ? 'active' : null"
          v-for="(t, i) in titles"
          :key="i"
        >
          {{ t.name }}
        </li>
      </ul>
    </div>
    <div class="content-right">
      <button
        ref="delete"
        class="delete"
        :disabled="countProductsChecked === 0"
        @click.stop="openModalDeleteHandler"
      >
        <span
          >Delete {{ countProductsChecked !== 0 ? '(' + countProductsChecked + ')' : null }}</span
        >
      </button>
      <button ref="perpage" class="per-page" @click.stop="openModalSelectPerPageHandler">
        <span> {{ perPage }} Per Page</span>
        <MiniArrowSvg />
      </button>

      <div class="pagination">
        <div
          @click="prevPageHandler"
          :class="this.currentPage === 1 || countTitlesChecked === 0 ? 'disabled' : null"
          class="left"
        >
          <MiniArrowSvg />
        </div>
        <span
          ><strong>{{ ragePage }}</strong> of <strong>{{ products.length }}</strong></span
        >
        <div
          @click="nextPageHandler"
          :class="
            currentPage === this.filteredProductsPerPage.length || countTitlesChecked === 0
              ? 'disabled'
              : null
          "
          class="right"
        >
          <MiniArrowSvg />
        </div>
      </div>

      <button ref="columns" @click.stop="openModalSelectTitlesHandler" class="select-columns">
        <span v-if="countTitlesChecked > 0">
          {{ countTitlesChecked }}
          {{ countTitlesChecked !== 1 ? 'columns selected' : 'column selected' }}
        </span>
        <span v-else>columns not selected</span>
        <MiniArrowSvg />
      </button>
    </div>

    <TableModalDelete
      @closeModal="closeModalDelete"
      @deleteHandler="deleteHandler"
      v-if="modalDeleteOpen"
      :top="top"
      :left="left"
    >
      <p style="color: #282136">
        Are you sure you want
        <strong>
          delete {{ countProductsChecked }}
          {{ countProductsChecked === 1 ? 'item' : 'items' }}</strong
        >?
      </p>
    </TableModalDelete>

    <TableModalSelectPerPage
      :left="this.left"
      :top="this.top"
      @closeModal="closeModalSelectPerPage"
      v-if="modalSelectPerPageOpen"
    />

    <TableModalSelectTitle
      @closeModal="closeModalSelectTitles"
      :top="this.top"
      :left="this.left"
      v-if="modalSelectTitlesOpen"
    />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import MiniArrowSvg from '../assets/MiniArrowSvg'
  import TableModalSelectTitle from './TableModalSelectTitle'
  import TableModalDelete from './TableModalDelete'
  import TableModalSelectPerPage from './TableModalSelectPerPage'
  import Loader from '../assets/Loader'

  export default {
    name: 'TableHeader',
    data: () => ({
      top: undefined,
      left: undefined,
      modalSelectTitlesOpen: false,
      modalSelectPerPageOpen: false,
      modalDeleteOpen: false,
      currentPage: undefined,
      isLoading: false
    }),
    components: {
      MiniArrowSvg,
      TableModalSelectTitle,
      TableModalDelete,
      TableModalSelectPerPage,
      Loader
    },
    computed: {
      ...mapGetters([
        'titles',
        'perPage',
        'countProductsChecked',
        'countTitlesChecked',
        'filteredProductsPerPage',
        'products',
        'firstItemTable',
        'sortProducts',
        'allCheckedProducts'
      ]),
      ragePage() {
        if (+this.currentPage === 1) {
          return `${+this.currentPage}-${
            this.perPage <= this.products.length ? this.perPage : this.products.length
          }`
        }

        if (+this.currentPage > 1 && this.perPage === 10) {
          return `${(+this.currentPage - 1) * this.perPage + 1}-${+this.currentPage * this.perPage}`
        }

        if (+this.currentPage === 2 && (this.perPage === 15 || 20)) {
          return `${+this.perPage + 1}-${
            +this.perPage * 2 <= this.products.length ? +this.perPage * 2 : this.products.length
          }`
        }

        if (+this.currentPage > 2 && (this.perPage === 15 || 20)) {
          return `${this.perPage * (+this.currentPage - 1) + 1}-${
            +this.perPage * this.currentPage <= this.products.length
              ? +this.perPage * this.currentPage
              : this.products.length
          }`
        }

        return null
      }
    },
    methods: {
      openModalDeleteHandler() {
        this.top = this.$refs.delete.getBoundingClientRect().y + window.pageYOffset
        this.left = this.$refs.delete.getBoundingClientRect().x
        this.modalDeleteOpen = !this.modalDeleteOpen
      },
      closeModalDelete() {
        this.top = undefined
        this.left = undefined
        this.modalDeleteOpen = false
      },
      openModalSelectPerPageHandler() {
        this.top = this.$refs.perpage.getBoundingClientRect().y + window.pageYOffset
        this.left = this.$refs.perpage.getBoundingClientRect().x
        this.modalSelectPerPageOpen = !this.modalSelectPerPageOpen
      },
      closeModalSelectPerPage() {
        this.top = undefined
        this.left = undefined
        this.modalSelectPerPageOpen = false
      },
      openModalSelectTitlesHandler() {
        this.top = this.$refs.columns.getBoundingClientRect().y
        this.left = this.$refs.columns.getBoundingClientRect().x
        this.modalSelectTitlesOpen = !this.modalSelectTitlesOpen
      },
      closeModalSelectTitles() {
        this.top = undefined
        this.left = undefined
        this.modalSelectTitlesOpen = false
      },
      nextPageHandler() {
        if (
          this.currentPage >= Math.ceil(this.products.length / this.perPage) ||
          this.countTitlesChecked === 0
        ) {
          return
        }
        this.currentPage++
        this.$router.push({
          name: 'Table',
          query: { perPage: String(this.perPage), page: String(this.currentPage) }
        })
      },
      prevPageHandler() {
        if (this.currentPage <= 1 || this.countTitlesChecked === 0) {
          return
        }

        this.currentPage--
        this.$router.push({
          name: 'Table',
          query: { perPage: String(this.perPage), page: String(this.currentPage) }
        })
      },
      toggleFirstItemTable(idx) {
        this.$store.commit('setFirstItemTable', idx)
        this.$store.commit('sortProducts', this.firstItemTable)
        this.$store.commit('setFilteredProductsPerPage', this.sortProducts)
      },
      async deleteHandler() {
        this.isLoading = true
        try {
          this.$store.commit('getAllCheckedProducts')
          const count = this.allCheckedProducts.length
          await this.$store.dispatch('deleteProduct', this.allCheckedProducts)
          this.$store.commit('sortProducts', this.firstItemTable)
          this.$store.commit('setFilteredProductsPerPage', this.sortProducts)
          this.$message(`${count} ${count > 1 ? 'items' : 'item'} deleted`)
        } catch (e) {
          this.$message(e.error)
        }
        this.isLoading = false
        this.modalDeleteOpen = false
      }
    },
    mounted() {
      this.$store.commit('setCountProductsChecked')
      this.currentPage = +this.$route.query.page
    },
    updated() {
      this.currentPage = +this.$route.query.page
    }
  }
</script>

<style lang="scss">
  .container {
    width: 100%;
    height: 64px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .content-left {
    display: flex;
    align-items: center;
    user-select: none;

    span {
      margin-right: 14px;
    }

    ul {
      list-style-type: none;
      display: flex;
      align-items: center;

      li {
        margin-right: 12px;
        cursor: pointer;

        &:hover {
          color: #00a11e;
        }
      }

      li.active {
        height: 32px;
        display: flex;
        align-items: center;
        white-space: nowrap;
        padding: 0 8px;
        background: #00a11e;
        border-radius: 2px;
        color: #ffffff;
      }
    }
  }

  .content-right {
    display: flex;
    align-items: center;
    position: relative;
    user-select: none;

    button {
      outline: none;
      border: none;
      height: 32px;
      padding: 0 15px;
      border-radius: 2px;
      cursor: pointer;
    }
  }

  button.delete {
    margin-right: 12px;
    color: #ffffff;
    background: #00a11e;

    &:disabled {
      background: transparent;
      color: #cbccd4;
      border: 1px solid #cbccd4;
      pointer-events: none;
    }
  }

  button.per-page {
    color: #5b5e77;
    border: 1px solid #d5dae0;
    background: transparent;
    margin-right: 16px;

    span {
      margin-right: 8px;
    }

    svg {
      fill: #888a9c;
      transform: rotate(90deg);
    }
  }

  .pagination {
    display: flex;
    align-items: center;
    margin-right: 16px;

    .left,
    .right {
      width: 32px;
      height: 32px;
      border-radius: 2px;
      border: 1px solid #d5dae0;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      svg {
        fill: #5b5e77;
      }
    }

    .left {
      margin-right: 8px;

      svg {
        transform: rotate(180deg);
      }
    }

    .right {
      margin-left: 8px;
    }

    .disabled {
      border: 1px solid #ebedf0;
      pointer-events: none;

      svg {
        fill: #cbccd4;
      }
    }
  }

  button.select-columns {
    border: 1px solid #d5dae0;
    box-sizing: border-box;
    border-radius: 2px;
    background: transparent;
    position: relative;

    span {
      color: #5b5e77;
      margin-right: 8px;
    }

    svg {
      transform: rotate(90deg);
      fill: #7b7d91;
    }
  }

  .left,
  .right,
  .select-columns,
  .per-page {
    &:hover {
      border-color: #00a11e;
    }
  }
</style>
