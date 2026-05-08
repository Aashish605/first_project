import { DataTypes } from 'sequelize';
const SubjectModel = (sequelize) => {
  return sequelize.define('Subject', {
    subject_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    subject_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Subject',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "subject_id" },
        ]
      },
    ]
  });
};

export default SubjectModel;