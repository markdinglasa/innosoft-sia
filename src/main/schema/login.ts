import Joi from 'joi'

export const loginSchema = Joi.object({
  UserName: Joi.string().required(),
  Password: Joi.string().required()
})
