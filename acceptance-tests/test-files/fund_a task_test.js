const fs = require("fs-sync");
const path = require("path");
const config = fs.readJSON(path.join(__dirname, "../.env.json"));

Feature("Fund a Task");

Scenario("test funding a task", async (I) => {
  I.amOnPage("/");
  pause(I)

  I.click(locate("Fund a Task"));
  pause(I)
  
  I.see("Please enter the link to the issue on GitHub.");
  I.fillField(
    locate("#taskLink"),
    "https://github.com/cla-assistant/cla-assistant/issues/530"
  );
  // I.click(locate("Next"));
});


async function pause(I) {
  (config.mode === "demo") ?
  await I.wait(4) : 
  await I.wait(3)
}