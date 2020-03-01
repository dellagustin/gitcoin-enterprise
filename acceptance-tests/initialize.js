const fs = require('fs-sync')
const path = require('path')
const fileIdFundedTasks = path.join(
  path.resolve(),
  "../server/operational-data/funded-tasks.json"
);

const fileIdLedgerEntries = path.join(
  path.resolve(),
  "../server/operational-data/ledger-entries.json"
);

const fileIdAuthenticationData = path.join(
  path.resolve(),
  "../server/operational-data/authentication-data.json"
);

fs.write(fileIdAuthenticationData, "[]");
fs.write(fileIdLedgerEntries, "[]");
fs.write(fileIdFundedTasks, "[]");
