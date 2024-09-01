import { Request, Response, NextFunction } from 'express'
import { AuthorizationError } from '../../../infrastructure/error/AuthorizationError'
import { PERMISSION } from '../../../domain/permission/Permission'

export const authorized = (requiredPermission: PERMISSION) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-expect-error
      if (req.permissions === undefined) {
        throw new AuthorizationError(
          'User not authenticated or permissions not found.'
        )
      }
      // @ts-expect-error
      if (req.permissions[requiredPermission] === undefined) {
        throw new AuthorizationError(
          `User does not have the required permission: ${requiredPermission}`
        )
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}
