exports.convertToXliff = function(rlr, fileName)
{
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
      Object.keys(rlr).map(function(key, index) {
        Object.keys(rlr[key]).map(function(subkey, subndx) {
          let transUnit = {
            _attributes: { id: key + "." + subkey },
            source: {
              _attributes: { "xml:lang": "en" },
              _text: rlr[key][subkey][0]
            }
          };
      
          xliffData.xliff.file["trans-unit"].push(transUnit);
        });
      });
    return xliffData;      
}

exports.convertToJson = function(xlf, rlrJson) {
    xlf.xliff.file["trans-unit"].map((tu)=>addTranslationUnit(tu, rlrJson))
    return rlrJson;
}

function addTranslationUnit(tu, rlrJson) {
    let sectionId = getTransUnitId(tu);
    if(rlrJson[sectionId] === undefined)
        rlrJson[sectionId] = {};
    parseTransUnit(tu, rlrJson[sectionId])
}

function getTransUnitId(tu) {
    return tu._attributes.id.split('.')[0];
}

function parseTransUnit(tu, section)
{
    let idParts = tu._attributes.id.split('.')
    if(section[idParts[1]] === undefined)
        section[idParts[1]] = [];
    let translation = "";
    if(tu.source !== undefined)
    {
        translation = tu.source._text;
    }
    if(tu.target !== undefined)
    {
        translation = tu.target._text;
    }
    section[idParts[1]].push(translation)
}