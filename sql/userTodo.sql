CREATE TABLE "UserTodo" (
    "userId" integer NOT NULL,
    "todoId" integer NOT NULL,
    "isOwner" boolean DEFAULT true NOT NULL,
    PRIMARY KEY ("userId", "todoId"),
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("todoId") REFERENCES "Todo" ("id") ON DELETE CASCADE
)