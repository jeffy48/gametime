const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// middleware to add user input validation on user signup requests to the backend server
const validateSignup = [
    check('firstName')
        .exists({ checkFalsy: true })
        .isLength({ min: 2 })
        .withMessage('First Name is required'),
    check('lastName')
        .exists({ checkFalsy: true })
        .isLength({ min: 2 })
        .withMessage('Last Name is required'),
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

//Sign Up a User
router.post(
    '/',
    validateSignup,
    async (req, res, next) => {
        const { firstName, lastName, username, email, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password);

        //check if email already exists (error handler: probably not the best way as each query is expensive)
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

        //check if username already exists (error handler)
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
