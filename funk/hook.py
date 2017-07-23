import json
from enum import Enum, auto
from pathlib import Path


class HookType(Enum):
    UPDATE_GRAPH = auto()
    DELETE_GRAPH = auto()
    CREATE_GRAPH = auto()


def make_export_hook(location: Path):
    assert location.is_dir()

    def export(hook_type: HookType, **args):
        if hook_type not in [HookType.CREATE_GRAPH, HookType.UPDATE_GRAPH]:
            return

        graph_name = args['graph_name']
        graph_json = args['graph_json']
        file_path = location.resolve() / '{}.json'.format(graph_name)
        with open(str(file_path), 'w') as file:
            json.dump(graph_json, file, indent=2)

    return export


def make_delete_hook(location: Path):
    assert location.is_dir()

    def delete(hook_type: HookType, **args):
        if hook_type is not HookType.DELETE_GRAPH:
            return

        graph_name = args['graph_name']
        file_path = location.resolve() / '{}.json'.format(graph_name)
        try:
            file_path.unlink()
        except FileNotFoundError:
            pass

    return delete
