import Joi from 'joi'

export const getReviewListSchema = {
  query: Joi.object({
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
    clinicId: Joi.string().optional(),
    patientName: Joi.string().optional(),
    reviewRating: Joi.number().optional(),
    limit: Joi.number().required(),
    page: Joi.number().required(),
  }),
}

export const getSingleReviewSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
}