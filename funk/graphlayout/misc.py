import math
import random


def apply_border_offset(nodes, left_border: int = 10, top_border: int = 100):
    top, _, left, _ = graph_bounding_box(nodes.values())
    shift_all(nodes.values(), -left + left_border, -top + top_border)


def graph_bounding_box(nodes):
    top = float(math.inf)
    bottom = -float(math.inf)
    left = float(math.inf)
    right = -float(math.inf)

    for node in nodes:
        node_top, node_bottom, node_left, node_right = bounding_box(node)
        top = min([top, node_top])
        bottom = max([bottom, node_bottom])
        left = min([left, node_left])
        right = max([right, node_right])

    return top, bottom, left, right


def bounding_box(node):
    top = node.y - float(node.height) / 2
    bottom = node.y + float(node.height) / 2
    left = node.x - float(node.width) / 2
    right = node.x + float(node.width) / 2
    return top, bottom, left, right


def shift_all(nodes, x, y):
    for node in nodes:
        node.x += x
        node.y += y


def randomize_positions(nodes, max_deviation: float):
    for node in nodes:
        node.y += random.uniform(-max_deviation, max_deviation)
        node.x += random.uniform(-max_deviation, max_deviation)
