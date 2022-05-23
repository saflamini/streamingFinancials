CREATE DATABASE accounting_system;

CREATE TABLE companies (
    id int PRIMARY KEY,
    owner varchar(42),
    address varchar(42),
    chain_id int
)

CREATE TABLE accounts (
    address varchar(42) PRIMARY KEY,
    company_address varchar(42),
    company_id int, 
    last_changed int,
    chain_id int,
    authorized boolean,
    CONSTRAINT fk_company_id FOREIGN KEY(company_id) REFERENCES companies(id)
);

CREATE TABLE incoming_transactions (
    tx_hash varchar PRIMARY KEY,
    event_type varchar,
    token varchar(42),
    timestamp_value int,
    value_total int,
    from_address varchar(42),
    company_id int,
    CONSTRAINT fk_company_id FOREIGN KEY (company_id) REFERENCES companies (id)
);

CREATE TABLE outgoing_transactions (
    tx_hash varchar PRIMARY KEY,
    event_type varchar,
    token varchar(42),
    timestamp_value int,
    value_total int,
    from_address varchar(42),
    to_address varchar(42),
    company_id int,
    CONSTRAINT fk_company_id FOREIGN KEY (company_id) REFERENCES companies (id)
);

