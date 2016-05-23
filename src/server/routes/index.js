var express = require('express');
var router = express.Router();

router.use('/api-docs', express.static('./src/docs'));

module.exports = router;
