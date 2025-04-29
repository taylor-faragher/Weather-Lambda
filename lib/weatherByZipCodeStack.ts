import {App, Duration, Stack, StackProps, aws_route53_targets} from 'aws-cdk-lib';
import {
    AccessLogFormat,
    EndpointType,
    LambdaIntegration,
    LogGroupLogDestination,
    Period,
    RestApi,
    SecurityPolicy,
    TokenAuthorizer,
} from 'aws-cdk-lib/aws-apigateway';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as path from 'path';
import {Runtime} from 'aws-cdk-lib/aws-lambda';
import {getSecretByArn} from './credentials/getSecretByArn';
import * as route53 from 'aws-cdk-lib/aws-route53';
import {LogGroup} from 'aws-cdk-lib/aws-logs';

interface WeatherStackProps extends StackProps {
    customConfig: Record<string, string>;
}

export class WeatherByZipCodeStack extends Stack {
    constructor(scope: App, id: string, props: WeatherStackProps) {
        super(scope, id, props);

        const openWeatherId = process.env.OPEN_WEATHER_API_ID;
        const jwksUriId = process.env.JWKS_URI_ID;

        const decryptedApiKey = getSecretByArn(this, 'openWeatherKey', {
            secretCompleteArn: `arn:aws:secretsmanager:us-east-1:${props?.env?.account}:secret:${openWeatherId}`,
        });

        const decryptedUri = getSecretByArn(this, 'decryptedUri', {
            secretCompleteArn: `arn:aws:secretsmanager:us-east-1:${props?.env?.account}:secret:${jwksUriId}`,
        });

        const weather = new NodejsFunction(this, 'getWeatherFreemiumGetHandler', {
            functionName: `${props.customConfig.lambdaFreemiumFunctionName}`,
            runtime: Runtime.NODEJS_LATEST,
            handler: 'index.getWeatherFreemium',
            entry: path.join(__dirname, `/../handlers/getWeatherFreemium.js`),
            environment: {
                API_KEY: `${decryptedApiKey}`,
            },
            timeout: Duration.seconds(30),
            memorySize: 1024,
        });

        const authorizer = new NodejsFunction(this, 'GetWeatherAuthorizerHandler', {
            functionName: `${props.customConfig.lambdaAuthorizerName}`,
            runtime: Runtime.NODEJS_LATEST,
            handler: 'authorizer',
            entry: path.join(__dirname, `/../handlers/authorizer/handler.js`),
            environment: {
                JWKS_URI: decryptedUri,
            },
        });

        const premiumWeather = new NodejsFunction(this, 'getWeatherPremiumGetHandler', {
            functionName: `${props.customConfig.lambdaPremiumFunctionName}`,
            runtime: Runtime.NODEJS_LATEST,
            handler: 'index.getWeatherPremium',
            entry: path.join(__dirname, `/../handlers/getWeatherPremium.js`),
            environment: {
                API_KEY: `${decryptedApiKey}`,
            },
            timeout: Duration.seconds(30),
            memorySize: 1024,
        });

        const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
            domainName: `${props.customConfig.domain}`,
        });

        const certificate = new acm.Certificate(this, 'ApiCertificate', {
            domainName: `${props.customConfig.fullDomain}`,
            validation: acm.CertificateValidation.fromDns(hostedZone),
        });

        const apiGatewayLogGroup = new LogGroup(this, `${props.customConfig.apiGatewayLogGroupName}`);

        const api = new RestApi(this, 'WeatherByZipCodeApi', {
            restApiName: `${props.customConfig.restApiName}`,
            deployOptions: {
                stageName: `${props.customConfig.env}`,
                accessLogDestination: new LogGroupLogDestination(apiGatewayLogGroup),
                accessLogFormat: AccessLogFormat.jsonWithStandardFields(),
            },
            endpointConfiguration: {
                types: [EndpointType.REGIONAL],
            },
            defaultCorsPreflightOptions: {
                allowOrigins: ['*'],
                allowMethods: ['GET', 'OPTIONS'],
            },
            domainName: {
                domainName: `${props.customConfig.fullDomain}`,
                certificate: certificate,
                securityPolicy: SecurityPolicy.TLS_1_2,
            },
        });

        const tokenAuthorizer = new TokenAuthorizer(this, 'GetWeatherTokenAuthorizer', {
            handler: authorizer,
        });

        const usagePlan = api.addUsagePlan('WeatherUsagePlan', {
            name: `WeatherLambdaUsagePlan-${props.customConfig.env}`,
            throttle: {
                rateLimit: 0.33,
                burstLimit: 10,
            },
            quota: {
                limit: 10000,
                period: Period.MONTH,
            },
        });

        const key = api.addApiKey(`WeatherApiKey-${props.customConfig.env}`);

        const getWeather = api.root.addMethod('GET', new LambdaIntegration(weather), {apiKeyRequired: true});
        const premium = api.root.addResource('premium');
        premium.addMethod('GET', new LambdaIntegration(premiumWeather), {
            authorizer: tokenAuthorizer,
        });

        usagePlan.addApiKey(key);
        usagePlan.addApiStage({
            stage: api.deploymentStage,
            throttle: [
                {
                    method: getWeather,
                    throttle: {
                        rateLimit: 0.33,
                        burstLimit: 10,
                    },
                },
            ],
        });

        new route53.ARecord(this, 'FullDomainARecord', {
            zone: hostedZone,
            recordName: `${props.customConfig.fullDomain}`,
            target: route53.RecordTarget.fromAlias(new aws_route53_targets.ApiGateway(api)),
        });
    }
}
