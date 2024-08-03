import { TimePeriodType } from 'domain/timeSlot/TimeSlot'
import Joi from 'joi'

export const getConsultationListSchema = {
  query: Joi.object({
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
    clinicId: Joi.string().optional(),
    timePeriod: Joi.string()
      .valid(...Object.values(TimePeriodType))
      .optional(),
    totalDurationMin: Joi.number().optional(),
    totalDurationMax: Joi.number().optional(),
    doctorId: Joi.string().optional(),
    patientId: Joi.string().optional(),
    limit: Joi.number().required(),
    page: Joi.number().required(),
  }),
}

export const getSingleConsultationSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
}