cd gitcoin-enterprise
git pull
cd server
npm i
npm run build
cd ../client
npm i
npm run build-prod
cp -r ./docs ../server/ 
mv ../server/docs/index.html ../server/docs/i-want-compression-via-route.html
pm2 restart gitcoin-enterprise-server