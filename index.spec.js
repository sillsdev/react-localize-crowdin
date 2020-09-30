const assert = require("assert");
const index = require("./index");

describe("index", function () {
  describe("getFileRoot()", function () {
    it("should return strings with specified suffix removed", function () {
      const suffix = ".Aa";
      assert.strictEqual(index.getFileRoot("", suffix), "");
      assert.strictEqual(index.getFileRoot("File.aa", suffix), "File");
      assert.strictEqual(index.getFileRoot("file.AA", suffix), "file");
    });
  });
});
