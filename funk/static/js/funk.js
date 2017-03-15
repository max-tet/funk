var funkInstance = {
    isDirty: false
};

var connectorPaintStyle = {
	lineWidth: 2,
	strokeStyle: '${type_color}',
	joinstyle: "round",
	outlineColor: "#dcdcdc",
	outlineWidth: 1
};
var connectorHoverStyle = {
	lineWidth: 4
};
var endpoint_out = {
	endpoint: "Dot",
	paintStyle: {
		strokeStyle: '${type_color_dark}',
		fillStyle: '${type_color}',
		radius: 5,
		lineWidth: 1
	},
	maxConnections: -1,
	isTarget: true,
	isSource: true,
	connector: [ "Bezier" ],
	connectorStyle: connectorPaintStyle,
	connectorHoverStyle: connectorHoverStyle,
	cssClass: 'funk-endpoint-out'
};
var endpoint_in = {
	endpoint: "Dot",
	paintStyle: {
		strokeStyle: '${type_color_dark}',
		fillStyle: '${type_color_light}',
		radius: 5,
		lineWidth: 1
	},
	maxConnections: 1,
	dropOptions: { hoverClass: "hover", activeClass: "active" },
	isTarget: true,
	isSource: true,
	connector: [ "Bezier" ],
	connectorStyle: connectorPaintStyle,
	connectorHoverStyle: connectorHoverStyle,
	cssClass: 'funk-endpoint-in'
};

var addNode = function (instance, node_id, name, type, position) {

	// node main div
	var node = $('<div/>', {id: node_id, class: 'funk-node'})
		.attr('funk-node-type', type.type)
		.css('background-color', type.color)
		.css('border-color', shadeColor(type.color, -0.2))
		.css('top', position[0])
		.css('left', position[1])
		.appendTo('#funk-canvas');

	// node name
	$('<strong/>').append(name).appendTo(node);

	// attribute table
	var tab = $('<table/>').appendTo(node);
	var connector_l = type.connector_l;
	var connector_r = type.connector_r;

	var nrOfLines = Math.max(connector_l.length, connector_r.length)
	for (var row = 0; row < nrOfLines; row++) {

		var tr = $('<tr/>').appendTo(tab);

		if (row < connector_l.length) {
			_addEndpoint(instance, node_id, tr, connector_l[row], 'l');
		} else {
			$('<td/>').appendTo(tr);
		}

		if (row < connector_r.length) {
			_addEndpoint(instance, node_id, tr, connector_r[row], 'r');
		} else {
			$('<td/>').appendTo(tr);
		}
	}

	instance.draggable(node, {stop: function () {funkInstance.isDirty = true;}});

	funkInstance.isDirty = true;
};

var connectEndpoints = function (instance, ep1, ep2) {
	source_ep = instance.getEndpoint(ep1);
	target_ep = instance.getEndpoint(ep2);
	instance.connect({source: source_ep, target: target_ep});
	funkInstance.isDirty = true;
};

var _addEndpoint = function (instance, node_id, tr, attr, side) {
	// side is 'l' or 'r'

    // the tabledata
	var td = $('<td/>', {class: 'funk-attr-' + side}).appendTo(tr);
	td
		.attr('id', node_id + '-' + attr.id)
		.addClass('funk-type-'+attr.type)
		.append(attr.name);

	// the jsPlumb endpoint for connections
	if (attr.direction == 'in') {endpoint_style = endpoint_in;} 
	else {endpoint_style = endpoint_out;}
	if (side == 'l') {anchor = [0, 0.5, -1, 0, -7, 0];}
	else {anchor = [1, 0.5, 1, 0, 7, 0];}
	instance.addEndpoint(td, endpoint_style, {
		uuid: 'funk-connector-' + node_id + '-' + attr.id,
		scope: attr.type,
		'anchor': anchor, 
		data: {
			type_color: dataTypes[attr.type],
			type_color_light: shadeColor(dataTypes[attr.type], 0.4),
			type_color_dark: shadeColor(dataTypes[attr.type], -0.4)
		}
	});
};

