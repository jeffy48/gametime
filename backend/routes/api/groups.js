const express = require('express');
const { check, oneOf, body } = require('express-validator');
const { Op } = require('sequelize');
const { requireAuth, requireOrganizerAuth, requireCoHostAuth, requireHostOrCoHostAuth } = require('../../utils/auth');
const { User, Group, Image, Venue, Event, Attendee, Member, sequelize } = require('../../db/models');
const { handleValidationErrors, handleGroupErrors, handleValidationErrorsCreateUpdateGroup, handleGroupImageErrors } = require('../../utils/validation');
const { param } = require('express-validator');

const validateGroupId = [
    param('groupId').custom(async value => {
        const group = await Group.findByPk(value);
        if (!group) {
          throw new Error("Group couldn't be found");
    }
    }),
    handleGroupImageErrors
];

const validateImageId = [
    param('imageId').custom(async value => {
        const image = await Image.findByPk(value);
        if (!image) {
          throw new Error("Group Image couldn't be found");
    }
    }),
    handleGroupErrors
];

const validateBodyStatus = [
    body('status').custom(async value => {
        if (value === 'pending') {
          throw new Error("Cannot change a membership status to pending");
    }
    }),
    handleValidationErrors
];

const validateBodyMember = [
    body('memberId').custom(async value => {
        const member = await Member.findOne({
            where: {
                userId: value
            }
        });
        if (!member) {
            throw new Error("User couldn't be found");
        }
    }),
    handleValidationErrors
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
    check('type')
        .isIn(['Online', 'In person'])
        .withMessage("Type must be 'Online' or 'In person'"),
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
                groupId: { [Op.eq]: id },
                status: { [Op.or]: ["member", "host", "co-host"]}
            }
        });
        groupObj.Groups.push(group);
    };
    return groupObj;
};

