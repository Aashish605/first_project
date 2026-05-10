import { DataTypes } from "sequelize";
import _School from "./School.js";   
import _Student from "./Student.js";
import _Subject from "./Subject.js";
import _Teacher from "./Teacher.js";

export default function initModels(sequelize) {
  const School = _School(sequelize, DataTypes);
  const Student = _Student(sequelize, DataTypes);
  const Subject = _Subject(sequelize, DataTypes);
  const Teacher = _Teacher(sequelize, DataTypes);

  // student & school 
  Student.belongsTo(School, { foreignKey: "school_id" , as: "school" });
  School.hasMany(Student, { foreignKey: "school_id" , as: "students" });

  // teacher & school
  Teacher.belongsTo(School, { foreignKey: "school_id", as: "workplace" });
  School.hasMany(Teacher, { foreignKey: "school_id", as: "staff" });

  // teacher & subject
  Teacher.belongsTo(Subject, { foreignKey: "subject_id", as: "specialty" });
  Subject.hasMany(Teacher, { foreignKey: "subject_id", as: "teachers" });

  // student & subject (many-to-many)
  Student.belongsToMany(Subject, { through: "student_subjects", foreignKey: "student_id" , as: "enrolledSubjects" });
  Subject.belongsToMany(Student, { through: "student_subjects", foreignKey: "subject_id" , as: "enrolledStudents" });

  return {
    School,
    Student,
    Subject,
    Teacher,
  };
}