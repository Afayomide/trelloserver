import express from 'express';
import {getMessages, createMessage} from '../controllers/messageController';

const router = express.Router();

router.get('/:conversationId', getMessages);

router.post('/:conversationId', createMessage);

export default router;

