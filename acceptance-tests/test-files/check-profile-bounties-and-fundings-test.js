Feature("Check Profile, Bounties and Fundings");

Scenario("test profile, bounties and fundings", async (I) => {
  I.amOnPage("/");
  await I.wait(2)
  I.click(locate("#burgerMenu"));
  await I.wait(2)

  I.click("Profile");
  await I.wait(2)
  
  // I.fillField(locate({id: 'userId'}), 'd123')
  // pause(I)

  // I.click("Next");
  // pause(I)

  // I.see("Bounties and Fundings")

});

