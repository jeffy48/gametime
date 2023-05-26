const { validationResult } = require('express-validator');


// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = {};
        validationErrors
            .array()
            .forEach(error => errors[error.param] = error.msg);
        console.log(validationErrors[1])
        const err = Error('Bad request.');
        err.errors = errors;
        err.status = 400;
        err.title = "Bad request.";
        next(err);
    }
    next();
};

const handleGroupErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        // const errors = {};
        // validationErrors
        //     .array()
        //     .forEach(error => errors[error.param] = error.msg);

        const err = Error("Group couldn't be found");
        // err.errors = errors;
        err.status = 404;
        next(err);
    }
    next();
};

module.exports = {
    handleValidationErrors, handleGroupErrors
  };
