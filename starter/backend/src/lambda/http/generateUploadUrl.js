import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getAttachmentUrl, getPutSignedUrl } from '../../fileStorage/attachmentUtils.mjs'
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
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)

    const uploadUrl = await getPutSignedUrl(todoId)

    if(uploadUrl){
      const attachmentUrl = getAttachmentUrl(todoId)
      await businessLogicTodosInstance.updateAttachmentUrl(userId, todoId, attachmentUrl)
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl
      })
    }
  })
