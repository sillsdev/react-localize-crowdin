let rlr = require("./r-l-r_json");
var assert = require("assert");

const enPhrase = "from something";
const esPhrase = "a algo";
describe("react-localize-redux to xlf tests", function () {
  let testJson = {
    localize: {
      something: [enPhrase],
    },
    nested: {
      localize: {
        something: [enPhrase],
      },
    },
  };
  let testXlf = {
    xliff: {
      _attributes: {
        xmlns: "urn:oasis:names:tc:xliff:document:1.2",
        version: "1.2",
      },
      file: {
        _attributes: {
          original: "test.json",
          "source-language": "en",
          "target-language": "es",
        },
        "trans-unit": [
          {
            _attributes: {
              id: "localize.something",
            },
            source: { _text: enPhrase },
            target: {
              _attributes: { state: "translated" },
              _text: esPhrase,
            },
          },
          {
            _attributes: {
              id: "nested.localize.something",
            },
            source: { _text: enPhrase },
            target: {
              _attributes: { state: "translated" },
              _text: esPhrase,
            },
          },
        ],
      },
    },
  };

  describe("r-l-r_json.convertToXliff", function () {
    var xlifJson = rlr.convertToXliff(testJson, "test.json")[0];
    it("should have source filename and source language", function () {
      assert.strictEqual(
        xlifJson["xliff"]["file"]["_attributes"]["original"],
        "test.json"
      );
      assert.strictEqual(
        xlifJson["xliff"]["file"]["_attributes"]["source-language"],
        "en"
      );
    });
    it("should have xliff translation id with sub object", function () {
      assert.notStrictEqual(
        xlifJson["xliff"]["file"]["trans-unit"].find(
          (item) => item["_attributes"].id === "localize.something"
        ),
        undefined
      );
      assert.strictEqual(
        xlifJson["xliff"]["file"]["trans-unit"][0].source._text,
        enPhrase
      );
    });
    it("should have xliff translation id with nested sub object", function () {
      let foundNested = xlifJson["xliff"]["file"]["trans-unit"].find(
        (item) => item["_attributes"].id === "nested.localize.something"
      );
      assert.notStrictEqual(foundNested, undefined);
      assert.strictEqual(foundNested.source._text, enPhrase);
    });
  });

  describe("xlf json to r-l-r tests", function () {
    it("builds r-l-r heirarchy from flat xliff ids", function () {
      var rlrJson = rlr.convertToJson(testXlf, {});
      assert.strictEqual(rlrJson["localize"]["something"][0], esPhrase);
    });
    it("adds to existing translations", function () {
      var rlrJson = rlr.convertToJson(testXlf, {
        localize: { something: ["firsttrans"] },
      });
      assert.strictEqual(rlrJson["localize"]["something"][0], "firsttrans");
      assert.strictEqual(rlrJson["localize"]["something"][1], esPhrase);
    });
    it("adds to existing nestedtranslations", function () {
      var rlrJson = rlr.convertToJson(testXlf, {
        nested: {
          localize: {
            something: ["firstTrans"],
          },
        },
      });
      assert.strictEqual(
        rlrJson["nested"]["localize"]["something"][0],
        "firstTrans"
      );
      assert.strictEqual(
        rlrJson["nested"]["localize"]["something"][1],
        esPhrase
      );
    });
  });

  describe("error handling tests", function () {
    let testJson = {
      localize: {
        something: 5,
      },
      nested: {
        localize: {
          something: [enPhrase],
        },
      },
    };
    it("receive error on bad data", function () {
      assert.throws(() => rlr.convertToXliff(testJson, "test.json"), Error);
    });
  });
});
