import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import { ValidationError } from '../../error/ValidationError'

type ValidationTarget = 'body' | 'params' | 'query'

type IValidatorSchema = Record<string, Joi.ObjectSchema>

export const validator =
  (schemas: IValidatorSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    for (const [target, schema] of Object.entries(schemas)) {
      const { error } = schema.validate(req[target as ValidationTarget])
      if (error != null) {
        next(new ValidationError(error.details[0].message, error))
      }
    }

    next()
  }
