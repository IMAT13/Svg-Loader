const createVNodeFromElement = (element) => {
  if (!element || element.nodeType !== 1) return null;
  const tag = element.tagName.toLowerCase();
  const props = {};
  const children = [];
  for (const attr of element.attributes) {
    props[attr.name] = attr.value;
  }
  for (const child of element.childNodes) {
    if (child.nodeType === 1) {
      children.push(createVNodeFromElement(child));
    } else if (child.nodeType === 3 && child.nodeValue.trim()) {
      children.push(child.nodeValue);
    }
  }

  return h(tag, props, children);
};

const parseSvgToVNode = (svgString) => {
  const parser = new DOMParser();
  const svgElement = parser.parseFromString(svgString, "image/svg+xml").documentElement;
  return createVNodeFromElement(svgElement);
};

export default parseSvgToVNode;
