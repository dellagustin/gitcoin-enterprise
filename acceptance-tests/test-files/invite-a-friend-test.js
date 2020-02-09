Feature("Invite a Friend");

Scenario("test inviting a friend", async I => {
  I.amOnPage("/");
  await I.wait(2)

  I.say('For this test it is important to be online also when testing locally - because accessing <i id="burgerMenu" class="fa fa-bars"></i>...')

  I.click(locate("#burgerMenu"));

  I.click(locate('#inviteFriends'))
  await I.wait(2)

  I.see("Invite Friends");
  I.fillField(
    locate("#eMailAddress"),
    "michael.spengler@sap.com"
  );

  await I.wait(0.2)
  I.see('I hereby confirm my friend wants to be invited by E-Mail')

  I.click(locate('#confirmationCheckbox'))
  await I.wait(0.2)

  I.see('I will send the following e-mail to')
  I.click(locate("#invite"));
});
