import sequelize from '../Db/Db.js';
import TeacherModel from '../models/Teacher.js';
import { UniqueConstraintError } from 'sequelize';

const Teacher = TeacherModel(sequelize);

export const addTeacher = async (req, res) => { // Added async
  try {
    const { teacher_id, subject_name, school_name } = req.body;

    if (!teacher_id || !subject_name || !school_name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const teacher = await Teacher.create({
      teacher_id,
      subject_name,
      school_name,
    });

    res.status(201).json({
      message: 'Teacher added successfully',
      data: teacher,
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return res.status(409).json({ message: 'Teacher with this ID already exists' });
    }
    res.status(500).json({ message: 'Error adding teacher', error: error.message });
  }
};

export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.findAll();
    res.status(200).json({
      message: 'Teachers fetched successfully',
      data: teachers,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teachers', error: error.message });
  }
};

export const getTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findByPk(id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json({
      message: 'Teacher fetched successfully',
      data: teacher,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teacher', error: error.message });
  }
};

export const updateTeacherInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { teacher_id, subject_name, school_name } = req.body;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'Invalid teacher ID provided' });
    }

    const [updatedRows] = await Teacher.update(
      { teacher_id, subject_name, school_name },
      { where: { id: parseInt(id) } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json({
      message: 'Teacher updated successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating teacher', error: error.message });
  }
};

export const removeTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'Invalid teacher ID provided' });
    }

    const deletedRows = await Teacher.destroy({ where: { id: parseInt(id) } });

    if (deletedRows === 0) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json({
      message: 'Teacher deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting teacher', error: error.message });
  }
};
