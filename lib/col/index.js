import {createNamespace} from "../utils/create"
export default createNamespace("col")({
	props: {
		span: {
			type: Number,
			default: () => 24
		},
		tag: {
			type: String,
			default: "div"
		},
		gutter: {
			type: [Number, String],
			default: () => 10
		}
	},
	render(h) {
		// 事件
		const listeners = {}
		if (this.$listeners) {
			Object.keys(this.$listeners).forEach(e => {
				listeners["!" + e] = this.$listeners[e]
			})
		}
		return h("div", {
			class: ["box-col-span-" + this.span],
			style: {
				"padding-left": this.gutter + "px",
				"padding-right": this.gutter + "px"
			},
			on: listeners
		}, this.$slots.default)
	}
});