const express = require("express");
const app = express();
require("./services/mongoose");
const auth = require("./routes/auth");

app.use(express.json());
app.use("/auth", auth);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port:${PORT}`));
