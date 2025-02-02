import express from 'express';
import { getConversations, createConversation, deleteConversation, switchConversation } from '../controllers/conversationController';


const router = express.Router();

router.get('/:userId', getConversations);

router.post('/', createConversation);

router.delete('/:conversationId', deleteConversation);

router.patch('/:conversationId', switchConversation);

export default router;

