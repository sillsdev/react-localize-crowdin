let rlr = require("./r-l-r_json");
var assert = require("assert");

const defaultFilename = "translations.json";
const langs = ["en", "es"];
const enPhrase = "from something";
const esPhrase = "a algo";
describe("react-localize-redux to xlf tests", function () {
  const testJson = {
    localize: { something: enPhrase },
    nested: { localize: { something: enPhrase } },
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
            original: defaultFilename,
            "source-language": langs[0],
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

  describe("json to xliff tests", function () {
    const xlfData = rlr.convertToXliff(testJson);
    it("should have default filename, default language", function () {
      assert.strictEqual(
        xlfData["xliff"]["file"]["_attributes"]["original"],
        defaultFilename
      );
      assert.strictEqual(
        xlfData["xliff"]["file"]["_attributes"]["source-language"],
        langs[0]
      );
    });
    it("should have xliff translation id with sub object", function () {
      const foundUnit = xlfData["xliff"]["file"]["trans-unit"].find(
        (item) => item["_attributes"].id === "localize.something"
      );
      assert.notStrictEqual(foundUnit, undefined);
      assert.strictEqual(
        xlfData["xliff"]["file"]["trans-unit"][0].source._text,
        enPhrase
      );
    });
    it("should have xliff translation id with nested sub object", function () {
      const foundNested = xlfData["xliff"]["file"]["trans-unit"].find(
        (item) => item["_attributes"].id === "nested.localize.something"
      );
      assert.notStrictEqual(foundNested, undefined);
      assert.strictEqual(foundNested.source._text, enPhrase);
    });
  });

  describe("xlf to json tests", function () {
    it("builds json hierarchy from flat xliff", function () {
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

  describe("error-handling tests", function () {
    let testJson = {
      localize: { something: 5 },
      nested: { localize: { something: enPhrase } },
    };
    it("receive error on bad data", function () {
      assert.throws(() => rlr.convertToXliff(testJson), Error);
    });
  });
});
