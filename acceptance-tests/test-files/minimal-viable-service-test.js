const fs = require("fs-sync");
const path = require("path");

Feature("Minimal Viable Service");

Scenario("test minimal viable service", async (I) => {

  I.say(
    'For this test it is important to be online also when testing locally - because accessing <i id="burgerMenu" class="fa fa-bars"></i>...'
  );

  I.amOnPage("/");
  await I.wait(2)

  I.see('Fund a Task')
  I.see('Solve a Task')

  await checkMyProfile(I)

  // await checkImpressum(I)

  await inviteAFriend(I)

  let transactionId = await fundATask(I)

  await validateSuccessfulFunding(I, transactionId)

  await solveATask(I, transactionId)



});




async function fundATask(I) {
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

  const transactionId = (await I.grabTextFrom(locate('#transactionId'))).trim();
  I.say(`transaction ID: ${transactionId}`)

  return transactionId
}


async function validateSuccessfulFunding(I, transactionId) {
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


}


async function solveATask(I, transactionId) {
  I.click(locate("#burgerMenu"));
  await I.wait(2)
  I.click(locate('#solve'));
  await I.wait(2)
  I.see("Task Explorer");

  // I.click(locate(`#taskId-${transactionId}`))
  I.click({xpath: '//td'})
  await I.wait(2)
  I.see("Task Explorer");
  I.see("What's your Plan?");
  I.fillField(locate('#theplan'), "I plan to solve this in my typical style which can be described as quick and dirty. I hope that's fine for you. I guess you just want to get this shit done :)")
  await I.wait(2)
  I.click(locate('#startsolvingthis'))
  await I.wait(3)
  I.see("You are a brave person");
}

async function checkImpressum(I) {
  I.click(locate("#burgerMenu"));
  await I.wait(2)
  I.click(locate('#contact'));
  await I.wait(2)
  I.see("Impressum");
}

async function inviteAFriend(I) {


  I.click(locate("#burgerMenu"));
  await I.wait(2);

  I.click(locate("#inviteFriends"));
  await I.wait(2);

  I.see("Invite Friends");
}

async function checkMyProfile(I) {


  I.click(locate("#burgerMenu"));
  await I.wait(2);

  I.click(locate("#profile"));
  await I.wait(7);

  I.see("Bounties & Fundings");
  I.see("Balance");
  I.see("Visit on GitHub");
}
