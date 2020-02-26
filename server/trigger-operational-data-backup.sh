cd ..
git branch -c operational-data-backup
git checkout operational-data-backup
git add .
git commit -m "operational-data-backup"
./topsecret/push.sh