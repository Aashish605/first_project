import { DataTypes } from 'sequelize'; // Use ES module import

const SchoolModel = (sequelize) => {
  return sequelize.define('School', { // Model name should be lowercase singular
    school_id: {
      type: DataTypes.STRING(50), // Assuming school_id is a string like "SCH-001"
      allowNull: false,
      unique: true, // Ensure school_id is unique
    },
    name: { // Changed to 'name' to match frontend req.body
      type: DataTypes.STRING(100),
      allowNull: false
    },
    address: { // Changed to 'address' to match frontend req.body
      type: DataTypes.STRING(255), // Use a larger string for address
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'School',
    timestamps: false, // It's good practice to have createdAt/updatedAt
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "school_id" }],
      },

    ]
  });
};

export default SchoolModel;
