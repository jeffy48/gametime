'use strict';
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Image.belongsTo(models.Group, {
        foreignKey: "imageableId",
        constraints: false
      });
      Image.belongsTo(models.Event, {
        foreignKey: "imageableId",
        constraints: false
      })
    }
  }
  Image.init({
    imageableId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    imageableType: {
      type: DataTypes.ENUM("Group", "Event"),
      allowNull: false,
      validate: {
        isIn: [["Group", "Event"]]
      }
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    preview: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};
