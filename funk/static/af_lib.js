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
	cssClass: 'gf_out'
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
	cssClass: 'gf_in'
};

var addNode = function (instance, node_id, name, type, position) {

	// node main div
	var node = $('<div/>', {id: node_id, class: 'node'})
		.attr('node-type', type.type)
		.css('background-color', type.color)
		.css('border-color', shadeColor(type.color, -0.2))
		.css('top', position[0])
		.css('left', position[1]);

	// node name
	$('<strong/>').append(name).appendTo(node);

	// attribute table
	var tab = $('<table/>').appendTo(node);
	var attr_l = type.attr_l;
	var attr_r = type.attr_r;
	var nrOfLines = Math.max(attr_l.length, attr_r.length)
	for (var row = 0; row < nrOfLines; row++) {

		// a single line
		var tr = $('<tr/>').appendTo(tab);

		if (row < attr_l.length) {
			_addEndpoint(instance, node_id, tr, attr_l[row], 'l');
		} else {
			$('<td/>').appendTo(tr);
		}

		if (row < attr_r.length) {
			_addEndpoint(instance, node_id, tr, attr_r[row], 'r');
		} else {
			$('<td/>').appendTo(tr);
		}
	}

	node.appendTo('#canvas');
	instance.draggable(node);
};

var connectEndpoints = function (instance, ep1, ep2) {
	source_ep = instance.getEndpoint(ep1);
	target_ep = instance.getEndpoint(ep2);
	instance.connect({source: source_ep, target: target_ep});
};

var _addEndpoint = function (instance, node_id, tr, attr, side) {
	// side is 'l' or 'r'

	var td = $('<td/>', {class: 'attr_' + side}).appendTo(tr);
	td
		.attr('id', node_id + '_' + attr.name)
		.addClass('type_'+attr.type)
		.append(attr.name);
	// the endpoint for connections
	if (attr.direction == 'in') {endpoint_style = endpoint_in;} 
	else {endpoint_style = endpoint_out;}
	if (side == 'l') {anchor = [0, 0.5, -1, 0, -7, 0];}
	else {anchor = [1, 0.5, 1, 0, 7, 0];}
	instance.addEndpoint(td, endpoint_style, {
		uuid: 'ep_' + node_id + '_' + attr.name,
		scope: attr.type,
		'anchor': anchor, 
		data: {
			type_color: af_dataTypes[attr.type],
			type_color_light: shadeColor(af_dataTypes[attr.type], 0.4),
			type_color_dark: shadeColor(af_dataTypes[attr.type], -0.4)
		}
	});
};

var getInstance = function () {

	var instance = window.jsp = jsPlumb.getInstance({
		// default drag options
		DragOptions: { cursor: 'pointer', zIndex: 2000 },
		Container: "canvas"
	});

	instance.bind('beforeDrop', function(params) {
		var source_is_out = params.connection.endpoints[0].hasClass('gf_out');
		var target_is_out = params.dropEndpoint.hasClass('gf_out');
		if ( (source_is_out && target_is_out) || (!source_is_out && !target_is_out) ) {
			return false;
		}

		var source_node = $(params.connection.endpoints[0].getElement()).closest('div')[0];
		var target_node = $(params.dropEndpoint.getElement()).closest('div')[0];
		if (source_node == target_node) {
			return false;
		}

		return true;
	});

	return instance;
};

var serialize = function (instance) {
	var json = {nodes: [], connections: []};
	
	var nodes = $('.node');
	for (var n = 0; n < nodes.length; n++) {
		var node = $(nodes[n])
		var node_json = {
			id: node.attr('id'),
			name: node.children('strong').text(),
			type: node.attr('node-type'),
			top: node.css('top'),
			left: node.css('left')
		};
		json.nodes = json.nodes.concat(node_json);
	}

	var connections = instance.getConnections('*');
	for (var c = 0; c < connections.length; c++) {
		var connection = connections[c];
		var node0 = $(connection.endpoints[0].getElement());
		var node1 = $(connection.endpoints[1].getElement());
		var connection_json = {
			a: node0.attr('id'),
			b: node1.attr('id')
		};
		json.connections = json.connections.concat(connection_json);
	}

	return JSON.stringify(json);
};

var load = function (instance, json) {
	instance.reset();
	$('.node').remove();
	instance = getInstance();
	// instance.batch(function () {
	// 	$('.node').each(function(i) {instance.removeAllEndpoints(this, true)});
	// 	$('.node').remove();
	// });
	instance.batch(function () {
		var data = JSON.parse(json);
		for (var i = 0; i < data.nodes.length; i++) {
			var node = data.nodes[i];
			addNode(instance, node.id, node.name, af_nodeTypes[node.type], [node.top, node.left]);
		}
		for (var i = 0; i < data.connections.length; i++) {
			var connection = data.connections[i];
			connectEndpoints(instance, 'ep_'+connection.a, 'ep_'+connection.b);
		}
	});
	return instance;
};

function shadeColor(color, percent) {   
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

