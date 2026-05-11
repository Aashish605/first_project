import sequelize from '../Db/Db.js';
import initModels from '../models/init-models.js';
import { UniqueConstraintError } from 'sequelize';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const { User } = initModels(sequelize);

export const addUser = async (req, res) => {
    console.log('Adding user:', req.body)
    try {
        const { user_name, user_email, user_password, refresh_token } = req.body

        if (!user_name || !user_email || !user_password) {
            return res.status(400).json({ message: 'user_name, user_email and user_password are required' })
        }

        const accessToken = jwt.sign({ user_email }, process.env.JWT_SECRET, { expiresIn: '5m' });
        const refreshToken = jwt.sign({ user_email }, process.env.JWT_SECRET, { expiresIn: '1d' });


        const user = await User.create({
            user_name,
            user_email,
            user_password,
            refresh_token: refreshToken,
        })
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 300000, sameSite: 'strict' });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 604800000, sameSite: 'strict' });
        return res.status(201).json({
            message: 'User added successfully',
            data: {
                user_id: user.user_id,
                user_name: user.user_name,
                user_email: user.user_email,
            },
        })
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            return res.status(409).json({ message: 'User with this email already exists' })
        }
        return res.status(500).json({ message: 'Error adding user', error: error.message })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { user_email, user_password } = req.body

        if (!user_email || !user_password) {
            return res.status(400).json({ message: 'user_email and user_password are required' })
        }

        const user = await User.findOne({ where: { user_email } })
        if (!user || user.user_password !== user_password) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        const accessToken = jwt.sign({ user_email: user.user_email }, process.env.JWT_SECRET, { expiresIn: '5m' })
        const refreshToken = jwt.sign({ user_email: user.user_email }, process.env.JWT_SECRET, { expiresIn: '1d' })
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3600000, sameSite: 'strict' })
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 604800000, sameSite: 'strict' })


        await User.update({ refresh_token: refreshToken }, { where: { user_email: user.user_email } })


        return res.status(200).json({
            message: 'Login successful',
            data: {
                user_id: user.user_id,
                user_name: user.user_name,
                user_email: user.user_email,
            },
        })
    } catch (error) {
        return res.status(500).json({ message: 'Error logging in', error: error.message })
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll()
        return res.status(200).json({
            message: 'Users fetched successfully',
            data: users,
        })
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching users', error: error.message })
    }
}

export const getUser = async (req, res) => {
    try {
        const { id } = req.params
        if (isNaN(parseInt(id, 10))) {
            return res.status(400).json({ message: 'Invalid user ID provided' })
        }

        const user = await User.findByPk(parseInt(id, 10))
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        return res.status(200).json({
            message: 'User fetched successfully',
            data: user,
        })
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching user', error: error.message })
    }
}

export const updateUserInfo = async (req, res) => {
    try {
        const { id } = req.params
        const { user_name, user_email, user_password, refresh_token } = req.body

        if (isNaN(parseInt(id, 10))) {
            return res.status(400).json({ message: 'Invalid user ID provided' })
        }

        const user = await User.findByPk(parseInt(id, 10))
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        await User.update(
            { user_name, user_email, user_password, refresh_token },
            { where: { user_id: parseInt(id, 10) } }
        )

        return res.status(200).json({ message: 'User updated successfully' })
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            return res.status(409).json({ message: 'User with this email already exists' })
        }
        return res.status(500).json({ message: 'Error updating user', error: error.message })
    }
}

export const removeUser = async (req, res) => {
    try {
        const { id } = req.params
        if (isNaN(parseInt(id, 10))) {
            return res.status(400).json({ message: 'Invalid user ID provided' })
        }

        const deleted = await User.destroy({ where: { user_id: parseInt(id, 10) } })
        if (deleted === 0) {
            return res.status(404).json({ message: 'User not found' })
        }

        return res.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting user', error: error.message })
    }
}

export const logoutUser = async (req, res) => {
    try {
        const { refreshToken } = req.cookies
        if (!refreshToken) {
            return res.status(401).json({ message: 'Unauthorized' })
        }
        await User.update({ refresh_token: null }, { where: { refresh_token: refreshToken } })
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        }
        res.clearCookie('accessToken', cookieOptions)
        res.clearCookie('refreshToken', cookieOptions)
        return res.status(200).json({ message: 'Logged out successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Error logging out', error: error.message })
    }
}

export const refreshToken = async (req, res) => {
    try {
        const  token  = req.cookies.refreshToken
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        const user = await User.findOne({ where: { refresh_token: token } })
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired refresh token' })
            }

            const newAccessToken = jwt.sign({ user_email: decoded.user_email }, process.env.JWT_SECRET, { expiresIn: '5m' })
            res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 300000 })
            return res.status(200).json({ message: 'Access token refreshed' })
        })
    } catch (error) {
        return res.status(500).json({ message: 'Error refreshing token', error: error.message })
    }
}

export const getMe = async (req, res) => {
    return res.status(200).json({
        message: 'Authenticated',
        data: req.user ?? null,
    })
}


