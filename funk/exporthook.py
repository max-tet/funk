import json
from pathlib import Path


def export_as_json_file(location: Path, graph_name: str, graph_json: dict):
    file_path = location.resolve() / '{}.json'.format(graph_name)
    with open(str(file_path), 'w') as file:
        json.dump(graph_json, file, indent=2)
