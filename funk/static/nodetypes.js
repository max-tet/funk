var colors = {
	green: '#8fbc8f',
	yellow: '#deb887',
	purple: '#A58DD2',
	red: '#FFAFA2',
	pink: '#DB92AF',
	cyan: '#2aa198'
};

var dataTypes = {
	actor: '#297E13',
	bool: '#D66326',
	integer: '#153D61',
	float: '#2aa198',
	string: '#EAA700',
	resource: '#351F99',
	timeseries: '#923158'
};

var nodeTypes = {
    source_rest_server: {
        type: 'source_rest_server',
        color: colors.purple,
        connector_l: [],
        connector_r: [{id: 'out', name: 'Out', type: 'resource', direction: 'out'}]
    },
    dest_rest_server: {
        type: 'dest_rest_server',
        color: colors.purple,
        connector_l: [{id: 'in', name: 'In', type: 'resource', direction: 'in'}],
        connector_r: []
    },
    dest_rest_client: {
        type: 'dest_rest_client',
        color: colors.purple,
        connector_l: [{id: 'in', name: 'In', type: 'resource', direction: 'in'}],
        connector_r: []
    },
    dest_file_writer: {
        type: 'dest_file_writer',
        color: colors.purple,
        connector_l: [{id: 'in', name: 'In', type: 'resource', direction: 'in'}],
        connector_r: []
    },
    constrain_time_sampling: {
        type: 'constrain_time_sampling',
        color: colors.purple,
        connector_l: [
            {id: 'in', name: 'In', type: 'resource', direction: 'in'},
            {id: 'secs_between_items', name: 'Seconds between Items', type: 'integer', direction: 'in'}
        ],
        connector_r: [{id: 'out', name: 'Out', type: 'resource', direction: 'out'}]
    },
    constrain_resolution: {
        type: 'constrain_resolution',
        color: colors.purple,
        connector_l: [
            {id: 'in', name: 'In', type: 'resource', direction: 'in'},
            {id: 'bucket_size', name: 'Bucket Size', type: 'integer', direction: 'in'}
        ],
        connector_r: [{id: 'out', name: 'Out', type: 'resource', direction: 'out'}]
    },
    distance: {
        type: 'distance',
        color: colors.cyan,
        connector_l: [
            {id: 'in1', name: 'In 1', type: 'float', direction: 'in'},
            {id: 'in2', name: 'In 2', type: 'float', direction: 'in'}
        ],
        connector_r: [{id: 'distance', name: 'Distance', type: 'integer', direction: 'out'}]
    },
    compare_integer: {
		type: 'compare_integer',
		color: colors.yellow,
		connector_l: [
			{id: 'val1', name: 'Value 1', type: 'integer', direction: 'in'},
			{id: 'val2', name: 'Value 2', type: 'integer', direction: 'in'}
		],
		connector_r: [{id: 'result', name: 'Result', type: 'bool', direction: 'out'}]
	},
	convert_resource_to_location: {
		type: 'convert_resource_to_location',
		color: colors.cyan,
		connector_l: [{id: 'in', name: 'In', type: 'resource', direction: 'in'}],
		connector_r: [{id: 'out', name: 'Out', type: 'float', direction: 'out'}]
	},
	convert_boolean_to_resource: {
	    type: 'convert_boolean_to_resource',
	    color: colors.yellow,
	    connector_l: [{id: 'in', name: 'In', type: 'bool', direction: 'in'}],
	    connector_r: [{id: 'out', name: 'Out', type: 'resource', direction: 'out'}]
	},
	const_integer: {
		type: 'const_integer',
		color: colors.yellow,
		connector_l: [],
		connector_r: [{id: 'out', name: 'Out', type: 'integer', direction: 'out'}]
	},
	const_location: {
		type: 'const_location',
		color: colors.cyan,
		connector_l: [],
		connector_r: [{id: 'out', name: 'Out', type: 'float', direction: 'out'}]
	}
};