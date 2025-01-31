import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: baseQuery, // Ссылка на baseQuery
    endpoints: (builder) => ({
        sendMessage: builder.mutation({
            query: ({ phoneNumber, message, idInstance, apiTokenInstance }) => {
                // Формируем данные для отправки сообщения
                const data = {
                    chatId: `${phoneNumber}@c.us`, // Формат номера с @c.us
                    message: message
                };

                // Возвращаем запрос с необходимым URL
                return {
                    url: `/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
                    method: 'POST',
                    body: data,
                };
            },
        }),

        receiveMessage: builder.query<ReceiveMessageResponse,{idInstance:string,apiTokenInstance:string}>({
            query: ({ idInstance, apiTokenInstance }) => {

                return {
                    url: `/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`,
                    method: 'GET',
                };
            },
        }),
        deleteMessage: builder.mutation({
            query: ({ idInstance, apiTokenInstance,receiptId }) => {

                return {
                    url: `/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`,
                    method: 'DELETE',
                    body: {receiptId},
                };
            },
        }),
    }),
    tagTypes: ['Messages'],
});

// Экспортируем хук для использования в компонентах
export const { useSendMessageMutation, useReceiveMessageQuery, useDeleteMessageMutation } = baseApi;
export type ReceiveMessageResponse = {
	receiptId: number;
	body: FdBody;
}
export type FdBodyInstanceData = {
	idInstance: number;
	wid: string;
	typeInstance: string;
}
export type FdBodySenderData = {
	chatId: string;
	sender: string;
	senderName: string;
	senderContactName: string;
}
export type FdBodyMessageDataTextMessageData = {
	textMessage: string;
}
export type FdBodyMessageData = {
	typeMessage: string;
	textMessageData: FdBodyMessageDataTextMessageData;
}
export type FdBody = {
	typeWebhook: string;
	instanceData: FdBodyInstanceData;
	timestamp: number;
	idMessage: string;
	senderData: FdBodySenderData;
	messageData: FdBodyMessageData;
}