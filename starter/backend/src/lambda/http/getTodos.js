import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import businessLogicTodosInstance from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const userId = getUserId(event)
    const result = await businessLogicTodosInstance.get(userId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        result
      })
    }
  })
  


