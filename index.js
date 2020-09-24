#! /usr/bin/env node

var fs = require("fs");
let xmlJsConvert = require("xml-js");
let rlr = require("./r-l-r_json");

function consoleUsage() {
  console.log("Command line utilities for working with Crowdin and react");
  console.log("Usage: -rlr [json translation file] [xlif file] [source lang]");
  console.log("\tConverts json to xlf file for Crowdin");
  console.log("Usage: -x [xlf] [xlf]... -rlr [json translation file]");
  console.log("\tConverts multiple xlf files from Crowdin int one json file");
}

const myArgs = process.argv.slice(2);
if (myArgs.length < 3) {
  consoleUsage();
} else {
  switch (myArgs[0]) {
    case "-rlr":
      if (myArgs.length > 3) {
        rlrToXlf(myArgs[1], myArgs[2], myArgs.slice(3));
      } else {
        console.log("Source language not specified; using default 'en'.");
        rlrToXlf(myArgs[1], myArgs[2], ["en"]);
      }
      break;
    case "-x":
      switch (myArgs[myArgs.length - 2]) {
        case "-rlr":
          xlfToRlr(
            myArgs.slice(1, myArgs.length - 2),
            myArgs[myArgs.length - 1]
          );
          break;
      }
      break;
  }
}

function xlfToRlr(xlfFiles, rlrFile) {
  var options = { compact: true, ignoreComment: true, spaces: 4 };
  let rlrJson = {};
  xlfFiles.map((xlf) => {
    let fileJson = JSON.parse(
      xmlJsConvert.xml2json(fs.readFileSync(xlf), options)
    );
    rlr.convertToJson(fileJson, rlrJson);
  });
  fs.writeFileSync(rlrFile, JSON.stringify(rlrJson), (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log("file saved!");
  });
}

function rlrToXlf(rlrJsonFile, xlfFile, languages) {
  const data = JSON.parse(fs.readFileSync(rlrJsonFile));
  const xlfSuffix = ".xliff";
  const xlfFileRoot = getFileRoot(xlfFile, xlfSuffix);
  const xliffData = rlr.convertToXliff(data, rlrJsonFile, languages);
  const options = { compact: true, ignoreComment: true, spaces: 4 };
  const result = xmlJsConvert.json2xml(xliffData[0], options);
  fs.writeFileSync(xlfFileRoot + xlfSuffix, result, (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log("file saved!");
  });
}

// Remove suffix from end of a string
function getFileRoot(fileName, fileSuffix) {
  const fLen = fileName.length;
  const sLen = fileSuffix.length;
  if (
    fLen >= sLen &&
    fileName.substring(fLen - sLen).toLowerCase() === fileSuffix.toLowerCase()
  ) {
    return fileName.substring(0, fLen - sLen);
  }
  return fileName;
}
