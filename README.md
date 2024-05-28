# Weather Lambda Project

This is a production ready backend for retrieving weather information. The information comes from openweathermap.org. Currently, weather information is only retrieved using zip code. This project is deployed automatically with cdk. See the steps below to run this project yourself.

# Installation

1. `cd` to the repo on your local machine
2. Run `yarn`
3. Run steps to bootstrap your AWS account. Steps can be found here: https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html
4. Retrieve your API key from your account at openweathermap.org. Once your have retrieved this, you will need to set it up as secret in your AWS secrets manager. Once your have done that, obtrieve the ID from the AWS console and use it in the following command: `export OPEN_WEATHER_API_ID=<ID>`
5. Make sure your AWS region and account number are exported in your terminal:
   - `export REGION=us-east-1`
   - `export AWS-ACCOUNT_NUMBER=<accountNumber>`
6. Run `yarn deploy`

## Important!

If you are deploying this, you will need to replace the code for the website used to access this or comment out the code.

# Running Locally
1. `cd` into the root directory of the project
2. Run `yarn`
3. Run `yarn local`

```
curl --request GET \
  --url http://localhost:8008/ \
  --header 'content-type: application/json'
```

# Testing

### Unit Testing
1. `cd` to the root directory of the project
2. Run `yarn`
3. Run `yarn test unit`

### Integration Testing
1. `cd` to the root directory of the project
2. Run `yarn`
3. Run `yarn test integration`

# Future updates
- Add weather lookup by city/state