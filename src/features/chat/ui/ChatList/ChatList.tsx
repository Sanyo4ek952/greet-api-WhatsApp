import {useCallback, useEffect, useState} from 'react';
import styles from './ChatList.module.scss';
import {Message, receiveMessage, setActiveChat} from "../../model/chatSlice";
import {useDeleteMessageMutation, useReceiveMessageQuery} from "../../../../service/baseApi";
import {useAppDispatch, useAppSelector} from "../../../../common/utils/storeHook";
import {storage} from "../../../../common/utils/storage";

export const ChatList = () => {
    const dispatch = useAppDispatch();
    const [isFetching, setIsFetching] = useState(false);

    const idInstance = storage.getIdInstance();
    const apiTokenInstance = storage.getApiTokenInstance();
    const {chats, activeChat} = useAppSelector(state => state.chat);
    const {refetch} = useReceiveMessageQuery({idInstance: idInstance || '', apiTokenInstance: apiTokenInstance || ''});
    const [deleteMessageApi] = useDeleteMessageMutation();

    const onSelectChat = (phoneNumber: string) => {
        dispatch(setActiveChat(phoneNumber));
    };

    const fetchMessages = useCallback(async () => {
        if (isFetching) {
            return;
        }

        setIsFetching(true);
        try {
            const res = await refetch().unwrap();
            console.log('Response from server:', res); // Лог для проверки ответа от сервера

            if (res && res.body && res.body.messageData?.textMessageData?.textMessage) {
                const message: Message = {
                    id: Date.now(),
                    text: res.body.messageData.textMessageData.textMessage,
                    sender: 'them'
                };
                const chat = {
                    chatId: res.body.senderData.chatId.substring(0, 11),
                    messages: message
                };
                dispatch(receiveMessage(chat));
                console.log('Received message:', message);

            }
            const receiptId = res.receiptId;
            await deleteMessageApi({idInstance, apiTokenInstance, receiptId});
        } catch (error) {

        } finally {
            setIsFetching(false)
            await fetchMessages();
        }
    }, [apiTokenInstance, deleteMessageApi, dispatch, idInstance, isFetching, refetch])

    useEffect(() => {
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [fetchMessages]);

    return (
        <div className={styles.chatList}>
            <h3>Чаты</h3>
            {chats.map(chat => (
                <div
                    key={chat.chatId}
                    className={`${styles.chatItem} ${activeChat === chat.chatId ? styles.active : ''}`}
                    onClick={() => onSelectChat(chat.chatId)}
                >
                    <div className={styles.phoneNumber}>{chat.chatId}</div>
                    <div className={styles.lastMessage}>{chat.chatId}</div>
                </div>
            ))}
        </div>
    );
};
