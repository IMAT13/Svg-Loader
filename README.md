# SvgLoader Vite Plugin

SvgLoader is a Vite plugin for Vue 3 that simplifies the process of loading SVGs into your project. It provides a component that you can use anywhere in your code to load SVGs effortlessly. Loading SVGs can be cumbersome, but with SvgLoader, you can easily manage and use SVGs without any hassle.

## Features

- Load SVGs with minimal effort.
- Provides a global component for SVG usage.
- Compatible with Vite and Vue 3.
- Customizable configurations.
- Modify styles using CSS variables.
- Automatic SVG transformation and optimization.

## Installation

Currently, SvgLoader is not available as an npm package. However, you can use the provided codebase and add it to your project. You will need to install the following dependencies:

1. Install required dependencies:

```bash
npm install fast-glob vite-svg-loader
```

2. Import SvgLoader from the path to the package and add it to the list of plugins in your Vite config.

## Usage

Here's an example of how to set up and use SvgLoader in your Vite project.

### Add SvgLoader to Vite Config

First, import SvgLoader from the path to the package and add it to the list of plugins in your Vite config.

```javascript
import svgLoader from "path-to-svg-loader-package/vite";

export default {
  plugins: [
    svgLoader({
      dirs: ["src/**/*.svg"], // Array of glob patterns to find SVG files
      ignore: [], // Array of SVG file names to ignore during transformation
      transform: null, // Optional transformation function: (svg, { name }) => string
    }),
  ],
};
```

#### Configuration Options

- `dirs` (Array, optional): Glob patterns to find SVG files. Default: `["src/**/*.svg"]`
- `ignore` (Array, optional): Array of SVG file names (without extension) to ignore during transformation. Default: `[]`
- `transform` (Function, optional): Custom transformation function that receives the SVG string and an object with the SVG name. Should return a transformed SVG string. Default: `null`

### Register the Vue Component

In your Vue application's main entry file (e.g., `main.js` or `main.ts`), register the SvgLoader component:

```javascript
import { createApp } from "vue";
import svgLoaderPlugin from "path-to-svg-loader-package/vue";
import App from "./App.vue";

const app = createApp(App);

// Register the SvgLoader component globally
app.use(svgLoaderPlugin, { as: "SvgLoader" }); // 'as' is optional, defaults to "SvgLoader"

app.mount("#app");
```

### Using the Global Component

Once you have added SvgLoader to your Vite config and registered the Vue component, you can use the global component in your project to load SVGs. For example:

```html
<template>
  <div>
    <SvgLoader name="example" />
  </div>
</template>

<script>
  export default {
    name: "MyComponent",
  };
</script>
```

#### Props

- `name`: (String, required) The name of the SVG file.
- `transformation`: (Boolean, optional) Enable or disable SVG transformation (default: true).
- `height`: (String, optional) Height of the SVG.
- `width`: (String, optional) Width of the SVG.
- `color`: (String, optional) Color of the SVG.
- `backgroundColor`: (String, optional) Background color for the SVG.
- `preserveAspectRatio`: (String, optional) Aspect ratio settings for the SVG.

### Example Configurations

#### Basic Configuration

```html
<template>
  <div>
    <SvgLoader name="logo" />
  </div>
</template>
```

#### Disable Transformation

```html
<template>
  <div>
    <SvgLoader name="logo" :transformation="false" />
  </div>
</template>
```

#### Custom Dimensions and Colors

```html
<template>
  <div>
    <SvgLoader name="icon" width="100px" height="100px" color="#FF5733" backgroundColor="#FFF" />
  </div>
</template>
```

### Styling with CSS Variables

SvgLoader allows you to modify the styles of the SVGs using CSS variables. Here are the CSS variables that can be used:

- `--icon-width`: Sets the width of the SVG.
- `--icon-height`: Sets the height of the SVG.
- `--icon-background-color`: Sets the background color of the SVG.
- `--icon-color`: Sets the color of the SVG.

These variables can be applied inside your CSS files and have higher priority over props.

#### Example of Custom Styling

```html
<template>
  <div>
    <SvgLoader class="my-svg" name="icon" />
  </div>
</template>

<style>
  .my-svg {
    --icon-width: 150px;
    --icon-height: 150px;
    --icon-background-color: #e0e0e0;
    --icon-color: #ff5733;
  }
</style>
```

By using these CSS variables, you can easily customize the appearance of your SVGs locally within your components.

## Requirements

- Vue 3.x
- Vite
- Node.js

## Compatibility

SvgLoader is fully compatible with Vite and Vue 3. There are no known issues so far.

## Contributing

We welcome contributions from the community! If you encounter any issues or have feature requests, please create an issue in the repository.

## License

SvgLoader is distributed under the MIT License.

Feel free to reach out if you have any questions or need further assistance.
