import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'
import { getPutSignedUrl } from '../../fileStorage/attachmentUtils.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const key = event.pathParameters.key

    const uploadUrl = await getPutSignedUrl(key)
    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl
      })
    }
  })
