exports.convertToXliff = function (jsonData) {
  const xliffData = xliffTemplateSource();
  flattenXliffTransUnits(jsonData, "", xliffData);
  return xliffData;
};

function xliffTemplateSource(
  filename = "translations.json",
  sourceLang = "en"
) {
  return {
    xliff: {
      _attributes: {
        xmlns: "urn:oasis:names:tc:xliff:document:1.2",
        version: "1.2",
      },
      file: {
        _attributes: {
          original: filename,
          "source-language": sourceLang,
        },
        "trans-unit": [],
      },
    },
  };
}

// function to recursively map the json object into a flat list of xliff trans-units
function flattenXliffTransUnits(rlrData, keyPrefix, xliffData) {
  Object.keys(rlrData).map(function (key) {
    if (typeof rlrData[key] === "string") {
      let transUnit = {
        _attributes: { id: keyPrefix + "." + key },
        source: { _text: rlrData[key] },
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
          " ] bad format in react-localize-redux json file?"
      );
    }
  });
}

exports.convertToJson = function (xlfData) {
  const jsonData = {};
  xlfData.xliff.file.body["trans-unit"].map((tu) =>
    addTranslationUnit(tu, jsonData)
  );
  return jsonData;
};

function addTranslationUnit(tu, jsonData) {
  const idParts = getTransUnitId(tu);
  let section = jsonData;
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
  return tu._attributes.resname.split(".");
}

function parseTransUnit(tu, section) {
  const finalPart = getTransUnitId(tu).pop();
  let translation = "";
  if (tu.target && tu.target._text) {
    translation = tu.target._text;
  } else if (tu.source && tu.source._text) {
    translation = tu.source._text;
  }
  section[finalPart] = translation;
}
