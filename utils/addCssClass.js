export default function addCssClass(name, styleObject, elementSelector = `.${name}`) {
  const css = Object.keys(styleObject)
    .map((property) => {
      const cssProperty = property.replace(/([A-Z])/g, "-$1").toLowerCase();
      return `${cssProperty}: ${styleObject[property]};`;
    })
    .join(" ");

  const styleContent = `${elementSelector} { ${css} }`;
  const head = document.head || document.getElementsByTagName("head")[0];
  const style = document.createElement("style");

  head.appendChild(style);

  if (style.styleSheet) style.styleSheet.cssText = styleContent;
  else style.appendChild(document.createTextNode(styleContent));
}
