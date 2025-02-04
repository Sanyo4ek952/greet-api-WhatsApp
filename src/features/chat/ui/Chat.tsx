import React, {useState, useEffect} from 'react';
import {
    useDeleteMessageMutation,
    useReceiveMessageQuery,
    useSendMessageMutation,
    useSetSettingsMutation
} from '../../../service/baseApi';
import {useAppDispatch, useAppSelector} from '../../../common/utils/storeHook';
import styles from './Chat.module.scss';
import {Button} from '../../../common/components/Button';
import {addChat, setPhoneNumber, setActiveChat, sendMessage, receiveMessage, deleteMessage} from '../model/chatSlice';

const Chat = () => {
    const dispatch = useAppDispatch();
    const {idInstance, apiTokenInstance} = useAppSelector(state => state.authorized);
    const {
        phoneNumber,
        chats,
        activeChat,
        myMessages,
        theirMessages,
    } = useAppSelector(state => state.chat);

    const [message, setMessage] = useState('');

    const [sendMessageApi, {isLoading, isSuccess, isError}] = useSendMessageMutation();
    const {data: getMessages, refetch} = useReceiveMessageQuery({idInstance, apiTokenInstance});
    const [deleteMessageApi] = useDeleteMessageMutation();
    const [setSetting] = useSetSettingsMutation();

    // Добавление чата
    const handleAddChat = () => {
        if (phoneNumber) {
            dispatch(addChat(phoneNumber));
            dispatch(setPhoneNumber(''));
        }
    };

    // Отправка сообщения
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

    // Выбор чата
    const handleSelectChat = (phoneNumber: string) => {
        dispatch(setActiveChat(phoneNumber));
    };
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await refetch().unwrap();
                // Проверка на наличие данных в ответе
                if (res && res.body) {
                    dispatch(receiveMessage(res)); // Добавляем новое сообщение
                    const receiptId = res.receiptId;
                    // Удаляем сообщение после обработки
                    await deleteMessageApi({idInstance, apiTokenInstance, receiptId});
                }
            } catch (error) {
                console.error('Ошибка при обновлении сообщений:', error);
            }
        }, 1000); // Интервал 1 секунда (1000 миллисекунд)

        // Очистка интервала при размонтировании компонента
        return () => clearInterval(interval);
    }, [idInstance, apiTokenInstance, dispatch, deleteMessageApi, refetch]); // Зависимости
    // Обновление сообщений
    const updateMessage = async () => {
        refetch().unwrap().then(res => {
            dispatch(receiveMessage(res))
            const receiptId = res.receiptId
            deleteMessageApi({idInstance, apiTokenInstance, receiptId})
        })
        // Если приходит входящее сообщение


    };
    const setSettingHandler = () => {
        setSetting({idInstance, apiTokenInstance})
    }

    const openChat = chats.filter(chat => chat.chatId === activeChat)[0]
    console.log('openChat',openChat)
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
                    <Button onClick={updateMessage}>Обновить</Button>
                    <Button onClick={setSettingHandler}>Setting</Button>
                </div>
                <div className={styles.chatList}>
                    <h3>Чаты</h3>
                    {chats.map((chat, index) => (
                        <div
                            key={index}
                            className={`${styles.chatItem} ${activeChat === chat.chatId ? styles.active : ''}`}
                            onClick={() => handleSelectChat(chat.chatId)}
                        >
                            <div className={styles.phoneNumber}>{chat.chatId}</div>
                            <div className={styles.lastMessage}>{chat.chatId}</div>
                        </div>
                    ))}
                </div>
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
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                    </div>
                    <div className={styles.inputArea}>
                        <button onClick={handleSend} disabled={isLoading} className={styles.button}>
                            {isLoading ? 'Отправка...' : 'Отправить'}
                        </button>
                    </div>
                    {isSuccess && <div className={styles.successMessage}>Сообщение отправлено!</div>}
                    {isError && <div className={styles.errorMessage}>Ошибка при отправке сообщения</div>}
                </div>
            </div>
        </div>
    );
};

export default Chat;
