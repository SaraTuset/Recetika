import express from 'express';

const router = express.Router();

// Definir rutas
router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/', (req, res) => {
    res.render('landing');
});

export default router;