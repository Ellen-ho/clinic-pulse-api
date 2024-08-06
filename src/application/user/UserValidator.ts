import Joi from 'joi'
import { UserRoleType } from '../../domain/user/User'
import { GenderType } from '../../domain/common'

export const signUpUserSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string()
      .valid(...Object.values(UserRoleType))
      .required(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    onboardDate: Joi.date().optional(),
    gender: Joi.string()
      .valid(...Object.values(GenderType))
      .optional(),
    birthDate: Joi.date().optional(),
  }),
}

export const signInUserSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}
