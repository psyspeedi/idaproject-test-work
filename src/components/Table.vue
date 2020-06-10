<template>
  <Loader v-if="isLoading" />
  <table v-else-if="!isLoading && countTitlesChecked !== 0">
    <thead>
      <tr>
        <th>
          <label>
            <input @click="selectAllProductsPerPage" type="checkbox" v-model="allChecked" />
            <span class="custom-checkbox"></span>
          </label>
        </th>
        <th
          :data-title-order="i"
          v-for="(t, i) in titles"
          :key="i"
          :class="i === firstItemTable ? 'selected' : null"
          v-show="t.checked"
          @click="toggleSortHandler(i)"
        >
          <span :class="i === firstItemTable ? 'selected-title' : null">{{ t.name }}</span>
          <Arrow :class="!arrowUp ? 'arrow-rotate' : null" v-if="i === firstItemTable" />
        </th>
        <th style="opacity: 0">
          __empty__
        </th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="p in this.filteredProductsPerPage[+this.$route.query.page - 1]"
        :key="p.id"
        @click="checkedHandler(p.id)"
      >
        <td :data-selected="p.checked ? 'true' : null">
          <label>
            <input type="checkbox" v-model="p.checked" @click="checkedHandler(p.id)" />
            <span class="custom-checkbox"></span>
          </label>
        </td>
        <td ref="order" v-show="showColumns(0)" :data-order="0">{{ p.product }}</td>
        <td ref="order" v-show="showColumns(1)" :data-order="1">{{ p.calories }}</td>
        <td ref="order" v-show="showColumns(2)" :data-order="2">{{ p.fat }}</td>
        <td ref="order" v-show="showColumns(3)" :data-order="3">{{ p.carbs }}</td>
        <td ref="order" v-show="showColumns(4)" :data-order="4">{{ p.protein }}</td>
        <td ref="order" v-show="showColumns(5)" :data-order="5">{{ p.iron }}</td>
        <td :class="p.id === deleteIconActiveId ? 'delete-active' : null">
          <span class="delete" @click.stop="openModalHandler(p.id)" ref="delete" :data-id="p.id">
            <span class="delete-content">
              <svg
                width="14"
                height="16"
                viewBox="0 0 14 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.2326 1.88398H10.0963V0.495768C10.0963 0.216339 9.8709 0 9.59149 0C9.56438 0 9.54629 0.00905115 9.53747 0.0180816C9.52842 0.00905115 9.51034 0 9.50131 0H4.48046H4.4445H4.40834C4.12893 0 3.91259 0.216339 3.91259 0.495768V1.884H1.76726C1.1542 1.884 0.676514 2.36169 0.676514 2.97475V3.76801V4.75952H1.62302V14.9183C1.62302 15.5314 2.09168 16 2.70474 16H11.2951C11.9082 16 12.3859 15.5314 12.3859 14.9183V4.75952H13.3233V3.76801V2.97475C13.3233 2.36169 12.8455 1.88398 12.2326 1.88398ZM4.90411 0.991515H9.09574V1.88398H4.90411V0.991515ZM11.3853 14.9183C11.3853 14.9816 11.3582 15.0085 11.2951 15.0085H2.70474C2.64167 15.0085 2.61456 14.9816 2.61456 14.9183V4.7595H11.3853V14.9183ZM12.3228 3.76799H1.67706V2.97473C1.67706 2.91164 1.70417 2.8755 1.76724 2.8755H12.2326C12.2957 2.8755 12.3228 2.91164 12.3228 2.97473V3.76799Z"
                  fill="#5B5E77"
                />
                <path d="M9.81689 5.92236H8.81635V14.1251H9.81689V5.92236Z" fill="#5B5E77" />
                <path d="M7.50915 5.92236H6.50861V14.1251H7.50915V5.92236Z" fill="#5B5E77" />
                <path d="M5.20153 5.92236H4.20099V14.1251H5.20153V5.92236Z" fill="#5B5E77" />
              </svg>
              <span>delete</span>
            </span>
          </span>
        </td>
      </tr>
    </tbody>
    <TableModalDelete
      @deleteHandler="deleteHandler"
      @closeModal="closeModal"
      :left="left"
      :top="top"
      v-if="modalOpen"
    />
  </table>
  <h1 v-else style="text-align: center; font-size: 1.5rem; margin-top: 100px">
    Columns not selected
  </h1>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Arrow from '../assets/ArrowSvg'
  import TableModalDelete from './TableModalDelete'
  import Loader from '../assets/Loader'

  export default {
    name: 'Table',
    components: { Arrow, TableModalDelete, Loader },
    data: () => ({
      modalOpen: false,
      removedId: undefined,
      top: undefined,
      left: undefined,
      deleteIconActiveId: undefined,
      allChecked: undefined,
      arrowUp: true,
      isLoading: false
    }),
    computed: {
      ...mapGetters([
        'titles',
        'firstItemTable',
        'filteredProductsPerPage',
        'countTitlesChecked',
        'defaultPage',
        'allCheckedPerPage',
        'sortProducts'
      ])
    },
    methods: {
      toggleSortHandler(idx) {
        if (this.firstItemTable === idx) {
          this.arrowUp = !this.arrowUp
          this.$store.commit('setReverseSort', !this.arrowUp)
          this.$store.commit('sortProducts', this.firstItemTable)
          this.$store.commit('setFilteredProductsPerPage', this.sortProducts)
        }
      },
      selectAllProductsPerPage() {
        this.$store.commit('selectAllProductsPerPage', {
          idx: +this.$route.query.page - 1,
          checked: !this.allChecked
        })
      },
      checkedHandler(id) {
        this.$store.commit('updateProductsChecked', id)
      },
      showColumns(i) {
        if (!this.titles[i].checked) {
          return false
        }
        return true
      },
      openModalHandler(id) {
        this.top =
          this.$refs.delete.filter(ref => +ref.dataset.id === id)[0].getBoundingClientRect().y +
          window.pageYOffset
        this.left = this.$refs.delete
          .filter(ref => +ref.dataset.id === id)[0]
          .getBoundingClientRect().x
        this.removedId = id
        this.modalOpen = true
        this.deleteIconActiveId = id
      },
      async deleteHandler() {
        this.isLoading = true
        try {
          await this.$store.dispatch('deleteProduct', [this.removedId])
          this.$store.commit('sortProducts', this.firstItemTable)
          this.$store.commit('setFilteredProductsPerPage', this.sortProducts)
          this.$message('Item deleted')
        } catch (e) {
          this.$message(e.error)
        }

        this.isLoading = false
        this.modalOpen = false
        this.deleteIconActiveId = undefined
        this.removedId = undefined
      },
      setOrder() {
        this.$refs.order
          .filter(ref => +ref.dataset.order === (this.firstItemTable || 0))
          .forEach(el => el.classList.add('selected'))
      },
      removeOrder() {
        this.$refs.order.forEach(el => el.classList.remove('selected'))
      },
      closeModal() {
        this.removedId = undefined
        this.modalOpen = false
        this.deleteIconActiveId = undefined
      }
    },
    mounted() {
      this.$store.commit('setAllCheckedPerPage', +this.$route.query.page - 1)
      this.allChecked = this.allCheckedPerPage
      setTimeout(() => {
        this.setOrder()
      }, 0)
    },
    updated() {
      setTimeout(() => {
        this.setOrder()
      }, 0)
    },
    beforeUpdate() {
      this.$store.commit('setAllCheckedPerPage', +this.$route.query.page - 1)
      this.$store.commit('transformStatePerPageToProducts')
      this.$store.commit('setCountProductsChecked')
      this.$store.commit('transformStatePerPageToProducts')
      this.allChecked = this.allCheckedPerPage
      setTimeout(() => {
        this.removeOrder()
      }, 0)
    },
    beforeDestroy() {
      setTimeout(() => {
        this.removeOrder()
      }, 0)
    }
  }
