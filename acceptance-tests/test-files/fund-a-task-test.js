Feature("Fund a Task");

Scenario("test funding a task", async I => {
  I.amOnPage("/");
  await I.wait(2)
  I.click(locate('#fundATask'));
  await I.wait(2)
  I.see("Please enter the link to the issue on GitHub.");
  I.fillField(
    locate("#taskLink"),
    "https://github.com/cla-assistant/cla-assistant/issues/530"
  );
  await I.wait(2)
  I.click(locate("#next"));
  await I.wait(2)
  
  I.fillField(locate('#userId'), 'd123')
  await I.wait(2)
  
  I.click(locate("#next"));
  await I.wait(2)
  
  I.click(locate('#saveFunding'))
  await I.wait(2)
  
  I.see("Funded Successfully")
  I.see("View Transaction in Ledger")
  I.see("Check it on GitHub")
  
  
  I.click(locate('#viewTransactionInLedger'))
  await I.wait(2)
});
