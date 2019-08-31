var fs = require("fs");
let convert = require("xml-js");

var myArgs = process.argv.slice(2);
console.log("myArgs: ", myArgs);

let fileName = myArgs[0];
let data = JSON.parse(fs.readFileSync(fileName));
let xliffData = {
  xliff: {
    _attributes: {
      xmlns: "urn:oasis:names:tc:xliff:document:1.2",
      version: "1.2"
    },
    file: {
      _attributes: {
        original: fileName,
        "source-language": "en"
      },
      "trans-unit": []
    }
  }
};
Object.keys(data).map(function(key, index) {
  Object.keys(data[key]).map(function(subkey, subndx) {
    let transUnit = {
      _attributes: { id: key + "." + subkey },
      source: {
        _attributes: { "xml:lang": "en" },
        _text: data[key][subkey][0]
      }
    };

    xliffData.xliff.file["trans-unit"].push(transUnit);
  });
});
var options = { compact: true, ignoreComment: true, spaces: 4 };
var result = convert.json2xml(xliffData, options);
console.log(result);
fs.writeFileSync("test.xml", result, err => {
  // throws an error, you could also catch it here
  if (err) throw err;

  // success case, the file was saved
  console.log("file saved!");
});
