#! /usr/bin/env node

const fs = require("fs");
const xmlJsConvert = require("xml-js");
const rlr = require("./r-l-r_json");

function consoleUsage() {
  console.log("Command line utilities for working with Crowdin and react");
  console.log("Usage: -rlr [json translation file] [xlif file]");
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
      rlrToXlf(myArgs[1], myArgs[2]);
      break;
    case "-x":
      switch (myArgs[myArgs.length - 2]) {
        case "-rlr":
          xlfToRlr(
            myArgs.slice(1, myArgs.length - 2),
            myArgs[myArgs.length - 1]
          );
          break;
        default:
          consoleUsage();
      }
      break;
    default:
      consoleUsage();
  }
}

function xlfToRlr(xlfFiles, rlrFile) {
  const options = { compact: true, ignoreComment: true, spaces: 4 };
  const rlrJson = {};
  xlfFiles.map((xlf) => {
    const fileJson = JSON.parse(
      xmlJsConvert.xml2json(fs.readFileSync(xlf), options)
    );
    rlr.convertToJson(fileJson, rlrJson);
  });
  fs.writeFileSync(rlrFile, JSON.stringify(rlrJson), (err) => {
    // throws an error, you could also catch it here
    if (err) {
      throw err;
    }

    // success case, the file was saved
    console.log("file saved!");
  });
}

function rlrToXlf(rlrJsonFile, xlfFile) {
  const data = JSON.parse(fs.readFileSync(rlrJsonFile));
  const xliffData = rlr.convertToXliff(data, rlrJsonFile);
  const options = { compact: true, ignoreComment: true, spaces: 4 };
  const result = xmlJsConvert.json2xml(xliffData, options);
  fs.writeFileSync(xlfFile, result, (err) => {
    // throws an error, you could also catch it here
    if (err) {
      throw err;
    }

    // success case, the file was saved
    console.log("file saved!");
  });
}
