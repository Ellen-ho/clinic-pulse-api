import { GenderType } from 'domain/common'
import Joi from 'joi'

export const createDoctorSchema = {
  body: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    onboardDate: Joi.date().required(),
    resignationDate: Joi.date().optional(),
    avatar: Joi.string().optional(),
    gender: Joi.string()
      .valid(...Object.values(GenderType))
      .required(),
    birthDate: Joi.date().required(),
  }),
}
