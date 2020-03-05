// to test only a specific scenario run e.g.: npx codeceptjs run --steps --grep Impressum
const fs = require("fs-sync");
const path = require("path");

let transactionId

Feature("Minimal Viable Service");

Scenario("Landing Page", async (I) => {

  I.say(prerequisite);

  I.amOnPage("/");
  I.wait(2)

  I.see('Solve the tasks you like.')
  I.see('Delegate the rest.')

  I.see('Fund a Task')
  I.see('Solve a Task')

});

Scenario("Check my Profile", async (I) => {

  I.say(prerequisite);

  I.amOnPage("/");
  I.wait(2)

  I.click(locate("#burgerMenu"));
  I.wait(2);

  I.click(locate("#profile"));
  await I.wait(2);

  I.see("Bounties & Fundings");
  I.see("Balance");
  I.see("Visit on GitHub");
  I.see("Balance: 200 EIC");

});

Scenario("Check Impressum", async (I) => {

  I.say(prerequisite);

  I.amOnPage("/");
  I.wait(2)

  I.click(locate("#burgerMenu"));
  I.wait(2)
  I.click(locate('#contact'));
  I.wait(2)
  I.see("Impressum");
  I.see("Angaben gemäß § 5 TMG");
  I.see("Keine Abmahnung ohne Kontakt !!");
});


Scenario("Fund a Task", async (I) => {

  I.say(prerequisite);

  I.amOnPage("/");
  I.wait(2)

  I.click(locate("#burgerMenu"));
  I.wait(2)
  I.click(locate('#fund'));
  I.wait(2)
  I.see("Enter the Link to Your Issue");
  I.fillField(
    locate("#taskLink"),
    "https://github.com/gitcoin-enterprise/gitcoin-enterprise/issues/25"
  );
  I.wait(2)
  I.click(locate("#next"));
  I.wait(2)

  I.click(locate('#saveFunding'))
  I.wait(2)

  transactionId = (await I.grabTextFrom(locate('#transactionId'))).trim();
  I.say(`transaction ID: ${transactionId}`)

  I.see("Funded Successfully")
  I.see("View Transaction in Ledger")
  I.see("Check it on GitHub")

  I.click(locate('#viewTransactionInLedger'))
  I.wait(2)

  I.scrollPageToBottom();
  I.wait(2)

  I.see('Transaction Volume')
  I.see('220 EIC')

  I.click(locate(`#taskId-${transactionId}`))
  I.wait(2)
  I.see('From User')
  I.see('To Task')
  I.see('Amount')
  I.see('20')

  I.click(locate(`#backToOverview`))

});


Scenario("Solve a Task", async (I) => {

  I.say(prerequisite);

  I.amOnPage("/");
  I.wait(2)

  I.click(locate("#burgerMenu"));
  I.wait(2)
  I.click(locate('#solve'));
  I.wait(2)
  I.see("Task Explorer");
  I.see("20 EIC");

  // I.click(locate(`#taskId-${transactionId}`))
  I.click({ xpath: '//td' })
  I.wait(2)
  I.see("Task Explorer");
  I.see("What's your Plan?");
  I.fillField(locate('#theplan'), "I plan to solve this in my typical style which can be described as quick and dirty. I hope that's fine for you. I guess you just want to get this shit done :)")
  I.wait(2)
  I.click(locate('#startsolvingthis'))
  await I.wait(3)
  I.see("You are a brave person");

});


Scenario("Pay the Bounty", async (I) => {

  I.say("For this test previous tests are necessary - in some contexts chained tests are o.k. --> otherwise: please create a PR solving this.");
  I.wait(2)
  I.say(prerequisite);

  I.amOnPage("/");
  I.wait(2)

  I.click(locate("#burgerMenu"));
  I.wait(2);

  I.click(locate("#profile"));
  I.wait(2);

  I.see("Bounties & Fundings");
  I.see("Balance");
  I.see("Visit on GitHub");
  I.see("Balance: 180 EIC");

  I.click(locate('#bountiesAndFundings'))
  I.wait(2);
  I.see("Balance: 180 EIC");
  I.see("Your Fundings");
  I.see("Your Bounties");
  I.see("Click Entry to Trigger Payout");
  I.see("20 EIC");
  I.see("Register Successfully"); 
  I.see("200 EIC");
  I.click({ xpath: '//td' })
  I.wait(2);
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
    completeAmount
  );

  I.click(locate('#addReceiver'))
  I.seeInPopup('You are already at 100%. Please reduce percentage before adding another receiver.')
  I.acceptPopup();

  I.click(locate('#transferCoins'))

  I.wait(2)
  I.see("Transferred Successfully")
  I.see(`I transferred ${completeAmount} EIC to`)
  I.see("View Transaction in Ledger")
  I.wait(2)
  I.click(locate('#viewTransactionInLedger'))
  I.wait(2)
  I.see("Transaction Volume")
  I.see("240 EIC")
  I.click(locate("#burgerMenu"));
  I.wait(2)
  I.click(locate('#landing'))
  I.wait(2)

  I.see('Solve the tasks you like.')
  I.see('Delegate the rest.')

  I.see('Fund a Task')
  I.see('Solve a Task')

  I.click(locate("#burgerMenu"));
  I.wait(2)

  I.click(locate("#profile"));
  I.wait(2);

  I.see("Bounties & Fundings");
  I.see("Balance: 200 EIC");
  I.see("Visit on GitHub");


});


Scenario("Check Ledger Component", async (I) => {

  I.say(prerequisite);

  I.amOnPage("/");
  I.wait(2)

  I.click(locate("#burgerMenu"));
  I.wait(2);

  I.click(locate("#downloadLedger"));
  await I.wait(2);

  I.see('Download as JSON')
  I.see('Download as CSV')

  // I.click(locate("#triggerBackup"));

  I.click({ xpath: '//td' })

  I.see('The Miner')
  I.see('michael-spengler')
  I.see('200')
});

const prerequisite = 'For this test it is important to be online also when testing locally - because accessing <i id="burgerMenu" class="fa fa-bars"></i>...' 


// Scenario("Invite a Friend", async (I) => {

//   I.say(prerequisite);

//   I.amOnPage("/");
//   I.wait(2)


//   I.click(locate("#burgerMenu"));
//   I.wait(2);

//   I.click(locate("#inviteFriends"));
//   I.wait(2);

//   I.see("Invite Friends");
//   I.see("Copy Link To Clipboard");

//   I.click(locate('#copyLinkToClipboard'))
//   I.seeInPopup('Invitationlink copied to clipboard')
//   I.acceptPopup();

// });
