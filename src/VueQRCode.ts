import { defineComponent, h } from "vue";
import QRCodeSvg from "./QRCodeSvg";
import QRCodeCanvas from "./QRCodeCanvas";

export default defineComponent({
  name: "VueQRCode",
  props: {
    value: {
      type: String,
      required: true,
      default: "",
    },
    size: {
      type: Number,
      default: 100,
    },
    level: {
      type: String,
      default: "L",
    },
    background: {
      type: String,
      default: "#fff",
    },
    foreground: {
      type: String,
      default: "#000",
    },
    margin: {
      type: Number,
      default: 0,
    },
    imageSettings: {
      type: Object,
      default: () => ({}),
    },
    renderAs: {
      type: String,
      default: "canvas",
    },
  },
  render() {
    const {
      renderAs,
      value,
      size,
      margin,
      level,
      background,
      foreground,
      imageSettings,
    } = this.$props;
    const props = {
      value,
      size,
      margin,
      level,
      background,
      foreground,
      imageSettings,
    };

    return h(renderAs === "svg" ? QRCodeSvg : QRCodeCanvas, props);
  },
});
