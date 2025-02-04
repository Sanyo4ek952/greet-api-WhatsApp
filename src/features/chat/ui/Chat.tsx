import React from 'react';
import styles from './Chat.module.scss';
import {ChatList} from "./ChatList/ChatList";
import {ChatWindow} from "./ChatWindow/ChatWindow";
import {PhoneInput} from "./PhoneInput/PhoneInput";

const Chat = () => {

    return (
        <div className={styles.container}>
            <div className={styles.leftColumn}>
                <PhoneInput/>
                <ChatList/>
            </div>
            <div className={styles.rightColumn}>
                <ChatWindow/>
            </div>
        </div>
    );


};

export default Chat;
