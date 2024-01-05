@echo off

SET PSQL=psql
SET DEFAULT_DB=postgres
SET METRYHUB_DB=metryhub
SET DB_USER=your-username
SET DB_PASS=your-password

:: Connect to the default database to create 'metryhub'
%PSQL% -U %DB_USER% -d %DEFAULT_DB% -c "CREATE DATABASE %METRYHUB_DB%;"

:: Create tables in the 'metryhub' database
%PSQL% -U %DB_USER% -d %METRYHUB_DB% -c "CREATE TABLE roles (role_id SERIAL PRIMARY KEY, role_name VARCHAR(255) UNIQUE NOT NULL);"
%PSQL% -U %DB_USER% -d %METRYHUB_DB% -c "CREATE TABLE users (email VARCHAR(255) PRIMARY KEY, password_hash VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, role_id INTEGER REFERENCES roles(role_id) NOT NULL, registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL);"
%PSQL% -U %DB_USER% -d %METRYHUB_DB% -c "CREATE TABLE iot_devices (device_id SERIAL PRIMARY KEY, vendor_email VARCHAR(255) REFERENCES users(email), device_name VARCHAR(255) NOT NULL, device_type VARCHAR(255) NOT NULL, registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL);"
%PSQL% -U %DB_USER% -d %METRYHUB_DB% -c "CREATE TABLE device_data (data_id SERIAL PRIMARY KEY, device_id INTEGER REFERENCES iot_devices(device_id), data_key VARCHAR(255) NOT NULL, data_value TEXT, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL);"
%PSQL% -U %DB_USER% -d %METRYHUB_DB% -c "CREATE TABLE client_subscriptions (subscription_id SERIAL PRIMARY KEY, client_email VARCHAR(255) NOT NULL REFERENCES users(email), device_id INTEGER NOT NULL REFERENCES iot_devices(device_id), subscription_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, active BOOLEAN DEFAULT TRUE NOT NULL, UNIQUE (client_email, device_id));"

:: Insert roles into the 'roles' table
%PSQL% -U %DB_USER% -d %METRYHUB_DB% -c "INSERT INTO roles (role_name) VALUES ('admin'), ('client'), ('vendor');"
