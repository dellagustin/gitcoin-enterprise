cd gitcoin-enterprise
echo triggering backup to github
git add server/operational-data -f 
git commit -m "operational-data-backup"
./topsecret/push.sh