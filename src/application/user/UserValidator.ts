import Joi from 'joi'
import { UserRoleType } from '../../domain/user/User'
import { GenderType } from 'domain/common'

export const signUpUserSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string()
      .valid(...Object.values(UserRoleType))
      .required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    onboardDate: Joi.date().required(),
    gender: Joi.string()
      .valid(...Object.values(GenderType))
      .required(),
    birthDate: Joi.date().required(),
  }),
}

export const signInUserSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}
