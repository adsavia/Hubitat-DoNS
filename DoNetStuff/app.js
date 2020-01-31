var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var router = require('express-convention-routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

router.load(app, {
    routesDirectory: './controllers', 
    //Root directory where your server is running
    rootDirectory: __dirname,
    //Do you want the created routes to be shown in the console?
    logRoutes: true
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
 console.log("Server running on port " + PORT);
});

