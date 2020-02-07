const fs = require("fs-sync");
const path = require("path");
const config = fs.readJSON(path.join(__dirname, "../.env.json"));

Feature("Solve a Task");

Scenario("test something", async I => {
  I.amOnPage("http://localhost:4200");
  if (config.mode === "demo") {
    await I.wait(1); // just for demo reasons making sure people can follow
  }
  I.click("Solve a Task");
  if (config.mode === "demo") {
    await I.wait(1); // just for demo reasons making sure people can follow
  }
  // I.see("Task Explorer");
});
