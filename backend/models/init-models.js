import { DataTypes } from 'sequelize';
import _Student from './Student.js';
import _Subject from './Subject.js';
import _Teacher from './Teacher.js';
import _school from './school.js';

export function initModels(sequelize) {
  const Student = _Student(sequelize, DataTypes);
  const Subject = _Subject(sequelize, DataTypes);
  const Teacher = _Teacher(sequelize, DataTypes);
  const school = _school(sequelize, DataTypes);

  return {
    Student,
    Subject,
    Teacher,
    school,
  };
}

export default initModels;