import pytest

from funk import model


@pytest.fixture
def database():
    db = model.init_db(':memory:')
    db.connect()
    model.create_tables(db)
    return db
