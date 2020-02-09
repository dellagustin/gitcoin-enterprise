const fs = require("fs-sync");
const path = require("path");

const fileIdFundedTasks = path.join(
  path.resolve(),
  "../server/operational-data/funded-tasks.json"
);

const fileIdInvitationLists = path.join(
  path.resolve(),
  "../server/operational-data/invitation-lists.json"
);

const fileIdLedgerEntries = path.join(
  path.resolve(),
  "../server/operational-data/ledger-entries.json"
);

const fileIdUsers = path.join(
  path.resolve(),
  "../server/operational-data/users.json"
);

const fileIdTemplateUsers = path.join(
  path.resolve(),
  "../server/operational-data/template-users.json"
);

fs.write(fileIdInvitationLists, "[]");
fs.write(fileIdLedgerEntries, "[]");
fs.write(fileIdFundedTasks, "[]");
fs.write(fileIdUsers, JSON.stringify(fs.readJSON(fileIdTemplateUsers)));
