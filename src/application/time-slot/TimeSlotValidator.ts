import Joi from 'joi'

export const getTimeSlotSchema = {
  query: Joi.object({
    clinicId: Joi.string().optional(),
  }),
}
