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
                    chatId: `79785082597@c.us`, // Формат номера с @c.us
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

        receiveMessage: builder.query({
            query: ({ idInstance, apiTokenInstance }) => {
                // Формируем URL для получения сообщений
                return {
                    url: `/waInstance${idInstance}/receiveMessage/${apiTokenInstance}`,
                    method: 'GET',
                };
            },
        }),
    }),
    tagTypes: ['Messages'],
});

// Экспортируем хук для использования в компонентах
export const { useSendMessageMutation, useReceiveMessageQuery } = baseApi;
