let rlr = require("./r-l-r_json");
var assert = require("assert");

const langs = ["en", "es"];
const enPhrase = "from something";
const esPhrase = "a algo";
describe("react-localize-redux to xlf tests", function () {
  const testJson = {
    localize: { something: [enPhrase, esPhrase] },
    nested: { localize: { something: [enPhrase, esPhrase] } },
  };
  const testXlf = {
    xliff: {
      _attributes: {
        xmlns: "urn:oasis:names:tc:xliff:document:1.2",
        version: "1.2",
      },
      file: {
        body: {
          _attributes: {
            original: "test.json",
            "source-language": langs[0],
            "target-language": langs[1],
          },
          "trans-unit": [
            {
              _attributes: { resname: "localize.sourceless" },
            },
            {
              _attributes: { resname: "localize.untranslatedA" },
              source: { _text: enPhrase },
            },
            {
              _attributes: { resname: "localize.untranslatedB" },
              source: { _text: enPhrase },
              target: {
                _attributes: { state: "needs-translation" },
              },
            },
            {
              _attributes: { resname: "localize.untranslatedC" },
              source: { _text: enPhrase },
              target: {
                _attributes: { state: "needs-translation" },
                _text: "",
              },
            },
            {
              _attributes: { resname: "localize.something" },
              source: { _text: enPhrase },
              target: {
                _attributes: { state: "translated" },
                _text: esPhrase,
              },
            },
            {
              _attributes: { resname: "nested.localize.something" },
              source: { _text: enPhrase },
              target: {
                _attributes: { state: "translated" },
                _text: esPhrase,
              },
            },
          ],
        },
      },
    },
  };

  describe("r-l-r_json.convertToXliff default", function () {
    const xlfSource = rlr.convertToXliff(testJson, "test.json")[0];
    it("should have source filename, source language", function () {
      assert.strictEqual(
        xlfSource["xliff"]["file"]["_attributes"]["original"],
        "test.json"
      );
      assert.strictEqual(
        xlfSource["xliff"]["file"]["_attributes"]["source-language"],
        langs[0]
      );
    });
    it("should have xliff translation id with sub object", function () {
      assert.notStrictEqual(
        xlfSource["xliff"]["file"]["trans-unit"].find(
          (item) => item["_attributes"].id === "localize.something"
        ),
        undefined
      );
      assert.strictEqual(
        xlfSource["xliff"]["file"]["trans-unit"][0].source._text,
        enPhrase
      );
      assert.strictEqual(
        xlfSource["xliff"]["file"]["trans-unit"][0].target,
        undefined
      );
    });
    it("should have xliff translation id with nested sub object", function () {
      const foundNested = xlfSource["xliff"]["file"]["trans-unit"].find(
        (item) => item["_attributes"].id === "nested.localize.something"
      );
      assert.notStrictEqual(foundNested, undefined);
      assert.strictEqual(foundNested.source._text, enPhrase);
      assert.strictEqual(foundNested.target, undefined);
    });
  });

  describe("r-l-r_json.convertToXliff with translation", function () {
    const xlfData = rlr.convertToXliff(testJson, "test.json", langs);
    it("should create data for the right number of languages", function () {
      assert.strictEqual(xlfData.length, langs.length);
    });
    const xlfTrans = xlfData[1];
    it("should have source filename, source language, target language", function () {
      assert.strictEqual(
        xlfTrans["xliff"]["file"]["_attributes"]["original"],
        "test.json"
      );
      assert.strictEqual(
        xlfTrans["xliff"]["file"]["_attributes"]["source-language"],
        langs[0]
      );
      assert.strictEqual(
        xlfTrans["xliff"]["file"]["_attributes"]["target-language"],
        langs[1]
      );
    });
    it("should have xliff translation id with sub object", function () {
      assert.notStrictEqual(
        xlfTrans["xliff"]["file"]["trans-unit"].find(
          (item) => item["_attributes"].id === "localize.something"
        ),
        undefined
      );
      assert.strictEqual(
        xlfTrans["xliff"]["file"]["trans-unit"][0].source._text,
        enPhrase
      );
      assert.strictEqual(
        xlfTrans["xliff"]["file"]["trans-unit"][0].target._text,
        esPhrase
      );
    });
    it("should have xliff translation id with nested sub object", function () {
      const foundNested = xlfTrans["xliff"]["file"]["trans-unit"].find(
        (item) => item["_attributes"].id === "nested.localize.something"
      );
      assert.notStrictEqual(foundNested, undefined);
      assert.strictEqual(foundNested.source._text, enPhrase);
      assert.strictEqual(foundNested.target._text, esPhrase);
    });
  });

  describe("xlf to json tests", function () {
    it("builds json heirarchy from flat xliff", function () {
      var jsonData = rlr.convertToJson(testXlf, {});
      assert.strictEqual(jsonData["localize"]["sourceless"], "");
      assert.strictEqual(jsonData["localize"]["untranslatedA"], enPhrase);
      assert.strictEqual(jsonData["localize"]["untranslatedB"], enPhrase);
      assert.strictEqual(jsonData["localize"]["untranslatedC"], enPhrase);
      assert.strictEqual(jsonData["localize"]["something"], esPhrase);
    });
    it("adds to existing translations", function () {
      var jsonData = rlr.convertToJson(testXlf, {
        localize: { something: "firstTrans" },
      });
      assert.strictEqual(jsonData["localize"]["something"], esPhrase);
    });
    it("adds to existing nested translations", function () {
      var jsonData = rlr.convertToJson(testXlf, {
        nested: { localize: { something: "firstTrans" } },
      });
      assert.strictEqual(jsonData["nested"]["localize"]["something"], esPhrase);
    });
  });

  describe("error handling tests", function () {
    let testJson = {
      localize: { something: 5 },
      nested: { localize: { something: enPhrase } },
    };
    it("receive error on bad data", function () {
      assert.throws(() => rlr.convertToXliff(testJson, "test.json"), Error);
    });
  });
});
