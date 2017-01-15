def from_static(name: str):
    with open('funk/static/{}'.format(name)) as f:
        return '\n'.join(f.readlines())
