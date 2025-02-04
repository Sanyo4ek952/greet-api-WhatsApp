import React, {useState} from 'react';
import styles from './MessageInput.module.scss';
import {sendMessage} from "../../model/chatSlice";
import {useAppDispatch, useAppSelector} from "../../../../common/utils/storeHook";
import {useSendMessageMutation} from "../../../../service/baseApi";
import {Button} from "../../../../common/components/Button";


export const MessageInput = () => {
    const [message, setMessage] = useState('');
    const {idInstance, apiTokenInstance} = useAppSelector(state => state.authorized);
    const dispatch = useAppDispatch();

    const {
        phoneNumber,
        activeChat,
    } = useAppSelector(state => state.chat);

    const [sendMessageApi, {isLoading, isSuccess, isError}] = useSendMessageMutation();

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

    return (
        <>
            <div className={styles.inputArea}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Введите сообщение"
                    className={styles.input}
                    disabled={!activeChat}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button onClick={handleSend} disabled={isLoading || !activeChat}>
                    {isLoading ? 'Отправка...' : 'Отправить'}
                </Button>
            </div>
            {isSuccess && <div className={styles.successMessage}>Сообщение отправлено!</div>}
            {isError && <div className={styles.errorMessage}>Ошибка при отправке сообщения</div>}
        </>
    );
};