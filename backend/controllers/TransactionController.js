const { validationResult } = require('express-validator');
const prisma = require('../prisma/client');

// GET /api/transactions
const getTransactions = async (req, res) => {
    try {
        const { type, category, search, startDate, endDate } = req.query;

        const where = {
            userId: req.userId,
        };

        if (type && ['INCOME', 'EXPENSE'].includes(type.toUpperCase())) {
            where.type = type.toUpperCase();
        }

        if (category) {
            where.category = category;
        }

        if (search) {
            where.OR = [
                { title: { contains: search } },
                { description: { contains: search } },
            ];
        }

        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date.gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                where.date.lte = end;
            }
        }

        const transactions = await prisma.transaction.findMany({
            where,
            orderBy: {
                date: 'desc',
            },
        });

        res.status(200).json({
            success: true,
            message: 'Daftar transaksi berhasil diambil',
            data: transactions,
        });
    } catch (error) {
        console.error('getTransactions error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server saat mengambil data transaksi',
        });
    }
};

// GET /api/transactions/summary
const getSummary = async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany({
            where: { userId: req.userId },
            orderBy: { date: 'desc' },
        });

        let totalIncome = 0;
        let totalExpense = 0;
        const categoryMap = {};

        transactions.forEach((tx) => {
            const amt = Number(tx.amount);
            if (tx.type === 'INCOME') {
                totalIncome += amt;
            } else if (tx.type === 'EXPENSE') {
                totalExpense += amt;
            }

            // Category breakdown for expenses
            if (!categoryMap[tx.category]) {
                categoryMap[tx.category] = { category: tx.category, type: tx.type, total: 0, count: 0 };
            }
            categoryMap[tx.category].total += amt;
            categoryMap[tx.category].count += 1;
        });

        const totalBalance = totalIncome - totalExpense;
        const recentTransactions = transactions.slice(0, 5);

        res.status(200).json({
            success: true,
            message: 'Ringkasan transaksi berhasil dihitung',
            data: {
                totalBalance,
                totalIncome,
                totalExpense,
                totalCount: transactions.length,
                recentTransactions,
                categoryBreakdown: Object.values(categoryMap),
            },
        });
    } catch (error) {
        console.error('getSummary error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server saat menghitung ringkasan',
        });
    }
};

// GET /api/transactions/:id
const getTransactionById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const transaction = await prisma.transaction.findFirst({
            where: {
                id,
                userId: req.userId,
            },
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaksi tidak ditemukan',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Detail transaksi berhasil diambil',
            data: transaction,
        });
    } catch (error) {
        console.error('getTransactionById error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server saat mengambil detail transaksi',
        });
    }
};

// POST /api/transactions
const createTransaction = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: 'Validasi gagal',
            errors: errors.array(),
        });
    }

    try {
        const { title, amount, type, category, date, description } = req.body;

        const transaction = await prisma.transaction.create({
            data: {
                userId: req.userId,
                title,
                amount: parseFloat(amount),
                type: type.toUpperCase(),
                category,
                date: date ? new Date(date) : new Date(),
                description: description || null,
            },
        });

        res.status(201).json({
            success: true,
            message: 'Transaksi berhasil ditambahkan',
            data: transaction,
        });
    } catch (error) {
        console.error('createTransaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server saat membuat transaksi',
        });
    }
};

// PUT /api/transactions/:id
const updateTransaction = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: 'Validasi gagal',
            errors: errors.array(),
        });
    }

    try {
        const id = parseInt(req.params.id);

        const existing = await prisma.transaction.findFirst({
            where: { id, userId: req.userId },
        });

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Transaksi tidak ditemukan',
            });
        }

        const { title, amount, type, category, date, description } = req.body;

        const updated = await prisma.transaction.update({
            where: { id },
            data: {
                title,
                amount: parseFloat(amount),
                type: type.toUpperCase(),
                category,
                date: date ? new Date(date) : existing.date,
                description: description !== undefined ? description : existing.description,
            },
        });

        res.status(200).json({
            success: true,
            message: 'Transaksi berhasil diperbarui',
            data: updated,
        });
    } catch (error) {
        console.error('updateTransaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server saat memperbarui transaksi',
        });
    }
};

// DELETE /api/transactions/:id
const deleteTransaction = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const existing = await prisma.transaction.findFirst({
            where: { id, userId: req.userId },
        });

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Transaksi tidak ditemukan',
            });
        }

        await prisma.transaction.delete({
            where: { id },
        });

        res.status(200).json({
            success: true,
            message: 'Transaksi berhasil dihapus',
        });
    } catch (error) {
        console.error('deleteTransaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server saat menghapus transaksi',
        });
    }
};

module.exports = {
    getTransactions,
    getSummary,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
};
