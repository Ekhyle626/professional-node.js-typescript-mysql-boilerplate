import Joi from 'joi';

export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().min(1).max(100).required(),
  lastName: Joi.string().min(1).max(100).required(),
});

export const updateUserSchema = Joi.object({
  email: Joi.string().email().optional(),
  firstName: Joi.string().min(1).max(100).optional(),
  lastName: Joi.string().min(1).max(100).optional(),
}).min(1);