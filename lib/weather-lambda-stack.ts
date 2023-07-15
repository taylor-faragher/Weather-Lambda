import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import {PolicyStatement} from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';

export class WeatherLambdaStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const accountNumber = process.env.AWS_ACCOUNT_NUMBER
    const secret_name = process.env.SECRET_NAME

    const lambdaPolicy = new PolicyStatement();
    lambdaPolicy.addActions('secretsmanager:GetSecretValue');
    lambdaPolicy.addActions('secretsmanager:GetResourcePolicy');
    lambdaPolicy.addActions('secretsmanager:DescribeSecret');
    lambdaPolicy.addActions('secretsmanager:ListSecretVersionIds');
    lambdaPolicy.addResources(`arn:aws:secretsmanager:us-east-1:${accountNumber}:secret:${secret_name}`);

    const weather = new NodejsFunction(this, 'WeatherHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      entry: path.join(__dirname, `/../lambda/weather.js`),
      initialPolicy: [lambdaPolicy],
      environment: { 
        "SECRET_NAME": `${secret_name}`,
      },
    });

    const api = new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: weather,
    });
  }
}
