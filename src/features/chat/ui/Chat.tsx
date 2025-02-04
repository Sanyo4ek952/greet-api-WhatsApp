import React, {useEffect} from 'react';
import styles from './Chat.module.scss';
import {ChatList} from "./ChatList/ChatList";
import {ChatWindow} from "./ChatWindow/ChatWindow";
import {PhoneInput} from "./PhoneInput/PhoneInput";
import {useNavigate} from "react-router-dom";
import {storage} from "../../../common/utils/storage";

const Chat = () => {
    const idInstance = storage.getIdInstance()
    const apiTokenInstance = storage.getApiTokenInstance()
    let navigate = useNavigate();

    useEffect(() => {
        if (idInstance === '' || apiTokenInstance === '') {
            navigate('/')
            return
        }
    }, [idInstance, apiTokenInstance, navigate]);
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
