<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600&display=swap');
  @import './assets/variables';
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Source Sans Pro;
    font-size: 14px;
    line-height: 24px;
  }

  #toast {
    position: fixed;
    top: 0;
    right: 250px;
    width: content-box;
    z-index: 1;
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    padding-top: 80px;
    padding-right: 50px;
    pointer-events: none;
  }

  .message-toast {
    display: inline-block;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.75);
    color: white;
    padding: 10px 20px;
    border-radius: 3px;
    margin: 3px 0;
    position: relative;
    z-index: 5;
    cursor: default;
  }

  ::-webkit-scrollbar {
    width: 3px;
    height: 1px;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-track {
    background-color: #d5dae0;
  }
  ::-webkit-scrollbar-track-piece {
    background-color: #ffffff;
  }
  ::-webkit-scrollbar-thumb {
    height: 3px;
    background-color: #d5dae0;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-corner {
    background-color: #d5dae0;
  }
</style>
