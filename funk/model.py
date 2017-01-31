from peewee import Model, CharField, ForeignKeyField, SqliteDatabase

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


class Connection(BaseModel):
    graph = ForeignKeyField(Graph, related_name='connections')
    in_node = ForeignKeyField(Node, related_name='in_connections')
    in_connector = CharField()
    out_node = ForeignKeyField(Node, related_name='out_connections')
    out_connector = CharField()


def init_db(db_path: str):
    database.init(db_path)
    return database


def create_tables(db):
    db.create_tables([Graph, Node, Connection], safe=True)
