const express = require("express");
const path = require("path");

const app = express();

//Pug Setup
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "pug");

//Middleware
let appAccessible;
let hourAccessible;
let dayAccessible;
let nextAccess;
const access = (req, res, next) => {
  req.start = new Date();
  //Check Hours
  req.start.getHours() > 8 && req.start.getHours() < 18
    ? (hourAccessible = true)
    : (hourAccessible = false);
  //Check Day
  req.start.getDay() > 0 && req.start.getDay() < 6
    ? (dayAccessible = true)
    : (dayAccessible = false);
  //Check Global Accessibilty
  hourAccessible & dayAccessible
    ? (appAccessible = true)
    : (appAccessible = false);

  nextAccess = new Date();
  nextAccess.setHours(9);
  nextAccess.setMinutes(0);
  nextAccess.setSeconds(0);

  req.start.getDay() === 6 &&
  req.start.getHours() > 8 &&
  req.start.getHours() < 23
    ? nextAccess.setDate(nextAccess.getDate() + 2)
    : req.start.getDay() === 6 &&
      req.start.getHours() > 0 &&
      req.start.getHours() < 8
    ? nextAccess.setDate(nextAccess.getDate() + 1)
    : nextAccess.setDate(nextAccess.getDate() + 0);
  console.log(req.start.getHours());
  next();
};

app.use(access);
//Routes
app.get("/", (req, res) => {
  appAccessible
    ? res.render("home")
    : res.render("inaccessible", {
        nextAccess,
      });
});
app.get("/services", (req, res) => {
  appAccessible
    ? res.render("services")
    : res.render("inaccessible", {
        nextAccess,
      });
});
app.get("/contact", (req, res) => {
  appAccessible
    ? res.render("contact")
    : res.render("inaccessible", {
        nextAccess,
      });
});

app.listen(5600);
