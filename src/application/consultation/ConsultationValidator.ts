import { RoomNumberType } from 'domain/consultationRoom/ConsultationRoom'
import { Granularity } from '../../domain/common'
import { TimePeriodType } from '../../domain/timeSlot/TimeSlot'
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
    patientName: Joi.string().optional(),
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

export const getConsultationOnsiteCanceledSchema = {
  query: Joi.object({
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
    clinicId: Joi.string().optional(),
    timePeriod: Joi.string()
      .valid(...Object.values(TimePeriodType))
      .optional(),
    granularity: Joi.string()
      .valid(...Object.values(Granularity))
      .optional(),
    doctorId: Joi.string().optional(),
  }),
}

export const getConsultationBookingSchema = {
  query: Joi.object({
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
    clinicId: Joi.string().optional(),
    timePeriod: Joi.string()
      .valid(...Object.values(TimePeriodType))
      .optional(),
    granularity: Joi.string()
      .valid(...Object.values(Granularity))
      .optional(),
    doctorId: Joi.string().optional(),
  }),
}

export const getConsultationRealTimeCountSchema = {
  query: Joi.object({
    clinicId: Joi.string().optional(),
    consultationRoomNumber: Joi.string()
      .valid(...Object.values(RoomNumberType))
      .optional(),
  }),
}

export const getConsultationRealTimeListSchema = {
  query: Joi.object({
    clinicId: Joi.string().optional(),
    consultationRoomNumber: Joi.string()
      .valid(...Object.values(RoomNumberType))
      .optional(),
    limit: Joi.number().required(),
    page: Joi.number().required(),
  }),
}

export const getAverageWaitingTimeSchema = {
  query: Joi.object({
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
    clinicId: Joi.string().optional(),
    timePeriod: Joi.string()
      .valid(...Object.values(TimePeriodType))
      .optional(),
    granularity: Joi.string()
      .valid(...Object.values(Granularity))
      .optional(),
    doctorId: Joi.string().optional(),
    patientId: Joi.string().optional(),
  }),
}

export const getFirstTimeConsultationCountAndRateSchema = {
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

export const getAverageConsultationCountSchema = {
  query: Joi.object({
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
    clinicId: Joi.string().optional(),
    timePeriod: Joi.string()
      .valid(...Object.values(TimePeriodType))
      .optional(),
    granularity: Joi.string()
      .valid(...Object.values(Granularity))
      .optional(),
    doctorId: Joi.string().optional(),
  }),
}

export const getDifferentTreatmentConsultationSchema = {
  query: Joi.object({
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
    clinicId: Joi.string().optional(),
    timePeriod: Joi.string()
      .valid(...Object.values(TimePeriodType))
      .optional(),
    granularity: Joi.string()
      .valid(...Object.values(Granularity))
      .optional(),
    doctorId: Joi.string().optional(),
  }),
}

export const createConsultationSchema = {
  body: Joi.object({
    patientId: Joi.string().required(),
    // doctorId: Joi.string().required(),
    timeSlotId: Joi.string().required(),
  }),
}

export const getConsultationRealTimeSchema = {
  query: Joi.object({
    clinicId: Joi.string().optional(),
    consultationRoomNumber: Joi.string()
      .valid(...Object.values(RoomNumberType))
      .optional(),
    doctorId: Joi.string().optional(),
  }),
}
