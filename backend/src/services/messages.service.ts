import { eq, and, asc, desc } from "drizzle-orm";
import { db } from "../db/index.js";
import { conversations, messages, adoptionApplications, shelterStaff } from "../db/schema/index.js";

export class MessagingError extends Error {
    constructor(message: string, public statusCode: number) {
        super(message);
    }
}

export async function startConversationForApplication(applicantId: string, applicationId: string) {
    const [application] = await db.select().from(adoptionApplications).where(eq(adoptionApplications.id, applicationId));
    if (!application) throw new MessagingError("Application not found", 404);
    if (application.applicantId !== applicantId) throw new MessagingError("Not your application", 403);

    const [existing] = await db.select().from(conversations)
        .where(and(eq(conversations.applicationId, applicationId), eq(conversations.adopterId, applicantId)));
    if (existing) return existing;

    const [conversation] = await db.insert(conversations).values({
        applicationId,
        shelterId: application.shelterId,
        adopterId: applicantId,
    }).returning();
    return conversation;
}

export async function listConversationsForAdopter(adopterId: string) {
    return db.select().from(conversations).where(eq(conversations.adopterId, adopterId)).orderBy(desc(conversations.createdAt));
}

export async function listConversationsForShelter(shelterId: string) {
    return db.select().from(conversations).where(eq(conversations.shelterId, shelterId)).orderBy(desc(conversations.createdAt));
}

async function getConversationForUser(conversationId: string, userId: string, userRole: string) {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, conversationId));
    if (!conversation) return null;
    if (conversation.adopterId === userId) return conversation;

    if (userRole === "shelter_staff") {
        const [staffRow] = await db.select().from(shelterStaff)
            .where(and(eq(shelterStaff.userId, userId), eq(shelterStaff.shelterId, conversation.shelterId)));
        if (staffRow) return conversation;
    }
    return null;
}

export async function listMessages(conversationId: string, userId: string, userRole: string) {
    const conversation = await getConversationForUser(conversationId, userId, userRole);
    if (!conversation) throw new MessagingError("Conversation not found", 404);
    return db.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(asc(messages.createdAt));
}

export async function sendMessage(conversationId: string, senderId: string, senderRole: string, content: string) {
    const conversation = await getConversationForUser(conversationId, senderId, senderRole);
    if (!conversation) throw new MessagingError("Conversation not found", 404);
    const [message] = await db.insert(messages).values({ conversationId, senderId, content }).returning();
    return message;
}