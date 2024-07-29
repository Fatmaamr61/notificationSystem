import joi from "joi";

// register
export const registerSchema = joi
  .object({
    userName: joi.string().min(3).max(20).required(),
    email: joi
      .string()
      .email({
        minDomainSegments: 2,
        maxDomainSegments: 3,
        tlds: { allow: ["com", "net", "edu", "org"] },
      })
      .required(),
    password: joi.string().required(),
    cPassword: joi.string().valid(joi.ref("password")).required(),
  })
  .required();

// activate account
export const activateSchema = joi
  .object({
    activationCode: joi.string().required(),
  })
  .required();

// login
export const loginSchema = joi
  .object({
    email: joi
      .string()
      .email({
        minDomainSegments: 2,
        maxDomainSegments: 3,
        tlds: { allow: ["com", "net", "edu", "org"] },
      })
      .required(),
    password: joi.string().required(),
  })
  .required();
