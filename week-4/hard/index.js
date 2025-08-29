const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

app.get("/healthy", (req, res)=> res.send("I am Healthy"));

//  start writing your routes here
const userRoutes = require("./routes/user")
const todoRoutes = require("./routes/todo")

app.use("/api/v1/user",userRoutes)
app.use("/api/v1/todo",todoRoutes)

app.listen(port, ()=> console.log(`Server is running at http://localhost:${port}`));
