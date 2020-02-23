// to test only a specific scenario run e.g.: npx codeceptjs run --steps --grep Impressum
const fs = require("fs-sync");
const path = require("path");

let transactionId

Feature("Minimal Viable Service");

Scenario("Landing Page", async (I) => {

  I.say(prerequisite);

  I.amOnPage("/");
  await I.wait(2)

  I.see('Solve the tasks you like.')
  I.see('Delegate the rest.')

  I.see('Fund a Task')
  I.see('Solve a Task')

});

Scenario("Check my Profile", async (I) => {

  I.say(prerequisite);

  I.amOnPage("/");
  await I.wait(2)

  I.click(locate("#burgerMenu"));
  await I.wait(2);

  I.click(locate("#profile"));
  await I.wait(7);

  I.see("Bounties & Fundings");
  I.see("Balance");
  I.see("Visit on GitHub");

});


Scenario("Invite a Friend", async (I) => {

  I.say(prerequisite);

  I.amOnPage("/");
  await I.wait(2)


  I.click(locate("#burgerMenu"));
  await I.wait(2);

  I.click(locate("#inviteFriends"));
  await I.wait(2);

  I.see("Invite Friends");
  I.see("Copy Link To Clipboard");

  I.click(locate('#copyLinkToClipboard'))
  I.seeInPopup('Invitationlink copied to clipboard')
  I.acceptPopup();

});


Scenario("Check Impressum", async (I) => {

  I.say(prerequisite);

  I.amOnPage("/");
  await I.wait(2)

  I.click(locate("#burgerMenu"));
  await I.wait(2)
  I.click(locate('#contact'));
  await I.wait(2)
  I.see("Impressum");
  I.see("Angaben gemäß § 5 TMG");
  I.see("Keine Abmahnung ohne Kontakt !!");
});


Scenario("Fund a Task", async (I) => {

  I.say(prerequisite);

  I.amOnPage("/");
  await I.wait(2)

  I.click(locate("#burgerMenu"));
  await I.wait(2)
  I.click(locate('#fund'));
  await I.wait(2)
  I.see("Please enter the link to the issue on GitHub.");
  I.fillField(
    locate("#taskLink"),
    "https://github.com/gitcoin-enterprise/gitcoin-enterprise/issues/16"
  );
  await I.wait(2)
  I.click(locate("#next"));
  await I.wait(2)

  I.click(locate('#saveFunding'))
  await I.wait(2)

  transactionId = (await I.grabTextFrom(locate('#transactionId'))).trim();
  I.say(`transaction ID: ${transactionId}`)

  I.see("Funded Successfully")
  I.see("View Transaction in Ledger")
  I.see("Check it on GitHub")

  I.click(locate('#viewTransactionInLedger'))
  await I.wait(2)

  I.scrollPageToBottom();
  await I.wait(2)

  I.see('Transaction Volume')

  I.click(locate(`#taskId-${transactionId}`))
  await I.wait(2)
  I.see('From User')
  I.see('To Task')

});


Scenario("Solve a Task", async (I) => {

  I.say(prerequisite);

  I.amOnPage("/");
  await I.wait(2)

  I.click(locate("#burgerMenu"));
  await I.wait(2)
  I.click(locate('#solve'));
  await I.wait(2)
  I.see("Task Explorer");

  // I.click(locate(`#taskId-${transactionId}`))
  I.click({ xpath: '//td' })
  await I.wait(2)
  I.see("Task Explorer");
  I.see("What's your Plan?");
  I.fillField(locate('#theplan'), "I plan to solve this in my typical style which can be described as quick and dirty. I hope that's fine for you. I guess you just want to get this shit done :)")
  await I.wait(2)
  I.click(locate('#startsolvingthis'))
  await I.wait(3)
  I.see("You are a brave person");

});


Scenario("Pay the Bounty", async (I) => {

  I.say("For this test previous tests are necessary - in some contexts chained tests are o.k. --> otherwise: please create a PR solving this.");
  I.wait(2)
  I.say(prerequisite);

  I.amOnPage("/");
  await I.wait(2)

  I.click(locate("#burgerMenu"));
  await I.wait(2);

  I.click(locate("#profile"));
  await I.wait(2);

  I.see("Bounties & Fundings");
  I.see("Balance");
  I.see("Visit on GitHub");

  I.click(locate('#bountiesAndFundings'))
  await I.wait(2);
  I.see("Click an entry to trigger a payout");
  I.click({ xpath: '//td' })
  await I.wait(2);
  const completeAmount = await I.grabValueFrom('input[id=amount]');
  I.say(completeAmount)
  I.see(`Please enter which GitHub User shall receive how much of the ${completeAmount} EIC.`);
  I.see("GitHub User");
  I.see("Amount");
  I.fillField(
    locate("#githubUser"),
    "michael-spengler"
  );

  I.fillField(
    locate("#amount"),
    "1"
  );

  I.click(locate('#transferCoins'))
  I.wait(1)
  I.seeInPopup('You can send this transaction as soon as you distributed 100%.')
  I.acceptPopup();
  I.wait(1)
  I.fillField(
    locate("#amount"),
    completeAmount
  );
  I.click(locate('#addReceiver'))
  I.seeInPopup('You are already at 100%. Please reduce percentage before adding another receiver.')
  I.acceptPopup();
  I.click(locate('#transferCoins'))
  I.acceptPopup();

});

const prerequisite = 'For this test it is important to be online also when testing locally - because accessing <i id="burgerMenu" class="fa fa-bars"></i>...' 