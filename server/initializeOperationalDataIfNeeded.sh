DIR="./operational-data"
if [ -d "$DIR" ]; then
  echo "it is there"
else
  mkdir operational-data
  cd operational-data
  echo "[]" >> funded-tasks.json
  echo "[]" >> ledger-entries.json
  echo "[]" >> invitations.json
  echo '[{"balance":1000,"id":"d123","firstName":"Michael","link":"https://github.com/michael-spengler"},{"balance":2000,"id":"d124","firstName":"Akshay","link":"https://github.com/ibakshay"},{"balance":3000,"id":"d125","firstName":"Fabian","link":"https://github.com/fabianriewe"}]' >> users.json
fi


