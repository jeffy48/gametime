const express = require('express');
const { check, oneOf, body, query } = require('express-validator');
const { Op } = require('sequelize');
const { requireAuth, requireOrganizerAuth } = require('../../utils/auth');
const { User, Group, Image, Venue, Event, Attendee, Member, sequelize } = require('../../db/models');
const { handleValidationErrors, handleGroupErrors, handleValidationErrorsCreateUpdateGroup, handleEventErrors, handleVenueErrors } = require('../../utils/validation');
const { param } = require('express-validator');
const { requireCoHostAuth, requireCoHostAuthAttendee, requireCoHostAuthEvent } = require('../../utils/auth');

//helper func
const getNumAttending = async (eventInstance) => {
    const eventObj = {Events: []};

    for (let i = 0; i < eventInstance.length; i++) {
        const event = { ...eventInstance[i].dataValues };
        const id = event.id;
        event.numAttending = await Attendee.count({
            where: {
                eventId: { [Op.eq]: id },
                status: { [Op.or]: ["attending", "co-host", "host"] }
            }
        });
        eventObj.Events.push(event);
    };
    return eventObj;
};

const validateGroupId = [
    param('groupId').custom(async value => {
        const group = await Group.findByPk(value);
        if (!group) {
          throw new Error("Group couldn't be found");
    }
    }),
    handleGroupErrors
];

const validateVenueId = [
    body('venueId').custom(async value => {
        const venue = await Venue.findByPk(value);
        if (!venue) {
          throw new Error("Venue couldn't be found");
    }
    }),
    handleVenueErrors
];

const validateEventId = [
    param('eventId').custom(async value => {
        const event = await Event.findByPk(value);
        if (!event) {
          throw new Error("Event couldn't be found");
    }
    }),
    handleEventErrors
];

const validateBodyStatus = [
    body('status').custom(async value => {
        if (value === 'pending') {
          throw new Error("Cannot change a membership status to pending");
    }
    }),
    handleValidationErrors
];

const validateEventBody = [
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ min: 5 })
        .withMessage('Name must be at least 5 characters'),
    check('type')
        .isIn(['Online', 'In person'])
        .withMessage("Type must be 'Online' or 'In person'"),
    check('capacity')
        .exists({ checkFalsy: false })
        .isInt()
        .withMessage('Capacity must be an integer'),
    check('price')
        .exists({ checkFalsy: true })
        .isDecimal()
        .withMessage('Price is invalid'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('startDate')
        .exists({ checkFalsy: true })
        .isAfter()
        .withMessage('Start date must be in the future'),
    body('endDate')
        .exists({ checkFalsy: true })
        .custom((value, { req }) => {
            console.log(req.body.startDate, "HELLO", value)
            if (new Date(req.body.startDate) >= new Date(value)) {
                throw new Error('End date is less than the start date')
            } else {
                return true;
            }
        }),
    handleValidationErrors
];

const router = express.Router();

//Add an Image to a Event based on the Event's id
router.post('/:eventId/images', validateEventId, requireAuth, requireAuth, requireCoHostAuthAttendee, async (req, res) => {
    const { url, preview } = req.body;
    const image = await Image.create({
        imageableId: req.params.eventId,
        imageableType: "Event",
        url,
        preview
    });
    const eventImage = {
        id: image.id,
        url: image.url,
        preview: image.preview
    }
    res.json(eventImage);
});

//Delete an Image for an Event
router.delete('/:eventId/images/:imageId', requireAuth, requireCoHostAuthEvent, async (req, res) => {
    const destroyed = await Image.destroy({
        where: {
            id: req.params.imageId
        }
    });
    if (!destroyed) {
        const err = new Error("Event Image couldn't be found");
        err.status = 404;
        throw err;
    };
    res.json({
        message: "Successfully deleted"
      });
});

