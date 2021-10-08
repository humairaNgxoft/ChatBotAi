const router = require('express').Router();
const fs = require('fs').promises
const path = require('path')
const appDir = path.dirname(require.main.filename)

router.get('/:fileName', async (req, res) => {
    const { fileName } = req.params;
    const data = await fs.readFile(`${appDir}/uploads/${fileName}`)
    res.writeHead(200, { 'Content-Type': 'image/jpeg' })
    res.end(data)
});

module.exports = router;