const getMembership = async (userInstance) => {
    const userObj = {Members: []};

    for (let i = 0; i < userInstance.length; i++) {
        const user = { ...userInstance[i].dataValues };
        const id = user.id;
        user.Membership = await Member.count({
            where: {
                groupId: { [Op.eq]: id },
                status: { [Op.or]: ["member", "host", "co-host"]}
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

//Delete an Image for a Group
router.delete('/:groupId/images/:imageId', requireAuth, requireCoHostAuth, validateImageId, async (req, res) => {
    const destroyed = await Image.destroy({
        where: {
            id: req.params.imageId
        }
    });
    res.json({
        message: "Successfully deleted"
      });
});

//Delete membership to a group specified by id
router.delete('/:groupId/membership', validateBodyMember, validateGroupId, requireAuth, async (req, res) => {
    const id = req.user.id;
    //check if curr user is host of group
    const checkHost = await Group.findOne({ where: {
        organizerId: id,
        id: req.params.groupId
    }});
    //if curr user isn't host and isn't deleting their own id from group
    if (!checkHost && req.body.memberId !== id) {
        const err = new Error('Forbidden');
        err.errors = { message: 'Forbidden' };
        err.status = 403;
        throw err;
    };

    const checkMembership = await Member.findOne({
        where: {
            userId: req.body.memberId,
            groupId: req.params.groupId
        }
    });
    if (!checkMembership) {
        const err = new Error('Membership between the user and the group does not exist');
        err.status = 404;
        throw err;
    };

    const destroyed = await Member.destroy({
        where: {
            userId: req.body.memberId,
            groupId: req.params.groupId
        }
    });
    res.send({message: 'Successfully deleted membership from group'});
});

//Request a Membership for a Group based on the Group's id
router.post('/:groupId/membership', validateGroupId, requireAuth, async (req, res) => {
    const memberAlreadyPending = await Member.findOne({
        where: {
            userId: req.user.id,
            groupId: req.params.groupId,
            status: 'pending'
        }
    });
    if (memberAlreadyPending) {
        const err = new Error('Membership has already been requested');
        err.status = 400;
        throw err;
    };

    const memberAlreadyExists = await Member.findOne({
        where: {
            userId: req.user.id,
            groupId: req.params.groupId,
            status: { [Op.or]: ["member", "host", "co-host"]}
        }
    });
    if (memberAlreadyExists) {
        const err = new Error('User is already a member of the group');
        err.status = 400;
        throw err;
    };

    const member = await Member.create({
        userId: req.user.id,
        groupId: req.params.groupId,
        status: 'pending'
    });
    const newMember = {
        memberId: req.user.id,
        status: 'pending'
    };
    res.json(newMember);
});

//Change the status of a membership for a group specified by id
router.put('/:groupId/membership', validateGroupId, validateBodyMember, validateBodyStatus, requireAuth, requireHostOrCoHostAuth, async (req, res) => {
    const { memberId, status } = req.body;

    const checkMembership = await Member.findOne({
        where: {
            userId: memberId,
            groupId: req.params.groupId
        }
    });
    if (!checkMembership) {
        const err = new Error('Membership between the user and the group does not exist');
        err.status = 404;
        throw err;
    };

    if (status === 'host') {
        const err = new Error('Cannot change the host');
        err.status = 400;
        throw err;
    }

    if (req.memberStatus === 'co-host') {
        if (status !== 'member') {
            const err = new Error('Forbidden');
            err.errors = { message: 'Forbidden' };
            err.status = 403;
            throw err;
        };

        const member = await Member.update({
            status
        },
        {
            where: {
                userId: memberId,
                groupId: req.params.groupId
            }
        });
        const updatedMember = await Member.findOne({
            where: {
                userId: memberId,
                groupId: req.params.groupId
            },
            attributes: ['id']
        });
        const id = updatedMember.dataValues.id;
        const resMember = {
            id,
            groupId: req.params.groupId,
            memberId
        };
        res.json(resMember);
    }
    else {
        const member = await Member.update({
            status
        },
        {
            where: {
                userId: memberId,
                groupId: req.params.groupId
            }
        });
        const updatedMember = await Member.findOne({
            where: {
                userId: memberId,
                groupId: req.params.groupId
            },
            attributes: ['id']
        });
        const id = updatedMember.dataValues.id;
        const resMember = {
            id,
            groupId: req.params.groupId,
            memberId
        };
        res.json(resMember);
    };
});

//Get all Members of a Group specified by its id
router.get('/:groupId/members', validateGroupId, async (req, res) => {
    //if you are the host or co-host of the group
    const id = req.user.id;
    const hostOrCoHost = await Member.findOne({
        where: {
            userId: id,
            groupId: req.params.groupId,
            status: { [Op.or]: ['host', 'co-host'] }
        }
    });
    if (hostOrCoHost) {
        const members = await Member.findAll({
            where: {
                groupId: req.params.groupId
            }
        });
        const memberArr = [];
        members.forEach((member) => {
            memberArr.push(member.userId);
        });
        const users = await User.findAll({
            where: {
                id: { [Op.in]: memberArr }
            },
            attributes: {
                exclude: ['username']
            },
            include: {
                model: Member,
                as: 'Membership',
                where: {
                    groupId: req.params.groupId
                },
                attributes: ['status']
            }
        });
        const resMembers = {Members: users};
        resMembers.Members.forEach(member => {
            const status = member.dataValues.Membership[0].dataValues.status;
            member.dataValues.Membership = {status};
        });
        res.json(resMembers);
    } else {
        const members = await Member.findAll({
            where: {
                groupId: req.params.groupId,
                status: { [Op.or]: ['co-host', 'member', 'host']}
            }
        });
        const memberArr = [];
        members.forEach((member) => {
            memberArr.push(member.userId);
        });
        const users = await User.findAll({
            where: {
                id: { [Op.in]: memberArr }
            },
            attributes: {
                exclude: ['username']
            },
            include: {
                model: Member,
                as: 'Membership',
                where: {
                    groupId: req.params.groupId
                },
                attributes: ['status']
            }
        });
        const resMembers = {Members: users};
        resMembers.Members.forEach(member => {
            const status = member.dataValues.Membership[0].dataValues.status;
            member.dataValues.Membership = {status};
        });
        res.json(resMembers);
    };
});

//Get all Groups joined or organized by the Current User
router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        const { user } = req;
        console.log(user.id)
        console.log('here')
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
            groupId: { [Op.eq]: id },
            status: { [Op.or]: ["member", "host", "co-host"]}
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
    console.log(group);
    const resGroup = {
        id: group.dataValues.id,
        organizerId: group.dataValues.organizerId,
        name: group.dataValues.name,
        about: group.dataValues.about,
        type: group.dataValues.type,
        private: group.dataValues.private,
        city: group.dataValues.city,
        state: group.dataValues.state,
        createdAt: group.dataValues.createdAt,
        updatedAt: group.dataValues.updatedAt
    };
    res.status = 201;
    res.json(resGroup);
});

// Get all Groups
router.get('/', async (req, res) => {
    const groups = await Group.findAll();
    const allGroups = await getNumMembers(groups);
    res.json(allGroups);
});

module.exports = router;
