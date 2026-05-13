#! /usr/bin/env node

const fs = require("fs");
const xmlJsConvert = require("xml-js");
const j2x = require("./jsonToXliff");
const x2j = require("./xliffToJson");

function consoleUsage() {
  console.log("Command line utilities for working with Crowdin and react:");
  console.log("Usage: -x2j [xlf file] [json file]");
  console.log(
    "\tConverts xlf file from Crowdin to json file for use with i18next."
  );
  console.log("Usage: -j2x [json file] [xlf file]");
  console.log(
    "\tConverts json file used with i18next to xlf for updating the source file in Crowdin."
  );
  console.log("Usage: -j2xt [source json file] [target json file] [xlf file]");
  console.log(
    "\tConverts source and target json files to a bilingual xlf for uploading translations to Crowdin."
  );
}

const myArgs = process.argv.slice(2);
switch (myArgs[0]) {
  case "-x2j":
    if (myArgs.length !== 3) { consoleUsage(); break; }
    xlfToJson(myArgs[1], myArgs[2]);
    break;
  case "-j2x":
    if (myArgs.length !== 3) { consoleUsage(); break; }
    jsonToXlf(myArgs[1], myArgs[2]);
    break;
  case "-j2xt":
    if (myArgs.length !== 4) { consoleUsage(); break; }
    jsonToXlfBilingual(myArgs[1], myArgs[2], myArgs[3]);
    break;
  default:
    consoleUsage();
}

function xlfToJson(xlfFilename, jsonFilename) {
  const options = { compact: true, ignoreComment: true, spaces: 4 };
  const xlfData = JSON.parse(
    xmlJsConvert.xml2json(fs.readFileSync(xlfFilename), options)
  );
  const jsonData = x2j.xliffToJson(xlfData);
  fs.writeFileSync(jsonFilename, JSON.stringify(jsonData), (err) => {
    // Throws an error, you could also catch it here
    if (err) {
      throw err;
    }
    // Success case, the file was saved
    console.log(`File saved: ${jsonFilename}`);
  });
}

function jsonToXlfBilingual(sourceJsonFilename, targetJsonFilename, xlfFilename) {
  const sourceData = JSON.parse(fs.readFileSync(sourceJsonFilename));
  const targetData = JSON.parse(fs.readFileSync(targetJsonFilename));
  const langMatch = targetJsonFilename.match(/\.([a-z]{2,3}(?:-[a-z]{2,4})?)\.json$/i);
  const targetLang = langMatch ? langMatch[1] : "und";
  const xlfData = j2x.jsonToXliffBilingual(sourceData, targetData, targetLang);
  const options = { compact: true, ignoreComment: true, spaces: 2 };
  const result = xmlJsConvert.json2xml(xlfData, options);
  fs.writeFileSync(xlfFilename, result, (err) => {
    if (err) throw err;
    console.log(`File saved: ${xlfFilename}`);
  });
}

function jsonToXlf(jsonFilename, xlfFilename) {
  const jsonData = JSON.parse(fs.readFileSync(jsonFilename));
  const xlfData = j2x.jsonToXliff(jsonData);
  const options = { compact: true, ignoreComment: true, spaces: 4 };
  const result = xmlJsConvert.json2xml(xlfData, options);
  fs.writeFileSync(xlfFilename, result, (err) => {
    // Throws an error, you could also catch it here
    if (err) {
      throw err;
    }
    // Success case, the file was saved
    console.log(`File saved: ${xlfFilename}`);
  });
}

// Remove suffix from end of a string
function getFileRoot(filename, suffix) {
  const fLen = filename.length;
  const sLen = suffix.length;
  if (
    fLen >= sLen &&
    filename.substring(fLen - sLen).toLowerCase() === suffix.toLowerCase()
  ) {
    return filename.substring(0, fLen - sLen);
  }
  return filename;
}

module.exports = { getFileRoot: getFileRoot };
