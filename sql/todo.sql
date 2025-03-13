CREATE TABLE "Todo" (
    "id" integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "title" text NOT NULL,
    "description" text NOT NULL,
    "status" text DEFAULT 'pending' NOT NULL,
    "startDateTime" timestamp NOT NULL,
    "endDateTime" timestamp NULL
);