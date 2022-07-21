#! /usr/bin/env node

const fs = require("fs");
const xmlJsConvert = require("xml-js");
const rlr = require("./r-l-r_json");

function consoleUsage() {
  console.log("Command line utilities for working with Crowdin and react");
  console.log("Usage: -x2j [xlf file] [json file]");
  console.log(
    "\tConverts xlf file from Crowdin to json file for use with i18next."
  );
  console.log("Usage: -j2x [json file] [xlf file]");
  console.log(
    "\tConverts json file used with i18next to xlf for updating in Crowdin."
  );
}

const myArgs = process.argv.slice(2);
if (myArgs.length < 3) {
  consoleUsage();
} else {
  switch (myArgs[0]) {
    case "-x2j":
      if (myArgs.length > 3) {
        console.log("Too many arguments.");
      } else {
        xlfToJson(myArgs[1], myArgs[2]);
      }
      break;
    case "-j2x":
      if (myArgs.length > 3) {
        console.log("Too many arguments.");
      } else {
        jsonToXlf(myArgs[1], myArgs[2]);
      }
      break;
    default:
      consoleUsage();
  }
}

function xlfToJson(xlfFilename, jsonFilename) {
  const options = { compact: true, ignoreComment: true, spaces: 4 };
  const xlfData = JSON.parse(
    xmlJsConvert.xml2json(fs.readFileSync(xlfFilename), options)
  );
  const jsonData = rlr.convertToJson(xlfData);
  fs.writeFileSync(jsonFilename, JSON.stringify(jsonData), (err) => {
    // Throws an error, you could also catch it here
    if (err) {
      throw err;
    }
    // Success case, the file was saved
    console.log(`File saved: ${jsonFilename}`);
  });
}

function jsonToXlf(jsonFile, xlfFile, language = "en") {
  const jsonData = JSON.parse(fs.readFileSync(jsonFile));
  const xlfSuffix = ".xlf";
  const xlfFileRoot = getFileRoot(xlfFile, xlfSuffix);
  const xlfData = rlr.convertToXliff(jsonData);
  const options = { compact: true, ignoreComment: true, spaces: 4 };
  const result = xmlJsConvert.json2xml(xlfData, options);
  const fileName = xlfFileRoot + "." + language + xlfSuffix;
  fs.writeFileSync(fileName, result, (err) => {
    // Throws an error, you could also catch it here
    if (err) {
      throw err;
    }
    // Success case, the file was saved
    console.log(`File saved: ${fileName}`);
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

module.exports = { getFileRoot: getFileRoot };
