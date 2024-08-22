import Joi from 'joi'

export const getNotificationDetailsSchema = {
  params: Joi.object({ id: Joi.string().uuid().required() }),
}

export const deleteNotificationSchema = {
  params: Joi.object({ id: Joi.string().uuid().required() }),
}
