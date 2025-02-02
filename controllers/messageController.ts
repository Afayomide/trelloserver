import { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const getMessages = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;

    const messages = await prisma.message.findMany({
      where: { conversationId: conversationId },
      orderBy: {
        createdAt: 'asc',  
      },
    });

    res.json(messages);
  } catch (error: unknown) {
    console.error(error)
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

export const createMessage = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const { text, isUser } = req.body;

    const newMessage = await prisma.message.create({
      data: {
        conversationId: conversationId,
        text: text,
        isUser: isUser,
      },
    });

    res.status(201).json(newMessage);
  } catch (error: unknown) {
    console.error(error)
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

