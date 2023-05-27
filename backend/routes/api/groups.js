const express = require('express');
const { check, oneOf } = require('express-validator');
const { Op } = require('sequelize');
const { requireAuth, requireOrganizerAuth } = require('../../utils/auth');
const { User, Group, Image, Venue, Event, Attendee, Member, sequelize } = require('../../db/models');
const { handleValidationErrors, handleGroupErrors, handleValidationErrorsCreateUpdateGroup } = require('../../utils/validation');
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

const validateCreateUpdate = [
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ min: 2, max: 60 })
        .withMessage('Name must be 60 characters or less'),
    check('about')
        .exists({ checkFalsy: true })
        .isLength({ min: 50 })
        .withMessage('About must be 50 characters or more'),
    oneOf([
        check('type').equals('Online'),
        check('type').equals('In person'),
        ], { message: "Type must be 'Online' or 'In person'"}),
    check('private')
        .exists({ checkFalsy: false })
        .isBoolean()
        .withMessage('Private must be a boolean'),
    check('city')
        .exists({ checkFalsy: true })
        .isLength({ min: 2, max: 50 })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .isLength({ min: 2, max: 2 })
        .withMessage('State is required'),
    handleValidationErrorsCreateUpdateGroup
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

//Add an image to a Group based on the Group's id
router.post('/:groupId/images', validateGroupId, requireAuth, requireOrganizerAuth, async (req, res) => {
    const { url, preview }= req.body;
    const image = await Image.create({
        imageableId: req.params.groupId,
        imageableType: "Group",
        url,
        preview
    });

    const groupImage = {
        id: image.id,
        url: image.url,
        preview: image.preview
    }
    res.json(groupImage);
});

//Get all Groups joined or organized by the Current User
router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        const { user } = req;
        const members = await Member.findAll({
            where: { userId: user.id }
        });
        const groupArr = [];
        members.forEach((member) => {
            groupArr.push(member.groupId);
        });
        console.log(groupArr);
        // console.log(groups);
        const groups = await Group.findAll({ where: { id: {[Op.in]: groupArr }}});
        console.log(groups);
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

//Edit a Group
//as of now, code doesnt update dynamically (requires client to pass in all required columns. make it better by allowing client to update what they choose to update)
router.put('/:groupId', validateGroupId, validateCreateUpdate, requireAuth, requireOrganizerAuth, async (req, res) => {
    const { name, about, type, private, city, state } = req.body;
    const group = await Group.update({ name, about, type, private, city, state },
        { where: { id: req.params.groupId }}
    );
    const updatedGroup = await Group.findByPk(req.params.groupId, {
        attributes: { exclude: ['previewImage'] }
    });
    res.json(updatedGroup);
});

//Delete a Group
router.delete('/:groupId', validateGroupId, requireAuth, requireOrganizerAuth, async (req, res) => {
    await Group.destroy({ where: { id: req.params.groupId }});
    res.send({ message: "Successfully deleted"});
});

//Create a Group
router.post('/', requireAuth, validateCreateUpdate, async (req, res) => {
    const { name, about, type, private, city, state } = req.body;
    const { user } = req;
    const userId = user.id;

    const group = await Group.create({ organizerId: userId, name, about, type, private, city, state});
    res.json(group);
});

// Get all Groups
router.get('/', async (req, res) => {
    const groups = await Group.findAll();
    const allGroups = await getNumMembers(groups);
    res.json(allGroups);
});

module.exports = router;
