def apply_topo_layout(nodes):
    assign_layers(nodes)
    assign_uplift_from_left(nodes)
    set_x_values_by_layer(nodes, 200)
    set_y_values_by_uplift(nodes, 100)


def assign_layers(nodes):
    leftmost_nodes = [n for n in nodes.values() if len(n.get_left_connected_nodes()) == 0]
    [n.update_layer(0) for n in leftmost_nodes]
    for node in leftmost_nodes:
        node.layer = min([n.layer for n in node.get_right_connected_nodes()]) - 1


def assign_uplift(nodes):
    for node in nodes.values():
        for side in [node.get_left_connected_nodes(), node.get_right_connected_nodes()]:
            if len(side) > 1:
                step = 1 / len(side)
                current_uplift = 1
                for connected_node in side:
                    connected_node.uplift += current_uplift
                    current_uplift -= step


def assign_uplift_from_left(nodes):
    for i, left_node in enumerate([n for n in nodes.values() if n.layer == 0]):
        left_node.uplift = float(i)
    do_later = []
    for current_nodes in get_layers(nodes, first_layer=1):
        for node in current_nodes:
            left_nodes = node.get_left_connected_nodes()
            if len(left_nodes) == 0:
                do_later.append(node)
            else:
                node.uplift = sum([n.uplift for n in left_nodes]) / len(left_nodes)
    for node in do_later:
        right_nodes = node.get_right_connected_nodes()
        node.uplift = sum([n.uplift for n in right_nodes]) / len(right_nodes)


def get_layers(nodes, first_layer=0):
    current_layer = first_layer
    while True:
        layer = [n for n in nodes.values() if n.layer == current_layer]
        if len(layer) == 0:
            raise StopIteration
        yield layer
        current_layer += 1


def set_x_values_by_layer(nodes, step=100):
    current_nodes = [n for n in nodes.values() if n.layer == 0]
    current_x = 0
    while len(current_nodes) > 0:
        for n in current_nodes:
            n.x = current_x
        current_nodes = [n for n in nodes.values() if n.layer == current_nodes[0].layer + 1]
        current_x += step


def set_y_values_by_uplift(nodes, step=100):
    current_layer_nodes = [n for n in nodes.values() if n.layer == 0]
    while len(current_layer_nodes) > 0:
        current_y = 0
        current_layer_nodes.sort(key=lambda n: n.uplift, reverse=True)
        for n in current_layer_nodes:
            n.y = current_y
            current_y += step
        current_layer_nodes = [n for n in nodes.values() if n.layer == current_layer_nodes[0].layer + 1]
