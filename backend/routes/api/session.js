const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateLogin = [
    check('credential', 'Credential is required')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isString()
        .isLength({ min: 1, max: 100}),
    check('password', 'Password is required')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isString(),
    handleValidationErrors
];

//Get Session User API Route
router.get(
    '/',
    (req, res) => {
        const { user } = req;
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

//Log In (USE credential KEY TO LOG IN, which the value can either be email or username)
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
