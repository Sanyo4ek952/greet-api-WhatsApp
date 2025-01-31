import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        sendMessage: builder.mutation({
            query: ({ phoneNumber, message, idInstance, apiTokenInstance }) => {
                const data = {
                    chatId: `${phoneNumber}@c.us`,
                    message: message
                };
                return {
                    url: `/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
                    method: 'POST',
                    body: data,
                };
            },
        }),
        setSettings: builder.mutation({
            query: ({ idInstance, apiTokenInstance }) => {
                const data = {
                    webhookUrl: "",
                    outgoingWebhook: "yes",
                    stateWebhook: "yes",
                    incomingWebhook: "yes"
                };
                return {
                    url: `/waInstance${idInstance}/setSettings/${apiTokenInstance}`,
                    method: 'POST',
                    body: data,
                };
            },
        }),
        receiveMessage: builder.query<ReceiveMessageResponse, { idInstance: string, apiTokenInstance: string }>({
            query: ({ idInstance, apiTokenInstance }) => ({
                url: `/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`,
                method: 'GET',
            }),
        }),

        deleteMessage: builder.mutation({
            query: ({ idInstance, apiTokenInstance, receiptId }) => ({
                url: `/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`,
                method: 'DELETE',
                body: { receiptId },
            }),
        }),
    }),
});

export const { useSendMessageMutation, useReceiveMessageQuery, useDeleteMessageMutation, useSetSettingsMutation } = baseApi;


export type ReceiveMessageResponse = {
    receiptId: number;
    body: FdBody;
};

export type FdBodyInstanceData = {
    idInstance: number;
    wid: string;
    typeInstance: string;
};

export type FdBodySenderData = {
    chatId: string;
    sender: string;
    senderName: string;
    senderContactName: string;
};

export type FdBodyMessageDataTextMessageData = {
    textMessage: string;
};

export type FdBodyMessageData = {
    typeMessage: string;
    textMessageData: FdBodyMessageDataTextMessageData;
};

export type FdBody = {
    typeWebhook: string;
    instanceData: FdBodyInstanceData;
    timestamp: number;
    idMessage: string;
    senderData: FdBodySenderData;
    messageData: FdBodyMessageData;
};