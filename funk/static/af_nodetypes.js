var af_colors = {
	green: '#8fbc8f',
	yellow: '#deb887',
	purple: '#A58DD2',
	red: '#FFAFA2',
	pink: '#DB92AF'
};

var af_dataTypes = {
	actor: '#297E13',
	bool: '#D66326',
	integer: '#153D61',
	string: '#EAA700',
	resource: '#351F99',
	timeseries: '#923158'
};

var af_nodeTypes = {
	actor: {
		type: 'actor',
		color: af_colors.green,
		attr_l: [],
		attr_r: [
			{name: 'Out', type: 'actor', direction: 'out'}
		]
	},
	actor_any: {
		type: 'actor_any',
		color: af_colors.green,
		attr_l: [
			{name: 'Actor 1', type: 'actor', direction: 'in'},
			{name: 'Actor 2', type: 'actor', direction: 'in'}
		],
		attr_r: [{name: 'Any', type: 'actor', direction: 'out'}]
	},
	actor_all: {
		type: 'actor_all',
		color: af_colors.green,
		attr_l: [
			{name: 'Actor 1', type: 'actor', direction: 'in'},
			{name: 'Actor 2', type: 'actor', direction: 'in'}
		],
		attr_r: [{name: 'All', type: 'actor', direction: 'out'}]
	},
	has_attr: {
		type: 'has_attr',
		color: af_colors.green,
		attr_l: [{name: 'Actor', type: 'actor', direction: 'in'}],
		attr_r: [{name: 'Result', type: 'bool', direction: 'out'}]
	},
	get_attr_actor: {
		type: 'get_attr_actor',
		color: af_colors.green,
		attr_l: [
			{name: 'Actor', type: 'actor', direction: 'in'},
			{name: 'Attribute Name', type: 'string', direction: 'in'}
		],
		attr_r: [{name: 'Result', type: 'string', direction: 'out'}]
	},
	get_attr_resource: {
		type: 'get_attr_resource',
		color: af_colors.purple,
		attr_l: [{name: 'Attribute Name', type: 'string', direction: 'in'}],
		attr_r: [
			{name: 'Resource', type: 'resource', direction: 'in'},
			{name: 'Result', type: 'string', direction: 'out'}
		]
	},
	resource: {
		type: 'resource',
		color: af_colors.purple,
		attr_l: [{name: 'Out', type: 'resource', direction: 'out'}],
		attr_r: []
	},
	permission: {
		type: 'permission',
		color: af_colors.purple,
		attr_l: [{name: 'Actor', type: 'actor', direction: 'in'}],
		attr_r: [{name: 'Resource', type: 'resource', direction: 'in'}]
	},
	permission_if: {
		type: 'permission_if',
		color: af_colors.purple,
		attr_l: [
			{name: 'Out', type: 'resource', direction: 'out'},
			{name: 'If', type: 'bool', direction: 'in'}
		],
		attr_r: [{name: 'Resource', type: 'resource', direction: 'in'}]
	},
	resource_to_timeseries: {
		type: 'resource_to_timeseries',
		color: af_colors.pink,
		attr_l: [{name: 'Out', type: 'timeseries', direction: 'out'}],
		attr_r: [{name: 'In', type: 'resource', direction: 'in'}]
	},
	timeseries_to_resource: {
		type: 'timeseries_to_resource',
		color: af_colors.pink,
		attr_l: [{name: 'Out', type: 'resource', direction: 'out'}],
		attr_r: [{name: 'In', type: 'timeseries', direction: 'in'}]
	},
	merge_timeseries: {
		type: 'merge_timeseries',
		color: af_colors.pink,
		attr_l: [{name: 'Result', type: 'timeseries', direction: 'out'}],
		attr_r: [
			{name: 'In 1', type: 'timeseries', direction: 'in'},
			{name: 'In 2', type: 'timeseries', direction: 'in'}
		]
	},
	change_resolution_timeseries: {
		type: 'change_resolution_timeseries',
		color: af_colors.pink,
		attr_l: [
			{name: 'Result', type: 'timeseries', direction: 'out'},
			{name: 'Resolution', type: 'integer', direction: 'in'}
		],
		attr_r: [{name: 'In', type: 'timeseries', direction: 'in'}]
	},
	const_string: {
		type: 'const_string',
		color: af_colors.yellow,
		attr_l: [],
		attr_r: [{name: 'Out', type: 'string', direction: 'out'}]
	},
	string_to_integer: {
		type: 'string_to_integer',
		color: af_colors.yellow,
		attr_l: [{name: 'In', type: 'string', direction: 'in'}],
		attr_r: [{name: 'Out', type: 'integer', direction: 'out'}]
	},
	eq_string: {
		type: 'eq_string',
		color: af_colors.yellow,
		attr_l: [
			{name: 'Value 1', type: 'string', direction: 'in'},
			{name: 'Value 2', type: 'string', direction: 'in'}
		],
		attr_r: [{name: 'Result', type: 'bool', direction: 'out'}]
	},
	const_integer: {
		type: 'const_integer',
		color: af_colors.yellow,
		attr_l: [],
		attr_r: [{name: 'Out', type: 'integer', direction: 'out'}]
	},
	compare_integer: {
		type: 'compare_integer',
		color: af_colors.yellow,
		attr_l: [
			{name: 'Value 1', type: 'integer', direction: 'in'},
			{name: 'Value 2', type: 'integer', direction: 'in'}
		],
		attr_r: [{name: 'Result', type: 'bool', direction: 'out'}]
	},
	between_integer: {
		type: 'between_integer',
		color: af_colors.yellow,
		attr_l: [
			{name: 'Minimum', type: 'integer', direction: 'in'},
			{name: 'Value', type: 'integer', direction: 'in'},
			{name: 'Maximum', type: 'integer', direction: 'in'}
		],
		attr_r: [{name: 'Result', type: 'bool', direction: 'out'}]
	},
	time_of_day: {
		type: 'time_of_day',
		color: af_colors.yellow,
		attr_l: [],
		attr_r: [{name: 'Out', type: 'integer', direction: 'out'}]
	},
	const_bool: {
		type: 'const_bool',
		color: af_colors.yellow,
		attr_l: [],
		attr_r: [{name: 'Out', type: 'bool', direction: 'out'}]
	},
	and_bool: {
		type: 'and_bool',
		color: af_colors.yellow,
		attr_l: [
			{name: 'Value 1', type: 'bool', direction: 'in'},
			{name: 'Value 2', type: 'bool', direction: 'in'}
		],
		attr_r: [{name: 'Result', type: 'bool', direction: 'out'}]
	},
};