let x2j = require("./xliffToJson");
var assert = require("assert");

const enPhrase = "from something";
const esPhrase = "a algo";
const testXlf = {
  xliff: {
    _attributes: {
      xmlns: "urn:oasis:names:tc:xliff:document:1.2",
      version: "1.2",
    },
    file: {
      "trans-unit": [
        {
          _attributes: { resname: "localize.sourceless" },
        },
        {
          _attributes: { resname: "localize.targetless" },
          source: { _text: enPhrase },
        },
        {
          _attributes: { resname: "localize.untranslatedA" },
          source: { _text: enPhrase },
          target: {
            _attributes: { state: "needs-translation" },
          },
        },
        {
          _attributes: { resname: "localize.untranslatedB" },
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
};

describe("xlf to json tests", function () {
  it("builds json hierarchy from flat xliff", function () {
    var jsonData = x2j.xliffToJson(testXlf, {});
    assert.strictEqual(jsonData["localize"]["sourceless"], undefined);
    assert.strictEqual(jsonData["localize"]["targetless"], undefined);
    assert.strictEqual(jsonData["localize"]["untranslatedA"], undefined);
    assert.strictEqual(jsonData["localize"]["untranslatedB"], undefined);
    assert.strictEqual(jsonData["localize"]["something"], esPhrase);
  });
  it("adds to existing translations", function () {
    var jsonData = x2j.xliffToJson(testXlf, {
      localize: { something: "firstTrans" },
    });
    assert.strictEqual(jsonData["localize"]["something"], esPhrase);
  });
  it("adds to existing nested translations", function () {
    var jsonData = x2j.xliffToJson(testXlf, {
      nested: { localize: { something: "firstTrans" } },
    });
    assert.strictEqual(jsonData["nested"]["localize"]["something"], esPhrase);
  });
});
