export default function (callback, options) {
  return {
    name: "infra-component-registerer",
    transform(code, id) {
      if (id.includes("main.ts") || id.includes("main.js")) return callback(code, options);
    },
  };
}
