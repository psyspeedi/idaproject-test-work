import Vue from 'vue'
import Vuex from 'vuex'
import { getProducts, deleteProducts } from '../api/request'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    products: undefined,
    titles: [
      {
        name: 'Product (100g serving)',
        checked: true
      },
      {
        name: 'Calories',
        checked: true
      },
      {
        name: 'Fat (g)',
        checked: true
      },
      {
        name: 'Carbs (g)',
        checked: true
      },
      {
        name: 'Protein (g)',
        checked: true
      },
      {
        name: 'Iron (%)',
        checked: true
      }
    ],
    firstItemTable: null,
    perPage: 10,
    defaultPage: 1,
    filteredProductsPerPage: undefined,
    allCheckedTitles: undefined,
    allCheckedPerPage: undefined,
    countProductsChecked: undefined,
    sortProducts: undefined,
    reverseSort: false,
    allCheckedProducts: undefined
  },
  getters: {
    reverseSort(state) {
      return state.reverseSort
    },
    defaultPage(state) {
      return state.defaultPage
    },
    products(state) {
      if (state.firstItemTable) {
        return state.sortProducts
      }
      return state.products
    },
    titles(state) {
      return state.titles
    },
    firstItemTable(state) {
      return state.firstItemTable
    },
    allCheckedTitles(state) {
      return state.allCheckedTitles
    },
    perPage(state) {
      return state.perPage
    },
    countProductsChecked(state) {
      return state.countProductsChecked
    },
    countTitlesChecked(state) {
      let count = 0
      state.titles.forEach(t => {
        if (t.checked) {
          count++
        }
      })

      return count
    },
    filteredProductsPerPage(state) {
      return state.filteredProductsPerPage
    },
    allCheckedPerPage(state) {
      return state.allCheckedPerPage
    },
    sortProducts(state) {
      return state.sortProducts
    },
    allCheckedProducts(state) {
      return state.allCheckedProducts
    }
  },
  mutations: {
    setPerPage(state, payload) {
      state.perPage = payload
    },
    transformStatePerPageToProducts(state) {
      state.products = state.filteredProductsPerPage.flat()
    },
    setAllCheckedTitles(state) {
      state.allCheckedTitles = state.titles.every(t => t.checked === true)
    },
    setProducts(state, payload) {
      state.products = payload.map(p => ({ ...p, checked: false }))
    },
    updateProductsChecked(state, payload) {
      const idx = state.products.findIndex(p => p.id === payload)
      state.products[idx].checked = !state.products[idx].checked
    },
    selectAllTitlesToggle(state, payload) {
      state.titles = state.titles.map(t => ({ ...t, checked: payload }))
    },
    selectTitleToggle(state, payload) {
      state.titles[payload].checked = !state.titles[payload].checked
    },
    togglePerPageCount(state, payload) {
      state.perPage = payload
    },
    setFilteredProductsPerPage(state, payload) {
      state.filteredProductsPerPage = payload.reduce(
        (acc, cur) => {
          if (acc[acc.length - 1].length == state.perPage) {
            acc.push([])
          }
          acc[acc.length - 1].push(cur)

          return acc
        },
        [[]]
      )
    },
    setAllCheckedPerPage(state, payload) {
      state.allCheckedPerPage = state.filteredProductsPerPage[payload].every(
        p => p.checked === true
      )
    },
    selectAllProductsPerPage(state, { idx, checked }) {
      state.filteredProductsPerPage[idx] = state.filteredProductsPerPage[idx].map(p => ({
        ...p,
        checked: checked
      }))
    },
    setCountProductsChecked(state) {
      let count = 0
      state.products.forEach(p => {
        if (p.checked) {
          count++
        }
      })

      state.countProductsChecked = count
    },
    setFirstItemTable(state, payload) {
      if (state.firstItemTable === payload) {
        return (state.firstItemTable = null)
      }
      state.firstItemTable = payload
    },
    setReverseSort(state, payload) {
      state.reverseSort = payload
    },
    sortProducts(state, payload) {
      if (payload === null) {
        return (state.sortProducts = state.products)
      }

      let i
      switch (payload) {
        case 0:
          i = 'product'
          break
        case 1:
          i = 'calories'
          break
        case 2:
          i = 'fat'
          break
        case 3:
          i = 'carbs'
          break
        case 4:
          i = 'protein'
          break
        case 5:
          i = 'iron'
          break
      }
      const copyProducts = [...state.products]

      if (state.reverseSort) {
        return (state.sortProducts = copyProducts.sort((a, b) => (a[i] < b[i] ? 1 : -1)))
      }

      state.sortProducts = copyProducts.sort((a, b) => (a[i] > b[i] ? 1 : -1))
    },
    deleteProducts(state, payload) {
      for (let i = 0; i < payload.length; i++) {
        let idx = state.products.findIndex(p => p.id === payload[i])
        state.products.splice(idx, 1)
      }
    },
    getAllCheckedProducts(state) {
      state.allCheckedProducts = state.products.filter(p => p.checked === true).map(t => t.id)
    }
  },
  actions: {
    fetchProduct({ commit }) {
      return getProducts().then(res => commit('setProducts', res))
    },
    deleteProduct({ commit }, payload) {
      return deleteProducts().then(() => commit('deleteProducts', payload))
    }
  }
})
