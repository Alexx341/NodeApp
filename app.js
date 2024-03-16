const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const session = require("express-session")
const path = require("path");

const app = express();

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(session({
    secret:"fdskfdksfksd",
    resave:false,
    saveUninitialized:false
}))

app.use(express.static(__dirname + '/public'));
app.use("/", require("./routes/web"));
app.use("/api", require("./routes/api"));
app.listen(app.get("port"),function(){
    console.log("server started on port " + app.get("port"));
});

