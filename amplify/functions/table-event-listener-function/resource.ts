import { defineFunction } from '@aws-amplify/backend'

export const tableEventListenerFunction = defineFunction({
  name: 'table-event-listener-function',
  timeoutSeconds: 300,
  runtime: 20
})