--liquibase formatted sql

--changeset rbp:1
create table multi
(
  tenant       uuid         not null,
  id           varchar(255) not null,
  threshold    float        not null default 0.0,
  error_cost   float        not null default 5.0,
  abstain_cost float        not null default 1.0,
  correct_cost float        not null default 0.0,
  primary key (tenant, id)
);

create table multi_data
(
  id           bigserial primary key,
  multi_tenant uuid         not null,
  multi_id     varchar(255) not null,
  ts           timestamp    not null,
  correct      varchar(255) not null,
  predictions  bytea        not null,
  foreign key (multi_tenant, multi_id) references multi (tenant, id)
);

create index multi_data_lookup on multi_data (multi_tenant, multi_id, ts);