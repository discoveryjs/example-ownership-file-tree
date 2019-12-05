module.exports = {
    name: 'Ownership FileTree Demo',
    data: () => require('./data.json'),
    prepare: __dirname + '/prepare.js',
    view: {
        basedir: __dirname + '/ui',
        libs: {
            pathUtils: '../libs/path.js'
        },
        assets: [
            'page/default.js',
            'page/default.css',
            'view/owner.js',
            'view/owner.css'
        ]
    }
};
