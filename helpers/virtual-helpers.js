import { readFile } from "fs/promises";
import pathLib from "path";
import fg from "fast-glob";
import logger from "./printConsoleMessage";

const SVG_VIRTUAL_PATH_BASE = "virtual:svg-content-";
const VIRTUAL_OPTIONS_PATH = "virtual:svg-loader-options";

export const isVirtualSvg = (id) => id.startsWith(SVG_VIRTUAL_PATH_BASE);
export const isVirtualOption = (id) => id.startsWith(VIRTUAL_OPTIONS_PATH);
export const getVirtualSvgName = (id) => id.replace(SVG_VIRTUAL_PATH_BASE, "");

const generateImportsFromName = (pathMap) =>
  Object.keys(pathMap)
    .map((name) => `"${name}": () => import('${SVG_VIRTUAL_PATH_BASE}${name}')`)
    .join(",");

const getContent = async (name, path) => {
  const content = await readFile(path, "utf-8");

  return { name, content };
};

export const generatePathMap = (paths) => {
  return paths.reduce((acc, filePath) => {
    const { name } = pathLib.parse(filePath);
    acc[name] = filePath;
    return acc;
  }, {});
};

export const generateContentMap = async (pathMap) => {
  return (
    await Promise.all(Object.entries(pathMap).map(async ([name, path]) => getContent(name, path)))
  ).reduce(
    (acc, { name, content }) => ({ ...acc, [name]: `export default ${JSON.stringify(content)};` }),
    {},
  );
};

export const generateContext = async ({ dirs = ["src/**/*.svg"] } = {}) => {
  try {
    const paths = await fg(dirs);
    const pathMap = generatePathMap(paths);
    const contentMap = await generateContentMap(pathMap);
    return { pathMap, contentMap };
  } catch {
    logger("error", "Failed to generate svg context");
    return {
      pathMap: {},
      contentMap: {},
    };
  }
};

export const generateVirtualOptions = ({ pathMap, ignore = [], transform = null }) => `
  const context = {${generateImportsFromName(pathMap)}};
  export const ignoreList = ${JSON.stringify(ignore)};
  export const transform = ${transform};
  export const importSvgByName = (name) => context[name]();
`;
