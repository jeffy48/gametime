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
          { through: models.Member,
            foreignKey: 'groupId',
            otherKey: 'userId'}
      );
      Group.belongsTo(
        models.User,
          { foreignKey: 'organizerId', as: "Organizer" }
      );
      Group.hasMany(
        models.Event,
          { foreignKey: 'groupId', onDelete: 'CASCADE',  hooks: true }
      );
      Group.hasMany(
        models.Venue,
          { foreignKey: 'groupId', onDelete: 'CASCADE',  hooks: true }
      );
      Group.hasMany(
        models.Image,
        { foreignKey: 'imageableId', as: "GroupImages", onDelete: 'CASCADE', hooks: true }
      );
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(2),
      allowNull: false
    },
    previewImage: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Group'
  });
  return Group;
};
