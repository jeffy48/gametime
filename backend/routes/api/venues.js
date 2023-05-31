const express = require('express');
const { check, oneOf } = require('express-validator');
const { Op } = require('sequelize');
const { requireAuth, requireOrganizerAuth, requireCoHostAuth, requireCoHostAuthVenue } = require('../../utils/auth');
const { User, Group, Image, Venue, Event, Attendee, Member, sequelize } = require('../../db/models');
const { handleValidationErrors, handleGroupErrors, handleValidationErrorsCreateUpdateGroup, handleVenueErrors } = require('../../utils/validation');
const { param } = require('express-validator');

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
    param('venueId').custom(async value => {
        const venue = await Venue.findByPk(value);
        if (!venue) {
          throw new Error("Venue couldn't be found");
    }
    }),
    handleVenueErrors
];

const validateVenueReqBody = [
//for some reason, its making me attach .withMessage to each method instead of just chaining one .withMessage at the end for all of them.
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required')
        .isLength({ min: 4})
        .withMessage('Street address is required')
        .notEmpty()
        .withMessage('Street address is required')
        .isString()
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required')
        .isLength({ min: 1})
        .withMessage('City is required')
        .notEmpty()
        .withMessage('City is required')
        .isString()
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required')
        .isLength({ min: 2, max: 2})
        .withMessage('State is required')
        .notEmpty()
        .withMessage('State is required')
        .isString()
        .withMessage('State is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .withMessage('Latitude is not valid')
        .isDecimal()
        .withMessage('Latitude is not valid')
        .notEmpty()
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .withMessage('Latitude is not valid')
        .isDecimal()
        .withMessage('Latitude is not valid')
        .notEmpty()
        .withMessage('Longitude is not valid'),
    handleValidationErrors
];

const router  = express.Router();

//Get All Venues for a Group specified by id
router.get('/groups/:groupId', validateGroupId, requireAuth, requireCoHostAuth, async (req, res) => {
    // console.log(validateGroupId);
    const venues = await Venue.findAll({
        where: { groupId: req.params.groupId },
        attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    const groupVenues = { Venues: venues}
    res.json(groupVenues);
});

//Create a new Venue for a Group specified by its id
//working but body val errors aren't showing correct msg
router.post('/groups/:groupId', validateGroupId, validateVenueReqBody, requireAuth, requireCoHostAuth, async (req, res) => {
    const { address, city, state, lat, lng } = req.body;
    const venue = await Venue.create({ groupId: Number(req.params.groupId), address, city, state, lat, lng });
    const newVenue = {
        id: venue.dataValues.id,
        groupId: venue.dataValues.groupId,
        address: venue.dataValues.address,
        city: venue.dataValues.city,
        state: venue.dataValues.state,
        lat: venue.dataValues.lat,
        lng: venue.dataValues.lng
    }
    res.json(newVenue);
});

//Edit a Venue specified by its id
router.put('/:venueId', validateVenueId, validateVenueReqBody, requireAuth, requireCoHostAuthVenue, async (req, res, next) => {
    const { address, city, state, lat, lng } = req.body;
    const venue = await Venue.update({ address, city, state, lat, lng },
        { where: { id: req.params.venueId }}
    );
    const updatedVenue = await Venue.findByPk(req.params.venueId, {
        attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    const resVenue = {
        id: updatedVenue.dataValues.id,
        groupId: updatedVenue.dataValues.groupId,
        address: updatedVenue.dataValues.address,
        city: updatedVenue.dataValues.city,
        state: updatedVenue.dataValues.state,
        lat: parseFloat(updatedVenue.dataValues.lat),
        lng: parseFloat(updatedVenue.dataValues.lng)
    };
    res.json(resVenue);

})

module.exports = router;
