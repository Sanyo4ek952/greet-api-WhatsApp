import React from 'react';
import styles from './PhoneInput.module.scss';
import {addChat, ChatType, setActiveChat, setPhoneNumber} from "../../model/chatSlice";
import {useAppDispatch, useAppSelector} from "../../../../common/utils/storeHook";
import {Button} from "../../../../common/components/Button";


export const PhoneInput = () => {
    const {
        phoneNumber,
        chats,
        activeChat,
    } = useAppSelector(state => state.chat);
    const dispatch = useAppDispatch();
    const handleAddChat = () => {
        const chatExists = chats.find((chat: ChatType) => chat.chatId === phoneNumber);
        if (chatExists){
            dispatch(setActiveChat(phoneNumber));
        }
        if (phoneNumber) {
            dispatch(addChat(phoneNumber));
            dispatch(setActiveChat(phoneNumber));
        }
    };
    return (
        <div className={styles.inputArea}>
            <input
                maxLength={11}
                type="text"
                value={phoneNumber}
                onChange={(e) => dispatch(setPhoneNumber(e.target.value))}
                placeholder="Введите номер телефона"
                className={styles.input}
            />
            <Button onClick={handleAddChat} disabled={phoneNumber === activeChat}>
                Добавить чат
            </Button>
        </div>
    );
};