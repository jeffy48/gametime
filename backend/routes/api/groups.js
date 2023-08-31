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
    handleGroupErrors
];

const validateImageId = [
    param('imageId').custom(async value => {
        const image = await Image.findByPk(value);
        if (!image) {
          throw new Error("Group Image couldn't be found");
    }
    }),
    handleGroupImageErrors
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
    check('name', 'Name must be 60 characters or less')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isString()
        .isLength({ min: 2, max: 60 }),
    check('about', 'About must be 50 characters or more')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isString()
        .isLength({ min: 50 }),
    check('type', "Type must be 'Online' or 'In person'")
        .notEmpty()
        .isString()
        .isIn(['Online', 'In person']),
    check('private', 'Invalid group privacy')
        .isBoolean()
        .exists({ checkFalsy: false }),
    check('city', 'City is required')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isString()
        .isLength({ min: 2, max: 50 }),
    check('state', 'State is required')
        .exists({ checkFalsy: true })
        .isLength({ min: 2, max: 2 })
        .notEmpty()
        .isString()
        .isAlpha(),
    handleValidationErrors
];

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
        group.numEvents = await Event.count({
            where: {
                groupId: { [Op.eq]: id }
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

    if (image.preview) {
        await Group.update({ previewImage: url },
            { where: { id: req.params.groupId }}
        );
    };

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
            id: req.params.imageId,
            imageableId: req.params.groupId,
            imageableType: "Group"
        }
    });

    if (!destroyed) {
        const err = new Error("Group Image couldn't be found");
        err.status = 404;
        throw err;
    };

    res.json({
        message: "Successfully deleted"
      });
});

//Delete membership to a group specified by id
router.delete('/:groupId/membership', validateBodyMember, validateGroupId, requireAuth, async (req, res) => {
    const id = req.user.id;
    const checkHost = await Group.findOne({ where: {
        organizerId: id,
        id: req.params.groupId
    }});

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
            attributes: ['id', 'groupId', 'status']
        });

        const id = updatedMember.dataValues.id;
        const resMember = {
            id,
            groupId: updatedMember.dataValues.groupId,
            memberId,
            status: updatedMember.dataValues.status
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
            attributes: ['id', 'groupId', 'status']
        });
        const id = updatedMember.dataValues.id;

        const resMember = {
            id,
            groupId: updatedMember.dataValues.groupId,
            memberId,
            status: updatedMember.dataValues.status
        };

        res.json(resMember);
    };
});

//Get all Members of a Group specified by its id
router.get('/:groupId/members', validateGroupId, async (req, res) => {
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
        const members = await Member.findAll({
            where: { userId: user.id }
        });

        const groupArr = [];
        members.forEach((member) => {
            groupArr.push(member.groupId);
        });

        const groups = await Group.findAll({ where: { id: {[Op.in]: groupArr }}});
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

    group.dataValues.numMembers = await Member.count({
        where: {
            groupId: { [Op.eq]: id },
            status: { [Op.or]: ["member", "host", "co-host"]}
        }
    });

    group.dataValues.numEvents = await Event.count({
        where: {
            groupId: { [Op.eq]: id }
        }
    });

    res.json(group);
});

//Edit a Group
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

    const groupId = group.dataValues.id;
    const member = await Member.create({
        userId,
        groupId,
        status: 'host'
    });

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
