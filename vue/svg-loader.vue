<template>
  <component :is="svgVNode" :style="styleProperties" class="svg-loader" />
</template>

<script setup>
  import { ignoreList, importSvgByName, transform } from "virtual:svg-loader-options";
  import { computed, reactive, ref, watchEffect } from "vue";
  import parseSvgToVNode from "../helpers/parseSvgToVNode";
  import logger from "../helpers/printConsoleMessage";

  const COLOR_REGEX = /#[0-9a-fA-F]{3,8}/g;
  const WIDTH_REGEX = /width\s*=\s*['"]?(\d+)['"]?/;
  const HEIGHT_REGEX = /height\s*=\s*['"]?(\d+)['"]?/;
  const VIEW_BOX_REGEX = /viewBox=['"]([^"]+)['"]/;

  const props = defineProps({
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
  });

  const svgVNode = ref(null);
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

  const ignoredSvgs = computed(() => ignoreList.map((svg) => svg.replace(".svg", "")));

  const addAttribute = (svg, name, value) => svg.replace("<svg", `<svg ${name}="${value}"`);

  const handleAttributesErrors = (size, viewBoxDimensions) => {
    if (!viewBoxDimensions && !size.width && !size.height) {
      logger(
        "error",
        `The provided SVG (name: ${props.name}) is missing required attributes: width, height, and viewBox. Please ensure the SVG includes these attributes.`,
      );
    } else if (viewBoxDimensions && (!size.width || !size.height)) {
      logger(
        "warn",
        `The provided SVG (name: ${props.name}) is missing required attributes: width and height. Please ensure the SVG includes these attributes.`,
      );
    } else if ((size.width || size.height) && !viewBoxDimensions) {
      logger(
        "warn",
        `The provided SVG (name: ${props.name}) is missing the required viewBox attribute. Please ensure the SVG includes this attribute.`,
      );
    }
  };

  const insertViewBoxFromDimensions = (svg, size) => {
    const maxX = size.width || size.height;
    const maxY = size.height || size.width;

    return addAttribute(svg, "viewBox", `0 0 ${maxX} ${maxY}`);
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

    if (props.preserveAspectRatio) {
      transformedSvg = addAttribute(transformedSvg, "preserveAspectRatio", props.preserveAspectRatio);
    }

    transformedSvg = addAttribute(transformedSvg, "data-name", props.name);

    return changeSVGColor(transformedSvg);
  };

  const extractSVGViewBox = (svg) => {
    const viewBoxDimensions = svg.match(VIEW_BOX_REGEX)?.[1]?.split(/\s+/);

    if (Array.isArray(viewBoxDimensions) && viewBoxDimensions.length === 4) {
      return {
        startPositionX: Number(viewBoxDimensions[0]),
        startPositionY: Number(viewBoxDimensions[1]),
        endPositionX: Number(viewBoxDimensions[2]),
        endPositionY: Number(viewBoxDimensions[3]),
      };
    }
    return null;
  };

  const changeSVGSize = (svg, property) => {
    const propertyPattern = property === "width" ? WIDTH_REGEX : HEIGHT_REGEX;

    const matchedList = svg.match(propertyPattern);
    currentSize[property] = matchedList ? Number(matchedList[matchedList.length - 1]) : "";

    return svg.replace(propertyPattern, "");
  };

  const changeSVGColor = (svg) => {
    const colorList = svg.match(COLOR_REGEX);
    const colorCount = new Set(colorList).size;

    if (colorCount === 1) {
      currentColor.value = colorList[0];
      return svg.replace(COLOR_REGEX, "currentColor");
    }

    return svg;
  };

  const isTransformable = (svg) =>
    !ignoredSvgs.value.includes(props.name) &&
    !svg.includes("svg-loader-transformation-disable") &&
    props.transformation;

  const convertNumberToPixel = (number) => (isNaN(Number(number)) || !number ? number : `${number}px`);

  watchEffect(async () => {
    try {
      const module = await importSvgByName(props.name);
      if (!module) {
        logger("error", `SVG "${props.name}" not found in context.`);
        return;
      }
      const content = module.default;

      const transformedSVG = isTransformable(content) ? transformSVG(content) : content;
      svgVNode.value = parseSvgToVNode(
        transform && typeof transform === "function"
          ? transform(transformedSVG, { name: props.name })
          : transformedSVG,
      );
    } catch (error) {
      logger("error", `Failed to load SVG "${props.name}": ${error.message}`);
    }
  });

  const styleProperties = computed(() => ({
    "--current-width": convertNumberToPixel(
      currentSize.width || currentViewBox.endPositionX - currentViewBox.startPositionX || 0,
    ),
    "--current-height": convertNumberToPixel(
      currentSize.height || currentViewBox.endPositionY - currentViewBox.startPositionY || 0,
    ),
    "--current-color": currentColor.value,
    width: convertNumberToPixel(props.width),
    height: convertNumberToPixel(props.height),
    color: props.color,
    backgroundColor: props.backgroundColor,
  }));
</script>

<!-- eslint-disable-next-line vue/enforce-style-attribute -->
<style lang="css">
  .svg-loader {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    width: var(--icon-width, var(--current-width));
    height: var(--icon-height, var(--current-height));
    background-color: var(--icon-background-color);
    color: var(--icon-color, var(--current-color));
    max-width: 100%;
  }

  /* Support for Apple products */
  @supports (-webkit-appearance: none) {
    .svg-loader {
      align-items: normal;
    }
  }
</style>
