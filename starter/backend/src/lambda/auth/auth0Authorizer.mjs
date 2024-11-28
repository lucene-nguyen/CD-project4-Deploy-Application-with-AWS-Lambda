import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const jwksUrl = 'https://dev-7brd6quydpm30rlu.us.auth0.com/.well-known/jwks.json'

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })

  try {
    const res = await Axios.get(jwksUrl)
    const keys = res.data.keys
    const key = keys.find((k) => k.kid === jwt.header.kid)
    if (!key) {
      logger.error('Key not found', { keyId: jwt.header.kid })
      throw new Error('Key not found')
    }
    const pem = key.x5c[0]
    const cert = `-----BEGIN CERTIFICATE-----\n${pem}\n-----END CERTIFICATE-----`

    const verifiedToken = jsonwebtoken.verify(token, cert);
    return verifiedToken
  } catch (error) {
    logger.error('Token verification failed', { error })
  }
  return undefined

}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
