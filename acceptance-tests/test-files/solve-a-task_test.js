Feature("Solve a Task");

Scenario("test solving a task", async I => {
  I.amOnPage("/");
  await I.wait(4)
  I.click(locate('#solveATask'));
  await I.wait(4)
  I.see("Task Explorer");
});
