import { DataTypes } from 'sequelize';

const SchoolModel = (sequelize) => {
  const School = sequelize.define('School', {
    school_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    school_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    school_address: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'School',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "school_id" }],
      },
    ]
  });
  return School;
};

export default SchoolModel;