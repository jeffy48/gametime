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
    check('address', 'Street address is required')
        .exists({ checkFalsy: true })
        .isLength({ min: 4})
        .notEmpty()
        .isString(),
    check('city', 'City is required')
        .exists({ checkFalsy: true })
        .isLength({ min: 2, max: 50})
        .notEmpty()
        .isString(),
    check('state', 'State is required')
        .exists({ checkFalsy: true })
        .isLength({ min: 2, max: 2})
        .notEmpty()
        .isAlpha()
        .isString(),
    check('lat', 'Latitude is not valid')
        .exists({ checkFalsy: true })
        .isDecimal()
        .notEmpty(),
    check('lng', 'Longitude is not valid')
        .exists({ checkFalsy: true })
        .isDecimal()
        .notEmpty(),
    handleValidationErrors
];

const router  = express.Router();

//Get All Venues for a Group specified by id
router.get('/groups/:groupId', validateGroupId, requireAuth, requireCoHostAuth, async (req, res) => {
    const venues = await Venue.findAll({
        where: { groupId: req.params.groupId },
        attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    const groupVenues = { Venues: venues}
    res.json(groupVenues);
});

//Create a new Venue for a Group specified by its id
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
