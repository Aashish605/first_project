import sequelize from '../Db/Db.js';
import SchoolModel from '../models/School.js';
import { UniqueConstraintError } from 'sequelize';

const School = SchoolModel(sequelize); // Initialize School model

export const addSchool = async (req, res) => { // Added async
  try {
    const { school_id, name, address } = req.body;

    if (!school_id || !name || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const school = await School.create({
      school_id,
      name,
      address,
    });

    res.status(201).json({
      message: 'School added successfully',
      data: school,
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) { // Sequelize unique constraint error
      return res.status(409).json({ message: 'School with this ID already exists' });
    }
    res.status(500).json({ message: 'Error adding school', error: error.message });
  }
};

export const getSchools = async (req, res) => {
  try {
    const schools = await School.findAll();
    res.status(200).json({
      message: 'Schools fetched successfully',
      data: schools,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching schools', error: error.message || error });
  }
};

export const getSchool = async (req, res) => {
  try {
    const { id } = req.params;
    const school = await School.findByPk(id); // Find by primary key 'id'

    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    res.status(200).json({
      message: 'School fetched successfully',
      data: school,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching school', error: error.message || error });
  }
};

export const updateSchoolInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { school_id, name, address } = req.body; // Destructure to match model fields

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'Invalid school ID provided' });
    }

    const [updatedRows] = await School.update(
      { school_id, name, address }, // Data to update
      { where: { id: parseInt(id) } } // Condition
    );

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'School not found' });
    }
    res.status(200).json({
      message: 'School updated successfully', // Sequelize update returns [affectedRows]
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating school', error: error.message });
  }
};

export const removeSchool = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'Invalid school ID provided' });
    }

    const deletedRows = await School.destroy({ where: { id: parseInt(id) } });

    if (deletedRows === 0) {
      return res.status(404).json({ message: 'School not found' });
    }
    res.status(200).json({
      message: 'School deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting school', error: error.message });
  }
};
