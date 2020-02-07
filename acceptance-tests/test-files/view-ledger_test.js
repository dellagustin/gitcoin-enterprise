const fs = require("fs-sync");
const path = require("path");
const config = fs.readJSON(path.join(__dirname, "../.env.json"));

Feature("View Ledger");

Scenario("test something", async I => {
  I.amOnPage("/");
  if (config.mode === "demo") {
    await I.wait(1); // just for demo reasons making sure people can follow
  }
  // I.click(locate("#burgerMenu"));
  // if (config.mode === "demo") {
  //   await I.wait(1); // just for demo reasons making sure people can follow
  // }

  // I.click("Download Ledger");
  //   if (config.mode === "demo") {
  //     await I.wait(2); // just for demo reasons making sure people can follow
  //   }
  // I.see("This makes a total of");
});
