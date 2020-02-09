Feature("View Ledger");

Scenario("test viewing ledger", async I => {
  
  I.amOnPage("/");
  await I.wait(2)

  I.say('For this test it is important to be online also when testing locally - because accessing <i id="burgerMenu" class="fa fa-bars"></i>...')
  
  I.click(locate("#burgerMenu"));
  await I.wait(2)
  
  I.click(locate("#downloadLedger"));
  await I.wait(2)

  I.scrollPageToBottom();
  await I.wait(0.2)
  
  I.see("Transaction Volume");
});
