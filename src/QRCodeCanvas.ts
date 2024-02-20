import { defineComponent, h, onMounted, onUpdated, ref } from "vue";
import QR from "../lib/qr-code-generator";
import { ErrorCorrectLevelMap, generatePath } from "./utils";

export default defineComponent({
  name: "QRCodeCanvas",
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
  },
  setup(props) {
    const canvasEl = ref<HTMLCanvasElement | null>(null);

    const generate = () => {
      const { value, level, size, margin, background, foreground } = props;

      const canvas = canvasEl.value;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const cells = QR.QrCode.encodeText(
        value,
        ErrorCorrectLevelMap[level],
      ).getModules();
      const numCells = cells.length + margin * 2;

      const devicePixelRatio = window.devicePixelRatio || 1;
      const scale = (size / numCells) * devicePixelRatio;

      canvas.height = canvas.width = size * devicePixelRatio;
      ctx.scale(scale, scale);

      ctx.fillStyle = background;
      ctx.fillRect(0, 0, numCells, numCells);

      ctx.fillStyle = foreground;
      ctx.fill(new Path2D(generatePath(cells, margin)));
    };

    onMounted(generate);
    onUpdated(generate);

    return () =>
      h("canvas", {
        ref: canvasEl,
        style: { width: `${props.size}px`, height: `${props.size}px` },
      });
  },
});
