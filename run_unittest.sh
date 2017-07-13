#!/bin/sh
pytest --cov=ac/ --cov-config=ac/tests/coverage.ini -c ac/tests/unit-pytest.ini
