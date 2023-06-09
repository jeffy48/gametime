'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(
        models.Group,
          { through: models.Member,
            foreignKey: 'userId',
            otherKey: 'groupId'}
      );
      User.belongsToMany(
        models.Event,
          { through: models.Attendee,
            foreignKey: 'userId',
            otherKey: 'eventId'}
      );
      User.hasMany(
        models.Group,
          { foreignKey: 'organizerId', as: "Organizer", onDelete: 'CASCADE',  hooks: true }
      );
      User.hasMany(
        models.Member,
          { foreignKey: 'userId', as: 'Membership', onDelete: 'CASCADE', hooks: true}
      );
      User.hasMany(
        models.Attendee,
          { foreignKey: 'userId', as: 'Attendance', onDelete: 'CASCADE', hooks: true}
      )
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [4, 30],
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error("Cannot be an email.");
          }
        }
      }
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
      }
    }
  });
  return User;
};
