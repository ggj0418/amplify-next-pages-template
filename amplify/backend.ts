import {defineBackend} from '@aws-amplify/backend';
import {auth} from './auth/resource';
import {data} from './data/resource';
import {AuthorizationType, LambdaIntegration, LambdaRestApi} from "aws-cdk-lib/aws-apigateway";
import {testFunction} from "@/amplify/functions/test-function/resource";
import {EventSourceMapping, StartingPosition} from "aws-cdk-lib/aws-lambda";
import {tableEventListenerFunction} from "@/amplify/functions/table-event-listener-function/resource";
import {Stack} from "aws-cdk-lib";
import {Effect, Policy, PolicyStatement} from "aws-cdk-lib/aws-iam";

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

const todoTable = backend.data.resources.tables["Todo"]
backend.tableEventListenerFunction.resources.lambda.role?.attachInlinePolicy(
    new Policy(
        Stack.of(todoTable),
        "DynamoDBPolicy",
        {
            statements: [
                new PolicyStatement({
                    effect: Effect.ALLOW,
                    actions: [
                        "dynamodb:DescribeStream",
                        "dynamodb:GetRecords",
                        "dynamodb:GetShardIterator",
                        "dynamodb:ListStreams",
                    ],
                    resources: ["*"],
                }),
            ],
        }
    )
);

new EventSourceMapping(
    Stack.of(todoTable),
    "test",
    {
        target: backend.tableEventListenerFunction.resources.lambda,
        eventSourceArn: todoTable.tableStreamArn,
        startingPosition: StartingPosition.LATEST,
    }
);
