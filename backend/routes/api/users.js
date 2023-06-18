const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// middleware to add user input validation on user signup requests to the backend server
const validateSignup = [
    check('firstName', 'First Name is required')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isString()
        .isAlpha()
        .isLength({ min: 1, max: 50 }),
    check('lastName', 'Last Name is required')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isString()
        .isAlpha()
        .isLength({ min: 1, max: 50 }),
    check('email', 'Invalid email')
        .exists({ checkFalsy: true })
        .isEmail()
        .notEmpty()
        .isString()
        .isLength({ min: 1, max: 100 }),
    check('username', 'Invalid username')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isString()
        .isLength({ min: 1, max: 50 }),
    check('username', 'Username cannot be an email')
        .not()
        .isEmail(),
    check('password', 'Password must be 6 characters or more')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isString()
        .isLength({ min: 6 }),
    handleValidationErrors
];

//Sign Up a User
router.post(
    '/',
    validateSignup,
    async (req, res, next) => {
        const { firstName, lastName, username, email, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password);

        const emailAlreadyExists = await User.findOne({
            where: { email: email}
        });
        if (emailAlreadyExists) {
            const err = new Error("User already exists");
            err.status = 500;
            err.errors = {
                email: "User with that email already exists"
            }
            return next(err);
        };
        const usernameAlreadyExists = await User.findOne({
            where: { username: username}
        });
        if (usernameAlreadyExists) {
            const err = new Error("User already exists");
            err.status = 500;
            err.errors = {
                username: "User with that username already exists"
            }
            return next(err);
        };

        const user = await User.create({ firstName, lastName, username, email, hashedPassword });
        const safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username
        };

        await setTokenCookie(res, safeUser);

        return res.json({
            user: safeUser
        });
    }
);



module.exports = router;
