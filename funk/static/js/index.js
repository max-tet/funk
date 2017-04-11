var graphList = new Vue({
    el: '#graph-list',
    data: {
        graphs: [],
        graphname: ''
    },
    methods: {
        refreshList: function () {
            this_ = this;
            $.get('/api/graphs')
                .done(function (data) {
                    this_.graphs = data;
                });
        },
        createGraph: function () {
            this_ = this;
            $.post('/api/graph/' + this.graphname)
                .done(function () {
                    this_.refreshList();
                });
            this.graphname = '';
        },
        deleteGraph: function (graphname) {
            this_ = this;
            $.ajax({
                url: '/api/graph/' + graphname,
                type: 'DELETE',
                success: function () {
                    this_.refreshList();
                }
            });
        }
    },
    mounted: function () {
        this.refreshList();
    }
});

Vue.component('graph-tr', {
    template: '#graph-tr-template',
    props: ['graph'],
    computed: {
        href: function () {
            return '/graph/' + this.graph;
        }
    },
    methods: {
        deleteGraph: function () {
            this.$emit('delete-graph', this.graph);
        }
    }
});