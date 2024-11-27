import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import businessLogicTodosInstance, { createTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId
    const updatedTodo = JSON.parse(event.body)
    const userId = getUserId(event)

    const isTodoExisted = businessLogicTodosInstance.getByTodoId(userId, todoId)
    if (!isTodoExisted) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Todo not found"
        })
      }
    }
    
    const result = await businessLogicTodosInstance.update(userId, todoId, updatedTodo)
    return {
      statusCode: 200,
      body: JSON.stringify({
        result
      })
    }
  })
