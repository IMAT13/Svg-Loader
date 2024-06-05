import insertTextAfter from "./insertTextAfter.js";
import addImportsToVue from "./addImportsToVue.js";
import svgLoader from "../components/svg-loader.js";
import addCssClass from "./addCssClass.js";

import { svgLoaderStyles } from "../styles/svg-loader-style.js";

const CREATE_APP_TEXT = "const app = createApp(App);";

export default function registerSvgLoaderComponent(code, options) {
  const codeWithAddedImports = addImportsToVue(code, ["ref", "computed", "watchEffect", "h"]);
  const componentName = options.componentName || "SvgLoader";

  return insertTextAfter(
    codeWithAddedImports,
    CREATE_APP_TEXT,
    `
          const addCssClass = ${addCssClass}
          addCssClass('svg-loader', ${JSON.stringify(svgLoaderStyles)});

          app.component("${componentName}", ${svgLoader(options)});
    `,
  );
}
