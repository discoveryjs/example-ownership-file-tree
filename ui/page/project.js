const leafExpanded = new Map();

discovery.page.define('project', {
    view: 'context',
    data: (data, context) => {
        const path = context.params.path;
        const id = unescape(context.id);
        const project = data.find(item => item.project === id);
        let root = null;

        if (project) {
            root = project.tree.get(path === true ? '' : path || '');
    
            if (leafExpanded.root !== root) {
                leafExpanded.root = root;
                leafExpanded.clear();
            }
        }

        return { ...project, root };
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
                    data: '(root.path.name ? [{ name: project or "repository", path: "" }] : []) + root.path..parent.reverse().[name]',
                    item: 'link:{ text: name, href: #.id.pageLink(#.page, { path }) }'
                },
                'text:root.path.name or project or "repository"',
                'owner:root'
            ]
        },
        {
            view: 'tree',
            limitLines: false,
            limit: false,
            expanded: data => leafExpanded.get(data),
            onToggle: (expanded, _, data) => leafExpanded.set(data, expanded),
            data: 'root.children.sort(<[no children, path.name]>)',
            children: 'children.sort(<[no children, path.name]>)',
            item: [
                {
                    view: 'switch',
                    content: [
                        { when: 'children', content: 'link:path.({ text: name, href: #.id.pageLink(#.page, { path }) })' },
                        { when: 'no ownership.owner', content: {
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
                            data: 'files.ownership.owner.name.[$ != @.ownership.owner.name]'
                        }
                    ]
                }
            ]
        }
    ]
}, {
    resolveLink: 'project'
});
