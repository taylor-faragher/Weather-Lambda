#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib/core';
import { WeatherLambdaStack } from '../lib/weather-lambda-stack';

const app = new cdk.App();
new WeatherLambdaStack(app, 'WeatherLambdaStack', {});

app.synth();