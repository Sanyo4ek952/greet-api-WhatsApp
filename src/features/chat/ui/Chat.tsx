import React, {useEffect} from 'react';
import {useDeleteMessageMutation, useReceiveMessageQuery, useSendMessageMutation} from '../../../service/baseApi';
import {useAppDispatch, useAppSelector} from '../../../common/utils/storeHook';
import styles from './Chat.module.scss';
import {Message, receiveMessage, setActiveChat} from '../model/chatSlice';
import {ChatList} from "./ChatList/ChatList";
import {ChatWindow} from "./ChatWindow/ChatWindow";
import {PhoneInput} from "./PhoneInput/PhoneInput";

const Chat = () => {
    const dispatch = useAppDispatch();
    const {idInstance, apiTokenInstance} = useAppSelector(state => state.authorized);
    const {
        chats,
        activeChat,
    } = useAppSelector(state => state.chat);



    const {data: getMessages, refetch} = useReceiveMessageQuery({idInstance, apiTokenInstance});
    const [deleteMessageApi] = useDeleteMessageMutation();




    const handleSelectChat = (phoneNumber: string) => {
        dispatch(setActiveChat(phoneNumber));
    };

    useEffect(() => {
        const interval = setInterval(async () => {
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
                if(res){
                    const receiptId = res.receiptId;
                    await deleteMessageApi({idInstance, apiTokenInstance, receiptId});
                }

            } catch (error) {
                console.error('Ошибка при обновлении сообщений:', error);
            }
            return () => clearInterval(interval);
        }, 3000);

        return () => clearInterval(interval);
    }, [idInstance, apiTokenInstance, dispatch, deleteMessageApi, refetch, getMessages]);

    const openChat = chats.filter(chat => chat.chatId === activeChat)[0]

    return (
        <div className={styles.container}>
            <div className={styles.leftColumn}>
                <PhoneInput />
                <ChatList chats={chats} activeChat={activeChat} onSelectChat={handleSelectChat }/>
            </div>

            <div className={styles.rightColumn}>
                <ChatWindow  messages={openChat?.messages} />

            </div>
        </div>
    );
};

export default Chat;
