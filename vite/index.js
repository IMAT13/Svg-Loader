import svgLoader from "vite-svg-loader";
import {
  generateContext,
  generateVirtualOptions,
  getVirtualSvgName,
  isVirtualOption,
  isVirtualSvg,
} from "../helpers/virtual-helpers";

const svgLoaderVitePlugin = (options) => {
  let pathMap = {};
  let contentMap = {};

  return [
    {
      name: "svg-loader",

      async buildStart() {
        const context = await generateContext(options);
        pathMap = context.pathMap;
        contentMap = context.contentMap;
      },

      resolveId(id) {
        if (isVirtualSvg(id) || isVirtualOption(id)) return id;
      },

      async load(id) {
        if (isVirtualSvg(id)) return contentMap[getVirtualSvgName(id)];

        if (isVirtualOption(id))
          return generateVirtualOptions({
            pathMap,
            ...options,
          });

        return null;
      },
    },
    svgLoader(),
  ];
};

export default svgLoaderVitePlugin;
