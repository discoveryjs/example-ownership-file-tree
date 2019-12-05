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
            'page/project.js',
            'page/project.css',
            'view/owner.js',
            'view/owner.css',
            'sidebar.js',
            'sidebar.css'
        ]
    }
};
