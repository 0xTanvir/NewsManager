-- Table: public.news

-- DROP TABLE IF EXISTS public.news;

CREATE TABLE IF NOT EXISTS public.news
(
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    source_name character varying(255) COLLATE pg_catalog."default",
    category character varying(255) COLLATE pg_catalog."default",
    headline character varying(255) COLLATE pg_catalog."default",
    story text COLLATE pg_catalog."default",
    published_at timestamp with time zone,
    image_link text COLLATE pg_catalog."default",
    source_link text COLLATE pg_catalog."default",
    meta_description text COLLATE pg_catalog."default",
    meta_keywords text COLLATE pg_catalog."default",
    CONSTRAINT news_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.news
    OWNER to postgres;