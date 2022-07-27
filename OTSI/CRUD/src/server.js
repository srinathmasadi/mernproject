const express = require("express");
require("./db/conn");
const Student = require("./models/basic");
const studentRouter = require("./routers/route");

const app = express();
const port= process.env.PORT || 3000;
app.use(express.json());
app.use(studentRouter);

app.listen(port, () =>{
    console.log(`connection is setup at ${port}`);
})