# Acceptance Tests

If you would like to contribute to this project it yould be great if you did so by applying Acceptance Test Driven Development.  
In this project we use [codecept.io](https://codecept.io/) for our Acceptance Tests.

## Execute the Test Suite in Demo Mode

Make sure to have the [Brave Browser](https://brave.com) installed to enjoy the whole show.

```
npm run acceptance-tests-demo
```

## Execute the Test Suite

```
npm run acceptance-tests
```

## Execute a Single Test

```
npx codeceptjs run --steps --grep "Fund a Task"
```

## Generate a Test

```
1. cd acceptance-tests
2. npx codeceptjs gt
```


## Learnings along the way
### chromium pupetteer ubuntu
https://stackoverflow.com/questions/52993002/headless-chrome-node-api-and-puppeteer-installation

```sudo apt-get install gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget```


And then https://github.com/karma-runner/karma-chrome-launcher/issues/158#issuecomment-339265457