const fs = require("fs-sync");
const path = require("path");

const fileIdInvitationLists = path.join(
  path.resolve(),
  "../server/operational-data/invitation-lists.json"
);

Feature("Minimal Viable Service");

const testUserId = 'f-i-r-s-t'

Scenario("test minimal viable service", async (I) => {

  setup()

  I.amOnPage("/");
  await I.wait(2)

  I.see('Fund a Task')
  let transactionId = await fundATask(I)

  // await validateSuccessfulFunding(I, transactionId)

  // await solveATask(I, transactionId)

});


async function fundATask(I) {
  I.click(locate('#fundATask'));
  await I.wait(2)
  // I.see("Please enter the link to the issue on GitHub.");
  // I.fillField(
  //   locate("#taskLink"),
  //   "https://github.com/gitcoin-enterprise/gitcoin-enterprise/issues/16"
  // );
  // await I.wait(2)
  // I.click(locate("#next"));
  // await I.wait(2)

  // I.fillField(locate('#userId'), testUserId)
  // await I.wait(2)

  // I.click(locate("#next"));
  // await I.wait(2)

  // I.click(locate('#saveFunding'))
  // await I.wait(2)

  // const transactionId = await I.grabTextFrom('#transactionId');
  // I.say(`transaction ID: ${transactionId}`)

  // return transactionId
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

}


async function solveATask(I, transactionId) {
  I.amOnPage("/");
  await I.wait(2)
  I.click(locate('#solveATask'));
  await I.wait(2)
  I.see("Task Explorer");

  // I.click(locate(`#taskId-${transactionId}`))
  // await I.wait(2)
  // I.see("Task Explorer");
}

function setup() {

  const fileIdUsers = path.join(
    path.resolve(),
    "../server/operational-data/users.json"
  );
  fs.write(fileIdInvitationLists, '[]')
  fs.write(fileIdUsers, JSON.stringify(getAFirstUser()))
}


function getAFirstUser() {
  return [{
    "balance": 1000,
    "id": "f-i-r-s-t",
    "firstName": "Michael",
    "link": "https://github.com/michael-spengler"
  }]
}
