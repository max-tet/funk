from peewee import Model, CharField, ForeignKeyField, IntegerField, SqliteDatabase

database = SqliteDatabase('graphs.db')


class BaseModel(Model):
    class Meta:
        database = database


class Graph(BaseModel):
    name = CharField(primary_key=True)


class Node(BaseModel):
    graph = ForeignKeyField(Graph, related_name='nodes')
    id = CharField()
    name = CharField()
    type = CharField()
    posx = IntegerField()
    posy = IntegerField()


class Connection(BaseModel):
    graph = ForeignKeyField(Graph, related_name='connections')
    in_node = ForeignKeyField(Node, related_name='in_connections')
    in_connector = CharField()
    out_node = ForeignKeyField(Node, related_name='out_connections')
    out_connector = CharField()


database.create_tables([Graph, Node, Connection], safe=True)
