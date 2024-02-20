import { createApp, defineComponent, onMounted, ref } from "vue";
import VueQRCode from "../src";
import type { Level, RenderAs, ImageSettings } from "../src";

const App = defineComponent({
  components: { "vue-qr-code": VueQRCode },
  setup() {
    const value = ref("https://github.com/Rohan-Shakya/vue-qr-code");
    const size = ref(250);
    const level = ref<Level>("L");
    const background = ref("#ffffff");
    const foreground = ref("#000000");
    const renderAs = ref<RenderAs>("svg");
    const margin = ref(0);
    const imageSettings = ref<ImageSettings>({
      src: "https://github.com/Rohan-Shakya.png",
      width: 30,
      height: 30,
      // x: 10,
      // y: 10,
      excavate: false,
    });

    const stargazersCount = ref(0);

    onMounted(() => {
      fetchGitHubRepoStarCount((repoDetail: any) => {
        const { stargazers_count } = repoDetail;

        if (typeof stargazers_count === "number") {
          stargazersCount.value = stargazers_count;
        }
      });
    });

    return {
      value,
      size,
      level,
      background,
      foreground,
      renderAs,
      margin,
      imageSettings,
      stargazersCount,
    };
  },
});

createApp(App).mount("#root");

function fetchGitHubRepoStarCount(callback: Function) {
  const repo = "https://api.github.com/repos/Rohan-Shakya/vue-qr-code";

  try {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        callback(JSON.parse(xhr.response));
      }
    };

    xhr.onerror = function (ev) {
      console.log(ev);
      callback({});
    };

    xhr.open("GET", repo);
    xhr.send();
  } catch (e) {
    console.log(e);
    callback({});
  }
}
