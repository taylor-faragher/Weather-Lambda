import {App, Stack, StackProps, aws_route53_targets} from 'aws-cdk-lib';
import {EndpointType, LambdaIntegration, RestApi, SecurityPolicy} from 'aws-cdk-lib/aws-apigateway';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as path from 'path';
import {Runtime} from 'aws-cdk-lib/aws-lambda';
import {getSecretByArn} from './credentials/getSecretByArn';
import * as route53 from 'aws-cdk-lib/aws-route53';

interface WeatherStackProps extends StackProps {
    customConfig: Record<string, string>;
}

export class WeatherByZipCodeStack extends Stack {
    constructor(scope: App, id: string, props: WeatherStackProps) {
        super(scope, id, props);

        const openWeatherId = process.env.OPEN_WEATHER_API_ID;

        const decryptedApiKey = getSecretByArn(this, 'openWeatherKey', {
            secretCompleteArn: `arn:aws:secretsmanager:us-east-1:${props?.env?.account}:secret:${openWeatherId}`,
        });

        const weather = new NodejsFunction(this, 'WeatherByZipCodeGetHandler', {
            functionName: `${props.customConfig.lambdaFunctionName}`,
            runtime: Runtime.NODEJS_18_X,
            handler: 'index.handler',
            entry: path.join(__dirname, `/../handlers/weather.js`),
            environment: {
                API_KEY: `${decryptedApiKey}`,
            },
        });

        const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
            domainName: `${props.customConfig.domain}`,
        });

        const certificate = new acm.Certificate(this, 'ApiCertificate', {
            domainName: `${props.customConfig.fullDomain}`,
            validation: acm.CertificateValidation.fromDns(hostedZone),
        });

        const api = new RestApi(this, 'WeatherByZipCodeApi', {
            restApiName: `${props.customConfig.restApiName}`,
            deployOptions: {
                stageName: `${props.customConfig.env}`,
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

        api.root.addMethod('GET', new LambdaIntegration(weather));

        new route53.ARecord(this, 'FullDomainARecord', {
            zone: hostedZone,
            recordName: `${props.customConfig.fullDomain}`,
            target: route53.RecordTarget.fromAlias(new aws_route53_targets.ApiGateway(api)),
        });
    }
}
