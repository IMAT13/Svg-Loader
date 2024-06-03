import svgLoader from "vite-svg-loader";
import registerSvgLoader from "./helpers/registerSvgLoaderComponent.js";
import componentRegisterer from "./plugins/component-registerer.js";

export default (options = { dir: "./assets/svg/", subDomain: "shared" }) => {
  return [
    svgLoader({
      svgoConfig: { plugins: [{ name: "removeViewBox", active: false }] },
    }),
    componentRegisterer(registerSvgLoader, options),
  ];
};

