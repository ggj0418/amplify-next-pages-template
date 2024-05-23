import { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { env } from '$amplify/env/test-function'

export const handler = async (event: APIGatewayProxyHandlerV2) => {
  try {
    const testKey = env.NEXT_PUBLIC_TEST_KEY
    // TODO: you have to replace the uri with your own uri
    const uri = 'https://example.com?' + new URLSearchParams({
      serviceKey: testKey
    })

    const response = await fetch(uri, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    const res= await response.json()
    console.log(`uri: ${uri}`)
    console.log(`response: ${JSON.stringify(response, null, 2)}`)
    console.log(`res: ${JSON.stringify(res, null, 2)}`)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
      },
      body: JSON.stringify({ success: true })
    }
  } catch (error) {
    console.error('Error sending message:', error)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
      },
      body: JSON.stringify({ success: false })
    }
  }
}