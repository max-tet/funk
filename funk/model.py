from peewee import Model, CharField, SqliteDatabase, TextField, DateTimeField

database = SqliteDatabase(None)


class BaseModel(Model):
    class Meta:
        database = database


class Graph(BaseModel):
    name = CharField(primary_key=True)
    time_created = DateTimeField()
    time_modified = DateTimeField()
    graph_json = TextField()


def init_db(db_path: str):
    database.init(db_path)
    return database


def create_tables(db):
    db.create_tables([Graph], safe=True)
