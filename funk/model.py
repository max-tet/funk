from peewee import Model, CharField, ForeignKeyField, SqliteDatabase, TextField, IntegerField, FloatField, \
    BooleanField

database = SqliteDatabase(None)


class BaseModel(Model):
    class Meta:
        database = database


class Graph(BaseModel):
    name = CharField(primary_key=True)

    def to_json(self):
        return {
            'nodes': [node.to_json() for node in self.nodes],
            'connections': [connection.to_json() for connection in self.connections]
        }


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
        if len(self.props) > 0:
            result['props'] = [prop.to_json() for prop in self.props]
        return result


class NodeProp(BaseModel):
    node = ForeignKeyField(Node, related_name='props')
    propid = CharField()
    name = CharField()
    type = CharField(choices=[('string', 'string'), ('integer', 'integer'), ('float', 'float'), ('boolean', 'boolean')])
    valueString = TextField(null=True)
    valueInteger = IntegerField(null=True)
    valueFloat = FloatField(null=True)
    valueBoolean = BooleanField(null=True)

    json_attributes = ['propid', 'name', 'type']

    def to_json(self):
        result = {attribute: getattr(self, attribute) for attribute in self.json_attributes}
        if self.type == 'string':
            result['value'] = self.valueString
        elif self.type == 'integer':
            result['value'] = self.valueInteger
        elif self.type == 'float':
            result['value'] = self.valueFloat
        elif self.type == 'boolean':
            result['value'] = self.valueBoolean
        return result


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
