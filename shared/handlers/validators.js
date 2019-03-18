const Joi = require("joi");

//defining our validation schema
const validatorSchema = Joi.object().keys({
  email: Joi.string()
    .email({ minDomainAtoms: 2 })
    .trim()
    .required()
    .error(() => "A valid Email is required ✉️"),
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .required()
    .error(
      () => "Username is required and must be at least 3 characters long 😐"
    ),
  password: Joi.string()
    .min(5)
    .required()
    .error(
      () => "Password is required and must be at least 5 characters long ✋"
    ),
  confirmPassword: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .error(() => "Passwords do not match 👎  !=  👍")
});

exports.validateRegistration = (req, res, next) => {
  const user = req.body;
  Joi.validate(
    req.body,
    validatorSchema,
    { abortEarly: false },
    (err, result) => {
      if (err) return res.status(422).send(err);
      next();
    }
  );
};
