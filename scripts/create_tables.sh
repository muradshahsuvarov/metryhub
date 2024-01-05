#!/bin/bash

PSQL="psql"
DEFAULT_DB="postgres"
METRYHUB_DB="metryhub"
DB_USER="your-username"
DB_PASS="your-password"

echo "Creating database '$METRYHUB_DB'"
$PSQL -U $DB_USER -d $DEFAULT_DB -c "CREATE DATABASE $METRYHUB_DB;"

SQL_STATEMENTS="
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE users (
    email VARCHAR(255) PRIMARY KEY,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE iot_devices (
    device_id SERIAL PRIMARY KEY,
    vendor_email VARCHAR(255) REFERENCES users(email),
    device_name VARCHAR(255) NOT NULL,
    device_type VARCHAR(255) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE device_data (
    data_id SERIAL PRIMARY KEY,
    device_id INTEGER REFERENCES iot_devices(device_id),
    data_key VARCHAR(255) NOT NULL,
    data_value TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE client_subscriptions (
    subscription_id SERIAL PRIMARY KEY,
    client_email VARCHAR(255) NOT NULL REFERENCES users(email),
    device_id INTEGER NOT NULL REFERENCES iot_devices(device_id),
    subscription_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    active BOOLEAN DEFAULT TRUE NOT NULL,
    UNIQUE (client_email, device_id)
);

INSERT INTO roles (role_name) VALUES ('admin'), ('client'), ('vendor');
"

echo "Creating tables and inserting roles in '$METRYHUB_DB'"
echo "$SQL_STATEMENTS" | $PSQL -U $DB_USER -d $METRYHUB_DB
