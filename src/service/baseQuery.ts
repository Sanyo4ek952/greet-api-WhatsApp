import { fetchBaseQuery } from '@reduxjs/toolkit/query';

export const baseQuery = fetchBaseQuery({
    baseUrl: 'https://1103.api.green-api.com',
    prepareHeaders: (headers) => {
        // Устанавливаем стандартные заголовки для всех запросов
        headers.set('Content-Type', 'application/json');
        headers.set('Referer', 'http://localhost:3000/');
        return headers;
    },
});
