import {App, Stack, StackProps} from 'aws-cdk-lib';
import { EndpointType, LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { getSecretByArn } from './credentials/getSecretByArn';

export class WeatherByZipCodeStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const openWeatherId = process.env.OPEN_WEATHER_API_ID;
    const awsAccount = process.env.AWS_ACCOUNT_ID

    const decryptedApiKey = getSecretByArn(this, 'openWeatherKey', {secretCompleteArn: `arn:aws:secretsmanager:us-east-1:${awsAccount}:secret:${openWeatherId}`});

    const weather = new NodejsFunction(this, 'WeatherByZipCodeGetHandler', {
      functionName: 'WeatherByZipCodeGetHandler',
      runtime: Runtime.NODEJS_18_X,
      handler: 'index.handler',
      entry: path.join(__dirname, `/../handlers/weather.js`),
      environment: { 
        "API_KEY": `${decryptedApiKey}`,
      },
    });

    new LambdaRestApi(this, 'WeatherByZipCode', {
      handler: weather,
      restApiName: 'Weather By Zip Code',
      deployOptions: {
        stageName: 'prod'
      },
      endpointConfiguration: {
        types: [EndpointType.REGIONAL],
      },
      defaultCorsPreflightOptions: {
        allowOrigins: ['*'],
        allowMethods: ['GET', 'OPTIONS'],
        statusCode: 200
      }
    });
  }
}
