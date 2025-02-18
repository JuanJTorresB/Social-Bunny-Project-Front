-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION pg_database_owner;

-- Drop table

-- DROP TABLE public."comment";

CREATE TABLE public."comment" (
	id int8 GENERATED BY DEFAULT AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE) NOT NULL,
	id_post int8 NOT NULL,
	id_user int8 NOT NULL,
	body varchar(255) NOT NULL,
	CONSTRAINT comment_pkey PRIMARY KEY (id),
	CONSTRAINT comment_id_post_fkey FOREIGN KEY (id_post) REFERENCES public.post(id) ON DELETE CASCADE,
	CONSTRAINT comment_id_user_fkey FOREIGN KEY (id_user) REFERENCES public."user"(id) ON DELETE CASCADE
);

-- Drop table

-- DROP TABLE public.follower;

CREATE TABLE public.follower (
	id int8 GENERATED BY DEFAULT AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE) NOT NULL,
	id_followed int8 NOT NULL,
	id_follower int8 NOT NULL,
	CONSTRAINT follower_pkey PRIMARY KEY (id),
	CONSTRAINT no_self_follow CHECK ((id_followed <> id_follower)),
	CONSTRAINT unique_follow UNIQUE (id_followed, id_follower),
	CONSTRAINT follower_id_followed_fkey FOREIGN KEY (id_followed) REFERENCES public."user"(id) ON DELETE CASCADE,
	CONSTRAINT follower_id_follower_fkey FOREIGN KEY (id_follower) REFERENCES public."user"(id) ON DELETE CASCADE
);

-- Drop table

-- DROP TABLE public.mention;

CREATE TABLE public.mention (
	id_post int8 NOT NULL,
	id_user int8 NOT NULL,
	CONSTRAINT unique_mention UNIQUE (id_post, id_user),
	CONSTRAINT mention_id_post_fkey FOREIGN KEY (id_post) REFERENCES public.post(id) ON DELETE CASCADE,
	CONSTRAINT mention_id_user_fkey FOREIGN KEY (id_user) REFERENCES public."user"(id) ON DELETE CASCADE
);

-- Drop table

-- DROP TABLE public.notification;

CREATE TABLE public.notification (
	id int8 GENERATED BY DEFAULT AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE) NOT NULL,
	id_user int8 NOT NULL,
	"type" varchar(255) NOT NULL,
	id_comment int8 NULL,
	id_reaction int8 NULL,
	id_follower int8 NULL,
	id_post int8 NULL,
	seen bool DEFAULT false NULL,
	CONSTRAINT notification_pkey PRIMARY KEY (id),
	CONSTRAINT notification_id_comment_fkey FOREIGN KEY (id_comment) REFERENCES public."comment"(id) ON DELETE CASCADE,
	CONSTRAINT notification_id_follower_fkey FOREIGN KEY (id_follower) REFERENCES public.follower(id) ON DELETE CASCADE,
	CONSTRAINT notification_id_post_fkey FOREIGN KEY (id_post) REFERENCES public.post(id) ON DELETE CASCADE,
	CONSTRAINT notification_id_reaction_fkey FOREIGN KEY (id_reaction) REFERENCES public.reaction(id) ON DELETE CASCADE,
	CONSTRAINT notification_id_user_fkey FOREIGN KEY (id_user) REFERENCES public."user"(id) ON DELETE CASCADE
);

-- Drop table

-- DROP TABLE public.post;

CREATE TABLE public.post (
	id int8 GENERATED BY DEFAULT AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE) NOT NULL,
	id_user int8 NOT NULL,
	description varchar(255) NULL,
	img varchar(2083) NULL,
	creation_date date NOT NULL,
	count_comments int4 NULL,
	count_reactions int4 NULL,
	CONSTRAINT post_pkey PRIMARY KEY (id),
	CONSTRAINT post_id_user_fkey FOREIGN KEY (id_user) REFERENCES public."user"(id) ON DELETE CASCADE
);

-- Drop table

-- DROP TABLE public.post_x_tag;

CREATE TABLE public.post_x_tag (
	id_post int8 NOT NULL,
	id_tag int8 NOT NULL,
	CONSTRAINT post_x_tag_id_post_fkey FOREIGN KEY (id_post) REFERENCES public.post(id) ON DELETE CASCADE,
	CONSTRAINT post_x_tag_id_tag_fkey FOREIGN KEY (id_tag) REFERENCES public.tag(id) ON DELETE CASCADE
);

-- Drop table

-- DROP TABLE public.reaction;

CREATE TABLE public.reaction (
	id int8 GENERATED BY DEFAULT AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE) NOT NULL,
	id_post int8 NOT NULL,
	id_user int8 NOT NULL,
	"type" varchar(255) NOT NULL,
	CONSTRAINT reaction_pkey PRIMARY KEY (id),
	CONSTRAINT reaction_id_post_fkey FOREIGN KEY (id_post) REFERENCES public.post(id) ON DELETE CASCADE,
	CONSTRAINT reaction_id_user_fkey FOREIGN KEY (id_user) REFERENCES public."user"(id) ON DELETE CASCADE
);

-- Drop table

-- DROP TABLE public.tag;

CREATE TABLE public.tag (
	id int8 GENERATED BY DEFAULT AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE) NOT NULL,
	tag_body varchar(50) NULL,
	CONSTRAINT tag_pkey PRIMARY KEY (id)
);

-- Drop table

-- DROP TABLE public."user";

CREATE TABLE public."user" (
	id int8 GENERATED BY DEFAULT AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE) NOT NULL,
	fullname varchar(255) NOT NULL,
	username varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	mobile_number varchar(10) NOT NULL,
	birth_date date NOT NULL,
	biography varchar(255) NULL,
	profile_photo varchar(255) NULL,
	"role" varchar(255) NOT NULL,
	CONSTRAINT user_birth_date_check CHECK ((birth_date <= (CURRENT_DATE - '14 years'::interval))),
	CONSTRAINT user_email_key UNIQUE (email),
	CONSTRAINT user_mobile_number_key UNIQUE (mobile_number),
	CONSTRAINT user_pkey PRIMARY KEY (id),
	CONSTRAINT user_username_key UNIQUE (username)
);