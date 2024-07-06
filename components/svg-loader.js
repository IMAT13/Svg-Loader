const COLOR_REGEX = /#[0-9a-fA-F]{3,8}/g;
const WIDTH_REGEX = /width\s*=\s*['"]?(\d+)['"]?/;
const HEIGHT_REGEX = /height\s*=\s*['"]?(\d+)['"]?/;
const VIEW_BOX_REGEX = /viewBox=['"]([^"]+)['"]/;

import logger from "../helpers/printConsoleMessage";

export default function ({ ignore = [], transform, context }) {
  return `{
    props: {
      name: {
        type: String,
        required: true,
      },
      transformation: {
        type: Boolean,
        default: true,
      },
      height: {
        type: String,
      },
      width: {
        type: String,
      },
      color: {
        type: String,
      },
      backgroundColor: {
        type: String,
      },
      preserveAspectRatio: {
        type: String,
      },
    },
    setup(props) {
      const context =${JSON.stringify(context)};
      const logger = ${logger};
      const ignoredSvgs = "${ignore}".replaceAll(".svg", "").split(",");
      const svgContent = ref(null);
      const currentColor = ref("");
      const currentSize = reactive({
        width: "",
        height: "",
      });
      const currentViewBox = reactive({
        startPositionX: 0,
        startPositionY: 0,
        endPositionX: 0,
        endPositionY: 0,
      });

      const addAttribute = (svg, name, value) => {
        return svg.replace("<svg", "<svg " + name + '="' + value + '"');
      };

      const transform = ${transform};

      const handleAttributesErrors = (size, viewBoxDimensions) => {
        if (!viewBoxDimensions && !size.width && !size.height) {
          logger("error",
            "The provided SVG (name: " +
              props.name +
              ") is missing required attributes: width, height, and viewBox. Please ensure the SVG includes these attributes.",
          );
        } else if (viewBoxDimensions && (!size.width || !size.height)) {
          logger("warn",
            "The provided SVG (name: " +
              props.name +
              ") is missing required attributes: width and height. Please ensure the SVG includes these attributes.",
          );
        } else if ((size.width || size.height) && !viewBoxDimensions) {
          logger("warn",
            "The provided SVG (name: " +
              props.name +
              ") is missing the required viewBox attribute. Please ensure the SVG includes this attribute.",
          );
        }
      };

      const insertViewBoxFromDimensions = (svg, size, viewBoxDimensions) => {
        const maxX = size.width ? size.width : size.height;
        const maxY = size.height ? size.height : size.width;

        return addAttribute(svg, "viewBox", "0 0 " + maxX + " " + maxY);
      };

      const transformSVG = (svg) => {
        let transformedSvg = svg;

        transformedSvg = changeSVGSize(transformedSvg, "width");
        transformedSvg = changeSVGSize(transformedSvg, "height");
        const viewBoxDimensions = extractSVGViewBox(transformedSvg);

        Object.assign(currentViewBox, viewBoxDimensions);

        handleAttributesErrors(currentSize, viewBoxDimensions);

        const shouldAddViewBox = (currentSize.width || currentSize.height) && !viewBoxDimensions;
        if (shouldAddViewBox) transformedSvg = insertViewBoxFromDimensions(transformedSvg, currentSize);

        if (props.preserveAspectRatio)
          transformedSvg = addAttribute(transformedSvg, "preserveAspectRatio", props.preserveAspectRatio);

        transformedSvg = addAttribute(transformedSvg, "data-name", props.name);

        return changeSVGColor(transformedSvg);
      };

      const extractSVGViewBox = (svg) => {
        const viewBoxDimensions = svg.match(${VIEW_BOX_REGEX})?.[1]?.split(/\\s+/);

        if (Array.isArray(viewBoxDimensions) && viewBoxDimensions.length === 4) {
          const svgViewBox = {
            startPositionX: Number(viewBoxDimensions[0]),
            startPositionY: Number(viewBoxDimensions[1]),
            endPositionX: Number(viewBoxDimensions[2]),
            endPositionY: Number(viewBoxDimensions[3]),
          };

          return svgViewBox;
        }
        return null;
      };

      const changeSVGSize = (svg, property) => {
        const propertyPattern = property === "width" ? ${WIDTH_REGEX} : ${HEIGHT_REGEX};

        const matchedList = svg.match(propertyPattern);
        currentSize[property] = matchedList ? Number(matchedList[matchedList.length - 1]) : "";

        return svg.replace(propertyPattern, "");
      };

      const changeSVGColor = (svg) => {
        const colorList = svg.match(${COLOR_REGEX});
        const colorCount = new Set(colorList).size;

        if (colorCount === 1) {
          currentColor.value = colorList[0];

          return svg.replace(${COLOR_REGEX}, "currentColor");
        }

        return svg;
      };

      const convertNumberToPixel = (number) => (isNaN(Number(number)) || !number ? number : number + "px");

      const isTransformable = (svg) =>
        !ignoredSvgs.includes(props.name) &&
        !svg.includes("svg-loader-transformation-disable") &&
        props.transformation;

      watchEffect(async () => {
        const content = context[props.name];

        if (!content){
            logger("error",
              "The specified SVG (name: " +
                props.name +
                ") is missing. Please ensure the SVG file is included in the src/*.",
            );
            
            return;
        }
        
        const transformedSVG = isTransformable ? transformSVG(content) : content;

        if (transform && typeof transform === "function") {
          svgContent.value = transform(transformedSVG, {
            name: props.name,
          });
        } else {
          svgContent.value = transformedSVG;
        }
      });

      const getStylePropertyValue = (property) =>
        isTransformable && props[property] ? props[property] : undefined;

      const currentWidth = computed(
        () =>
          currentSize.width ||
          currentViewBox.endPositionX - currentViewBox.startPositionX ||
          currentSize.height ||
          0,
      );
      const currentHeight = computed(
        () =>
          currentSize.height ||
          currentViewBox.endPositionY - currentViewBox.startPositionY ||
          currentSize.width ||
          0,
      );

      const styleProperties = computed(() => ({
        "--current-width": convertNumberToPixel(currentWidth.value),
        "--current-height": convertNumberToPixel(currentHeight.value),
        "--current-color": currentColor.value,
        width: convertNumberToPixel(getStylePropertyValue("width")),
        height: convertNumberToPixel(getStylePropertyValue("height")),
        color: getStylePropertyValue("color"),
        backgroundColor: getStylePropertyValue("backgroundColor"),
      }));

      return () =>
        h("span", {
          innerHTML: svgContent.value,
          class: "svg-loader",
          style: styleProperties.value,
        });
    },
  }`;
}
