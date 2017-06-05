import numpy

from funk.graphlayout.misc import bounding_box


def apply_phys_layout(nodes, scale_force: float = 0.3):
    for _ in range(50):
        forces = {k: numpy.array([0.0, 0.0]) for k in nodes.keys()}
        for force in [f(nodes) for f in [force_repel, force_attract_connected]]:
            for nodeid in forces.keys():
                forces[nodeid] += force[nodeid]

        forces = {nodeid: force * scale_force for nodeid, force in forces.items()}
        for nodeid, node in nodes.items():
            move_node(node, forces[nodeid])


def force_repel(nodes, distance: float = 300, max_force: float = 60):
    force_vector_dict = dict()
    for current_node_id, current_node in nodes.items():
        accumulated_force_vector = numpy.array([0.0, 0.0])
        for other_node in [n for n in nodes.values() if n is not current_node]:
            connecting_vector = vector_between(current_node, other_node)
            node_dist = node_distance(current_node, other_node)
            strength = rescale(node_dist, 0, distance, max_force, 0, limit=True)
            force_vector = rescale_vector(connecting_vector, strength * -1)
            accumulated_force_vector += force_vector
        force_vector_dict[current_node_id] = accumulated_force_vector
    return force_vector_dict


def force_attract_connected(nodes, max_force: float = 10):
    force_vector_dict = dict()
    for current_node_id, current_node in nodes.items():
        accumulated_force_vector = numpy.array([0.0, 0.0])
        for other_node in current_node.get_connected_nodes():
            connecting_vector = vector_between(current_node, other_node)
            force_vector = rescale_vector(connecting_vector, max_force)
            accumulated_force_vector += force_vector
        force_vector_dict[current_node_id] = accumulated_force_vector
    return force_vector_dict


def vector_between(node_from, node_to) -> numpy.array:
    return node_pos(node_to) - node_pos(node_from)


def node_distance(node_from, node_to) -> float:
    node_from_top, node_from_bottom, node_from_left, node_from_right = bounding_box(node_from)
    node_to_top, node_to_bottom, node_to_left, node_to_right = bounding_box(node_to)
    horizontal_distance = range_distance(node_from_left, node_from_right, node_to_left, node_to_right)
    vertical_distance = range_distance(node_from_top, node_from_bottom, node_to_top, node_to_bottom)
    vector = numpy.array([horizontal_distance, vertical_distance])
    return numpy.linalg.norm(vector)


def vector_length(vector: numpy.array) -> float:
    return numpy.linalg.norm(vector)


def rescale_vector(vector: numpy.array, length: float):
    return vector / vector_length(vector) * length


def node_pos(node):
    return numpy.array([node.x, node.y])


def rescale(in_value, old_from, old_to, new_from, new_to, limit: bool = False) -> float:
    if limit:
        if old_from < old_to:
            in_value = min(in_value, old_to)
            in_value = max(in_value, old_from)
        if old_to < old_from:
            in_value = min(in_value, old_from)
            in_value = max(in_value, old_to)
    return (in_value - old_from) * (new_from - new_to) / (old_from - old_to) + new_from


def range_distance(a_left, a_right, b_left, b_right) -> float:
    if is_between(a_left, b_left, b_right) or is_between(a_right, b_left, b_right) \
            or is_between(b_left, a_left, a_right) or is_between(b_right, a_left, a_right):
        return 0.0
    return min([abs(a - b) for a in [a_left, a_right] for b in [b_left, b_right]])


def is_between(value, bound0, bound1):
    return bound0 < value < bound1 or bound0 > value > bound1


def move_node(node, vector: numpy.array):
    new_pos = node_pos(node) + vector  # type: numpy.array
    node.x = new_pos[0]
    node.y = new_pos[1]
