exports.convertToXliff = function (rlr, fileName, languages = ["en"]) {
  let xliffData = [
    {
      xliff: {
        _attributes: {
          xmlns: "urn:oasis:names:tc:xliff:document:1.2",
          version: "1.2",
        },
        file: {
          _attributes: {
            original: fileName,
            "source-language": languages[0],
          },
          "trans-unit": [],
        },
      },
    },
  ];
  flattenXliffTransUnits(rlr, "", xliffData[0], languages[0]);
  return xliffData;
};

// function to recursively map the json object into a flat list of xliff trans-units
function flattenXliffTransUnits(rlrData, keyPrefix, xliffData, lang = "en") {
  Object.keys(rlrData).map(function (key) {
    if (Array.isArray(rlrData[key])) {
      let transUnit = {
        _attributes: { id: keyPrefix + "." + key },
        source: {
          _attributes: { "xml:lang": lang },
          _text: rlrData[key][0],
        },
      };
      xliffData.xliff.file["trans-unit"].push(transUnit);
    } else if (typeof rlrData[key] === "object") {
      flattenXliffTransUnits(
        rlrData[key],
        keyPrefix + (keyPrefix === "" ? "" : ".") + key,
        xliffData
      );
    } else {
      throw new Error(
        "Unexpected data[ " +
          JSON.stringify(rlrData[key]) +
          "] bad format in react-localize-redux json file?"
      );
    }
  });
}

exports.convertToJson = function (xlf, rlrJson) {
  xlf.xliff.file["trans-unit"].map((tu) => addTranslationUnit(tu, rlrJson));
  return rlrJson;
};

function addTranslationUnit(tu, rlrJson) {
  const idParts = getTransUnitId(tu);
  let section = rlrJson;
  let sectionId = "";
  for (let i = 0; i < idParts.length - 1; i++) {
    sectionId = idParts[i];
    if (section[sectionId] === undefined) {
      section[sectionId] = {};
    }
    section = section[sectionId];
  }
  parseTransUnit(tu, section);
}

function getTransUnitId(tu) {
  return tu._attributes.id.split(".");
}

function parseTransUnit(tu, section) {
  const idParts = tu._attributes.id.split(".");
  const finalPart = idParts[idParts.length - 1];
  if (section[finalPart] === undefined) section[finalPart] = [];
  let translation = "";
  if (tu.target !== undefined) {
    translation = tu.target._text;
  } else if (tu.source !== undefined) {
    translation = tu.source._text;
  }
  section[finalPart].push(translation);
}
