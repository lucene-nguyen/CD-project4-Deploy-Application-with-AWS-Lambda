import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
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

    console.log("key: " + key)
    console.log("event.pathParameters: " + event.pathParameters)

    const uploadUrl = await getPutSignedUrl(key)
    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl
      })
    }
  })
