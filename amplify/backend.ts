import {defineBackend} from '@aws-amplify/backend';
import {auth} from './auth/resource';
import {data} from './data/resource';
import {testFunction} from "@/amplify/functions/test-function/resource";
import {AuthorizationType, LambdaIntegration, LambdaRestApi} from "aws-cdk-lib/aws-apigateway";

const backend = defineBackend({
    auth,
    data,
    testFunction
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