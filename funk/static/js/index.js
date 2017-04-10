var graphList = new Vue({
    el: '#graph-list',
    data: {
        graphs: []
    },
    mounted: function () {
        this_ = this;
        $.get('/api/graphs')
            .done(function (data) {
                this_.graphs = data;
            });
    }
});

Vue.component('graph-tr', {
    template: '#graph-tr-template',
    props: ['graph'],
    computed: {
        href: function () {
            return '/graph/' + this.graph;
        }
    }
});