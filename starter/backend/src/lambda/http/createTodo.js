import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import businessLogicTodosInstance from '../../businessLogic/todos.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const newTodo = JSON.parse(event.body)
    const userId = getUserId(event)

    const result = await businessLogicTodosInstance.create(userId, newTodo)

    return {
      statusCode: 201,
      body: JSON.stringify({
        result
      })
    }
  })

