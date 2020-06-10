<template>
  <div
    ref="modal"
    class="select-modal"
    :style="{ top: this.top + 45 + 'px', left: this.left + 'px' }"
  >
    <div class="content">
      <label class="label" @click.stop.self="toggleAllTitlesHandler">
        <input @click="toggleAllTitlesHandler" type="checkbox" v-model="allChecked" />
        <span class="custom-checkbox"></span>
        <span class="text strong">Select All</span>
      </label>
      <label
        class="label"
        v-for="(t, i) in titles"
        :key="i"
        @click.stop.self="toggleTitleCheckedHandler(i)"
      >
        <input @click="toggleTitleCheckedHandler(i)" type="checkbox" v-model="t.checked" />
        <span class="custom-checkbox"></span>
        <span class="text">{{ t.name }}</span>
      </label>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'TableModalSelectTitle',
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
      allChecked: undefined
    }),
    computed: { ...mapGetters(['titles', 'allCheckedTitles']) },
    methods: {
      closeHandler() {
        this.$emit('closeModal')
      },
      toggleAllTitlesHandler() {
        this.$store.commit('selectAllTitlesToggle', !this.allChecked)
      },
      toggleTitleCheckedHandler(idx) {
        this.$store.commit('selectTitleToggle', idx)
        this.$store.commit('setAllCheckedTitles')
        this.allChecked = this.allCheckedTitles
      },
      close(e) {
        if (e.target !== this.$refs.modal && e.target.parentNode !== this.$refs.modal) {
          this.closeHandler()
        }
      }
    },
    mounted() {
      this.$store.commit('setAllCheckedTitles')
      this.allChecked = this.allCheckedTitles
      document.addEventListener('click', this.close)
    },

    beforeDestroy() {
      document.removeEventListener('click', this.close)
    }
  }
</script>

<style lang="scss">
  .select-modal {
    position: absolute;
    z-index: 10;
    width: 207px;
    height: 243px;
    padding: 15px 12px 0 17px;
    background: #ffffff;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.16);
    border-radius: 4px;

    .content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      overflow-y: auto;

      .label {
        display: flex;
        align-items: center;
        width: 100%;
        position: relative;
        cursor: pointer;

        .custom-checkbox {
          position: absolute;
          width: 14px;
          height: 14px;
          left: 0;
          border-radius: 2px;
          border: 1px solid #c6cbd4;
        }

        .text {
          margin-left: 13px;
          color: #282136;
          width: 100%;

          &.strong {
            font-weight: 600;
          }
        }
      }
    }
  }
</style>
