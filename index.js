import generateProjectSvgsContext from "./helpers/generateProjectSvgsContext.js";
import registerSvgLoader from "./utils/registerSvgLoaderComponent.js";

export default function (options) {
  return {
    name: "svg-loader",
    async transform(code, id) {
      if (id.includes("main.ts") || id.includes("main.js")) {
        const context = await generateProjectSvgsContext();

        return registerSvgLoader(code, { ...options, context });
      }
    },
  };
}
