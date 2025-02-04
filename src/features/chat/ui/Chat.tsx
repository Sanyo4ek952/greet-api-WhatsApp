import React, {useEffect, useState} from 'react';
import {useDeleteMessageMutation, useReceiveMessageQuery, useSendMessageMutation} from '../../../service/baseApi';
import {useAppDispatch, useAppSelector} from '../../../common/utils/storeHook';
import styles from './Chat.module.scss';
import {Button} from '../../../common/components/Button';
import {addChat, Message, receiveMessage, sendMessage, setActiveChat, setPhoneNumber} from '../model/chatSlice';
import {ChatList} from "../../../common/components/ChatList/ChatList";

const Chat = () => {
    const dispatch = useAppDispatch();
    const {idInstance, apiTokenInstance} = useAppSelector(state => state.authorized);
    const {
        phoneNumber,
        chats,
        activeChat,
    } = useAppSelector(state => state.chat);

    const [message, setMessage] = useState('');

    const [sendMessageApi, {isLoading, isSuccess, isError}] = useSendMessageMutation();
    const {data: getMessages, refetch} = useReceiveMessageQuery({idInstance, apiTokenInstance});
    const [deleteMessageApi] = useDeleteMessageMutation();

    const handleAddChat = () => {
        if (phoneNumber) {
            dispatch(addChat(phoneNumber));
            dispatch(setPhoneNumber(''));
        }
    };

    const handleSend = async () => {
        if (message.trim() && activeChat) {
            try {
                await sendMessageApi({phoneNumber: activeChat, message, idInstance, apiTokenInstance}).unwrap();
                dispatch(sendMessage({text: message, phoneNumber}));
                setMessage('');
            } catch (error) {
                console.error('Ошибка при отправке сообщения:', error);
            }
        }
    };

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
                <div className={styles.inputArea}>
                    <input
                        maxLength={11}
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => dispatch(setPhoneNumber(e.target.value))}
                        placeholder="Введите номер телефона"
                        className={styles.input}
                    />
                    <Button onClick={handleAddChat} disabled={isLoading} className={styles.button}>
                        Добавить чат
                    </Button>
                </div>
                <ChatList chats={chats} activeChat={activeChat} onSelectChat={handleSelectChat }/>
            </div>

            <div className={styles.rightColumn}>
                <div className={styles.chatWindow}>
                    <div className={styles.messages}>

                        {openChat?.messages.map((message) => {
                            return (
                                <div key={message.id}
                                     className={message.sender === 'me' ? styles.myMessage : styles.theirMessage}>{message.text}</div>
                            )
                        })}
                    </div>

                    <div className={styles.inputArea}>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Введите сообщение"
                            className={styles.input}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                    </div>
                    <div className={styles.inputArea}>
                        <Button onClick={handleSend} disabled={isLoading} className={styles.button}>
                            {isLoading ? 'Отправка...' : 'Отправить'}
                        </Button>
                    </div>
                    {isSuccess && <div className={styles.successMessage}>Сообщение отправлено!</div>}
                    {isError && <div className={styles.errorMessage}>Ошибка при отправке сообщения</div>}
                </div>
            </div>
        </div>
    );
};

export default Chat;
