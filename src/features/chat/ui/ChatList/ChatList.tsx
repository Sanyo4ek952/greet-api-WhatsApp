import {useEffect, useState} from 'react';
import styles from './ChatList.module.scss';
import {Message, receiveMessage, setActiveChat} from "../../model/chatSlice";
import {useDeleteMessageMutation, useReceiveMessageQuery} from "../../../../service/baseApi";
import {useAppDispatch, useAppSelector} from "../../../../common/utils/storeHook";


export const ChatList = () => {
    const dispatch = useAppDispatch();
    const [isFetching, setIsFetching] = useState(false);

    const {idInstance, apiTokenInstance} = useAppSelector(state => state.authorized);
    const {
        chats,
        activeChat,
    } = useAppSelector(state => state.chat);
    const {refetch} = useReceiveMessageQuery({idInstance, apiTokenInstance});
    const [deleteMessageApi] = useDeleteMessageMutation();
    const onSelectChat = (phoneNumber: string) => {
        dispatch(setActiveChat(phoneNumber));
    };
    useEffect(() => {
        const interval = setInterval(async () => {
            if (isFetching) {
                return;
            }

            setIsFetching(true);
            try {
                const res = await refetch().unwrap();

                if (res && res.body && res.body.messageData?.textMessageData?.textMessage) {
                    const message: Message = {
                        id: Date.now(),
                        text: res.body.messageData.textMessageData.textMessage,
                        sender: 'them'
                    }
                    const chat = {
                        chatId: res.body.senderData.chatId.substring(0, 11),
                        messages: message
                    }
                    dispatch(receiveMessage(chat));
                }
                if (res) {
                    const receiptId = res.receiptId;
                    await deleteMessageApi({idInstance, apiTokenInstance, receiptId});
                }
            } catch (error) {
                console.error('Ошибка при обновлении сообщений:', error);
            } finally {
                setIsFetching(false);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [idInstance, apiTokenInstance, dispatch, deleteMessageApi, refetch]);
    return (
        <div className={styles.chatList}>
            <h3>Чаты</h3>
            {chats.map((chat, index) => (
                <div
                    key={index}
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