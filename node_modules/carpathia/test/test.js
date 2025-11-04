var carpathia = require(__dirname + "/../")
  , chai      = require("chai")
  , expect    = chai.expect
  ;

chai.should();

describe("Carpathia.js", function() {
  describe("translate", function() {
    it("should correctly translate the following phrases", function() {
      var test = {
          "en-US": {
            "phrase": "that's life"
          }
        , "fr-FR": {
            "phrase": "c'est la vie"
          }
      };
      expect(test).to.be.an("object");
      expect(test).to.have.property("en-US");
      expect(test["en-US"]).to.be.an('object');
      expect(test["en-US"]).to.have.property("phrase");
      expect(test["en-US"].phrase).to.be.a("string");
      expect(test["en-US"].phrase).to.equal("that's life");
    });

    it("should throw an invalid dictionary error on missing dictionary", function(done) {
      try {
        carpathia.translate(null, "en-US", "phrase");
      }
      catch (err) {
        expect(err).to.match(/Invalid dictionary/);
        done();
      }
    });

    it("should throw an invalid dictionary error on non-object dictionary", function(done) {
      try {
        carpathia.translate(5, "en-US", "phrase");
      }
      catch (err) {
        expect(err).to.match(/Invalid dictionary/);
        done();
      }
    });

    it("should throw an invalid language error on empty language parameter", function(done) {
      try {
        carpathia.translate({"en-US": {"phrase": "foo"}}, null, "phrase");
      }
      catch (err) {
        expect(err).to.match(/Invalid language/);
        done();
      }
    });

    it("should throw an invalid language error on missing language parameter", function(done) {
      try {
        carpathia.translate({"en-US": {"phrase": "foo"}}, "baz", "phrase");
      }
      catch (err) {
        expect(err).to.match(/Invalid language/);
        done();
      }
    });

    it("should throw an invalid language error on invalid language parameter", function(done) {
      try {
        carpathia.translate({"en-US": {"phrase": "foo"}}, "fr-FR", "phrase");
      }
      catch (err) {
        expect(err).to.match(/Invalid language/);
        done();
      }
    });

    it("should throw an invalid symbol error on missing symbol parameter", function(done) {
      try {
        carpathia.translate({"en-US": {"phrase": "foo"}}, "en-US", null);
      }
      catch (err) {
        expect(err).to.match(/Invalid symbol/);
        done();
      }
    });

    it("should throw an invalid symbol error on invalid symbol parameter", function(done) {
      try {
        carpathia.translate({"en-US": {"phrase": "foo"}}, "en-US", "clause");
      }
      catch (err) {
        expect(err).to.match(/Invalid symbol/);
        done();
      }
    });
  });
});
