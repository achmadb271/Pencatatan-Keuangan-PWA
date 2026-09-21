const { body } = require('express-validator');
const prisma = require('../../prisma/client');

const validateRegister = [
    body('name')
        .trim()
        .notEmpty().withMessage('Nama harus diisi'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email harus diisi')
        .isEmail().withMessage('Format email tidak valid')
        .custom(async (value) => {
            if (!value) return true;
            const existingUser = await prisma.user.findUnique({
                where: { email: value.toLowerCase() }
            });
            if (existingUser) {
                throw new Error('Email sudah terdaftar');
            }
            return true;
        }),
    body('password')
        .isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
];

const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email harus diisi')
        .isEmail().withMessage('Format email tidak valid'),
    body('password')
        .notEmpty().withMessage('Password harus diisi'),
];

module.exports = { validateRegister, validateLogin };
