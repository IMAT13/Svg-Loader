import { readFile } from "fs/promises";
import pathLib from "path";
import fg from "fast-glob";
import printConsoleMessage from "./printConsoleMessage";

const generateProjectSvgsContext = async () => {
  try {
    const svgPaths = await fg(["src/**/*.svg"]);

    const svgContents = await Promise.all(
      svgPaths.map(async (filePath) => {
        const svgContent = await readFile(filePath, "utf-8");
        return { path: filePath, value: svgContent };
      }),
    );

    return svgContents.reduce((map, { path, value }) => {
      const { name } = pathLib.parse(path);
      if (!map[name]) map[name] = value;
      else
        printConsoleMessage("warn", `svg "${name}" is already been registered. svg at "${path}" is ignored.`)
      return map;
    }, {});
  } catch (error) {
    printConsoleMessage("error", error)
  }
};
export default generateProjectSvgsContext;
