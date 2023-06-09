const { validationResult } = require('express-validator');


// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = {};
        validationErrors
            .array()
            .forEach(error => {
                errors[error.path] = error.msg;
                console.log(error.msg);
            });
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
        const err = Error("Group couldn't be found");
        err.status = 404;
        next(err);
    }
    next();
};

const handleGroupImageErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const err = Error("Group Image couldn't be found");
        err.status = 404;
        next(err);
    }
    next();
};

const handleEventErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const err = Error("Event couldn't be found");
        err.status = 404;
        next(err);
    }
    next();
};

const handleVenueErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const err = Error("Venue couldn't be found");
        err.status = 404;
        next(err);
    }
    next();
};

const handleValidationErrorsCreateUpdateGroup = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = {};
        validationErrors
            .array()
            .forEach(error => {
                //this is still giving undefined for type if multiple validation errors including type are thrown
                if (errors[error.path] === 'undefined') errors.type = error.msg
                else {
                    errors[error.path] = error.msg;
                    console.log(error);
                }
            });
        const err = Error('Bad request.');
        err.errors = errors;
        err.status = 400;
        err.title = "Bad request.";
        next(err);
    }
    next();
};

module.exports = {
    handleValidationErrors, handleGroupErrors, handleValidationErrorsCreateUpdateGroup, handleEventErrors, handleVenueErrors, handleGroupImageErrors
  };
