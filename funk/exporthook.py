import json
from pathlib import Path


def make_exporter(location: Path):
    assert location.is_dir()

    def export(graph_name: str, graph_json: dict):
        file_path = location.resolve() / '{}.json'.format(graph_name)
        with open(str(file_path), 'w') as file:
            json.dump(graph_json, file, indent=2)

    return export
