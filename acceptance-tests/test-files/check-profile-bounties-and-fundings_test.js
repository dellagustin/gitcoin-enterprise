const fs = require("fs-sync");
const path = require("path");
const config = fs.readJSON(path.join(__dirname, "../.env.json"));

Feature("Check Profile, Bounties and Fundings");

Scenario("test profile, bounties and fundings", async (I) => {
  I.amOnPage("/");
  pause(I)
  I.click(locate("#burgerMenu"));
  pause(I)

  I.click("Profile");
  pause(I)
  
  // I.fillField(locate({id: 'userId'}), 'd123')
  // pause(I)

  // I.click("Next");
  // pause(I)

  // I.see("Bounties and Fundings")

});

async function pause(I) {
  (config.mode === "demo") ?
  await I.wait(4) : 
  await I.wait(3)
}