var express = require("express"),
    app = express(),
    path = require("path"),
    config = require("./config");

app.use(express.static(path.join(__dirname,"..","dist")));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname,"..","client","index.html"));
});

app.listen(config.port, function() {
    console.log("listening on "+config.port);
});
