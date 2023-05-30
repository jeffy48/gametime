const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User, Group, Member, Attendee } = require('../db/models');
const { Op } = require('sequelize');

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
    // Create the token.
    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
    };
    const token = jwt.sign(
        { data: safeUser },
        secret,
        { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );

const isProduction = process.env.NODE_ENV === "production";

    // Set the token cookie
    res.cookie('token', token, {
        maxAge: expiresIn * 1000, // maxAge in milliseconds
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && "Lax"
    });

    return token;
};

const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
        if (err) {
            return next();
        }

        try {
            const { id } = jwtPayload.data;
            req.user = await User.findByPk(id, {
                attributes: {
                    include: ['email', 'createdAt', 'updatedAt']
                }
            });
        } catch (e) {
            res.clearCookie('token');
            return next();
        }

        if (!req.user) res.clearCookie('token');

        return next();
    });
};

// If there is no current user, return an error
const requireAuth = [
    restoreUser,
    function (req, _res, next) {
    if (req.user) return next();

    const err = new Error('Authentication required');
    err.title = 'Authentication required';
    err.errors = { message: 'Authentication required' };
    err.status = 401;
    return next(err);
    }
];

const requireOrganizerAuth = async (req, _res, next) => {
    const id = req.user.id;
    const group = await Group.findOne({ where: {
        organizerId: id,
        id: req.params.groupId
    }});
    if (group) return next();

    const err = new Error('Forbidden');
    // err.title = 'Authentication required';
    err.errors = { message: 'Forbidden' };
    err.status = 403;
    return next(err);
};

const requireCoHostAuth = async (req, _res, next) => {
    const id = req.user.id;
    const group = await Member.findOne({
        where: {
            userId: id,
            groupId: req.params.groupId,
            status: { [Op.or]: ['host', 'co-host'] }
        }
    });
    if (group) return next();

    const err = new Error('Forbidden');
    // err.title = 'Authentication required';
    err.errors = { message: 'Forbidden' };
    err.status = 403;
    return next(err);
};

const requireCoHostAuthVenue = async (req, _res, next) => {
    const id = req.user.id;
    const group = await Member.findOne({
        where: {
            userId: id,
            groupId: req.params.venueId,
            status: { [Op.or]: ['host', 'co-host'] }
        }
    });
    if (group) return next();

    const err = new Error('Forbidden');
    // err.title = 'Authentication required';
    err.errors = { message: 'Forbidden' };
    err.status = 403;
    return next(err);
};

const requireCoHostAuthAttendee = async (req, _res, next) => {
    const id = req.user.id;
    const attendees = await Attendee.findOne({
        where: {
            userId: id,
            eventId: req.params.eventId,
            status: { [Op.or]: ['host', 'co-host', 'attending'] }
        }
    });
    if (attendees) return next();

    const err = new Error('Forbidden');
    // err.title = 'Authentication required';
    err.errors = { message: 'Forbidden' };
    err.status = 403;
    return next(err);
};

const requireHostOrCoHostAuth = async (req, res, next) => {
    const id = req.user.id;
    const member = await Member.findOne({
        where: {
            userId: id,
            groupId: req.params.groupId,
            status: { [Op.or]: ['host', 'co-host'] }
        }
    });
    req.memberStatus = member.dataValues.status;
    if (member) return next();

    const err = new Error('Forbidden');
    // err.title = 'Authentication required';
    err.errors = { message: 'Forbidden' };
    err.status = 403;
    return next(err);
};

module.exports = { setTokenCookie, restoreUser, requireAuth, requireOrganizerAuth, requireCoHostAuth, requireCoHostAuthVenue, requireCoHostAuthAttendee, requireHostOrCoHostAuth };
