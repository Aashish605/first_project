import { DataTypes } from 'sequelize';

const StudentModel = (sequelize) => {
  const Student = sequelize.define('Student', {
    student_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },

    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    address: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    class: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    school_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    interests: {
      type: DataTypes.JSON,
      allowNull: true
    }

  }, {
    sequelize,
    tableName: 'student',
    timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [
            { name: "student_id" },
          ]
        },]
  });

  return Student;
};

export default StudentModel;