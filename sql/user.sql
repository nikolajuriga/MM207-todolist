
CREATE TABLE "User" (
    "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "email" text NOT NULL UNIQUE,
    "fullName" text NOT NULL,
    "pwdHash" text NOT NULL,
    "role" text DEFAULT 'user' NOT NULL
);

/*Alter table and set the email to UNIQUE*/
ALTER TABLE "User" ADD CONSTRAINT "unique_email" UNIQUE ("email");

SELECT * FROM public."User"