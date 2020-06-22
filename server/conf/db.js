let allConfig = require('../../server-config.json')
allConfig = process.env.NODE_ENV === 'production' ? allConfig.prod : allConfig.dev

module.exports = allConfig
