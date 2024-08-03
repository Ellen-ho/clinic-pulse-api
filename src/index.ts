import express, { Express } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import session from 'express-session'
import passport from 'passport'

void main()

async function main(): Promise<void> {
  dotenv.config()
  const env = process.env
  const port = env.API_PORT as string

  if (env.NODE_ENV === 'test' && env.POSTGRES_DB_NAME !== 'test_db') {
    throw new Error(
      `Running test on a non 'test' db will wipe out the entire db! POSTGRES_DB_NAME is specified as '${
        env.POSTGRES_DB_NAME as string
      }'`
    )
  }

  const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }

  const app: Express = express()

  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())

  app.use(
    session({
      secret: env.SECRET_KEY as string,
      resave: false,
      saveUninitialized: true,
    })
  )

  app.use(passport.session())

  app.use(cors(corsOptions))

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
  })
}
