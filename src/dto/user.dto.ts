import Joi from 'joi';

export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().min(1).max(201).optional(),
  firstName: Joi.string().min(1).max(100).optional(),
  lastName: Joi.string().min(1).max(100).optional(),
  age: Joi.number().integer().min(0).optional(),
}).custom((value, helpers) => {
  if (value.name) {
    return value;
  }
  if (!value.firstName || !value.lastName) {
    return helpers.error('object.missing', {
      peers: ['name', 'firstName and lastName'],
    });
  }
  return value;
});

export const updateUserSchema = Joi.object({
  email: Joi.string().email().optional(),
  firstName: Joi.string().min(1).max(100).optional(),
  lastName: Joi.string().min(1).max(100).optional(),
}).min(1);