const express = require("express");
const app = express();
require("./services/mongoose");
const auth = require("./routes/auth");

app.use(express.json());
app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use("/auth", auth);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port:${PORT}`));