//Delete attendance to an event specified by id
router.delete('/:eventId/attendees', validateEventId, requireAuth, async (req, res) => {
    const id = req.user.id;
    const event = await Event.findOne({
        where: {
            id: req.params.eventId
        }
    });
    const groupId = event.dataValues.groupId;
    //check if curr user is host of group
    const checkHost = await Group.findOne({ where: {
        organizerId: id,
        id: groupId
    }});
    //if curr user isn't host and isn't deleting their own id from group
    if (!checkHost && req.body.userId !== id) {
        const err = new Error('Only the User or organizer may delete an Attendance');
        err.status = 403;
        throw err;
    };

    const destroyed = await Attendee.destroy({
        where: {
            userId: req.body.userId,
            eventId: req.params.eventId
        }
    });
    console.log(destroyed)
    if (!destroyed) {
        const err = new Error('Attendance does not exist for this User');
        err.status = 404;
        throw err;
    }
    res.json({message: 'Successfully deleted attendance from event'});
});

//Change the status of an attendance for an event specified by id
router.put('/:eventId/attendees', validateEventId, validateBodyStatus, requireAuth, async (req, res) => {
    const id = req.user.id;
    const event = await Event.findOne({
        where: {
            id: req.params.eventId
        }
    });
    const groupId = event.dataValues.groupId;
    const hostOrCoHost = await Member.findOne({
        where: {
            userId: id,
            groupId,
            status: { [Op.or]: ['host', 'co-host'] }
        }
    });
    if (!hostOrCoHost) {
        const err = new Error('Forbidden');
        err.errors = { message: 'Forbidden' };
        err.status = 403;
        throw err;
    };

    const { userId, status } = req.body;
    const checkAttendee = await Attendee.findOne({
        where: {
            userId,
            eventId: req.params.eventId
        }
    });
    if (!checkAttendee) {
        const err = new Error('Attendance between the user and the event does not exist');
        err.status = 404;
        throw err;
    };

    const attendee = await Attendee.update({
        status
    },{
        where: {
            userId,
            eventId: req.params.eventId
        }
    });
    const updatedAttendee = await Attendee.findOne({
        where: {
            userId,
            eventId: req.params.eventId
        }
    });

    const resAttendee = {
        id: updatedAttendee.dataValues.id,
        eventId: req.params.eventId,
        userId,
        status: updatedAttendee.dataValues.status
    };
    res.json(resAttendee);
});

//Get all Attendees of an Event specified by its id
router.get('/:eventId/attendees', validateEventId, async (req, res) => {
    const id = req.user.id;
    const event = await Event.findOne({
        where: {
            id: req.params.eventId
        }
    });
    const groupId = event.dataValues.groupId;

    const hostOrCoHost = await Member.findOne({
        where: {
            userId: id,
            groupId,
            status: { [Op.or]: ['host', 'co-host'] }
        }
    });
    if (hostOrCoHost) {
        const attendees = await Attendee.findAll({
            where: {
                eventId: req.params.eventId
            }
        });
        const attendeeArr = [];
        attendees.forEach((attendee) => {
            attendeeArr.push(attendee.userId);
        });
        const users = await User.findAll({
            where: {
                id: { [Op.in]: attendeeArr }
            },
            attributes: {
                exclude: ['username']
            },
            include: {
                model: Attendee,
                as: 'Attendance',
                where: {
                    eventId: req.params.eventId
                },
                attributes: ['status']
            }
        });
        const resAttendees = {Attendees: users};
        resAttendees.Attendees.forEach(attendee => {
            const status = attendee.dataValues.Attendance[0].dataValues.status;
            attendee.dataValues.Attendance = {status};
        });
        res.json(resAttendees);
    } else {
        const attendees = await Attendee.findAll({
            where: {
                eventId: req.params.eventId,
                status: { [Op.or]: ['co-host', 'attending', 'host', 'waitlist']}
            }
        });
        const attendeeArr = [];
        attendees.forEach((attendee) => {
            attendeeArr.push(attendee.userId);
        });
        const users = await User.findAll({
            where: {
                id: { [Op.in]: attendeeArr }
            },
            attributes: {
                exclude: ['username']
            },
            include: {
                model: Attendee,
                as: 'Attendance',
                where: {
                    eventId: req.params.eventId
                },
                attributes: ['status']
            }
        });
        const resAttendees = {Attendees: users};
        resAttendees.Attendees.forEach(attendee => {
            const status = attendee.dataValues.Attendance[0].dataValues.status;
            attendee.dataValues.Attendance = {status};
        });
        res.json(resAttendees);
    };
});

