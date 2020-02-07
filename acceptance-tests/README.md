# Acceptance Tests

If you would like to contribute to this project it yould be great if you did so by applying Acceptance Test Driven Development.  
In this project we use [codecept.io](https://codecept.io/) for our Acceptance Tests.

## Generate a Test

```
1. cd acceptance-tests
2. npx codeceptjs gt
```

## Execute the Test Suite

```
npx codeceptjs run --steps
```

## Execute a Single Test

```
npx codeceptjs run --steps --grep "Fund a Task"
```

## Showing Browser During Execution

You can set the

```
show: true
´´´

or
```

show: false
´´´

within codecept.conf.js
