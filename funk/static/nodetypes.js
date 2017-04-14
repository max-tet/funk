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
	timeseries: {id: 'timeseries', name: 'Timeseries', color: '#923158'},
	location: {id: 'location', name: 'Location', color: '#69AB54'},
	geo_region: {id: 'geo_region', name: 'Geographical Region', color: '#69AB54'}
};

var nodeTypes = [
    {
        type: 'source_rest_server',
        name: 'Source Rest Server',
        color: colors.purple,
        categories: ['Source'],
        connector_l: [],
        connector_r: [{id: 'out', name: 'Out', type: 'resource', direction: 'out'}]
    },
    {
        type: 'source_dataflow',
        name: 'Source Dataflow',
        color: colors.purple,
        categories: ['Source'],
        connector_l: [],
        connector_r: [{id: 'out', name: 'Out', type: 'resource', direction: 'out'}]
    },
    {
        type: 'dest_rest_server',
        name: 'Destination Rest Server',
        color: colors.purple,
        categories: ['Destination'],
        connector_l: [{id: 'in', name: 'In', type: 'resource', direction: 'in'}],
        connector_r: []
    },
    {
        type: 'dest_rest_client',
        name: 'Destination Rest Client',
        color: colors.purple,
        categories: ['Destination'],
        connector_l: [{id: 'in', name: 'In', type: 'resource', direction: 'in'}],
        connector_r: []
    },
    {
        type: 'dest_file_writer',
        name: 'Destination File Writer',
        color: colors.purple,
        categories: ['Destination'],
        connector_l: [{id: 'in', name: 'In', type: 'resource', direction: 'in'}],
        connector_r: []
    },
    {
        type: 'dest_dataflow',
        name: 'Destination Dataflow',
        color: colors.purple,
        categories: ['Destination'],
        connector_l: [{id: 'in', name: 'In', type: 'resource', direction: 'in'}],
        connector_r: []
    },
    {
        type: 'dest_email',
        name: 'Destination Email',
        color: colors.purple,
        categories: ['Destination'],
        connector_l: [{id: 'in', name: 'In', type: 'resource', direction: 'in'}],
        connector_r: []
    },
    {
        type: 'dest_sql',
        name: 'Destination SQL',
        color: colors.purple,
        categories: ['Destination'],
        connector_l: [{id: 'in', name: 'In', type: 'resource', direction: 'in'}],
        connector_r: []
    },
    {
        type: 'filter_resource',
        name: 'Filter Resource',
        color: colors.purple,
        categories: ['Resource'],
        connector_l: [
            {id: 'in', name: 'In', type: 'resource', direction: 'in'},
            {id: 'if', name: 'If', type: 'boolean', direction: 'in'}
        ],
        connector_r: [{id: 'out', name: 'Out', type: 'resource', direction: 'out'}]
    },
    {
        type: 'constrain_time_sampling',
        name: 'Constrain Time Sampling',
        color: colors.purple,
        categories: ['Resource'],
        connector_l: [
            {id: 'in', name: 'In', type: 'resource', direction: 'in'},
            {id: 'secs_between_items', name: 'Seconds between Items', type: 'integer', direction: 'in'}
        ],
        connector_r: [{id: 'out', name: 'Out', type: 'resource', direction: 'out'}]
    },
    {
        type: 'constrain_resolution',
        name: 'Constrain Resolution',
        color: colors.purple,
        categories: ['Resource'],
        connector_l: [
            {id: 'in', name: 'In', type: 'resource', direction: 'in'},
            {id: 'bucket_size', name: 'Bucket Size', type: 'integer', direction: 'in'}
        ],
        connector_r: [{id: 'out', name: 'Out', type: 'resource', direction: 'out'}]
    },
    {
        type: 'set_res_prop_str',
        name: 'Set Resource Property String',
        color: colors.purple,
        categories: ['Resource', 'String'],
        connector_l: [
            {id: 'in', name: 'In', type: 'resource', direction: 'in'},
            {id: 'key', name: 'Key', type: 'string', direction: 'in'},
            {id: 'value', name: 'Value', type: 'string', direction: 'in'}
        ],
        connector_r: [{id: 'out', name: 'Out', type: 'resource', direction: 'out'}]
    },
    {
        type: 'get_res_prop_str',
        name: 'Get Resource Property String',
        color: colors.purple,
        categories: ['Resource', 'String'],
        connector_l: [
            {id: 'in', name: 'In', type: 'resource', direction: 'in'},
            {id: 'key', name: 'Key', type: 'string', direction: 'in'}
        ],
        connector_r: [{id: 'value', name: 'Value', type: 'string', direction: 'out'}]
    },
    {
        type: 'set_res_prop_location',
        name: 'Set Resource Property Location',
        color: colors.purple,
        categories: ['Resource', 'Location'],
        connector_l: [
            {id: 'in', name: 'In', type: 'resource', direction: 'in'},
            {id: 'key', name: 'Key', type: 'string', direction: 'in'},
            {id: 'value', name: 'Value', type: 'location', direction: 'in'}
        ],
        connector_r: [{id: 'out', name: 'Out', type: 'resource', direction: 'out'}]
    },
    {
        type: 'get_res_prop_location',
        name: 'Get Resource Property Location',
        color: colors.purple,
        categories: ['Resource', 'Location'],
        connector_l: [
            {id: 'in', name: 'In', type: 'resource', direction: 'in'},
            {id: 'key', name: 'Key', type: 'string', direction: 'in'}
        ],
        connector_r: [{id: 'value', name: 'Value', type: 'location', direction: 'out'}]
    },
    {
        type: 'distance',
        name: 'Distance',
        color: '#A1D490',
        categories: ['Location'],
        connector_l: [
            {id: 'in1', name: 'In 1', type: 'location', direction: 'in'},
            {id: 'in2', name: 'In 2', type: 'location', direction: 'in'}
        ],
        connector_r: [{id: 'distance', name: 'Distance', type: 'integer', direction: 'out'}]
    },
	{
		type: 'location_in_region',
        name: 'Location in Region',
		color: '#A1D490',
        categories: ['Location'],
		connector_l: [
			{id: 'location', name: 'Location', type: 'location', direction: 'in'},
			{id: 'region', name: 'Region', type: 'geo_region', direction: 'in'}
		],
		connector_r: [{id: 'result', name: 'Result', type: 'boolean', direction: 'out'}]
	},
	{
		type: 'actor',
        name: 'Actor',
		color: colors.green,
		connector_l: [],
		connector_r: [
			{id: 'out', name: 'Out', type: 'actor', direction: 'out'}
		]
	},
	{
		type: 'actor_any',
        name: 'Any Actor',
		color: colors.green,
		connector_l: [
			{id: 'actor1', name: 'Actor 1', type: 'actor', direction: 'in'},
			{id: 'actor2', name: 'Actor 2', type: 'actor', direction: 'in'}
		],
		connector_r: [{id: 'any', name: 'Any', type: 'actor', direction: 'out'}]
	},
	{
		type: 'actor_all',
        name: 'All Actors',
		color: colors.green,
		connector_l: [
			{id: 'actor1', name: 'Actor 1', type: 'actor', direction: 'in'},
			{id: 'actor2', name: 'Actor 2', type: 'actor', direction: 'in'}
		],
		connector_r: [{id: 'all', name: 'All', type: 'actor', direction: 'out'}]
	},
	{
		type: 'has_attr',
        name: 'Has Attribute',
		color: colors.green,
		connector_l: [{id: 'actor', name: 'Actor', type: 'actor', direction: 'in'}],
		connector_r: [{id: 'result', name: 'Result', type: 'boolean', direction: 'out'}]
	},
	{
		type: 'get_attr_actor',
        name: 'Get Attribute from Actor',
		color: colors.green,
		connector_l: [
			{id: 'actor', name: 'Actor', type: 'actor', direction: 'in'},
			{id: 'attr_name', name: 'Attribute Name', type: 'string', direction: 'in'}
		],
		connector_r: [{id: 'result', name: 'Result', type: 'string', direction: 'out'}]
	},
	{
		type: 'get_connector_resource',
        name: 'Get Connector Resource',
		color: colors.purple,
		connector_l: [{id: 'attr_name', name: 'Attribute Name', type: 'string', direction: 'in'}],
		connector_r: [
			{id: 'resource', name: 'Resource', type: 'resource', direction: 'in'},
			{id: 'result', name: 'Result', type: 'string', direction: 'out'}
		]
	},
	{
		type: 'resource',
        name: 'Resource',
		color: colors.purple,
		connector_l: [{id: 'out', name: 'Out', type: 'resource', direction: 'out'}],
		connector_r: []
	},
	{
		type: 'permission',
        name: 'Permission',
		color: colors.purple,
		connector_l: [{id: 'actor', name: 'Actor', type: 'actor', direction: 'in'}],
		connector_r: [{id: 'resource', name: 'Resource', type: 'resource', direction: 'in'}]
	},
	{
		type: 'permission_if',
        name: 'Grant Permission If',
		color: colors.purple,
		connector_l: [
			{id: 'out', name: 'Out', type: 'resource', direction: 'out'},
			{id: 'if', name: 'If', type: 'boolean', direction: 'in'}
		],
		connector_r: [{id: 'resource', name: 'Resource', type: 'resource', direction: 'in'}]
	},
	{
		type: 'resource_to_timeseries',
        name: 'Convert Resource to Timeseries',
		color: colors.pink,
		connector_l: [{id: 'out', name: 'Out', type: 'timeseries', direction: 'out'}],
		connector_r: [{id: 'in', name: 'In', type: 'resource', direction: 'in'}]
	},
	{
		type: 'timeseries_to_resource',
        name: 'Convert Timeseries to Resource',
		color: colors.pink,
		connector_l: [{id: 'out', name: 'Out', type: 'resource', direction: 'out'}],
		connector_r: [{id: 'in', name: 'In', type: 'timeseries', direction: 'in'}]
	},
	{
		type: 'merge_timeseries',
        name: 'Merge Timeseries',
		color: colors.pink,
		connector_l: [{id: 'result', name: 'Result', type: 'timeseries', direction: 'out'}],
		connector_r: [
			{id: 'in1', name: 'In 1', type: 'timeseries', direction: 'in'},
			{id: 'in2', name: 'In 2', type: 'timeseries', direction: 'in'}
		]
	},
	{
		type: 'change_resolution_timeseries',
        name: 'Change Resolution of Timesries',
		color: colors.pink,
		connector_l: [
			{id: 'result', name: 'Result', type: 'timeseries', direction: 'out'},
			{id: 'resolution', name: 'Resolution', type: 'integer', direction: 'in'}
		],
		connector_r: [{id: 'in', name: 'In', type: 'timeseries', direction: 'in'}]
	},
	{
		type: 'const_string',
        name: 'Constant String',
		color: colors.yellow,
		connector_l: [],
		connector_r: [{id: 'out', name: 'Out', type: 'string', direction: 'out'}],
		props: [
		    {propid: 'value', name: 'Value', type: 'string', value: ''}
		]
	},
	{
		type: 'fill_template_str',
        name: 'Fill Template String',
		color: colors.yellow,
		connector_l: [
		    {id: 'template', name: 'Template', type: 'string', direction: 'in'},
		    {id: 'resource', name: 'Resource', type: 'resource', direction: 'in'}
		],
		connector_r: [{id: 'out', name: 'Out', type: 'string', direction: 'out'}]
	},
	{
		type: 'string_to_integer',
        name: 'Convert String to Integer',
		color: colors.yellow,
		connector_l: [{id: 'in', name: 'In', type: 'string', direction: 'in'}],
		connector_r: [{id: 'out', name: 'Out', type: 'integer', direction: 'out'}]
	},
	{
		type: 'eq_string',
        name: 'Check String Equals',
		color: colors.yellow,
		connector_l: [
			{id: 'val1', name: 'Value 1', type: 'string', direction: 'in'},
			{id: 'val2', name: 'Value 2', type: 'string', direction: 'in'}
		],
		connector_r: [{id: 'result', name: 'Result', type: 'boolean', direction: 'out'}]
	},
	{
		type: 'const_integer',
        name: 'Constant Integer',
		color: colors.yellow,
		connector_l: [],
		connector_r: [{id: 'out', name: 'Out', type: 'integer', direction: 'out'}],
		props: [
		    {propid: 'value', name: 'Value', type: 'integer', value: 0}
		]
	},
	{
		type: 'compare_integer',
        name: 'Compare Integers',
		color: colors.yellow,
		connector_l: [
			{id: 'val1', name: 'Value 1', type: 'integer', direction: 'in'},
			{id: 'val2', name: 'Value 2', type: 'integer', direction: 'in'}
		],
		connector_r: [{id: 'result', name: 'Result', type: 'boolean', direction: 'out'}]
	},
	{
		type: 'has_changed_bool',
        name: 'Has Changed (Boolean)',
		color: colors.yellow,
		connector_l: [
			{id: 'val', name: 'Value', type: 'boolean', direction: 'in'},
			{id: 'context', name: 'Context', type: 'string', direction: 'in'}
		],
		connector_r: [{id: 'has_changed', name: 'Has changed', type: 'boolean', direction: 'out'}]
	},
	{
		type: 'convert_resource_to_location',
        name: 'Convert Resource to Location',
		color: '#A1D490',
		connector_l: [{id: 'in', name: 'In', type: 'resource', direction: 'in'}],
		connector_r: [{id: 'out', name: 'Out', type: 'location', direction: 'out'}]
	},
	{
	    type: 'convert_boolean_to_resource',
        name: 'Convert Boolean to Resource',
	    color: colors.yellow,
	    connector_l: [{id: 'in', name: 'In', type: 'boolean', direction: 'in'}],
	    connector_r: [{id: 'out', name: 'Out', type: 'resource', direction: 'out'}]
	},
	{
	    type: 'convert_string_to_resource',
        name: 'Convert String to Resource',
	    color: colors.yellow,
	    connector_l: [{id: 'in', name: 'In', type: 'string', direction: 'in'}],
	    connector_r: [{id: 'out', name: 'Out', type: 'resource', direction: 'out'}]
	},
	{
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
	{
		type: 'time_of_day',
        name: 'Current time of day',
		color: colors.yellow,
		connector_l: [],
		connector_r: [{id: 'out', name: 'Out', type: 'integer', direction: 'out'}]
	},
	{
		type: 'const_bool',
        name: 'Constant Boolean',
		color: colors.yellow,
		connector_l: [],
		connector_r: [{id: 'out', name: 'Out', type: 'boolean', direction: 'out'}],
		props: [
		    {propid: 'value', name: 'Value', type: 'boolean', value: false}
		]
	},
	{
		type: 'and_bool',
        name: 'And',
		color: colors.yellow,
		connector_l: [
			{id: 'val1', name: 'Value 1', type: 'boolean', direction: 'in'},
			{id: 'val2', name: 'Value 2', type: 'boolean', direction: 'in'}
		],
		connector_r: [{id: 'result', name: 'Result', type: 'boolean', direction: 'out'}]
	},
	{
		type: 'not_bool',
        name: 'Not',
		color: colors.yellow,
		connector_l: [{id: 'in', name: 'In', type: 'boolean', direction: 'in'}],
		connector_r: [{id: 'out', name: 'Out', type: 'boolean', direction: 'out'}]
	},
	{
		type: 'const_resource',
        name: 'Constant Resource',
		color: colors.purple,
		connector_l: [],
		connector_r: [{id: 'out', name: 'Out', type: 'resource', direction: 'out'}]
	},
	{
		type: 'const_location',
        name: 'Constant Location',
		color: '#A1D490',
		connector_l: [],
		connector_r: [{id: 'out', name: 'Out', type: 'location', direction: 'out'}],
		props: [
		    {propid: 'lat', name: 'Latitude', type: 'float', value: 0},
		    {propid: 'lng', name: 'Longitude', type: 'float', value: 0}
		]
	},
	{
		type: 'const_geo_region',
        name: 'Constant Geographical Region',
		color: '#A1D490',
		connector_l: [],
		connector_r: [{id: 'out', name: 'Out', type: 'geo_region', direction: 'out'}]
	}
];