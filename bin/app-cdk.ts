import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { WeatherByZipCodeStack } from '../lib/weatherByZipCodeStack';
import { getCdkConfig } from './getCdkConfig';

const app = new cdk.App();

const env = app.node.tryGetContext('env') || 'dev'; 

const config = getCdkConfig(env);

new WeatherByZipCodeStack(app, `WeatherLambdaStack-${env}`, {
    customConfig: config,
    env: {
        account: process.env.AWS_ACCOUNT_NUMBER,
        region: config.region
    }
});