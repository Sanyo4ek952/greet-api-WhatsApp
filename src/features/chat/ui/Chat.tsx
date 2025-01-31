import React, { useState, useEffect } from 'react';
import { useSendMessageMutation } from "../../../service/baseApi";
import { useAppSelector } from "../../../common/utils/storeHook";
import styles from './Chat.module.scss'; // Импортируем стили

const Chat = () => {
    const [message, setMessage] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [messages, setMessages] = useState<Array<{ text: string; sender: 'me' | 'them' }>>([]);
    const [chats, setChats] = useState<Array<{ phoneNumber: string; lastMessage: string }>>([]);
    const [activeChat, setActiveChat] = useState<string | null>(null);
    const [sendMessage, { isLoading, isSuccess, isError }] = useSendMessageMutation();

    const idInstance = useAppSelector(state => state.authorized.idInstance);  // Получаем idInstance
    const apiTokenInstance = useAppSelector(state => state.authorized.apiTokenInstance);

    // Функция для отправки сообщения
    const handleSend = async () => {
        try {
            if (message.trim() && phoneNumber.trim()) {
                const messageData = { phoneNumber, message, idInstance, apiTokenInstance };  // Данные для отправки
                await sendMessage(messageData).unwrap();

                // Добавляем отправленное сообщение в список
                setMessages([...messages, { text: message, sender: 'me' }]);
                setMessage('');  // Очистка поля ввода после отправки

                // Обновляем список чатов
                const chatExists = chats.some(chat => chat.phoneNumber === phoneNumber);
                if (!chatExists) {
                    setChats([...chats, { phoneNumber, lastMessage: message }]);
                }
            }
        } catch (error) {
            console.error('Ошибка при отправке сообщения:', error);
        }
    };

    // Функция для выбора чата
    const handleSelectChat = (phoneNumber: string) => {
        setActiveChat(phoneNumber);
        setPhoneNumber(phoneNumber);
        setMessages([]); // Очищаем сообщения при выборе нового чата
    };

    // Функция для получения сообщений (заглушка, нужно реализовать через API)
    const fetchMessages = async () => {
        // Здесь должен быть код для получения сообщений через API
        // Например:
        // const response = await receiveMessage(idInstance, apiTokenInstance);
        // if (response) {
        //     setMessages([...messages, { text: response.body.messageData.textMessageData.textMessage, sender: 'them' }]);
        // }
    };

    // Периодический опрос API для получения новых сообщений
    useEffect(() => {
        const interval = setInterval(fetchMessages, 5000); // Опрос каждые 5 секунд
        return () => clearInterval(interval); // Очистка интервала при размонтировании
    }, [messages]);

    return (
        <div className={styles.container}>
            {/* Список чатов */}
            <div className={styles.chatList}>
                <h3>Чаты</h3>
                {chats.map((chat, index) => (
                    <div
                        key={index}
                        className={`${styles.chatItem} ${activeChat === chat.phoneNumber ? styles.active : ''}`}
                        onClick={() => handleSelectChat(chat.phoneNumber)}
                    >
                        <div className={styles.phoneNumber}>{chat.phoneNumber}</div>
                        <div className={styles.lastMessage}>{chat.lastMessage}</div>
                    </div>
                ))}
            </div>

            {/* Окно чата */}
            <div className={styles.chatWindow}>
                {/* Окно сообщений */}
                <div className={styles.messages}>
                    {messages.map((msg, index) => (
                        <div key={index} className={msg.sender === 'me' ? styles.myMessage : styles.theirMessage}>
                            {msg.text}
                        </div>
                    ))}
                </div>

                {/* Поле для ввода номера телефона */}
                <div className={styles.inputArea}>
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Введите номер телефона"
                        className={styles.input}
                    />
                </div>

                {/* Поле для ввода сообщения */}
                <div className={styles.inputArea}>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Введите сообщение"
                        className={styles.input}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()} // Отправка по Enter
                    />
                </div>

                {/* Кнопка отправки */}
                <div className={styles.inputArea}>
                    <button
                        onClick={handleSend}
                        disabled={isLoading}
                        className={styles.button}
                    >
                        {isLoading ? 'Отправка...' : 'Отправить'}
                    </button>
                </div>

                {/* Сообщения об успехе/ошибке */}
                {isSuccess && <div className={styles.successMessage}>Сообщение отправлено!</div>}
                {isError && <div className={styles.errorMessage}>Ошибка при отправке сообщения</div>}
            </div>
        </div>
    );
};

export default Chat;