<template>
  <div class="ball-container">
    <transition @before-enter="beforeEnter" @enter="enter" @after-enter="leave">
      <div class="ball" v-show="isShow">
        <div class="inner-ball"></div>
      </div>
    </transition>
  </div>
</template>

<script>
	export default {
		name: "SportBall",
    data() {
			return {
				isShow: false
      }
    },
    methods: {
      run(target) {
      	this.isShow = true
      },
      beforeEnter(el) {
        el.style.display = '' // 清空display
        el.style.webkitTransform = `translate3d(0, 0, 0)`
        el.style.transform = `translate3d(0, 0, 0)`
        // 处理内层动画
        let inner = el.getElementsByClassName('inner-ball')[0]
        inner.style.webkitTransform = `translate3d(0, 0, 0)`
        inner.style.transform = `translate3d(0, 0, 0)`

        el.style.opacity = 1.0
      },
      enter(el, done) {
	      let rf = el.offsetHeight; //触发重绘html

	      // 让动画效果异步执行,提高性能
	      el.style.webkitTransform = 'translate3d(0, -100px, 0)'
	      el.style.transform = 'translate3d(0, -100px, 0)'
	      // 处理内层动画
	      let inner = el.getElementsByClassName('inner-ball')[0]
	      inner.style.webkitTransform = 'translate3d(100px, 0, 0)'
	      inner.style.transform = 'translate3d(100px, 0, 0)'
	      el.style.opacity = 0.3
	      el.addEventListener('transitionend', done)
      },
	    leave(el) {
      	this.isShow = false
      }
    }
	}
</script>

<style scoped>
  .ball {
    position: absolute;
    left: 0;
    bottom: 0;

    transition: all .6s cubic-bezier(0,.48,.27,1.08);
  }

  .ball .inner-ball {
    width: 20px;
    height: 20px;
    background-color: var(--color-tint);
    border-radius: 10px;

    transition: all .6s linear;
  }
</style>