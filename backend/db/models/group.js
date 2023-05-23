'use strict';
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsToMany(
        models.User,
          { through: models.Member}
      );
      Group.belongsTo(
        models.User,
          { foreignKey: 'organizerId' }
      );
    }
  }
  Group.init({
    id: DataTypes.INTEGER,
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isAlphanumeric: true
      }
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['In person', 'Online', 'Hybrid']]
      }
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [1, 50],
        isAlphanumeric: true
      }
    },
    state: {
      type: DataTypes.STRING(2),
      allowNull: false,
      validate: {
        len: [2, 2],
        isAlpha: true
      }
    },
    previewImage: {
      type: DataTypes.STRING,
      validate: {
        isUrl: true
      }
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
