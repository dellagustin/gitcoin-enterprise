const fs = require("fs-sync");
const path = require("path");
const config = fs.readJSON(path.join(__dirname, "../.env.json"));

Feature("Fund a Task");

Scenario("test something", async I => {
  I.amOnPage("http://localhost:4200");
  if (config.mode === "demo") {
    await I.wait(1); // just for demo reasons making sure people can follow
  }
  I.click("Fund a Task");
  I.see("Please enter the link to the issue on GitHub.");
  I.fillField(
    locate("#taskLink"),
    "https://github.com/cla-assistant/cla-assistant/issues/530"
  );
  if (config.mode === "demo") {
    await I.wait(1.5); // just for demo reasons making sure people can follow
  }
  // I.click(locate("Next"));
});
