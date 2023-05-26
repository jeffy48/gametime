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

const router = express.Router();

// Get all Groups
router.get('/', async (req, res) => {
    const allGroups = {Groups: []};
    const groups = await Group.findAll();
    for (let i = 0; i < groups.length; i++) {
        const group = { ...groups[i].dataValues };
        const id = group.id;
        group.numMembers = await Member.count({
            where: {
                groupId: { [Op.eq]: id }
            }
        })

        const previewImage = await Image.findOne({
            where: {
                imageableId: id,
                imageableType: "Group",
                preview: true
            }
        });
        if (previewImage) {
            group.previewImage = previewImage.dataValues.url;
        }

        allGroups.Groups.push(group);
    };
    res.json(allGroups);
});

//Get all Groups joined or organized by the Current User
router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        const { user } = req;
        console.log(user)
        const userGroup = await Group.findAll({
            where: {
                organizerId: user.id
            }
        })
        const userGroups2 = user.getGroups();
        console.log(userGroups2);
    }
);

//get details of a group from an id
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
        ]
    });
    // if (!group) {
    //     console.log(group)
    //     const err = new Error("Couldn't find a Group with the specified id");
    //         err.status = 404;
    //         err.message = "Group couldn't be found";
    //     throw err;
    // }
    // counts num of entries in Members table with matching group id and sets numMembers key to equal that
    group.dataValues.numMembers = await Member.count({
        where: {
            groupId: { [Op.eq]: id }
        }
    });
    res.json(group);
});

module.exports = router;
