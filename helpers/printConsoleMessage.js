const printConsoleMessage = (type, text) => {
  console[type](`[svg-loader]: ${text}`);
};

export default printConsoleMessage;
