import pytest
import json
from transformer import app, transform_data

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_zero_voltage():
    assert transform_data(0.5) == 0.0

def test_positive_temp():
    assert transform_data(1.0) == 10.0

def test_below_baseline():
    assert transform_data(0.0) == -10.0

def test_rounding():
    assert transform_data(0.555) == 1.1

def test_valid_post(client):
    res = client.post('/transform',
        data=json.dumps({'voltage': 1.0, 'timestamp': 1234567890.0}),
        content_type='application/json'
    )
    assert res.status_code == 200
    assert res.get_json()['temperature'] == 10.0

def test_missing_voltage(client):
    res = client.post('/transform',
        data=json.dumps({'timestamp': 1234567890.0}),
        content_type='application/json'
    )
    assert res.status_code == 400

def test_bad_json(client):
    res = client.post('/transform',
        data='not json',
        content_type='application/json'
    )
    assert res.status_code == 400

def test_get_not_allowed(client):
    assert client.get('/transform').status_code == 405