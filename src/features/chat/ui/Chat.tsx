import React, {useEffect} from 'react';
import styles from './Chat.module.scss';
import {ChatList} from "./ChatList/ChatList";
import {ChatWindow} from "./ChatWindow/ChatWindow";
import {PhoneInput} from "./PhoneInput/PhoneInput";
import {useAppSelector} from "../../../common/utils/storeHook";
import {useNavigate} from "react-router-dom";

const Chat = () => {
    const {idInstance, apiTokenInstance} = useAppSelector(state => state.authorized);
    const navigate = useNavigate();

    useEffect(() => {
        if (idInstance === '' || apiTokenInstance === '') {
            navigate('/greet-api-WhatsApp/')
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
