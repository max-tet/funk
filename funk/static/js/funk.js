var funkInstance = {
    isDirty: false,
    jsPlumbInstance: undefined,
    graphname: undefined,
    endpointArgsFactory: function (isLeft, connector, type) {
        endpointArgs = {
            endpoint: 'Dot',
            paintStyle: {
                strokeStyle: shadeColor(type, -0.4),
                fillStyle: (connector.direction == 'in') ? shadeColor(type, 0.4) : type,
                radius: 5,
                lineWidth: 1
            },
            isTarget: true,
            isSource: true,
            connector: [ "Bezier" ],
            connectorStyle: {
                lineWidth: 2,
                strokeStyle: type,
                joinstyle: 'round',
                outlineColor: '#dcdcdc',
                outlineWidth: 1
            },
            connectorHoverStyle: {
                lineWidth: 4
            },
            maxConnections: (connector.direction == 'in') ? 1 : -1,
            scope: connector.type,
            cssClass: (connector.direction == 'in') ? 'funk-endpoint-in' : 'funk-endpoint-out',
            anchor: (isLeft) ? [0, 0.5, -1, 0, -7, 0] : [1, 0.5, 1, 0, 7, 0]
        };
        if (connector.direction == 'in') {
            endpointArgs.dropOptions = { hoverClass: 'hover', activeClass: 'active' };
        }
        return endpointArgs;
    }
};

Vue.component('funk-node', {
    template: '#funk-node-template',
    data: function () {return {
        funkInstance: funkInstance,
        isSelected: false
    };},
    props: ['node'],
    computed: {
        type: function () {return nodeTypes[this.node.type];},
        style: function () {
            return {
                'background-color': this.type.color,
                'border-color': shadeColor(this.type.color, -0.2),
                top: this.node.top,
                left: this.node.left
            };
        },
        nrOfRows: function () {return Math.max(this.type.connector_l.length, this.type.connector_r.length);}
    },
    methods: {
        toggleSelection: function () {this.isSelected = !this.isSelected;},
        onDeleteKey: function () {
            if (this.isSelected) {
                this.$emit('delete-node', this.node.nodeid);
            }
        }
    },
    watch: {
        isSelected: function (val, oldVal) {
            if (val) {this.funkInstance.jsPlumbInstance.addToDragSelection(this.$el);}
            else {this.funkInstance.jsPlumbInstance.removeFromDragSelection(this.$el);}
        }
    },
    components: {
        'funk-node-connector': {
            template: '#funk-node-connector-template',
            props: ['connector', 'side', 'nodeid'],
            computed: {
                elId: function () {
                    if (this.connector == undefined) {return undefined;}
                    else {return this.nodeid + '-' + this.connector.id;}
                }
            },
            mounted: function () {
                if (this.connector == undefined) {return;}
                var endpointArgs = funkInstance.endpointArgsFactory(
                    this.side == 'left', this.connector, dataTypes[this.connector.type]);
                endpointArgs.uuid = 'funk-connector-' + this.nodeid + '-' + this.connector.id;
                funkInstance.jsPlumbInstance.addEndpoint(this.$el, endpointArgs);
            },
            beforeDestroy: function () {
                if (this.connector) {
                   funkInstance.jsPlumbInstance.deleteEndpoint('funk-connector-' + this.nodeid + '-' + this.connector.id);
                }
            }
        }
    },
    mounted: function () {
        funkInstance.jsPlumbInstance.draggable(this.$el, {stop: function () {funkInstance.isDirty = true;}});
        var thisEl = this.$el;
        var node = this.node;
        var observer = new MutationObserver(
            function (records) {
                $.each(records, function (i, record) {
                    node.top = $(thisEl).css('top');
                    node.left = $(thisEl).css('left');
                });
            }
        );
        observer.observe(this.$el, {attributes:true, attributeFilter:['style']});
        this.funkInstance.isDirty = true;
    },
    beforeDestroy: function () {this.funkInstance.isDirty = true;}
});

Vue.component('funk-save-button', {
    template: '#funk-save-button-template',
    data: function () {return {
        funkInstance: funkInstance,
        isSaving: false
    };},
    computed: {
        active: function () {return this.funkInstance.isDirty;},
        text: function () {
            if (this.isSaving) {return 'Saving..';}
            if (this.active) {return 'Save';}
            return 'Saved';
        }
    },
    methods: {
        save: function () {
            component = this;
            component.isSaving = true;
            $.ajax({
                url: '/api/graph/' + component.funkInstance.graphname,
                type: 'PUT',
                contentType: 'application/json',
                data: funkCanvas.serializeGraph(),
                success: function () {component.funkInstance.isDirty = false;},
                complete: function () {component.isSaving = false;}
            });
        }
    }
});

Vue.component('funk-new-graph-modal', {
    template: '#funk-new-graph-modal-template',
    data: function () {return {
        funkInstance: funkInstance
    };},
    props: ['graphName'],
    methods: {
        createGraph: function () {
            this_ = this;
            $.post('/api/graph/' + this.funkInstance.graphname)
                .done(function () {
                    this_.$emit('create');
                    $(this_.$el).modal('hide');
                });
        }
    },
    mounted: function () {
        var modal = $(this.$el);
        modal.modal({backdrop: 'static', keyboard: false});
    }
});

