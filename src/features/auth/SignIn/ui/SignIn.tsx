import {useForm} from "react-hook-form";
import {Button} from "../../../../common/components/Button";
import React from "react";
import {Input} from "../../../../common/components/Input";
import styles from './SingIn.module.scss';
import {setAuthorized} from "../model/authSlice";
import {useAppDispatch} from "../../../../common/utils/storeHook";
import {useNavigate} from "react-router-dom";

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
                        value={'1103184265'}
                        propsClassName={styles.input}
                        {...register('idInstance', {
                            required: 'This field is required',
                        })}
                    />
                    <Input
                        value={'66b1109c87704693bc5dc50763f7b7c73a3c8c2585a34a0484'}
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