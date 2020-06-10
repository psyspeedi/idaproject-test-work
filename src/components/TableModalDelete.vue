<template>
  <div
    ref="modal"
    :style="{ top: this.top + 40 + 'px', left: this.left - 100 + 'px' }"
    class="modal"
  >
    <slot>
      <p>Are you sure you want to <strong>delete item</strong>?</p>
    </slot>
    <div class="buttons">
      <button @click="closeHandler" class="cancel">Cancel</button>
      <button @click="deleteHandler" class="confirm">Confirm</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TableModalDelete',
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
    methods: {
      closeHandler() {
        this.$emit('closeModal')
      },
      deleteHandler() {
        this.$emit('deleteHandler')
      },
      close(e) {
        if (e.target !== this.$refs.modal && e.target.parentNode !== this.$refs.modal) {
          this.closeHandler()
        }
      }
    },
    mounted() {
      document.addEventListener('click', this.close)
    },
    beforeDestroy() {
      document.removeEventListener('click', this.close)
    }
  }
</script>

<style lang="scss">
  .modal {
    min-width: 254px;
    height: 96px;
    background: #ffffff;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.16);
    border-radius: 4px;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    position: absolute;
    z-index: 10;

    .buttons {
      width: 166px;
      display: flex;
      justify-content: space-between;

      button {
        width: 75px;
        height: 33px;
        outline: none;
        cursor: pointer;
      }

      .cancel {
        color: #5b5e77;
        border: 1px solid #c6cbd4;
        box-sizing: border-box;
        border-radius: 4px;
      }

      .confirm {
        border-radius: 4px;
        background: #00a11e;
        color: #ffffff;
        border: none;
      }
    }
  }
</style>
