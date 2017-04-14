var funkInstance = {
    isDirty: false,
    jsPlumbInstance: undefined,
    graphname: undefined,
    endpointArgsFactory: function (isLeft, connector, type) {
        endpointArgs = {
            endpoint: 'Dot',
            paintStyle: {
                strokeStyle: shadeColor(type.color, -0.4),
                fillStyle: (connector.direction == 'in') ? shadeColor(type.color, 0.4) : type.color,
                radius: 5,
                lineWidth: 1
            },
            isTarget: true,
            isSource: true,
            connector: [ "Bezier" ],
            connectorStyle: {
                lineWidth: 2,
                strokeStyle: type.color,
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

Vue.config.keyCodes = {
    end: 35,
    home: 36
}

Vue.component('funk-node', {
    template: '#funk-node-template',
    data: function () {return {
        funkInstance: funkInstance
    };},
    props: ['node'],
    computed: {
        type: function () {
            var typeId = this.node.type;
            return nodeTypes.find(function (type) {return type.type == typeId;});
        },
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
        edit: function () {
            this.$emit('edit', this.node);
        },
        shiftClick: function () {
            this.$emit('shift-clicked', this.node);
        }
    },
    watch: {
        'node.ephemeral.isSelected': function (val, oldVal) {
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

                $(this.$el).tooltip({
                    placement: this.side,
                    title: dataTypes[this.connector.type].name,
                    delay: {show: 500, hide: 100}
                });
            },
            beforeDestroy: function () {
                if (this.connector) {
                   funkInstance.jsPlumbInstance.deleteEndpoint('funk-connector-' + this.nodeid + '-' + this.connector.id);
                }
            }
        },
        'funk-node-property': {
            template: '#funk-node-property-template',
            props: ['prop']
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

Vue.component('funk-node-properties-modal', {
    template: '#funk-node-properties-modal-template',
    props: ['node', 'isOpen'],
    methods: {
        cancel: function () {
            this.$emit('cancel');
        },
        save: function () {
            this.$emit('save', this.node);
        },
    },
    watch: {
        isOpen: function (val, oldVal) {
            if (val) {
                $(this.$el).modal({backdrop: 'static', keyboard: false});
            } else {
                $(this.$el).modal('hide');
            }
        }
    }
});

Vue.component('funk-add-node', {
    template: '#funk-add-node-template',
    data: function () {return {
        categories: {},
        isActive: false,
        filterText: '',
        selection: 0,
    };},
    props: ['nodetypes'],
    computed: {
        filteredNodetypes: function () {
            var this_ = this;
            var completeList = [];
            $.each(this_.categories, function (category, nodetypes) {
                completeList.push({name: category, isCategory: true});
                $.each(nodetypes, function (index, nodetype) {completeList.push(nodetype);});
            });

            var filteredList = completeList.filter(function (item) {
                if ('isCategory' in item) {return true;}
                var regex = new RegExp('.*' + this_.filterText + '.*', 'i');
                return item.name.match(regex) != null;
            });
            this.selection = Math.min(this.selection, filteredList.length - 1);
            return $.map(filteredList, function (value, index) {
                return $.extend({}, value, {isSelected: (index == this_.selection)});
            });
        }
    },
    methods: {
        addNode: function (nodetype) {
            this.isActive = false;
            this.$emit('add-node', nodetype);
        },
        selectionDown: function () {
            var maxSelection = this.filteredNodetypes.length - 1;
            this.selection = Math.min(maxSelection, this.selection + 1);
        },
        selectionUp: function () {
            this.selection = Math.max(0, this.selection - 1);
        },
        selectionHome: function () {
            this.selection = 0;
        },
        selectionEnd: function () {
            this.selection = this.filteredNodetypes.length - 1;
        },
        addSelectedNode: function () {
            this.addNode(this.filteredNodetypes[this.selection]);
        }
    },
    watch: {
        isActive: function (val) {
            this_ = this;
            if (val) {
                Vue.nextTick(function () {
                    $(this_.$el).find('input').focus();
                });
            }
        }
    },
    mounted: function () {
        for (t in this.nodetypes) {
            var nodetype = this.nodetypes[t];
            if ('categories' in nodetype) {
                for (c in nodetype.categories) {
                    var category = nodetype.categories[c];
                    if (!(category in this.categories)) {
                        this.categories[category] = [];
                    }
                    this.categories[category].push(nodetype);
                }
            } else {
                if (!('Misc' in this.categories)) {
                    this.categories['Misc'] = [];
                }
                this.categories.Misc.push(nodetype);
            }
        }
    }

});

Vue.component('funk-nodetype-preview', {
    template: '#funk-nodetype-preview-template',
    props: ['nodetype'],
    computed: {
        style: function () {
            return {
                'background-color': this.nodetype.color,
                'border-color': shadeColor(this.nodetype.color, -0.2)
            };
        }
    },
    methods: {
        addNode: function () {
            this.$emit('add-node', this.nodetype);
        }
    },
    watch: {
        'nodetype.isSelected': function (val) {
            if (val) {$(this.$el).scrollintoview({duration: 100});}
        }
    }
});

funkCanvas = new Vue({
    el: '#funk-canvas',
    data: {
        nodes: [],
        nodetypes: nodeTypes,
        funkInstance: funkInstance,
        graphNotFound: false,
        nodeUnderModification: ''
    },
    methods: {
        initJsPlumbInstance: function () {
            if (this.funkInstance.jsPlumbInstance) {this.funkInstance.jsPlumbInstance.reset();}

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
        },
        loadGraph: function () {
            var this_ = this;
            funkInstance.graphname = window.location.pathname.split('/')[2];
            $.get('/api/graph/' + this.funkInstance.graphname)
                .done(function (data) {
                    this_.initJsPlumbInstance();
                    $.each(data.nodes, function (i, node) {
                        var newNode = $.extend({ephemeral: {isSelected: false, isHovered: false}}, node);
                        this_.nodes.push(newNode);
                    });
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
                        this_.graphNotFound = true;
                    }
                });
        },
        serializeGraph: function () {
            var outJson = {nodes: [], connections: []};
            $.each(this.nodes, function (i, node) {
                var outNode = $.extend({}, node);
                delete outNode.ephemeral;
                outJson.nodes.push(outNode);
            });
            $.each(this.funkInstance.jsPlumbInstance.getConnections('*'), function (i, connection) {
                var ids_in = $(connection.endpoints[0].getElement()).attr('id').split('-');
                var ids_out = $(connection.endpoints[1].getElement()).attr('id').split('-');
                var outConnection = {
                    out_node: ids_out[0],
                    out_connector: ids_out[1],
                    in_node: ids_in[0],
                    in_connector: ids_in[1],
                };
                outJson.connections.push(outConnection);
            });
            return JSON.stringify(outJson);
        },
        addNode: function (nodeType) {
            var node = {
                nodeid: nodeType.type + '_' + randomString(6),
                name: nodeType.name,
                type: nodeType.type,
                top: '5em',
                left: '5em',
                ephemeral: {
                    isSelected: false,
                    isHovered: false
                }
            };
            if ('props' in nodeType) {
                node.props = $.extend(true, [], nodeType.props);
            }
            this.nodes.push(node);
        },
        toggleNodeSelection: function (node) {
            node.ephemeral.isSelected = !node.ephemeral.isSelected;
        },
        onCanvasClick: function (event) {
            if ($(event.target).attr('id') == 'funk-canvas') {
                $.each(this.nodes, function (i, node) {
                    node.ephemeral.isSelected = false;
                })
            }
        },
        deleteSelectedNodes: function () {
            this.nodes = this.nodes.filter(function (node) {
                return !node.ephemeral.isSelected;
            });
        },
        editNode: function (node) {
            this.nodeUnderModification = $.extend(true, {}, node, {ephemeral: {isHovered: false}});
            this.showNodeEditModal = true;
        },
        modifyNode: function (node) {
            var this_ = this;
            var existingNode = this.nodes.find(function (candidate) {
                return candidate.nodeid == node.nodeid;
            });
            $.extend(true, existingNode, node);
            this.nodeUnderModification= '';
            this.funkInstance.isDirty = true;
            this.$nextTick(function () {
                this_.funkInstance.jsPlumbInstance.recalculateOffsets(node.nodeid);
                this_.funkInstance.jsPlumbInstance.repaintEverything();
            });
        }
    },
    mounted: function () {this.loadGraph();}

});

$(document).bind("keyup", "del", function() {funkCanvas.deleteSelectedNodes();});
$(document).bind("keydown", "ctrl+a", function() {funkCanvas.$refs.addNode.isActive=true;});
$(document).bind("keydown", "esc", function() {funkCanvas.$refs.addNode.isActive=false;});

function shadeColor(color, percent) {
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

function randomString(length) {
    return (Math.random()+1).toString(36).substr(2,length);
}
