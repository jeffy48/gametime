const express = require('express');
const { check, oneOf, body } = require('express-validator');
const { Op } = require('sequelize');
const { requireAuth, requireOrganizerAuth } = require('../../utils/auth');
const { User, Group, Image, Venue, Event, Attendee, Member, sequelize } = require('../../db/models');
const { handleValidationErrors, handleGroupErrors, handleValidationErrorsCreateUpdateGroup, handleEventErrors, handleVenueErrors } = require('../../utils/validation');
const { param } = require('express-validator');
const { requireCoHostAuth, requireCoHostAuthAttendee } = require('../../utils/auth');

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

    const newEvent = {
        id: event.dataValues.id,
        groupId: event.dataValues.groupId,
        venueId: event.dataValues.venueId,
        name: event.dataValues.name,
        type: event.dataValues.type,
        capacity: event.dataValues.capacity,
        price: event.dataValues.price,
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

    res.json(event);
});

//Get all events
router.get('/', async (req, res) => {
    const events = await Event.findAll({
        include: [{
            model: Group,
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


module.exports = router;
