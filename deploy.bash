cd gitcoin-enterprise
git stash
git pull
cd server
npm i
rm -rf dist
npm run build
cd ../client
npm i
npm run build-prod
rm -rf ../server/docs
cp -r ./docs ../server/ 
mv ../server/docs/index.html ../server/docs/i-want-compression-via-route.html
cd ../server
npm run compress
pm2 restart gitcoin-enterprise-server
cd ../acceptance-tests
npm i 
npm run acceptance-tests-prod
echo "if npm run acceptance-tests-prod fails, autosend a telegram message to 24*7 operations team, generate an issue + transfer 50% of last committers balance - funding this issue which will probably be solved by operations team"

