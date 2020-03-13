# Learning Experiences

Collecting some highlight learning experiences while implementing the project

## Acceptance Test Related

### chromium pupetteer ubuntu

https://stackoverflow.com/questions/52993002/headless-chrome-node-api-and-puppeteer-installation

`sudo apt-get install gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget`

And then https://github.com/karma-runner/karma-chrome-launcher/issues/158#issuecomment-339265457


## Link Previews
I plan to show the task title in the link preview
https://ogp.me/
https://meetedgar.com/blog/facebooks-new-link-previews-need-know-2018/
https://developers.facebook.com/tools/debug/
https://developers.facebook.com/tools/debug/og/object/
https://developers.facebook.com/docs/sharing/best-practices



## Git
Applying .gitignore to committed files
git rm --cached /path/to/file
https://stackoverflow.com/questions/7527982/applying-gitignore-to-committed-files


## Client / Frontend related

### Bootstrap

I needed to

1. install https://www.npmjs.com/package/bootstrap
2. add the following entry in styles within angular.json
   "./node_modules/bootstrap/dist/css/bootstrap.min.css",

before I could use https://www.npmjs.com/package/ngx-bootstrap successfully

https://valor-software.com/ngx-bootstrap/#/typeahead was helpful

### Pagespeed

https://developers.google.com/speed/pagespeed/insights/

## Encryption HTTPS / SSL Related

How to get https right: https://certbot.eff.org/

## Interfaces & Dependency Injection
Interfaces & Dependency Injection: https://stackoverflow.com/questions/52969037/nestjs-dependency-injection-and-ddd-clean-architecture

## NestJS Related

### Dependency Injection

As Interfaces are currently design time only, I needed to play a trick for mimicing Interface Polymorphism / Interface based Dependency Injection - can be checked in server/src/app.module.ts

## Docker Related
For starters [this video](https://www.youtube.com/watch?v=CsWoMpK3EtE) seems helpful.

### Publishing the docker image via GitHub Packages
```docker login docker.pkg.github.com --username {{GitHubUserName}} -p {{GitHubToken}}```

```docker tag {{DockerImageId}} docker.pkg.github.com/{{GitHubUserName}}/{{RepositoryId}}/{{DockerName}}:latest```

```docker push docker.pkg.github.com/{{GitHubUserName}}/{{RepositoryId}}/{{DockerName}}:latest```

### Pulling docker image from GitHub Packages
```docker pull docker.pkg.github.com/gitcoinenterprise/testing-gh-docker-registry/express-app:latest```


## Authentication Related
### OAuth
**Explaining OAuth to Users nicely**
https://www.youtube.com/watch?v=Y6E1GZckIko

regarding the topic of secrets in queryparameters of redirect URL:
```history.replaceState(null, null, ' ')```  
after having the variables transferred from query parameters to locals

### E-Mail based Authentication
I decided now to leave E-Mail based Authentication behind. GitHub based Authentication seems best in the context of GitCoin Enterprise.

**Background Info**
https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/
https://oauth.net/articles/authentication/
https://www.youtube.com/watch?v=A23O4aUftXk


### In General
http://www.passportjs.org/docs/

### GitHub based Authentication
**Rather Classic**
http://www.passportjs.org/packages/passport-github/ resp.
http://www.passportjs.org/packages/passport-github2/

**Using GitHub Apps**
https://developer.github.com/apps/building-github-apps/identifying-and-authorizing-users-for-github-apps/

## Shell / Bash Script Related

FILE=./.env.json
if [ -f "$FILE" ]; then
echo "I checked $FILE exists - let's go :)"
else
    echo '{"mode": "real"}' >> .env.json
    echo "I created $FILE with default values successfully"
fi


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

### Experimental
https://www.js-tutorials.com/javascript-tutorial/use-localstorage-sessionstorage-using-webstorage-angular4/

## Postgres
docker run -p 5432:5432 --name p2p -e POSTGRES_USER=p2p -e POSTGRES_PASSWORD=mysecretpassword -d postgres
docker ps -a
docker stop && docker rm

## Cloud SQL on GCP
https://www.youtube.com/watch?v=vMUpNoukwnM
