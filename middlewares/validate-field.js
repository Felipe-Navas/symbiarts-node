const { response } = require('express')
const { validationResult } = require('express-validator')

const validateFields = (req, res = response, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      msg: 'Validation failed',
      errors: errors.mapped(),
    })
  } else {
    console.log('Error in validateFields: errors.isEmpty()')
    console.log(errors)
  }
  next()
}

module.exports = {
  validateFields,
}
