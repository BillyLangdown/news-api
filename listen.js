const app = require("./app");
const { PORT = 9000 } = process.env;

app.listen(PORT, () => {
  console.log(`Listerning on port ${port}`);
});