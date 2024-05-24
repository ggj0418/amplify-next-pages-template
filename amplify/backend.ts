import {defineBackend} from '@aws-amplify/backend';
import {auth} from './auth/resource';
import {data} from './data/resource';
import {AuthorizationType, LambdaIntegration, LambdaRestApi} from "aws-cdk-lib/aws-apigateway";
import {testFunction} from "@/amplify/functions/test-function/resource";
import {DynamoEventSource} from "aws-cdk-lib/aws-lambda-event-sources";
import {StartingPosition} from "aws-cdk-lib/aws-lambda";
import {tableEventListenerFunction} from "@/amplify/functions/table-event-listener-function/resource";

const backend = defineBackend({
    tableEventListenerFunction,
    testFunction,
    auth,
    data,
});

const apiGatewayStack = backend.createStack('TestStack')
const api = new LambdaRestApi(apiGatewayStack, 'TestStackApi', {
    handler: backend.testFunction.resources.lambda,
    proxy: false
})

const testFunctionIntegration = new LambdaIntegration(backend.testFunction.resources.lambda, {
    proxy: true,
    allowTestInvoke: true
})
api.root.addResource('test').addMethod('POST', testFunctionIntegration, {
    authorizationType: AuthorizationType.NONE,
})

const eventSource = new DynamoEventSource(backend.data.resources.tables["Todo"], {
    startingPosition: StartingPosition.LATEST,
});
backend.tableEventListenerFunction.resources.lambda.addEventSource(eventSource);