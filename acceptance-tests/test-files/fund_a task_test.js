Feature("Fund a Task");

Scenario("test something", async I => {
  I.amOnPage("/");
  I.click("Fund a Task");
  I.see("Please enter the link to the issue on GitHub.");
  I.fillField(
    locate("#taskLink"),
    "https://github.com/cla-assistant/cla-assistant/issues/530"
  );
  // I.click(locate("Next"));
});
