from peewee import Model, CharField, ForeignKeyField, SqliteDatabase, CompositeKey

database = SqliteDatabase(None)


class BaseModel(Model):
    class Meta:
        database = database


class Graph(BaseModel):
    name = CharField(primary_key=True)


class Node(BaseModel):
    graph = ForeignKeyField(Graph, related_name='nodes')
    nodeid = CharField()
    name = CharField()
    type = CharField()
    top = CharField()
    left = CharField()

    json_attributes = ['nodeid', 'name', 'type', 'top', 'left']

    def to_json(self):
        result = {attribute: getattr(self, attribute) for attribute in self.json_attributes}
        result['props'] = [prop.to_json() for prop in self.props]
        return result


class NodeProp(BaseModel):
    node = ForeignKeyField(Node, related_name='props')
    id = CharField()
    name = CharField()
    type = CharField()
    value = CharField()

    class Meta:
        primary_key = CompositeKey('node', 'id')

    json_attributes = ['id', 'name', 'type', 'value']

    def to_json(self):
        return {attribute: getattr(self, attribute) for attribute in self.json_attributes}


class Connection(BaseModel):
    graph = ForeignKeyField(Graph, related_name='connections')
    out_node = ForeignKeyField(Node, related_name='out_connections')
    out_connector = CharField()
    in_node = ForeignKeyField(Node, related_name='in_connections')
    in_connector = CharField()

    json_attributes = ['out_node', 'out_connector', 'in_node', 'in_connector']

    def to_json(self):
        d = {attribute: getattr(self, attribute) for attribute in self.json_attributes}
        d['out_node'] = d['out_node'].nodeid
        d['in_node'] = d['in_node'].nodeid
        return d


def init_db(db_path: str):
    database.init(db_path)
    return database


def create_tables(db):
    db.create_tables([Graph, Node, NodeProp, Connection], safe=True)
