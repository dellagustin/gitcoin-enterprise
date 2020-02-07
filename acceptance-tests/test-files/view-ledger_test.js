const fs = require("fs-sync");
const path = require("path");
const config = fs.readJSON(path.join(__dirname, "../.env.json"));

Feature("View Ledger");

Scenario("test viewing ledger", async (I) => {
  I.amOnPage("/");
  pause(I)
  I.click(locate("#burgerMenu"));
  pause(I)

  I.click(locate("Download Ledger"));
  pause(I)
  I.see("This makes a total of");
});

async function pause(I) {
  (config.mode === "demo") ?
  await I.wait(4) : 
  await I.wait(3)
}