Feature("View Ledger");

Scenario("test viewing ledger", async I => {
  I.amOnPage("/");
  await I.wait(4)
  I.click(locate("#burgerMenu"));
  await I.wait(4)
  I.click(locate("#downloadLedger"));
  await I.wait(4)
  I.see("This makes a total of");
});
