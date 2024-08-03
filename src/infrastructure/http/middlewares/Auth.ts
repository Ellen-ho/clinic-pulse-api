import { NextFunction, Request, Response } from 'express'
import passport from 'passport'

const authenticator = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  passport.authenticate('local', { session: false })(req, res, next)
}

const authenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  passport.authenticate(
    'jwt',
    { session: false },
    (err: any, user: Express.User | false | null) => {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (err || !user) {
        return res.status(401).json({ status: 'error', message: '驗證失敗！' })
      }
      req.user = user
      next()
    }
  )(req, res, next)
}

export { authenticator, authenticated }
