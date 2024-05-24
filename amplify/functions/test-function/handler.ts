import {APIGatewayProxyHandlerV2} from 'aws-lambda'

export const handler = async (event: APIGatewayProxyHandlerV2) => {
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*'
        },
        body: JSON.stringify({success: true})
    }
}