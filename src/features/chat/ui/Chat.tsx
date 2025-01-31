import React, {useState} from 'react';
import {useDeleteMessageMutation, useReceiveMessageQuery, useSendMessageMutation} from "../../../service/baseApi";
import {useAppSelector} from "../../../common/utils/storeHook";
import styles from './Chat.module.scss';
import {Button} from "../../../common/components/Button";

const Chat = () => {
    const [message, setMessage] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [messages, setMessages] = useState<Array<{ text: string; sender: 'me' | 'them' }>>([]);
    const [chats, setChats] = useState<Array<{ phoneNumber: string; lastMessage: string }>>([]);
    const [activeChat, setActiveChat] = useState<string | null>(null);
    const idInstance = useAppSelector(state => state.authorized.idInstance);
    const apiTokenInstance = useAppSelector(state => state.authorized.apiTokenInstance);
    const [sendMessage, {isLoading, isSuccess, isError}] = useSendMessageMutation();
    const {data: getMessages, refetch} = useReceiveMessageQuery({idInstance, apiTokenInstance});
    const [deleteMessageApi] = useDeleteMessageMutation()
    console.log(getMessages)
    // Функция для добавления нового чата
    const handleAddChat = () => {
        if (phoneNumber.trim()) {
            const chatExists = chats.some(chat => chat.phoneNumber === phoneNumber);
            if (!chatExists) {
                setChats([...chats, {phoneNumber, lastMessage: ''}]);
                setPhoneNumber('');
            } else {
                alert('Этот чат уже существует');
            }
        }
    };


    // Функция для отправки сообщения
    const handleSend = async () => {
        try {
            if (message.trim() && phoneNumber.trim()) {
                const messageData = {phoneNumber, message, idInstance, apiTokenInstance};
                await sendMessage(messageData).unwrap();

                setMessages([...messages, {text: message, sender: 'me'}]);
                setMessage('');

                setChats(chats.map(chat =>
                    chat.phoneNumber === phoneNumber
                        ? {...chat, lastMessage: message}
                        : chat
                ));
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

    const updateMessage = () => {
        refetch().then(res=>{
                if(res.data) {
                    const receiptId = res.data.receiptId
                    deleteMessageApi({idInstance, apiTokenInstance, receiptId})
                }





        })

    }
    return (
        <div className={styles.container}>
            <div className={styles.leftColumn}>
                <div className={styles.inputArea}>
                    <input
                        maxLength={11}
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Введите номер телефона"
                        className={styles.input}
                    />
                    <Button
                        onClick={handleAddChat}
                        disabled={isLoading}
                        className={styles.button}
                    >
                        Добавить чат
                    </Button>
                    <Button onClick={updateMessage}>Update</Button>
                </div>
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
            </div>

            <div className={styles.rightColumn}>
                <div className={styles.chatWindow}>
                    <div className={styles.messages}>
                        {messages.map((msg, index) => (
                            <div key={index} className={msg.sender === 'me' ? styles.myMessage : styles.theirMessage}>
                                {msg.text}
                            </div>
                        ))}
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
                        <button
                            onClick={handleSend}
                            disabled={isLoading}
                            className={styles.button}
                        >
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
