CREATE TABLE configuration
(
    config_id    SERIAL,
    config_name VARCHAR(255) UNIQUE,
    PRIMARY KEY (config_id)
);

CREATE TABLE csv_fields
(
    field_id        SERIAL,
    config_id       INT,
    field_name      VARCHAR(255) NOT NULL,
    field_type      VARCHAR(255),
    is_null_allowed VARCHAR(255),
    field_length    VARCHAR(255),
    dependent_field VARCHAR(255),
    dependent_value VARCHAR(255),
    date_type       VARCHAR(255),
    time_type       VARCHAR(255),
    datetime_type   VARCHAR(255),
    PRIMARY KEY (field_id),
    FOREIGN KEY (config_id) REFERENCES configuration (config_id)
);

CREATE TABLE field_values
(
    value_id      SERIAL,
    allowed_value VARCHAR(255) NOT NULL,
    field_id      INT,
    PRIMARY KEY (value_id),
    FOREIGN KEY (field_id) REFERENCES csv_fields (field_id)
);


