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
