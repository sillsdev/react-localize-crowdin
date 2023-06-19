let j2x = require("./jsonToXliff");
var assert = require("assert");

const defaultFilename = "translations.json";
const langs = ["en", "es"];
const enPhrase = "from something";
const testJson = {
  localize: { something: enPhrase },
  nested: { localize: { something: enPhrase } },
};

describe("json to xliff tests", function () {
  const xlfData = j2x.jsonToXliff(testJson);
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

describe("error-handling tests", function () {
  let testJson = {
    localize: { something: 5 },
    nested: { localize: { something: enPhrase } },
  };
  it("receive error on bad data", function () {
    assert.throws(() => j2x.convertToXliff(testJson), Error);
  });
});
