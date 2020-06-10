export default {
  install(Vue) {
    Vue.prototype.$message = function(text) {
      const app = document.querySelector('#app')
      const wrap = document.createElement('div')
      const container = document.getElementById('toast') || document.createElement('div')
      container.id = 'toast'
      app.append(container)

      let start = null
      function animate(timestamp) {
        if (!start) start = timestamp
        let progress = timestamp - start
        wrap.style.transform = 'translateX(' + Math.min(progress / 5) + 'px)'
        wrap.style.opacity = progress / 2 + '%'
        if (progress < 180) {
          window.requestAnimationFrame(animate)
        }
      }

      if (container) {
        wrap.className = 'message-toast'
        const p = document.createElement('p')
        wrap.appendChild(p)
        p.innerText = text
        container.appendChild(wrap)
        window.requestAnimationFrame(animate)
        setTimeout(() => {
          container.removeChild(wrap)
          if (!document.querySelectorAll('.message-toast').length) {
            app.removeChild(container)
          }
        }, 3000)
      }
    }
  }
}
