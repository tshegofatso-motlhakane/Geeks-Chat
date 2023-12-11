-- creating a users table
create type user_status_enum as enum('offline','online');
create table users(
  id bigint primary key generated always as identity (start with 1000),
  username varchar(255) not null unique,
  email varchar(255) not null unique,
  user_password varchar(255) not null,
  firstname varchar(255),
  lastname varchar(255),
  user_bio text,
  user_sponsor varchar(255),
  profile_picture text,
  user_status user_status_enum default 'offline',
  lastseen timestamp not null
);
--conversation table

create type conversation_type_enum as enum('private','group');
create table conversation(
  conversation_id bigserial primary key not null ,
  conversation_type conversation_type_enum not null default 'private',
  created_at timestamp default now()
);

-- messages table ->  
create table messages(
	message_id bigserial primary key not null ,
	conversation_id bigint not null,
	sender_id bigint not null,
	message_content text not null,
	sent_at timestamp not null default now(),
	is_read boolean not null default false,
	foreign key(conversation_id) references conversation(conversation_id),
	foreign key(sender_id) references users(user_id)
);

-- participants table
create table participants(
 user_id bigint not null,
 conversation_id bigint not null,
 primary key(user_id,conversation_id),
 foreign key(conversation_id) references conversation(conversation_id),
 foreign key(user_id) references users(user_id)
);

-- contact table

create table contacts(
 contact_id bigserial primary key not null unique,
 user_id bigint not null,
 contact_user_id bigint not null,
 created_at timestamp default now(),
 foreign key(user_id) references users(user_id)
);