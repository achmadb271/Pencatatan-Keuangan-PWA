const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');

const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: 'Validasi gagal',
            errors: errors.array(),
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email.toLowerCase(),
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });

        // Auto create token for easy onboarding
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.status(201).json({
            success: true,
            message: 'Registrasi berhasil',
            data: {
                user,
                token,
            },
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server saat registrasi',
        });
    }
};

const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: 'Validasi gagal',
            errors: errors.array(),
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: req.body.email.toLowerCase() },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email atau password salah',
            });
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Email atau password salah',
            });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        const { password, ...safeUser } = user;

        res.status(200).json({
            success: true,
            message: 'Login berhasil',
            data: {
                user: safeUser,
                token,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server saat login',
        });
    }
};

const me = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User tidak ditemukan',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Data user berhasil diambil',
            data: user,
        });
    } catch (error) {
        console.error('Me error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server',
        });
    }
};

module.exports = { register, login, me };