</script>

<style lang="scss">
  table {
    table-layout: fixed;
    width: 100%;
    height: auto;
    border-radius: 4px;
    background: #ffffff;
    border-spacing: 0;
    border-collapse: collapse;
    color: #282136;
    display: flex;
    flex-direction: column;

    thead tr th {
      display: flex;
      align-items: center;

      svg {
        margin-left: 8px;
      }
    }

    thead,
    tbody {
      tr {
        display: flex;
        align-items: center;
        th,
        td {
          align-self: center;
        }
      }
    }

    td:nth-child(1),
    th:nth-child(1) {
      order: -1;
      padding-left: 8px;
      width: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    th:last-child {
      pointer-events: none;
      cursor: default;
    }

    td,
    th {
      width: calc((100% - 60px) / 7);
    }

    th[data-title-order='0'] {
      min-width: 195px;
    }

    td:last-child {
      text-align: center;
      position: relative;
      opacity: 0;
    }

    thead {
      border-bottom: 1px solid #ededed;
      text-align: left;
    }

    tr {
      height: 49px;
      &:nth-child(even) {
        background: #f8f9fa;
      }
    }

    tbody tr td:nth-child(2) {
      min-width: 195px;
      padding-right: 10px;
    }

    tbody tr:hover {
      background: rgba(0, 161, 30, 0.07);
    }

    tbody tr:hover > td:last-child {
      opacity: 1;
    }

    tbody tr:hover > td.selected {
      color: #282136 !important;
      font-weight: 600;
    }
  }

  label {
    position: relative;
    width: 14px;
    height: 14px;

    input[type='checkbox'] {
      opacity: 0;
    }

    span.custom-checkbox {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      border-radius: 2px;
      border: 1px solid #c6cbd4;
    }
  }

  label input[type='checkbox']:checked + span.custom-checkbox {
    background: #00a11e;
    border-color: #00a11e !important;

    &:after {
      position: absolute;
      content: '';
      bottom: 0;
      left: 0;
      right: 0;
      top: 0;
      background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.56354 2.61235L0.666992 3.41618L3.54877 5.99991L9.33366 0.803736L8.43711 -9.15527e-05L3.54877 4.39225L1.56354 2.61235Z' fill='white'/%3E%3C/svg%3E%0A");
      background-position: center;
      background-repeat: no-repeat;
    }
  }

  tbody tr td[data-selected='true'] ~ td.selected {
    color: #534d5e;
    font-weight: 600;
  }

  .delete {
    color: #5b5e77;
    cursor: pointer;
    display: inline-block;
    vertical-align: center;

    .delete-content {
      display: flex;
      align-items: center;

      svg {
        margin-right: 6px;
      }
    }
  }

  .delete-active {
    opacity: 1 !important;
  }

  .selected {
    order: -1;
  }

  .selected-title {
    color: #00a11e;
    cursor: pointer;
  }

  .arrow-rotate {
    transform: rotate(180deg);
  }
</style>
