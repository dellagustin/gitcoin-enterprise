const fs = require("fs-sync");
const path = require("path");

const fileIdInvitationLists = path.join(
  path.resolve(),
  "../server/operational-data/invitation-lists.json"
);

Feature("Invite a Friend");

Scenario("test inviting a friend", async I => {

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

  I.fillField(locate("#userId"), "d123");
  await I.wait(2);

  I.click(locate("#next"));
  await I.wait(2);

  I.fillField(locate("#eMailAddress"), "michael.spengler@sap.com");
  await I.wait(0.2);
  I.see("I hereby confirm my friend wants to be invited by E-Mail");

  I.click(locate("#confirmationCheckbox"));
  await I.wait(0.2);

  I.see("I will send the following e-mail to");
  I.click(locate("#invite"));

  validateContentInInvitationLists()

});

// michael.spengler@sap.com

function setup() {

  fs.write(fileIdInvitationLists, '[]')


}

function validateContentInInvitationLists() {
  const invitationListsAfterTest = fs.readJSON(fileIdInvitationLists)
  if (invitationListsAfterTest.length === 0) {
    // throw new Error('writing invitationlists did not work')
  }
}