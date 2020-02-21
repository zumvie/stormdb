const assert = require("assert");
const path = require("path");
const fs = require("fs");
const StormDB = require("../index.js");

const emptyDBPath = path.resolve(__dirname, "./fixtures/empty-file.stormdb");
const exampleDBPath = path.resolve(__dirname, "./fixtures/example.stormdb");
const corruptedDBPath = path.resolve(__dirname, "./fixtures/corrupted-db.stormdb");

const deleteFile = function(fileName) {
  fs.unlinkSync(fileName);
};

describe("engines", function() {
  it("should utilise custom deserialize function", function() {
    const engine = new StormDB.localFileEngine(exampleDBPath, {
      deserialize: () => "deserialized data"
    });
    const db = StormDB(engine);

    let value = db.value();
    assert.equal(value, "deserialized data");
  });

  it("should utilise custom serialize function", function() {
    // ensure an existing database isn't used for the test
    if (fs.existsSync("tempDB.stormdb")) deleteFile("tempDB.stormdb");

    const engine = new StormDB.localFileEngine("tempDB.stormdb", {
      serialize: () => "serialized data"
    });
    const db = StormDB(engine);

    db.save();

    let savedData = fs.readFileSync("tempDB.stormdb");
    assert.equal(savedData, "serialized data");

    deleteFile("tempDB.stormdb");
  });

  it("should throw error if trying to read incorrect data", function() {
    const engine = new StormDB.localFileEngine(corruptedDBPath);
    
    const loadDB = () => {
      StormDB(engine);
    };

    assert.throws(loadDB, Error);
  });

  it("if database file empty, empty JSON object should be used", function() {
    const engine = new StormDB.localFileEngine(emptyDBPath);
    const db = StormDB(engine);

    let dbValue = db.value();
    assert.deepEqual(dbValue, {});
  });

  describe("async engine option enabled", function() {
    it(".save() function should return promise", function(done) {
      const engine = new StormDB.localFileEngine(exampleDBPath, {
        async: true
      });
      const db = StormDB(engine);

      db.save().then(function() {
        done();
      })
    });

    it(".save() promise should reject is problem writing to file", function() {
      const engine = new StormDB.localFileEngine(exampleDBPath, {
        async: true
      });
      const db = StormDB(engine);

      // purposely induce error by setting erroneous write path
      engine.path = "./nonexistent/file.stormdb";
      
      const saveDB = () => {
        return db.save();
      }

      assert.rejects(saveDB, Error);
    })
  });
});
