export default function addImportsToVue(text, importsToAdd) {
  const importRegex = /import\s+\{([^{}]+)\}\s+from\s+["']vue["'];?/;

  const importMatch = text.match(importRegex);
  if (importMatch) {
    const existingImports = importMatch[1]
      .trim()
      .split(",")
      .map((importName) => importName.trim());

    const allImports = Array.from(new Set([...existingImports, ...importsToAdd]));

    const newImportStatement = `import {${allImports.join(", ")}} from "vue";`;

    const modifiedText = text.replace(importRegex, newImportStatement);

    return modifiedText;
  } else {
    const newImportStatement = `import {${importsToAdd.join(", ")}} from "vue";\n`;
    const modifiedText = newImportStatement + text;

    return modifiedText;
  }
}
