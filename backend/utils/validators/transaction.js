const { body } = require('express-validator');

const validateTransaction = [
    body('title')
        .trim()
        .notEmpty().withMessage('Judul transaksi harus diisi')
        .isLength({ max: 255 }).withMessage('Judul transaksi maksimal 255 karakter'),
    body('amount')
        .notEmpty().withMessage('Nominal transaksi harus diisi')
        .isFloat({ gt: 0 }).withMessage('Nominal transaksi harus berupa angka positif'),
    body('type')
        .notEmpty().withMessage('Tipe transaksi harus diisi')
        .isIn(['INCOME', 'EXPENSE']).withMessage('Tipe transaksi hanya boleh INCOME atau EXPENSE'),
    body('category')
        .trim()
        .notEmpty().withMessage('Kategori transaksi harus diisi'),
    body('date')
        .optional()
        .isISO8601().withMessage('Format tanggal tidak valid (ISO8601)'),
];

module.exports = { validateTransaction };
