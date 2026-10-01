const express = require('express');
const supabase = require('../../config/supabase');


const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { data: library } = await supabase
            .from('library')
            .select(`
                id,
                book_id,
                
            `)
    }
    catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to get library',
        });
    }
})

router.get('/:name', async (req, res) => {
    try {
        const { name } = req.params;

        const { data: library } = await supabase
            .from('library')
            .select(`
                id,
                book_id,
                
            `)
            .eq('name', name);

        if (!library) {
            return res.status(404).json({
                message: 'Library with matching name not found',
            });
        }

        res.json(library);
    }
    catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to get library',
        });
    }
})

module.exports = router;