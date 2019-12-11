discovery.view.define('owner', function(el, config, data, context) {
    discovery.view.render(el, {
        view: 'badge',
        data: 'ownership.owner ? { text: ownership.owner.name, color: "#c6dee7" } : { text: "", color: "#f0f0f0" }'
    }, data, context);

    if (data.ownership && (!data.ownership.id && data.ownership.owner)) {
        el.classList.add('inherited');
    }
});
