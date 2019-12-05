const pathMap = new Map();

class FileTree {
    constructor() {
        this.map = new Map();
    }

    add(file) {
        const path = getPath(file);

        if (this.map.has(path)) {
            return this.map.get(path);
        }

        const self = {
            path,
            ownership: null,
            children: []
        };

        this.map.set(path, self);
        Object.defineProperty(self, 'tree', {
            value: this
        });

        if (path.parent) {
            this.add(path.parent.path)
                .children.push(self);
        }

        return self;
    }

    get(path) {
        return this.map.get(getPath(path));
    }
}

function normalizePath(path) {
    path = pathUtils.normalize(path);
    return path === '.' ? '' : path;
}

function getPath(path = '') {
    if (!pathMap.has(path)) {
        const normalized = normalizePath(path);

        if (normalized !== path) {
            pathMap.set(path, getPath(normalized));
        } else {
            const parentPath = normalizePath(pathUtils.dirname(normalized));
            let parent = null;

            if (parentPath !== normalized) {
                parent = getPath(parentPath);
            }

            pathMap.set(path, {
                parent,
                name: pathUtils.basename(path),
                path
            });
        }
    }

    return pathMap.get(path);
}

function getProjectOwnership(projectMap, pathRef) {
    if (!projectMap.has(pathRef)) {
        if (pathRef.parent && pathRef.parent.name !== 'node_modules') {
            const inherit = getProjectOwnership(projectMap, pathRef.parent);

            projectMap.set(pathRef, {
                owner: inherit.owner
            });
        } else {
            projectMap.set(pathRef, {
                owner: null
            });
        }
    }

    return projectMap.get(pathRef);
}

discovery.setPrepare(function(data, setData) {
    data.forEach(item => {
        const { files, ownership } = item;
        const tree = new FileTree();
        const ownershipMap = new Map();

        ownership.forEach(({ path, owner }) => {
            ownershipMap.set(getPath(path), { id: true, owner: { name: owner } });
        });

        files.forEach(path =>
            tree.add(path).ownership = getProjectOwnership(ownershipMap, getPath(path))
        );

        discovery.query('..children.[no ownership]', tree.get('.'))
            .forEach(leaf => leaf.ownership = getProjectOwnership(ownershipMap, leaf.path));

        item.tree = tree;
    });

    const projectIndex = data.reduce(
        (map, item) => map
            .set(item, item)
            .set(item.project, item),
        new Map()
    );
    discovery.addEntityResolver(value => {
        if (value) {
            value = projectIndex.get(value) || projectIndex.get(value.project);
        }

        if (value) {
            return {
                type: 'project',
                id: value.project,
                name: value.project,
                entity: value
            };
        }
    });
});
