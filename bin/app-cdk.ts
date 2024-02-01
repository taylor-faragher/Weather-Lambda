import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { WeatherByZipCodeStack } from '../lib/weatherByZipCodeStack';

const app = new cdk.App();
new WeatherByZipCodeStack(app, 'WeatherLambdaStack', {
    env: {
        account: process.env.AWS_ACCOUNT_NUMBER,
        region: process.env.REGION
    }
});