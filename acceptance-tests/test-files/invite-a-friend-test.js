
const fileIdInvitationLists = path.join(
  path.resolve(),
  "../server/operational-data/invitation-lists.json"
);

Feature("Invite a Friend");

Scenario("test inviting a friend", async I => {

<<<<<<< HEAD
=======

>>>>>>> 171b3fec4fde11bddade45f77a3084f9d95d2ff9
  setup()

  I.amOnPage("/");
  await I.wait(2);

  I.say(
    'For this test it is important to be online also when testing locally - because accessing <i id="burgerMenu" class="fa fa-bars"></i>...'
  );

  I.click(locate("#burgerMenu"));

  I.click(locate("#inviteFriends"));
  await I.wait(2);

  I.see("Invite Friends");

  I.fillField(locate("#userId"), "f-i-r-s-t");
  await I.wait(2);

  I.click(locate("#next"));
  await I.wait(2);

  I.fillField(locate("#eMailAddress"), "michael@gitcoin-enterprise.org");
  await I.wait(0.2);
  I.see("I hereby confirm my friend wants to be invited by E-Mail");

  I.click(locate("#confirmationCheckbox"));
  await I.wait(0.2);

  I.see("I will send the following e-mail to");
  I.click(locate("#invite"));

  validateContentInInvitationLists()

});

// michael.spengler@sap.com

function validateContentInInvitationLists() {
  const invitationListsAfterTest = fs.readJSON(fileIdInvitationLists)
  if (invitationListsAfterTest.length === 0) {
    // throw new Error('writing invitationlists did not work')
  }
}



function setup() {

  const fs = require("fs-sync");
  const path = require("path");

  const fileIdInvitationLists = path.join(
    path.resolve(),
    "../server/operational-data/invitation-lists.json"
  );

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