Vue.component('funk-add-node-input', {
    template: '#funk-add-node-input',
    props: [],
    mounted: function () {
        this_ = this;
        var funkNodeMatcher = function (query, callback) {
            var matches = [];
            var regex = new RegExp(query, 'i');
            $.each(nodeTypes, function (i, nodeType) {
                if (regex.test(nodeType.type)) {matches.push(nodeType);}
            });
            callback(matches);
        };
        $(this_.$el).find('input').typeahead({
            minLength: 1,
            highlight: true
        },
        {
            name: 'nodeTypes',
            source: funkNodeMatcher,
            display: 'type',
            templates: {
                suggestion: function (nodeType) {
                    return '<div style="background-color: '+nodeType.color+'">'+nodeType.type+'</div>';
                }
            }
        })
        .bind('typeahead:select', function(ev, suggestion) {
            this_.$emit('add-node', {
                nodeid: suggestion.type + '_' + randomString(6),
                name: suggestion.type,
                type: suggestion.type,
                top: '5em',
                left: '5em'
            });
            $(this_.$el).find('input').typeahead('val', '');
        });
    }
});

funkCanvas = new Vue({
    el: '#funk-canvas',
    data: {
        nodes: [],
        funkInstance: funkInstance,
        showNewGraphModal: false
    },
    methods: {
        loadGraph: function () {
            var this_ = this;
            $.get('/api/graph/' + this.funkInstance.graphname)
                .done(function (data) {
                    this_.funkInstance.jsPlumbInstance.reset();
                    this_.nodes = [];
                    this_.nodes = data.nodes;
                    this_.$nextTick(function () {
                        $.each(data.connections, function (i, connection) {
                            connector_id_out = 'funk-connector-' + connection.out_node + '-' + connection.out_connector;
                            connector_id_in = 'funk-connector-' + connection.in_node + '-' + connection.in_connector;
                            source_ep = this_.funkInstance.jsPlumbInstance.getEndpoint(connector_id_out);
                            target_ep = this_.funkInstance.jsPlumbInstance.getEndpoint(connector_id_in);
                            this_.funkInstance.jsPlumbInstance.connect({source: source_ep, target: target_ep});
                        });
                        funkInstance.isDirty = false;
                    });
                })
                .fail(function (response) {
                    if (response.status == 404) {
                        this_.showNewGraphModal = true;
                    }
                });
        },
        serializeGraph: function () {
            var json = {nodes: this.nodes, connections: []};
            $.each(this.funkInstance.jsPlumbInstance.getConnections('*'), function (i, connection) {
                var ids_in = $(connection.endpoints[0].getElement()).attr('id').split('-');
                var ids_out = $(connection.endpoints[1].getElement()).attr('id').split('-');
                var connection_json = {
                    out_node: ids_out[0],
                    out_connector: ids_out[1],
                    in_node: ids_in[0],
                    in_connector: ids_in[1],
                };
                json.connections = json.connections.concat(connection_json);
            });
            return JSON.stringify(json);
        },
        addNode: function (node) {
            this.nodes.push(node);
        },
        clearSelection: function () {
            $.each(this.$refs.nodes, function (i, node) {
                node.isSelected = false;
            })
        },
        onDeleteKey: function () {
            $.each(this.$refs.nodes, function (i, node) {
                node.onDeleteKey();
            });
        },
        deleteNode: function (nodeid) {
            this.nodes = this.nodes.filter(function (node) {
                if (node.nodeid == nodeid) {return false;}
                return true;
            });
        }
    },
    mounted: function () {
        funkInstance.graphname = window.location.pathname.split('/')[2];

        var instance = window.jsp = jsPlumb.getInstance({
            DragOptions: { cursor: 'pointer', zIndex: 2000 },
            Container: this.$el
        });

        instance.bind('beforeDrop', function(params) {
            // Only connect input and output
            var source_is_out = params.connection.endpoints[0].hasClass('funk-endpoint-out');
            var target_is_out = params.dropEndpoint.hasClass('funk-endpoint-out');
            if ( (source_is_out && target_is_out) || (!source_is_out && !target_is_out) ) {
                return false;
            }

            // Do not connect to the same node
            var source_node = $(params.connection.endpoints[0].getElement()).closest('div')[0];
            var target_node = $(params.dropEndpoint.getElement()).closest('div')[0];
            if (source_node == target_node) {
                return false;
            }

            funkInstance.isDirty = true;
            return true;
        });

        instance.bind('beforeDetach', function(connection) {
            funkInstance.isDirty = true;
            return true;
        });

        this.funkInstance.jsPlumbInstance = instance;

        this.loadGraph();
    }
});

$(document).bind("keyup", "del", function() {funkCanvas.onDeleteKey()});

function shadeColor(color, percent) {
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

function randomString(length) {
    return (Math.random()+1).toString(36).substr(2,length);
}
