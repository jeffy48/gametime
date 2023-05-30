const express = require('express');
const { check, oneOf } = require('express-validator');
const { Op } = require('sequelize');
const { requireAuth, requireOrganizerAuth } = require('../../utils/auth');
const { User, Group, Image, Venue, Event, Attendee, Member, sequelize } = require('../../db/models');
const { handleValidationErrors, handleGroupErrors, handleValidationErrorsCreateUpdateGroup } = require('../../utils/validation');
const { param } = require('express-validator');

const router = express.Router();

module.exports = router;
