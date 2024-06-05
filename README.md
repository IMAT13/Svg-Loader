# SvgLoader Vite Plugin

SvgLoader is a Vite plugin that simplifies the process of loading SVGs into your project. It provides a component that you can use anywhere in your code to load SVGs effortlessly. Loading SVGs can be cumbersome, but with SvgLoader, you can easily manage and use SVGs without any hassle.

## Features

- Load SVGs with minimal effort.
- Provides a global component for SVG usage.
- Compatible with Vite.
- Customizable configurations.
- Modify styles using CSS variables.

## Installation

Currently, SvgLoader is not available as an npm package. However, you can use the provided codebase and add it to your project. Additionally, you will need to install the `vite-svg-loader` package.

1. Install `vite-svg-loader`:

```bash
npm install vite-svg-loader
```

2. Import SvgLoader from the path to the package and add it to the list of plugins in your Vite config.

## Usage

Here's an example of how to set up and use SvgLoader in your Vite project.

### Add SvgLoader to Vite Config

First, import SvgLoader from the path to the package and add it to the list of plugins in your Vite config.

```javascript
import svgLoader from "path-to-svg-loader-package";

export default {
  plugins: [
    svgLoader({
      dir: "@/assets/svg/",
      subDomain: "shared",
      ignore: [],
      componentName: "SvgLoader",
      transform: null, // Optional transformation function
    }),
  ],
};
```

### Using the Global Component

Once you have added SvgLoader to your Vite config, you can use the global component in your project to load SVGs. For example:

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
- `subDomain`: (String, optional) Subdirectory under the main SVG directory.
- `path`: (String, optional) Full path to the SVG file.
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

#### Custom Path

```html
<template>
  <div>
    <SvgLoader path="custom/path/to/logo" />
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

## Compatibility

SvgLoader is fully compatible with Vite. There are no known issues so far.

## Contributing

We welcome contributions from the community! If you encounter any issues or have feature requests, please create an issue in the repository.

## License

SvgLoader is distributed under the MIT License.

Feel free to reach out if you have any questions or need further assistance.

