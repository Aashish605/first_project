import sequelize from '../Db/Db.js';
import StudentModel from '../models/Student.js';
import { UniqueConstraintError } from 'sequelize'; // Import UniqueConstraintError

const Student = StudentModel(sequelize);

export const addStudent = async (req, res) => {
  console.log(req.body);
  
  try { // Added student_id to req.body destructuring
    const { firstname, lastname, address, class: className, subject, school } = req.body;

    if (!firstname || !lastname || !address || !className || !subject || !school) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const student = await Student.create({
      firstname:firstname,
      lastname:lastname,
      address: address,
      class: className,
      subject: subject,
      school: school
    });

    res.status(201).json({
      message: 'Student added successfully',
      data: student,
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return res.status(409).json({ message: 'Student with this ID already exists' });
    }
    res.status(500).json({ message: 'Error adding student', error: error.message });
  }
};

export const getStudents = async (req, res) => {
  try {
    const students = await Student.findAll();
    res.status(200).json({
      message: 'Students fetched successfully',
      data: students,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
};

export const getStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student', error: error.message });
  }
};

export const updateStudentInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'Invalid student ID provided' });
    }

    const [updated] = await Student.update({
      student_id: updateData.student_id,
      firstname: updateData.firstname,
      lastname: updateData.lastname,
      address: updateData.address,
      class: updateData.class,
      subject: updateData.subject,
      school: updateData.school
    }, { // Use 'id' as the primary key
      where: { id: parseInt(id) }
    });

    if (updated === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({
      message: 'Student updated successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating student', error: error.message });
  }
};

export const removeStudent = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'Invalid student ID provided' });
    }
    const deleted = await Student.destroy({ where: { id: parseInt(id) } }); // Use 'id' as the primary key
    
    if (deleted === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({
      message: 'Student deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error: error.message });
  }
};
