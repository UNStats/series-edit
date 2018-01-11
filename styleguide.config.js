const path = require("path");
const pkg = require("./package.json");

module.exports = {
  components: "src/components/**/[A-Z]*.{js,jsx}",
  styleguideComponents: {
    Wrapper: path.join(__dirname, "src/styleguide/Wrapper")
  },
  title: pkg.description
};
