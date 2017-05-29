import math


def apply_border_offset(nodes, left_border: int = 10, top_border: int = 100):
    top, _, left, _ = bounding_box(nodes.values())
    shift_all(nodes.values(), -left + left_border, -top + top_border)


def bounding_box(nodes):
    top = float(math.inf)
    bottom = -float(math.inf)
    left = float(math.inf)
    right = -float(math.inf)

    for node in nodes:
        top = min([top, node.y - float(node.height) / 2])
        bottom = max([bottom, node.y + float(node.height) / 2])
        left = min([left, node.x - float(node.width) / 2])
        right = max([right, node.x + float(node.width) / 2])

    return top, bottom, left, right


def shift_all(nodes, x, y):
    for node in nodes:
        node.x += x
        node.y += y
