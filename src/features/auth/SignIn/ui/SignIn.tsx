import {useForm} from "react-hook-form";
import {Button} from "../../../../common/components/Button";
import React from "react";
import {Input} from "../../../../common/components/Input";
import styles from './SingIn.module.scss';
import {setAuthorized} from "../model/authSlice";
import {useAppDispatch} from "../../../../common/utils/storeHook";
import {useNavigate} from "react-router-dom";
import {storage} from "../../../../common/utils/storage";

export type Authorized = {
    idInstance: string;
    apiTokenInstance: string;
};

export const SignIn = () => {
    const {
        handleSubmit,
        register,
    } = useForm<Authorized>({
        mode: "onSubmit", // Валидация только при отправке формы
    });

    const dispatch = useAppDispatch();
    let navigate = useNavigate();
    const formPost = (data: Authorized) => {
        storage.setApiTokenInstance(data.apiTokenInstance)
        storage.setIdInstance(data.idInstance)
        dispatch(setAuthorized(data));
        navigate('/chat')
    };

    return (
        <div className={styles.signIn}>
            <div className={styles.container}>
                <form
                    className={styles.form}
                    onSubmit={handleSubmit(formPost)}
                >
                    <Input
                        label={'Id Instance'}
                        propsClassName={styles.input}
                        {...register('idInstance', {
                            required: 'This field is required',
                        })}
                    />
                    <Input
                        label={'apiTokenInstance'}
                        propsClassName={styles.input}
                        type={'password'}
                        {...register('apiTokenInstance', {
                            required: 'This field is required',
                        })}
                    />
                    <Button className={styles.buttonSignIn} type={'submit'}>
                        Sign In
                    </Button>
                </form>
            </div>
        </div>
    );
};