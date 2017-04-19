var fs  = require("fs"),
    _ = require("underscore"),
    marked = requier("marked"),
    Args = require("argparse").ArgumentParser;

var parser = new Args();

parser.addArgument("file");

var args = parser.parseArgs(),
    inp = "./"+args.file;
    out = "./html/"+args.file+".html";

fs.writeFileSync(out, fs.readFileSync("./base/doc.css"));
fs.writeFileSync(out, marked(fs.readFileSync(inp))); 

fs.readFileSync('./'+args.file).toString().split('\n').forEach(function (line) { 
    var l = line.replace(new RegExp("--",'g'),'—');
    
    if(line.slice(0,2) == "h.") {
        fs.appendFileSync(out, (!firsth ? "</div>" : "") + "<div class='the black"+(firsth ? " header" : "")+"'>\n");
        firsth = false;
    } else if(line.slice(0,2) == "s.") {
        fs.appendFileSync(out, (!firsts ? "</div>" : "") +"<div class='the white"+(firsts ? " header" : "")+"'>\n");
        firsts = false;
    } else {
        fs.appendFileSync(out, l.toString());
    }
});