//Request to Attend an Event based on the Event's id
router.post('/:eventId/join', validateEventId, requireAuth, async (req, res) => {
    const id = req.user.id;
    const checkEvent = await Event.findOne({
        where: {
            eventId: req.params.eventId,
        }
    });
    const groupId = checkEvent.dataValues.groupId;
    const checkMember = await Member.findOne({
        where: {
            userId: id,
            groupId
        }
    });
    if (!checkMember) {
        const err = new Error('Forbidden');
        err.errors = { message: 'Forbidden' };
        err.status = 403;
        throw err;
    };
    const checkAttendance = await Attendee.findOne({
        where: {
            userId: id,
            eventId: req.params.eventId
        }
    });
    if (checkAttendance && checkAttendance.dataValues.status === 'pending') {
        const err = new Error('Attendance has already been requested');
        err.status = 400;
        throw err;
    }
    else if (checkAttendance) {
        const err = new Error('User is already an attendee of the event');
        err.status = 400;
        throw err;
    }
    else {
        await Attendee.create({
            userId: id,
            eventId: req.params.eventId,
            status: 'pending'
        });
        const newAttendee = {
            userId: id,
            status: 'pending'
        };
        res.json(newAttendee);
    };
});

//Create an Event for a Group specified by its id
router.post('/groups/:groupId', validateGroupId, validateEventBody, requireAuth, requireCoHostAuth, async (req, res) => {
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

    //venueId body val error handler
    const venueExists = await Venue.findOne({
        where: {
            groupId: req.params.groupId,
            id: venueId
        }
    });
    if (!venueExists) {
        const err = new Error('Bad Request');
        err.title = 'Bad Request';
        err.errors = {venueId: "Venue does not exist"};
        throw err;
    };
    // if (new Date(startDate) >= new Date(endDate)) {
    //     const err = new Error('Bad Request');
    //     err.title = 'Bad Request';
    //     err.errors = {endDate: 'End date is less than start date'};
    //     throw err;
    // }

    const event = await Event.create({
        groupId: req.params.groupId, venueId, name, type, capacity, price, description, startDate, endDate
    });

    const attendee = await Attendee.create({
        userId: req.user.id,
        eventId: event.dataValues.id,
        status: 'host'
    });

    const newEvent = {
        id: event.dataValues.id,
        groupId: event.dataValues.groupId,
        venueId: event.dataValues.venueId,
        name: event.dataValues.name,
        type: event.dataValues.type,
        capacity: event.dataValues.capacity,
        price: parseFloat(event.dataValues.price),
        description: event.dataValues.description,
        startDate: event.dataValues.startDate,
        endDate: event.dataValues.endDate
    };

    res.json(newEvent);
});

//Get all Events of a Group specified by its id
router.get('/groups/:groupId', validateGroupId, async (req, res) => {
    const events = await Event.findAll({
        where: { groupId: req.params.groupId },
        include: [{
            model: Group,
            // as: "GroupImages",
            attributes: ['id', 'name', 'city', 'state']
            },
            {
            model: Venue,
            attributes: ['id', 'city', 'state']
            }
        ],
        attributes: { exclude: ['createdAt', 'updatedAt', 'capacity', 'price', 'description'] }
    });
    const allEvents = await getNumAttending(events)
    res.json(allEvents);
});

