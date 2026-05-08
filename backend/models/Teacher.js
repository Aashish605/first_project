import { DataTypes } from 'sequelize';
const TeacherModel = (sequelize) => {
  return sequelize.define('Teacher', {
    Teacher_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    subject_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    school_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Teacher',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Teacher_id" },
        ]
      },
    ]
  });
};

export default TeacherModel;