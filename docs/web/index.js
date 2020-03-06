// select page elements
const stateContents = document.getElementById("stateContents");
const runButton = document.getElementById("runBtn");
const reloadButton = document.getElementById("reloadBtn");
const saveButton = document.getElementById("saveBtn");
const resetButton = document.getElementById("resetBtn");
const demoSelector = document.getElementById("demoSelector");
const errorOutput = document.getElementById("errorOutput");

function displayError(errorMsg) {
  errorOutput.innerText = errorMsg;
}

// ensure db doesn't break on loading corrupted data
const engine = new BrowserEngine("db");
let db;
try {
  db = new StormDB(engine);
} catch (error) {
  localStorage.setItem("db", "{}");
  db = new StormDB(engine);
  displayError(
    new Error(
      "Had to reset database due to corrupted or invalid database data."
    )
  );
}

db.default({
  list: [1, 2, 3],
  string: "test",
  numbers: 123,
  objects: {
    property: "test property"
  }
});
db.save();

// Credit for JSON syntax highlighting goes to: https://stackoverflow.com/a/7220510
function syntaxHighlight(json) {
  json = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function(match) {
      var cls = "number";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "key";
        } else {
          cls = "string";
        }
      } else if (/true|false/.test(match)) {
        cls = "boolean";
      } else if (/null/.test(match)) {
        cls = "null";
      }
      return '<span class="' + cls + '">' + match + "</span>";
    }
  );
}

const getDBData = function() {
  return JSON.stringify(db.value(), null, 4);
};

const updateDatabaseState = function() {
  const dbData = getDBData();
  stateContents.innerHTML = "";

  stateContents.innerHTML = syntaxHighlight(dbData);
};

function clearError() {
  errorOutput.innerText = "";
}

// update database state on load
updateDatabaseState();

runButton.addEventListener("click", function() {
  clearError();
  try {
    let codeToRun = editor.getCode();
    eval(codeToRun);
    updateDatabaseState();
  } catch (error) {
    displayError(error);
  }
});

reloadButton.addEventListener("click", function() {
  clearError();
  try {
    let loadedData = JSON.parse(localStorage.getItem("db"));

    // ensure data loaded is valid JSON object
    if (loadedData && typeof loadedData === "object") {
      db.state = loadedData;
    } else {
      throw new Error(
        "Failed to load StormDB database file - invalid or corrupted format."
      );
    }
  } catch (error) {
    displayError(
      new Error(
        "Failed to load StormDB database file - invalid or corrupted format."
      )
    );
  }
  updateDatabaseState();
});

saveButton.addEventListener("click", function() {
  db.save();
});

resetButton.addEventListener("click", function() {
  clearError();
  db.state = {};
  localStorage.setItem("db", "{}");
  updateDatabaseState();
});

const editor = new CodeFlask("#editor", {
  lineNumbers: true
});

// demo selector logic
const demoKeys = Object.keys(demos);

function loadDemo(key) {
  editor.updateCode(demos[key]["code"]);
}

demoKeys.forEach(key => {
  let demo = demos[key];
  const option = document.createElement("option");
  option.textContent = demo["name"];
  option.value = key;
  demoSelector.appendChild(option);
});

// load first demo
loadDemo(demoKeys[0]);

demoSelector.addEventListener("change", function() {
  loadDemo(demoSelector.value);
});

async function loadVersion() {
  fetch("https://unpkg.com/stormdb@0.3.0/package.json")
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      let versionNumber = data.version;

      document.getElementById(
        "versionNumber"
      ).innerText = `StormDB v${versionNumber}`;
    })
    .catch(function(error) {});
}
loadVersion();
