<template>
  <div ref="dashboard" class="vcp-dashboard" autoplay>
    <div v-show="show" class="vcp-dashboard-box">
      <Progress />
      <Controls :muted="muted" />
    </div>
  </div>
</template>

<script>
import { DEFAULT_CONFIG, EVENTS } from '../constants'
import { isDescendant } from '../helper/dom'
import { isMobile } from '../helper/util'
import Progress from './progress'
import Controls from './controls'
import coreMixins from '../mixins'
let b = 0
const pageCoor = {
  x: null,
  y: null
}
export default {
  name: 'Dashboard',
  components: {
    Progress,
    Controls
  },
  mixins: [coreMixins],
  props: {
    controls: [Boolean, String],
    muted: Boolean
  },
  data() {
    return {
      show: true
    }
  },
  mounted() {
    const { controls } = this
    if (!controls) {
      this.show = false
    } else if (controls === 'fixed') {
      this.show = true
    } else {
      this._initAutoMode()
    }
  },
  methods: {
    showDashboard(delay) {
      window.clearTimeout(this._hideTimeout)
      this.show = true
      this.emit(EVENTS.UI_DASHBOARD_SHOW)
      if (delay === 0) {
        // TODO handle force show
      } else {
        this._hideTimeout = setTimeout(() => {
          this.hideDashboard()
        }, delay || DEFAULT_CONFIG.dashboardHideDelay)
      }
    },
    hideDashboard() {
      this.show = false
      this.emit(EVENTS.UI_DASHBOARD_HIDE)
    },
    getEvent(e) {
      return e|| window.event
    },
    _initAutoMode() {
      const $parent = this.$refs['dashboard'].parentNode
      if (isMobile) {
        $parent.addEventListener('touchend', this._onTouchend.bind(this), true)
      } else {
        $parent.addEventListener('mousemove', this._onMousemove.bind(this))
        $parent.addEventListener('mouseleave', this._onMouseleave.bind(this))
        $parent.addEventListener('mouseover', this._onMouseover.bind(this), true)
      }
      this.showDashboard(2000)
    },
    _onMousemove(e) {
      if (e.pageX === pageCoor.x && e.pageY === pageCoor.y) {
        pageCoor.x = e.pageX
        pageCoor.y = e.pageY
        return
      }
      pageCoor.x = e.pageX
      pageCoor.y = e.pageY
      if (isDescendant(this._el, e.target)) {
        return this.showDashboard(10)
      }
      this.showDashboard();
    },
    _onMouseleave() {
      console.log("_onMouseleave")
      this.showDashboard(100)
    },
    _onMouseover(e) {
      this.showDashboard(1000)
      console.log("_onMouseover")
    },
    _onTouchend() {
      console.log("_onTouchend")
      this.showDashboard()
    }
  }
}
</script>
