Feature("Check Profile, Bounties and Fundings");

Scenario("test checking profile, bounties and fundings", async (I) => {

  I.amOnPage("/");
  await I.wait(2)

  I.say('For this test it is important to be online also when testing locally - because accessing <i id="burgerMenu" class="fa fa-bars"></i>...')
  
  I.click(locate("#burgerMenu"));

  await I.wait(2)
  I.click(locate("#profile"));
  await I.wait(2)

  I.fillField(locate('#userId'), 'd123')
  await I.wait(2)

  I.click("Next");
  await I.wait(2)

  I.see("Bounties & Fundings")

});

