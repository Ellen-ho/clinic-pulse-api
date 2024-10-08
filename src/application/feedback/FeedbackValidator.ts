import { Granularity } from '../../domain/common'
import { TimePeriodType } from '../../domain/timeSlot/TimeSlot'
import Joi from 'joi'

export const getSingleFeedbackSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
}

export const getFeedbackListSchema = {
  query: Joi.object({
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
    clinicId: Joi.string().optional(),
    timePeriod: Joi.string()
      .valid(...Object.values(TimePeriodType))
      .optional(),
    doctorId: Joi.string().optional(),
    patientName: Joi.string().optional(),
    patientId: Joi.string().optional(),
    feedbackRating: Joi.number().optional(),
    limit: Joi.number().required(),
    page: Joi.number().required(),
  }),
}

export const getFeedbackCountAndRateSchema = {
  query: Joi.object({
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
    clinicId: Joi.string().optional(),
    timePeriod: Joi.string()
      .valid(...Object.values(TimePeriodType))
      .optional(),
    doctorId: Joi.string().optional(),
    granularity: Joi.string()
      .valid(...Object.values(Granularity))
      .optional(),
  }),
}