var getInstance = function (containerId) {

	var instance = window.jsp = jsPlumb.getInstance({
		// default drag options
		DragOptions: { cursor: 'pointer', zIndex: 2000 },
		Container: containerId
	});

	instance.bind('beforeDrop', function(params) {
		var source_is_out = params.connection.endpoints[0].hasClass('funk-endpoint-out');
		var target_is_out = params.dropEndpoint.hasClass('funk-endpoint-out');
		if ( (source_is_out && target_is_out) || (!source_is_out && !target_is_out) ) {
			return false;
		}

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

	return instance;
};

var serialize = function (instance) {
	var json = {nodes: [], connections: []};
	
	var nodes = $('.funk-node');
	for (var n = 0; n < nodes.length; n++) {
		var node = $(nodes[n])
		var node_json = {
			nodeid: node.attr('id'),
			name: node.children('strong').text(),
			type: node.attr('funk-node-type'),
			top: node.css('top'),
			left: node.css('left')
		};
		json.nodes = json.nodes.concat(node_json);
	}

	var connections = instance.getConnections('*');
	for (var c = 0; c < connections.length; c++) {
		var connection = connections[c];
		var ids_in = $(connection.endpoints[0].getElement()).attr('id').split('-');
		var ids_out = $(connection.endpoints[1].getElement()).attr('id').split('-');

		var connection_json = {
		    out_node: ids_out[0],
		    out_connector: ids_out[1],
		    in_node: ids_in[0],
		    in_connector: ids_in[1],
		};
		json.connections = json.connections.concat(connection_json);
	}

	return JSON.stringify(json);
};

var loadFromString = function (instance, data) {
    var containerId = $(instance.getContainer()).attr('id');
	instance.reset();
	$('.funk-node').remove();
	instance = getInstance(containerId);
	instance.batch(function () {
		for (var i = 0; i < data.nodes.length; i++) {
			var node = data.nodes[i];
			addNode(instance, node.nodeid, node.name, nodeTypes[node.type], [node.top, node.left]);
		}
		for (var i = 0; i < data.connections.length; i++) {
			var connection = data.connections[i];
			connector_id_out = 'funk-connector-' + connection.out_node + '-' + connection.out_connector;
			connector_id_in = 'funk-connector-' + connection.in_node + '-' + connection.in_connector;
			connectEndpoints(instance, connector_id_out, connector_id_in);
		}
	});
	return instance;
};

var save = function () {
    $.ajax({
        url: '/api/graph/' + funkInstance.graphname,
        type: 'PUT',
        contentType: 'application/json',
        data: serialize(funkInstance.jsPlumbInstance),
        success: function () {funkInstance.isDirty = false;}
    });
};

var load_graph = function () {
    $.get('/api/graph/' + funkInstance.graphname)
        .done(function (data) {
            funkInstance.jsPlumbInstance = loadFromString(funkInstance.jsPlumbInstance, data);
            funkInstance.isDirty = false;
        })
        .fail(function (response) {
            if (response.status == 404) {
                var modal = $('#new_graph_modal')
                modal.modal({backdrop: 'static', keyboard: false});
                modal.find('.modal-body strong').text(funkInstance.graphname);
                modal.find('button').on('click', function () {
                    $.post('/api/graph/' + funkInstance.graphname)
                        .done(function () {
                            load_graph();
                            $('#new_graph_modal').modal('hide');
                        });
                });
            }
        });
};

var funk_init = function (containerId) {
    funkInstance.jsPlumbInstance = getInstance(containerId);
    var pathname = window.location.pathname;
    funkInstance.graphname = pathname.split('/')[2];
    load_graph();
};

function shadeColor(color, percent) {   
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

buttonSave = new Vue({
    el: '#funk-button-save',
    data: {
        save: save,
        funkInstance: funkInstance
    }
});