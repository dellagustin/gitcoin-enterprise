const fs = require("fs-sync");
const path = require("path");
const config = fs.readJSON(path.join(__dirname, "../.env.json"));

Feature("Solve a Task");

Scenario("test solving a task", async (I) => {
  I.amOnPage("/");
  pause(I)
  
  I.click(locate("Solve a Task"));
  pause(I)  

  I.see("Task Explorer");
});

async function pause(I) {
  (config.mode === "demo") ?
  await I.wait(4) : 
  await I.wait(3)
}