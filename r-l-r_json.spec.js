let rlr = require("./r-l-r_json");
var assert = require("assert");
describe("react-localize-redux to xlf tests", function() {
  let testJson = {
    localize: {
      something: ["tosomething"]
    },
    nested: {
      localize: {
        something: ["tosomething"]
      }
    }
  };
  let testXlf = {
    xliff: {
      _attributes: {
        xmlns: "urn:oasis:names:tc:xliff:document:1.2",
        version: "1.2"
      },
      file: {
        _attributes: { original: "test.json", "source-language": "fr" },
        "trans-unit": [
          {
            _attributes: {
              id: "localize.something"
            },
            source: { _attributes: { "xml:lang": "en", _text: "tosomething" } },
            target: {
              _attributes: { "xml:lang": "es" },
              _text: "palabrasenespanol"
            }
          },
          {
            _attributes: {
              id: "nested.localize.something"
            },
            source: { _attributes: { "xml:lang": "en", _text: "tosomething" } },
            target: {
              _attributes: { "xml:lang": "es" },
              _text: "palabrasenespanol"
            }
          }
        ]
      }
    }
  };
  describe("r-l-r_json.convertToXliff", function() {
    var xlifJson = rlr.convertToXliff(testJson, "test.json");
    it("should have source filename and source language", function() {
      assert.equal(
        xlifJson["xliff"]["file"]["_attributes"]["original"],
        "test.json"
      );
      assert.equal(
        xlifJson["xliff"]["file"]["_attributes"]["source-language"],
        "en"
      );
    });
    it("should have xliff translation id with sub object", function() {
      assert.notEqual(
        xlifJson["xliff"]["file"]["trans-unit"].find(
          item => item["_attributes"].id === "localize.something"
        ),
        undefined
      );
      assert.equal(
        xlifJson["xliff"]["file"]["trans-unit"][0].source._text,
        "tosomething"
      );
    });
    it("should have xliff translation id with nested sub object", function() {
      let foundNested = xlifJson["xliff"]["file"]["trans-unit"].find(
        item => item["_attributes"].id === "nested.localize.something"
      );
      assert.notEqual(foundNested, undefined);
      assert.equal(foundNested.source._text, "tosomething");
    });
  });
  describe("xlf json to r-l-r tests", function() {
    it("builds r-l-r heirarchy from flat xliff ids", function() {
      var rlrJson = rlr.convertToJson(testXlf, {});
      assert.equal(rlrJson["localize"]["something"][0], "palabrasenespanol");
    });
    it("adds to existing translations", function() {
      var rlrJson = rlr.convertToJson(testXlf, {
        localize: { something: ["firsttrans"] }
      });
      assert.equal(rlrJson["localize"]["something"][0], "firsttrans");
      assert.equal(rlrJson["localize"]["something"][1], "palabrasenespanol");
    });
    it("adds to existing nestedtranslations", function() {
      var rlrJson = rlr.convertToJson(testXlf, {
        nested: {
          localize: {
            something: ["firsttrans"]
          }
        }
      });
      assert.equal(rlrJson["nested"]["localize"]["something"][0], "firsttrans");
      assert.equal(
        rlrJson["nested"]["localize"]["something"][1],
        "palabrasenespanol"
      );
    });
  });
  describe("error handling tests", function() {
    let testJson = {
      localize: {
        something: 5
      },
      nested: {
        localize: {
          something: ["tosomething"]
        }
      }
    };
    it("receive error on bad data", function() {
      assert.throws(() => rlr.convertToXliff(testJson, "test.json"), Error);
    });
  });
});