//Edit an Event specified by its id
router.put('/:eventId', validateEventId, validateVenueId, requireAuth, async (req, res) => {
    //check authorization
    const checkEvent = await Event.findOne({ where: { id: req.params.eventId }});
    const groupId = checkEvent.dataValues.groupId;
    const checkMemberStatus = await Member.findOne({
        where: {
            userId: req.user.id,
            groupId,
            status: { [Op.or]: ['host', 'co-host']}
        }
    });
    if (!checkMemberStatus) {
        const err = new Error('Forbidden');
        err.errors = { message: 'Forbidden' };
        err.status = 403;
        throw err;
    };

    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
    const event = await Event.update({ venueId, name, type, capacity, price, description, startDate, endDate },
        { where: { id: req.params.eventId }}
        );
    const updatedEvent = await Event.findByPk(req.params.eventId, {
        attributes: { exclude: ['description', 'previewImage', 'createdAt', 'updatedAt'] }
    })
    updatedEvent.dataValues.price = parseFloat(updatedEvent.dataValues.price);
    res.json(updatedEvent);
});

//Delete an Event specified by its id
router.delete('/:eventId', validateEventId, requireAuth, async (req, res) => {
    //check auth
    const checkEvent = await Event.findOne({ where: { id: req.params.eventId }});
    const groupId = checkEvent.dataValues.groupId;
    const checkMemberStatus = await Member.findOne({
        where: {
            userId: req.user.id,
            groupId,
            status: { [Op.or]: ['host', 'co-host']}
        }
    });
    if (!checkMemberStatus) {
        const err = new Error('Forbidden');
        err.errors = { message: 'Forbidden' };
        err.status = 403;
        throw err;
    };

    await Event.destroy({
        where: {
            id: req.params.eventId
        }
    });
    res.send({ message: "Successfully deleted"});
});

//Get details of an Event specified by its id
router.get('/:eventId', validateEventId, async (req, res) => {
    const event = await Event.findOne({
        where: { id: req.params.eventId },
        include: [{
            model: Group,
            attributes: ['id', 'name','private', 'city', 'state']
            },
            {
            model: Venue,
            attributes: ['id', 'address', 'city', 'state', 'lat', 'lng']
            },
            {
            model: Image,
            as: "EventImages",
            attributes: ['id', 'url', 'preview']
            }
        ],
        attributes: { exclude: ['createdAt', 'updatedAt', 'previewImage'] }
    });

    event.dataValues.numAttending = await Attendee.count({
        where: {
            eventId: { [Op.eq]: req.params.eventId },
            status: { [Op.or]: ["attending", "co-host", "host"] }
        }
    });
    event.dataValues.price = parseFloat(event.dataValues.price);
    res.json(event);
});

//Get all events
router.get('/', query('startDate').isDate(), async (req, res, next) => {
    let { page, size, name, type, startDate } = req.query;
    console.log(page, size, name, type, startDate);
    page = parseInt(page);
    size = parseInt(size);
    if (Number.isNaN(page)) {
        page = 1;
    }
    if (Number.isNaN(size)) {
        size = 20
    }
    console.log(page, size)

    const errors = {};

    if ( page < 1 || page > 10 ) {
        errors.page = 'Page must be greater than or equal to 1';
    };

    if (size < 1 || size > 20) {
        errors.size = 'Size must be greater than or equal to 1';
    };
    if (name && typeof name !== 'string') {
        errors.name = "Name must be a string";
    };
    console.log(type);
    if (type && (type.toString() !== 'Online' && type.toString() !== 'In Person')) {
        errors.type = "Type must be 'Online' or 'In Person'";
    };

    if (Object.keys(errors).length > 0) {
        const err = new Error('Bad Request');
        err.status = 400;
        err.errors = errors;
        return next(err);
    };

    const query = {};
    if (name) {
        query.name = name;
    };
    if (type) {
        query.type = type;
    };
    if (startDate) {
        query.startDate = startDate;
    };

    const events = await Event.findAll({
        where: query,
        include: [{
            model: Group,
            attributes: ['id', 'name', 'city', 'state']
            },
            {
            model: Venue,
            attributes: ['id', 'city', 'state']
            }
        ],
        attributes: { exclude: ['createdAt', 'updatedAt', 'capacity', 'price', 'description'] },
        offset: (page - 1) * size,
        limit: size
    });

    const allEvents = await getNumAttending(events)
    res.json(allEvents);
});


module.exports = router;
