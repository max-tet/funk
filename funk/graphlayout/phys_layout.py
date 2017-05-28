import re

import numpy


def apply_phys_layout(nodes, scale_force: float = 0.05):
    for _ in range(50):
        forces = {k: numpy.array([0.0, 0.0]) for k in nodes.keys()}
        for force in [f(nodes) for f in [force_repel]]:
            for nodeid in forces.keys():
                forces[nodeid] += force[nodeid]

        forces = {nodeid: force * scale_force for nodeid, force in forces.items()}
        for nodeid, node in nodes.items():
            move_node(node, forces[nodeid])


def force_repel(nodes, distance: float = 50, max_force: float = 10):
    force_vector_dict = dict()
    for current_node_id, current_node in nodes.items():
        accumulated_force_vector = numpy.array([0.0, 0.0])
        for other_node in [n for n in nodes.values() if n is not current_node]:
            connecting_vector = vector_between(current_node, other_node)
            strength = rescale(vector_length(connecting_vector), 0, distance, max_force, 0, limit=True)
            force_vector = rescale_vector(connecting_vector, strength * -1)
            accumulated_force_vector += force_vector
        force_vector_dict[current_node_id] = accumulated_force_vector
    return force_vector_dict


def vector_between(node_from, node_to) -> numpy.array:
    return node_pos(node_to) - node_pos(node_from)


def vector_length(vector: numpy.array) -> float:
    return numpy.linalg.norm(vector)


def rescale_vector(vector: numpy.array, length: float):
    return vector / vector_length(vector) * length


def node_pos(node):
    pattern = '^(-?[0-9]*(\.[0-9]*)?)px'
    try:
        x = re.match(pattern, node.x).group(1)
        y = re.match(pattern, node.y).group(1)
    except AttributeError as e:
        raise AttributeError('failed to match {} or {}'.format(node.x, node.y)) from e

    return numpy.array([float(x), float(y)])


def rescale(input: float, old_from: float, old_to: float, new_from: float, new_to: float, limit: bool = False) -> float:
    val = (input - old_from) * (new_to / old_to) + new_from
    if limit:
        val = min(val, new_to)
        val = max(val, new_from)
    return val


def move_node(node, vector: numpy.array):
    new_pos = node_pos(node) + vector  # type: numpy.array
    node.x = '{}px'.format(new_pos[0])
    node.y = '{}px'.format(new_pos[1])
