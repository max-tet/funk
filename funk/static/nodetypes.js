var colors = {
	green: '#8fbc8f',
	yellow: '#deb887',
	purple: '#A58DD2',
	red: '#FFAFA2',
	pink: '#DB92AF',
	cyan: '#2aa198'
};

var dataTypes = {
	actor: {id: 'actor', name: 'Actor', color: '#297E13'},
	boolean: {id: 'boolean', name: 'Boolean', color: '#D66326'},
	integer: {id: 'integer', name: 'Integer', color: '#153D61'},
	float: {id: 'float', name: 'Float', color: '#2aa198'},
	string: {id: 'string', name: 'String', color: '#EAA700'},
	resource: {id: 'resource', name: 'Resource', color: '#351F99'},
	timeseries: {id: 'timeseries', name: 'Timeseries', color: '#923158'}
};

var nodeTypes = {
    source_rest_server: {
        type: 'source_rest_server',
        name: 'Source Rest Server',
        color: colors.purple,
        connector_l: [],
        connector_r: [{id: 'out', name: 'Out', type: 'resource', direction: 'out'}]
    },
    dest_rest_server: {
        type: 'dest_rest_server',
        name: 'Destination Rest Server',
        color: colors.purple,
        connector_l: [{id: 'in', name: 'In', type: 'resource', direction: 'in'}],
        connector_r: []
    },
    dest_rest_client: {
        type: 'dest_rest_client',
        name: 'Destination Rest Client',
        color: colors.purple,
        connector_l: [{id: 'in', name: 'In', type: 'resource', direction: 'in'}],
        connector_r: []
    },
    dest_file_writer: {
        type: 'dest_file_writer',
        name: 'Destination File Writer',
        color: colors.purple,
        connector_l: [{id: 'in', name: 'In', type: 'resource', direction: 'in'}],
        connector_r: []
    },
    constrain_time_sampling: {
        type: 'constrain_time_sampling',
        name: 'Constrain Time Sampling',
        color: colors.purple,
        connector_l: [
            {id: 'in', name: 'In', type: 'resource', direction: 'in'},
            {id: 'secs_between_items', name: 'Seconds between Items', type: 'integer', direction: 'in'}
        ],
        connector_r: [{id: 'out', name: 'Out', type: 'resource', direction: 'out'}]
    },
    constrain_resolution: {
        type: 'constrain_resolution',
        name: 'Constrain Resolution',
        color: colors.purple,
        connector_l: [
            {id: 'in', name: 'In', type: 'resource', direction: 'in'},
            {id: 'bucket_size', name: 'Bucket Size', type: 'integer', direction: 'in'}
        ],
        connector_r: [{id: 'out', name: 'Out', type: 'resource', direction: 'out'}]
    },
    distance: {
        type: 'distance',
        name: 'Distance',
        color: colors.cyan,
        connector_l: [
            {id: 'in1', name: 'In 1', type: 'float', direction: 'in'},
            {id: 'in2', name: 'In 2', type: 'float', direction: 'in'}
        ],
        connector_r: [{id: 'distance', name: 'Distance', type: 'integer', direction: 'out'}]
    },
	actor: {
		type: 'actor',
        name: 'Actor',
		color: colors.green,
		connector_l: [],
		connector_r: [
			{id: 'out', name: 'Out', type: 'actor', direction: 'out'}
		]
	},
	actor_any: {
		type: 'actor_any',
        name: 'Any Actor',
		color: colors.green,
		connector_l: [
			{id: 'actor1', name: 'Actor 1', type: 'actor', direction: 'in'},
			{id: 'actor2', name: 'Actor 2', type: 'actor', direction: 'in'}
		],
		connector_r: [{id: 'any', name: 'Any', type: 'actor', direction: 'out'}]
	},
	actor_all: {
		type: 'actor_all',
        name: 'All Actors',
		color: colors.green,
		connector_l: [
			{id: 'actor1', name: 'Actor 1', type: 'actor', direction: 'in'},
			{id: 'actor2', name: 'Actor 2', type: 'actor', direction: 'in'}
		],
		connector_r: [{id: 'all', name: 'All', type: 'actor', direction: 'out'}]
	},
	has_attr: {
		type: 'has_attr',
        name: 'Has Attribute',
		color: colors.green,
		connector_l: [{id: 'actor', name: 'Actor', type: 'actor', direction: 'in'}],
		connector_r: [{id: 'result', name: 'Result', type: 'boolean', direction: 'out'}]
	},
	get_attr_actor: {
		type: 'get_attr_actor',
        name: 'Get Attribute from Actor',
		color: colors.green,
		connector_l: [
			{id: 'actor', name: 'Actor', type: 'actor', direction: 'in'},
			{id: 'attr_name', name: 'Attribute Name', type: 'string', direction: 'in'}
		],
		connector_r: [{id: 'result', name: 'Result', type: 'string', direction: 'out'}]
	},
	get_connector_resource: {
		type: 'get_connector_resource',
        name: 'Get Connector Resource',
		color: colors.purple,
		connector_l: [{id: 'attr_name', name: 'Attribute Name', type: 'string', direction: 'in'}],
		connector_r: [
			{id: 'resource', name: 'Resource', type: 'resource', direction: 'in'},
			{id: 'result', name: 'Result', type: 'string', direction: 'out'}
		]
	},
	resource: {
		type: 'resource',
        name: 'Resource',
		color: colors.purple,
		connector_l: [{id: 'out', name: 'Out', type: 'resource', direction: 'out'}],
		connector_r: []
	},
	permission: {
		type: 'permission',
        name: 'Permission',
		color: colors.purple,
		connector_l: [{id: 'actor', name: 'Actor', type: 'actor', direction: 'in'}],
		connector_r: [{id: 'resource', name: 'Resource', type: 'resource', direction: 'in'}]
	},
	permission_if: {
		type: 'permission_if',
        name: 'Grant Permission If',
		color: colors.purple,
		connector_l: [
			{id: 'out', name: 'Out', type: 'resource', direction: 'out'},
			{id: 'if', name: 'If', type: 'boolean', direction: 'in'}
		],
		connector_r: [{id: 'resource', name: 'Resource', type: 'resource', direction: 'in'}]
	},
	resource_to_timeseries: {
		type: 'resource_to_timeseries',
        name: 'Convert Resource to Timeseries',
		color: colors.pink,
		connector_l: [{id: 'out', name: 'Out', type: 'timeseries', direction: 'out'}],
		connector_r: [{id: 'in', name: 'In', type: 'resource', direction: 'in'}]
	},
	timeseries_to_resource: {
		type: 'timeseries_to_resource',
        name: 'Convert Timeseries to Resource',
		color: colors.pink,
		connector_l: [{id: 'out', name: 'Out', type: 'resource', direction: 'out'}],
		connector_r: [{id: 'in', name: 'In', type: 'timeseries', direction: 'in'}]
	},
	merge_timeseries: {
		type: 'merge_timeseries',
        name: 'Merge Timeseries',
		color: colors.pink,
		connector_l: [{id: 'result', name: 'Result', type: 'timeseries', direction: 'out'}],
		connector_r: [
			{id: 'in1', name: 'In 1', type: 'timeseries', direction: 'in'},
			{id: 'in2', name: 'In 2', type: 'timeseries', direction: 'in'}
		]
	},
	change_resolution_timeseries: {
		type: 'change_resolution_timeseries',
        name: 'Change Resolution of Timesries',
		color: colors.pink,
		connector_l: [
			{id: 'result', name: 'Result', type: 'timeseries', direction: 'out'},
			{id: 'resolution', name: 'Resolution', type: 'integer', direction: 'in'}
		],
		connector_r: [{id: 'in', name: 'In', type: 'timeseries', direction: 'in'}]
	},
	const_string: {
		type: 'const_string',
        name: 'Constant String',
		color: colors.yellow,
		connector_l: [],
		connector_r: [{id: 'out', name: 'Out', type: 'string', direction: 'out'}]
	},
	string_to_integer: {
		type: 'string_to_integer',
        name: 'Convert String to Integer',
		color: colors.yellow,
		connector_l: [{id: 'in', name: 'In', type: 'string', direction: 'in'}],
		connector_r: [{id: 'out', name: 'Out', type: 'integer', direction: 'out'}]
	},
	eq_string: {
		type: 'eq_string',
        name: 'Check String Equals',
		color: colors.yellow,
		connector_l: [
			{id: 'val1', name: 'Value 1', type: 'string', direction: 'in'},
			{id: 'val2', name: 'Value 2', type: 'string', direction: 'in'}
		],
		connector_r: [{id: 'result', name: 'Result', type: 'boolean', direction: 'out'}]
	},
	const_integer: {
		type: 'const_integer',
        name: 'Constant Integer',
		color: colors.yellow,
		connector_l: [],
		connector_r: [{id: 'out', name: 'Out', type: 'integer', direction: 'out'}]
	},
	compare_integer: {
		type: 'compare_integer',
        name: 'Compare Integers',
		color: colors.yellow,
		connector_l: [
			{id: 'val1', name: 'Value 1', type: 'integer', direction: 'in'},
			{id: 'val2', name: 'Value 2', type: 'integer', direction: 'in'}
		],
		connector_r: [{id: 'result', name: 'Result', type: 'boolean', direction: 'out'}]
	},
	convert_resource_to_location: {
		type: 'convert_resource_to_location',
        name: 'Convert Resource to Location',
		color: colors.cyan,
		connector_l: [{id: 'in', name: 'In', type: 'resource', direction: 'in'}],
		connector_r: [{id: 'out', name: 'Out', type: 'float', direction: 'out'}]
	},
	convert_boolean_to_resource: {
	    type: 'convert_boolean_to_resource',
        name: 'Convert Boolean to Resource',
	    color: colors.yellow,
	    connector_l: [{id: 'in', name: 'In', type: 'boolean', direction: 'in'}],
	    connector_r: [{id: 'out', name: 'Out', type: 'resource', direction: 'out'}]
	},
	between_integer: {
		type: 'between_integer',
        name: 'Integer is between',
		color: colors.yellow,
		connector_l: [
			{id: 'min', name: 'Minimum', type: 'integer', direction: 'in'},
			{id: 'val', name: 'Value', type: 'integer', direction: 'in'},
			{id: 'max', name: 'Maximum', type: 'integer', direction: 'in'}
		],
		connector_r: [{id: 'result', name: 'Result', type: 'boolean', direction: 'out'}]
	},
	time_of_day: {
		type: 'time_of_day',
        name: 'Current time of day',
		color: colors.yellow,
		connector_l: [],
		connector_r: [{id: 'out', name: 'Out', type: 'integer', direction: 'out'}]
	},
	const_bool: {
		type: 'const_bool',
        name: 'Constant Boolean',
		color: colors.yellow,
		connector_l: [],
		connector_r: [{id: 'out', name: 'Out', type: 'boolean', direction: 'out'}]
	},
	and_bool: {
		type: 'and_bool',
        name: 'And',
		color: colors.yellow,
		connector_l: [
			{id: 'val1', name: 'Value 1', type: 'boolean', direction: 'in'},
			{id: 'val2', name: 'Value 2', type: 'boolean', direction: 'in'}
		],
		connector_r: [{id: 'result', name: 'Result', type: 'boolean', direction: 'out'}]
	},
	const_location: {
		type: 'const_location',
        name: 'Constant Location',
		color: colors.cyan,
		connector_l: [],
		connector_r: [{id: 'out', name: 'Out', type: 'float', direction: 'out'}]
	}
};