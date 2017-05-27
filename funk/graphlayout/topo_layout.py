def apply_topo_layout(nodes, step=150):
    assign_layers(nodes)
    assign_uplift(nodes)
    set_x_values_by_layer(nodes, step)
    set_y_values_by_uplift(nodes, step)


def assign_layers(nodes):
    leftmost_nodes = [n for n in nodes.values() if len(n.get_left_connected_nodes()) == 0]
    [n.update_layer(0) for n in leftmost_nodes]
    for node in leftmost_nodes:
        node.layer = min([n.layer for n in node.get_right_connected_nodes()]) - 1


def assign_uplift(nodes):
    for node in nodes.values():
        for connected_nodes in [node.get_left_connected_nodes(), node.get_right_connected_nodes()]:
            if len(connected_nodes) > 1:
                step = 1 / len(connected_nodes)
                current_uplift = 1
                for connected_node in connected_nodes:
                    connected_node.uplift += current_uplift
                    current_uplift -= step


def set_x_values_by_layer(nodes, step=100):
    current_nodes = [n for n in nodes.values() if n.layer == 0]
    current_x = 0
    while len(current_nodes) > 0:
        for n in current_nodes:
            n.x = '{}px'.format(current_x)
        current_nodes = [n for n in nodes.values() if n.layer == current_nodes[0].layer + 1]
        current_x += step


def set_y_values_by_uplift(nodes, step=100):
    current_layer_nodes = [n for n in nodes.values() if n.layer == 0]
    while len(current_layer_nodes) > 0:
        current_y = 0
        current_layer_nodes.sort(key=lambda n: n.uplift, reverse=True)
        for n in current_layer_nodes:
            n.y = '{}px'.format(current_y)
            current_y += step
        current_layer_nodes = [n for n in nodes.values() if n.layer == current_layer_nodes[0].layer + 1]
