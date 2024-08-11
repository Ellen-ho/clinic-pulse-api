import Joi from 'joi'

export const getPatientNameAutoCompleteSchema = {
  query: Joi.object({
    searchText: Joi.string().required(),
  }),
}
