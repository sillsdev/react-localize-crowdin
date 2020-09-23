const assert = require("assert");
const rlr = require("./r-l-r_json");

describe("react-localize-redux to xlf tests", function () {
  const testJson = {
    localize: {
      something: ["tosomething"],
    },
    nested: {
      localize: {
        something: ["tosomething"],
      },
    },
  };
  const testXlf = {
    xliff: {
      _attributes: {
        xmlns: "urn:oasis:names:tc:xliff:document:1.2",
        version: "1.2",
      },
      file: {
        _attributes: { original: "test.json", "source-language": "fr" },
        "trans-unit": [
          {
            _attributes: {
              id: "localize.something",
            },
            source: { _attributes: { "xml:lang": "en", _text: "tosomething" } },
            target: {
              _attributes: { "xml:lang": "es" },
              _text: "palabrasenespanol",
            },
          },
          {
            _attributes: {
              id: "nested.localize.something",
            },
            source: { _attributes: { "xml:lang": "en", _text: "tosomething" } },
            target: {
              _attributes: { "xml:lang": "es" },
              _text: "palabrasenespanol",
            },
          },
        ],
      },
    },
  };

  describe("r-l-r_json.convertToXliff", function () {
    const xlifJson = rlr.convertToXliff(testJson, "test.json");
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
        "tosomething"
      );
    });
    it("should have xliff translation id with nested sub object", function () {
      const foundNested = xlifJson["xliff"]["file"]["trans-unit"].find(
        (item) => item["_attributes"].id === "nested.localize.something"
      );
      assert.notStrictEqual(foundNested, undefined);
      assert.strictEqual(foundNested.source._text, "tosomething");
    });
  });

  describe("xlf json to r-l-r tests", function () {
    it("builds r-l-r heirarchy from flat xliff ids", function () {
      const rlrJson = rlr.convertToJson(testXlf, {});
      assert.strictEqual(
        rlrJson["localize"]["something"][0],
        "palabrasenespanol"
      );
    });
    it("adds to existing translations", function () {
      const rlrJson = rlr.convertToJson(testXlf, {
        localize: { something: ["firsttrans"] },
      });
      assert.strictEqual(rlrJson["localize"]["something"][0], "firsttrans");
      assert.strictEqual(
        rlrJson["localize"]["something"][1],
        "palabrasenespanol"
      );
    });
    it("adds to existing nestedtranslations", function () {
      const rlrJson = rlr.convertToJson(testXlf, {
        nested: {
          localize: {
            something: ["firsttrans"],
          },
        },
      });
      assert.strictEqual(
        rlrJson["nested"]["localize"]["something"][0],
        "firsttrans"
      );
      assert.strictEqual(
        rlrJson["nested"]["localize"]["something"][1],
        "palabrasenespanol"
      );
    });
  });

  describe("error handling tests", function () {
    const testJson = {
      localize: {
        something: 5,
      },
      nested: {
        localize: {
          something: ["tosomething"],
        },
      },
    };
    it("receive error on bad data", function () {
      assert.throws(() => rlr.convertToXliff(testJson, "test.json"), Error);
    });
  });
});
