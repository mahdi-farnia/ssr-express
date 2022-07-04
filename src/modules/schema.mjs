import mongoose from 'mongoose';
import { z } from 'zod';

const MIN_USERNAME_LENGTH = 4,
  MAX_USERNAME_LENGTH = 25;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 4,
      max: 25
    },
    age: {
      type: Number,
      required: true,
      min: 1,
      max: 99
    },
    password: {
      type: String,
      required: true,
      min: 4
    }
  },
  {
    statics: {
      findByUsername(username = '') {
        return this.findOne({ username }).exec();
      }
    }
  }
);

export const User = mongoose.model('User', userSchema);

export const userRegisterSchema = z
  .object({
    username: z
      .string()
      .min(MIN_USERNAME_LENGTH, 'Username should have at least 4 characters')
      .max(MAX_USERNAME_LENGTH, 'Username should not have more than 25 characters'),
    age: z
      .string()
      .regex(/^\d\d?$/, 'Age should be a positive number')
      .transform(parseInt),
    password: z
      .string()
      .min(4, 'Password should be at least 4 characters long')
      .regex(/[a-z]/, 'Password should has at least one lowercase character')
      .regex(/[A-Z]/, 'Password should has at least one uppercase character')
      .regex(/[0-9]/, 'Password should has at least one number character'),
    passConfirm: z.string(), // NOTE don't forget to change the schema parameter to match the same key in types.d.ts
    agreement: z
      .string({
        errorMap: () => ({
          message: 'You must agree with our terms to use our services'
        })
      })
      .regex(/^on$/i, 'You must agree with our terms to use our services')
  })
  .refine(({ passConfirm, password }) => passConfirm === password, {
    path: ['passConfirm'],
    message: 'Passwords did not match'
  })
  .refine(({ age }) => age > 0, { path: ['age'], message: 'Age should be greater than 0' });
