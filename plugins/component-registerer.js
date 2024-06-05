export default function (callback, options) {
  return {
    name: "component-registerer",
    transform(code, id) {
      if (id.includes("main.ts") || id.includes("main.js")) return callback(code, options);
    },
  };
}
