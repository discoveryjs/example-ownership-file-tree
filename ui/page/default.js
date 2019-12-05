const leafExpanded = new Map();

discovery.page.define('default', {
    view: 'context',
    data: ({ tree }, context) => {
        const path = context.params.path;
        const root = tree.get(path === true ? '' : path || '');

        if (leafExpanded.root !== root) {
            leafExpanded.root = root;
            leafExpanded.clear();
        }

        return root;
    },
    content: [
        {
            view: 'block',
            className: 'tab-toolbar',
            content: [
                {
                    view: 'inline-list',
                    className: 'breadcrums',
                    emptyText: false,
                    data: '(path.name ? [{ name: #.data.project or "repository", path: "" }] : []) + path..parent.reverse().[name]',
                    item: 'link:{ text: name, href: #.id.pageLink(#.page, { path }) }'
                },
                'text:path.name or #.data.project or "repository"'
            ]
        },
        {
            view: 'tree',
            limitLines: false,
            limit: false,
            expanded: data => leafExpanded.get(data),
            onToggle: (expanded, _, data) => leafExpanded.set(data, expanded),
            data: 'children.sort(<[no children, path.name]>)',
            children: 'children.sort(<[no children, path.name]>)',
            item: [
                {
                    view: 'switch',
                    content: [
                        { when: 'children', content: 'link:path.({ text: name, href: #.id.pageLink(#.page, { path }) })' },
                        { when: 'no ownership.owner.id', content: {
                            view: 'block',
                            className: 'unowned-file',
                            content: 'text:path.name'
                        } },
                        { content: 'text:path.name' }
                    ]
                },
                'owner',
                {
                    view: 'block',
                    className: 'dir-file-count',
                    when: 'children',
                    data: `
                        $files: ..children.[no children];
                        {
                            $files,
                            count: $files.size(),
                            noOwnerCount: $files.[no ownership.owner].size(),
                            ownership
                        }
                    `,
                    content: [
                        'text:count + (count > 1 ? " files" : " file")',
                        {
                            view: 'block',
                            className: 'bad',
                            when: 'noOwnerCount',
                            content: 'text:noOwnerCount = count ? "all unowned" : "unowned " + noOwnerCount + (noOwnerCount > 1 ? " files" : " file")'
                        },
                        {
                            view: 'comma-list',
                            data: 'files.ownership.owner.[$.id != @.ownership.owner.id].name'
                        }
                    ]
                }
            ]
        }
    ]
});
