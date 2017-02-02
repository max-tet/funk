var colors = {
	green: '#8fbc8f',
	yellow: '#deb887',
	purple: '#A58DD2',
	red: '#FFAFA2',
	pink: '#DB92AF'
};

var dataTypes = {
	actor: '#297E13',
	bool: '#D66326',
	integer: '#153D61',
	string: '#EAA700',
	resource: '#351F99',
	timeseries: '#923158'
};

var nodeTypes = {
	actor: {
		type: 'actor',
		color: colors.green,
		attr_l: [],
		attr_r: [
			{id: 'out', name: 'Out', type: 'actor', direction: 'out'}
		]
	},
	actor_any: {
		type: 'actor_any',
		color: colors.green,
		attr_l: [
			{id: 'actor1', name: 'Actor 1', type: 'actor', direction: 'in'},
			{id: 'actor2', name: 'Actor 2', type: 'actor', direction: 'in'}
		],
		attr_r: [{id: 'any', name: 'Any', type: 'actor', direction: 'out'}]
	},
	actor_all: {
		type: 'actor_all',
		color: colors.green,
		attr_l: [
			{id: 'actor1', name: 'Actor 1', type: 'actor', direction: 'in'},
			{id: 'actor2', name: 'Actor 2', type: 'actor', direction: 'in'}
		],
		attr_r: [{id: 'all', name: 'All', type: 'actor', direction: 'out'}]
	},
	has_attr: {
		type: 'has_attr',
		color: colors.green,
		attr_l: [{id: 'actor', name: 'Actor', type: 'actor', direction: 'in'}],
		attr_r: [{id: 'result', name: 'Result', type: 'bool', direction: 'out'}]
	},
	get_attr_actor: {
		type: 'get_attr_actor',
		color: colors.green,
		attr_l: [
			{id: 'actor', name: 'Actor', type: 'actor', direction: 'in'},
			{id: 'attr_name', name: 'Attribute Name', type: 'string', direction: 'in'}
		],
		attr_r: [{id: 'result', name: 'Result', type: 'string', direction: 'out'}]
	},
	get_attr_resource: {
		type: 'get_attr_resource',
		color: colors.purple,
		attr_l: [{id: 'attr_name', name: 'Attribute Name', type: 'string', direction: 'in'}],
		attr_r: [
			{id: 'resource', name: 'Resource', type: 'resource', direction: 'in'},
			{id: 'result', name: 'Result', type: 'string', direction: 'out'}
		]
	},
	resource: {
		type: 'resource',
		color: colors.purple,
		attr_l: [{id: 'out', name: 'Out', type: 'resource', direction: 'out'}],
		attr_r: []
	},
	permission: {
		type: 'permission',
		color: colors.purple,
		attr_l: [{id: 'actor', name: 'Actor', type: 'actor', direction: 'in'}],
		attr_r: [{id: 'resource', name: 'Resource', type: 'resource', direction: 'in'}]
	},
	permission_if: {
		type: 'permission_if',
		color: colors.purple,
		attr_l: [
			{id: 'out', name: 'Out', type: 'resource', direction: 'out'},
			{id: 'if', name: 'If', type: 'bool', direction: 'in'}
		],
		attr_r: [{id: 'resource', name: 'Resource', type: 'resource', direction: 'in'}]
	},
	resource_to_timeseries: {
		type: 'resource_to_timeseries',
		color: colors.pink,
		attr_l: [{id: 'out', name: 'Out', type: 'timeseries', direction: 'out'}],
		attr_r: [{id: 'in', name: 'In', type: 'resource', direction: 'in'}]
	},
	timeseries_to_resource: {
		type: 'timeseries_to_resource',
		color: colors.pink,
		attr_l: [{id: 'out', name: 'Out', type: 'resource', direction: 'out'}],
		attr_r: [{id: 'in', name: 'In', type: 'timeseries', direction: 'in'}]
	},
	merge_timeseries: {
		type: 'merge_timeseries',
		color: colors.pink,
		attr_l: [{id: 'result', name: 'Result', type: 'timeseries', direction: 'out'}],
		attr_r: [
			{id: 'in1', name: 'In 1', type: 'timeseries', direction: 'in'},
			{id: 'in2', name: 'In 2', type: 'timeseries', direction: 'in'}
		]
	},
	change_resolution_timeseries: {
		type: 'change_resolution_timeseries',
		color: colors.pink,
		attr_l: [
			{id: 'result', name: 'Result', type: 'timeseries', direction: 'out'},
			{id: 'resolution', name: 'Resolution', type: 'integer', direction: 'in'}
		],
		attr_r: [{id: 'in', name: 'In', type: 'timeseries', direction: 'in'}]
	},
	const_string: {
		type: 'const_string',
		color: colors.yellow,
		attr_l: [],
		attr_r: [{id: 'out', name: 'Out', type: 'string', direction: 'out'}]
	},
	string_to_integer: {
		type: 'string_to_integer',
		color: colors.yellow,
		attr_l: [{id: 'in', name: 'In', type: 'string', direction: 'in'}],
		attr_r: [{id: 'out', name: 'Out', type: 'integer', direction: 'out'}]
	},
	eq_string: {
		type: 'eq_string',
		color: colors.yellow,
		attr_l: [
			{id: 'val1', name: 'Value 1', type: 'string', direction: 'in'},
			{id: 'val2', name: 'Value 2', type: 'string', direction: 'in'}
		],
		attr_r: [{id: 'result', name: 'Result', type: 'bool', direction: 'out'}]
	},
	const_integer: {
		type: 'const_integer',
		color: colors.yellow,
		attr_l: [],
		attr_r: [{id: 'out', name: 'Out', type: 'integer', direction: 'out'}]
	},
	compare_integer: {
		type: 'compare_integer',
		color: colors.yellow,
		attr_l: [
			{id: 'val1', name: 'Value 1', type: 'integer', direction: 'in'},
			{id: 'val2', name: 'Value 2', type: 'integer', direction: 'in'}
		],
		attr_r: [{id: 'result', name: 'Result', type: 'bool', direction: 'out'}]
	},
	between_integer: {
		type: 'between_integer',
		color: colors.yellow,
		attr_l: [
			{id: 'min', name: 'Minimum', type: 'integer', direction: 'in'},
			{id: 'val', name: 'Value', type: 'integer', direction: 'in'},
			{id: 'max', name: 'Maximum', type: 'integer', direction: 'in'}
		],
		attr_r: [{id: 'result', name: 'Result', type: 'bool', direction: 'out'}]
	},
	time_of_day: {
		type: 'time_of_day',
		color: colors.yellow,
		attr_l: [],
		attr_r: [{id: 'out', name: 'Out', type: 'integer', direction: 'out'}]
	},
	const_bool: {
		type: 'const_bool',
		color: colors.yellow,
		attr_l: [],
		attr_r: [{id: 'out', name: 'Out', type: 'bool', direction: 'out'}]
	},
	and_bool: {
		type: 'and_bool',
		color: colors.yellow,
		attr_l: [
			{id: 'val1', name: 'Value 1', type: 'bool', direction: 'in'},
			{id: 'val2', name: 'Value 2', type: 'bool', direction: 'in'}
		],
		attr_r: [{id: 'result', name: 'Result', type: 'bool', direction: 'out'}]
	},
};