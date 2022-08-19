//imports
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || "8000";
// const routes= require('./routes/routes.js');

// database connection
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connected to the database!")); //if connected sucess message

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false,
  })
);

// storing session message
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});
// app.use(express.static(join(process.cwd(), 'public'), options));
app.use(express.static("uploads"));
//set template engine
app.set("view engine", "ejs");
// router prefix
app.use("", require("./routes/routes.js"));

// get all users route

/* app.get('/', (req, res) => {
    res.send("hello world")
}) 
app.get('/', (req, res) => {
    
});
*/
app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});

/* 
app.use('/', routes); */
