import { defineFunction, secret } from '@aws-amplify/backend'

export const testFunction = defineFunction({
  name: 'test-function',
  timeoutSeconds: 60,
  runtime: 20,
  environment: {
    NEXT_PUBLIC_TEST_KEY: secret('NEXT_PUBLIC_TEST_KEY')
  }
})