export interface Message {
	senderId: string;
	receiverId: string;
	text: string;
	image?: string;
}

export interface MessageWithId extends Message {
	_id: string;
	createdAt: string;
}
