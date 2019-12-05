discovery.view.define('sidebar', {
    view: 'content-filter',
    content: {
        view: 'list',
        data: `
            .[no #.filter or project~=#.filter]
            .sort(<project>)
        `,
        emptyText: 'No matches',
        item: {
            view: 'auto-link',
            content: 'text-match:{ text, match: #.filter }'
        }
    }
}, {
    tag: false
});
