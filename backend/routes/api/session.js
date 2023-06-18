const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// validation middleware to check and validate body of log-in post req
const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isString()
        .isLength({ min: 1, max: 100})
        .withMessage('Credential is required'),
    check('password')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isString()
        .withMessage('Password is required'),
    handleValidationErrors
];

//Get Session User API Route
router.get(
    '/',
    (req, res) => {
        const { user } = req;
        console.log(user);
        if (user) {
            const safeUser = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username
            };
            return res.json({ user: safeUser });
        } else return res.json({ user: null });
    }
);

//Log In
router.post(
    '/',
    validateLogin,
    async (req, res, next) => {
        const { credential, password } = req.body;

        const user = await User.unscoped().findOne({
            where: {
                [Op.or]: {
                    username: credential,
                    email: credential
                }
            }
        });

        if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
            const err = new Error('Invalid credentials');
            err.title = "Login failed"
            err.status = 401;
            return next(err);
        };

        const safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
        };

        await setTokenCookie(res, safeUser);

        return res.json({
            user: safeUser
        });
    }
);

//Log Out
router.delete(
    '/',
    (_req, res) => {
        res.clearCookie('token');
        return res.json({message: 'success'});
    }
);

module.exports = router;
