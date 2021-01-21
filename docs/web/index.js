// select page elements
const stateContents = document.getElementById("stateContents");
const runButton = document.getElementById("runBtn");
const reloadButton = document.getElementById("reloadBtn");
const saveButton = document.getElementById("saveBtn");
const resetButton = document.getElementById("resetBtn");
const copyButton = document.getElementById("copyBtn");
const demoSelector = document.getElementById("demoSelector");
const outputDiv = document.getElementById("output");

function getQueryVariable(variable) {
  return new URLSearchParams(window.location.search).get(variable);
}

var displayOutput = function(msg, colour = "black") {
  const p = document.createElement("p");
  p.textContent = msg;
  p.classList += " output";
  p.style.color = colour;
  outputDiv.appendChild(p);
};

console.log = console.error = (msg, colour) =>
  displayOutput("Output: " + msg, "blue");

// ensure db doesn't break on loading corrupted data
const engine = new BrowserEngine("db");
let db;
try {
  db = new StormDB(engine);
} catch (error) {
  localStorage.setItem("db", "{}");
  db = new StormDB(engine);
  displayOutput(
    new Error(
      "Had to reset database due to corrupted or invalid database data."
    ),
    "red"
  );
}

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
  outputDiv.innerText = "";
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
    displayOutput(error, "red");
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
    displayOutput(
      new Error(
        "Failed to load StormDB database file - invalid or corrupted format."
      ),
      "red"
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

demoSelector.addEventListener("change", function() {
  loadDemo(demoSelector.value);
});

let queryCode = getQueryVariable("code");
if (queryCode !== null) {
  editor.updateCode(decodeURI(queryCode));
} else {
  loadDemo(demoKeys[0]);
}

async function loadVersion() {
  fetch("https://unpkg.com/stormdb/package.json")
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

// copy URL function
copyButton.addEventListener("click", function() {
  let url = new URL(window.location.href);
  url.searchParams.set("code", encodeURI(editor.getCode()));
  navigator.clipboard.writeText(url);
});
