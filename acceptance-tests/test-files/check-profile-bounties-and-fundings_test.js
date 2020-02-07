const fs = require("fs-sync");
const path = require("path");
const config = fs.readJSON(path.join(__dirname, "../.env.json"));

Feature("check-profile-bounties-and-fundings");

Scenario("test something", async I => {
  I.amOnPage("/");
  if (config.mode === "demo") {
    await I.wait(1); // just for demo reasons making sure people can follow
  }
});
