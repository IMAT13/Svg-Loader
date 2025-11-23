export default {
  name: "svg-loader",
  async install(app, { as = "SvgLoader" } = {}) {
    const module = await import("./svg-loader.vue");
    app.component(as, module.default);
  },
};
