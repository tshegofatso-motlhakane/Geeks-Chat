CREATE TABLE "Users"(
    "UserID" INTEGER NOT NULL,
    "username" VARCHAR(255) NOT NULL UNIQUE,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(50) NOT NULL,
    "FirstName" VARCHAR(255) NOT NULL,
    "LastName" VARCHAR(255) NOT NULL,
    "bio" VARCHAR(255) NULL,
    "profile_picture" VARCHAR(255) NULL,
    "status" VARCHAR(255) CHECK
        ("status" IN('')) NOT NULL DEFAULT '' offline ''
);
ALTER TABLE
    "Users" ADD PRIMARY KEY("UserID");
CREATE INDEX "users_username_index" ON
    "Users"("username");


CREATE TABLE "Conversation"(
    "ConversationID" INTEGER NOT NULL,
    "ConversationType" VARCHAR(255) CHECK
    ("ConversationType" IN('')) NOT NULL DEFAULT '1-TO-1',
     "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "Conversation" ADD PRIMARY KEY("ConversationID");

CREATE TABLE "GroupInformation"(
    "GroupInformationID" INTEGER NOT NULL,
    "ConversationID" INTEGER NOT NULL,
    "GroupName" VARCHAR(255) NOT NULL,
    "GroupInfo" VARCHAR(255) NOT NULL,
    "Created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "GroupInformation" ADD PRIMARY KEY("GroupInformationID");
CREATE TABLE "Message"(
    "MessageID" INTEGER NOT NULL,
    "ConversationID" INTEGER NOT NULL,
    "SenderID" INTEGER NOT NULL,
    "MessageContent" VARCHAR(255) NOT NULL,
    "Sent_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT '0'
);
ALTER TABLE
    "Message" ADD PRIMARY KEY("MessageID");
CREATE TABLE "Participants"(
    "UserID" INTEGER NOT NULL,
    "ConversationID" INTEGER NOT NULL
);
ALTER TABLE
    "Participants" ADD PRIMARY KEY("UserID");
ALTER TABLE
    "Participants" ADD PRIMARY KEY("ConversationID");
CREATE TABLE "Contacts"(
    "ContactID" INTEGER NOT NULL,
    "UserID" INTEGER NOT NULL,
    "Contact_UserID" INTEGER NOT NULL,
    "Created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "Contacts" ADD PRIMARY KEY("ContactID");
ALTER TABLE
    "Users" ADD CONSTRAINT "users_email_foreign" FOREIGN KEY("email") REFERENCES "Participants"("UserID");
ALTER TABLE
    "Message" ADD CONSTRAINT "message_senderid_foreign" FOREIGN KEY("SenderID") REFERENCES "Users"("UserID");
ALTER TABLE
    "Users" ADD CONSTRAINT "users_firstname_foreign" FOREIGN KEY("FirstName") REFERENCES "Contacts"("ContactID");
ALTER TABLE
    "Conversation" ADD CONSTRAINT "conversation_conversationid_foreign" FOREIGN KEY("ConversationID") REFERENCES "Participants"("UserID");
ALTER TABLE
    "Message" ADD CONSTRAINT "message_senderid_foreign" FOREIGN KEY("SenderID") REFERENCES "Conversation"("ConversationID");