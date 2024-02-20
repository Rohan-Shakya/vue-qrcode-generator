import { PropType, defineComponent, h, ref, watchEffect } from "vue";
import QR from "../lib/qr-code-generator";
import {
  ErrorCorrectLevelMap,
  generatePath,
  getImageSettings,
  excavateModules,
} from "./utils";
import { ImageSettings } from ".";

export default defineComponent({
  name: "QRCodeSvg",
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
      type: Object as PropType<ImageSettings>,
      default: () => ({}),
    },
  },
  setup(props) {
    const numCells = ref(0);
    const fgPath = ref("");
    const imageProps = ref<{
      x: number;
      y: number;
      width: number;
      height: number;
    }>(null!);

    watchEffect(() => {
      const { value, level, margin } = props;
      let cells = QR.QrCode.encodeText(
        value,
        ErrorCorrectLevelMap[level],
      ).getModules();
      numCells.value = cells.length + margin * 2;

      if (props.imageSettings.src) {
        const imageSettings = getImageSettings(
          cells,
          props.size,
          margin,
          props.imageSettings,
        );
        imageProps.value = {
          x: imageSettings.x,
          y: imageSettings.y,
          width: imageSettings.w,
          height: imageSettings.h,
        };

        if (imageSettings.excavation) {
          cells = excavateModules(cells, imageSettings.excavation);
        }
      }

      fgPath.value = generatePath(cells, margin);
    });

    return () =>
      h(
        "svg",
        {
          width: props.size,
          height: props.size,
          "shape-rendering": `crispEdges`,
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: `0 0 ${numCells.value} ${numCells.value}`,
        },
        [
          h("path", {
            fill: props.background,
            d: `M0,0 h${numCells.value}v${numCells.value}H0z`,
          }),
          h("path", { fill: props.foreground, d: fgPath.value }),
          props.imageSettings.src &&
            h("image", {
              href: props.imageSettings.src,
              ...imageProps.value,
            }),
        ],
      );
  },
});
