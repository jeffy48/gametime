const express = require('express');
const { check } = require('express-validator');
const { Op } = require('sequelize');
const { requireAuth } = require('../../utils/auth');
const { User, Group, Image, Venue, Event, Attendee, Member, sequelize } = require('../../db/models');
const { handleValidationErrors, handleGroupErrors } = require('../../utils/validation');
const { param } = require('express-validator');

const validateGroupId = [
    param('groupId').custom(async value => {
        console.log('here')
        const group = await Group.findByPk(value);
        if (!group) {
          throw new Error("Group couldn't be found");
    }
    }),
    handleGroupErrors
];

//helper func
const getNumMembers = async (groupInstance) => {
    const groupObj = {Groups: []};

    for (let i = 0; i < groupInstance.length; i++) {
        const group = { ...groupInstance[i].dataValues };
        const id = group.id;
        group.numMembers = await Member.count({
            where: {
                groupId: { [Op.eq]: id }
            }
        });
        groupObj.Groups.push(group);
    };
    return groupObj;
};

const router = express.Router();

//Get all Groups joined or organized by the Current User
router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        const { user } = req;
        const groups = await user.getGroups({ joinTableAttributes: [] });
        const userGroup = await getNumMembers(groups);
        res.json(userGroup);
    }
);

//Get details of a Group from an id
router.get('/:groupId', validateGroupId, async (req, res,) => {
    const id = req.params.groupId;
    const group = await Group.findByPk(id, {
        include: [{
            model: Image,
            as: "GroupImages",
            attributes: ['id', 'url', 'preview']
            },
            {
            model: User,
            as: "Organizer",
            attributes: ['id', 'firstName', 'lastName']
            },
            {
            model: Venue,
            attributes: { exclude: ['createdAt', 'updatedAt'] }
            }
        ],
        attributes: { exclude: ['previewImage'] }
    });
    // counts num of entries in Members table with matching group id and sets numMembers key to equal that
    group.dataValues.numMembers = await Member.count({
        where: {
            groupId: { [Op.eq]: id }
        }
    });
    res.json(group);
});

//Create a Group
router.post('/', requireAuth, async (req, res) => {

})

// Get all Groups
router.get('/', async (req, res) => {
    const groups = await Group.findAll();
    const allGroups = await getNumMembers(groups);
    res.json(allGroups);
});

module.exports = router;
