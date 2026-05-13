exports.jsonToXliff = function (jsonData) {
  const xliffData = xliffTemplateSource();
  flattenXliffTransUnits(jsonData, "", xliffData);
  return xliffData;
};

exports.jsonToXliffBilingual = function (sourceData, targetData, targetLang) {
  const xliffData = {
    _declaration: { _attributes: { version: "1.0", encoding: "utf-8" } },
    ...xliffTemplateBilingual("translations.json", "en", targetLang),
  };
  flattenXliffBilingualTransUnits(sourceData, targetData, "", xliffData);
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

function xliffTemplateBilingual(
  filename = "translations.json",
  sourceLang = "en",
  targetLang = "id"
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
          "target-language": targetLang,
        },
        "trans-unit": [],
      },
    },
  };
}

function flattenXliffBilingualTransUnits(sourceData, targetData, keyPrefix, xliffData) {
  Object.keys(sourceData).map(function (key) {
    if (typeof sourceData[key] === "string") {
      let transUnit = {
        _attributes: { id: keyPrefix + "." + key },
        source: { _text: sourceData[key] },
      };
      if (targetData && typeof targetData[key] === "string") {
        transUnit.target = { _attributes: { state: "translated" }, _text: targetData[key] };
      }
      xliffData.xliff.file["trans-unit"].push(transUnit);
    } else if (typeof sourceData[key] === "object") {
      const nextTarget =
        targetData && typeof targetData[key] === "object" ? targetData[key] : null;
      flattenXliffBilingualTransUnits(
        sourceData[key],
        nextTarget,
        keyPrefix + (keyPrefix === "" ? "" : ".") + key,
        xliffData
      );
    } else {
      throw new Error(
        "Unexpected data[ " +
          JSON.stringify(sourceData[key]) +
          " ] bad format in react-localize-redux json file?"
      );
    }
  });
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
