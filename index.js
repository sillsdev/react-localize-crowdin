#! /usr/bin/env node

var fs = require("fs");
let xmlJsConvert = require("xml-js");
let rlr = require("./r-l-r_json");

var myArgs = process.argv.slice(2);
if (myArgs.length < 2) {
  console.log("Command line utilities for working with Crowdin and react");
  console.log("Usage: -rlr [json translation file] [xlif file]");
  console.log("\tConverts json to xlf file for Crowdin");
  console.log("Usage: -x [xlf] [xlf]... -rlr [json translation file]");
  console.log("\tConverts multiple xlf files from Crowdin int one json file");
}
console.log("myArgs: ", myArgs);

let fileName = myArgs[0];
switch (myArgs[0]) {
  case "-rlr":
    rlrToXlf(myArgs[1], myArgs[2]);
    break;
  case "-x":
    switch (myArgs[myArgs.length - 2]) {
      case "-rlr":
        xlfToRlr(myArgs.slice(1, myArgs.length - 2), myArgs[myArgs.length - 1]);
        break;
    }
}

function xlfToRlr(xlfFiles, rlrFile) {
  var options = { compact: true, ignoreComment: true, spaces: 4 };
  let rlrJson = {};
  xlfFiles.map(xlf => {
    let fileJson = JSON.parse(
      xmlJsConvert.xml2json(fs.readFileSync(xlf), options)
    );
    rlr.convertToJson(fileJson, rlrJson);
  });
  fs.writeFileSync(rlrFile, JSON.stringify(rlrJson), err => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log("file saved!");
  });
}

function rlrToXlf(rlrJsonFile, xlfFile) {
  let data = JSON.parse(fs.readFileSync(rlrJsonFile));
  let xliffData = rlr.convertToXliff(data, rlrJsonFile);
  var options = { compact: true, ignoreComment: true, spaces: 4 };
  var result = xmlJsConvert.json2xml(xliffData, options);
  fs.writeFileSync(xlfFile, result, err => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log("file saved!");
  });
}
