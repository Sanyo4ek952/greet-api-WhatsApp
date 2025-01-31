import {useForm} from "react-hook-form";
import {Button} from "../../../common/components/Button";
import React, {useState} from "react";
import {Input} from "../../../common/components/Input";
import styles from './SingIn.module.scss'

export const SignIn = () => {
    const [idInstance, setIdInstance] = useState<string | null>(null);
    const [apiTokenInstance, setApiTokenInstance] = useState<string | null>(null);

    const {
        clearErrors,
        formState: {errors},
        handleSubmit,
        register,
    } = useForm<{ idInstance: string; apiTokenInstance: string }>()


    const formPost = (data: { idInstance: string; apiTokenInstance: string }) => {
        setIdInstance(data.idInstance)
        setApiTokenInstance(data.apiTokenInstance)
    }
    console.log(idInstance)
    console.log(apiTokenInstance)



    return (
        <div className={styles.signIn}>
            <div className={styles.container}>
                <form
                    className={styles.form}
                    onSubmit={handleSubmit(formPost)} // Вызываем переданную функцию при сабмите
                >
                    <Input

                        label={'Id Instance'}
                        propsClassName={styles.input}
                        {...register('idInstance', {
                            onChange: () => clearErrors('idInstance'),
                            required: 'This field is required',
                        })}

                    />
                    <Input
                        errorMessage={typeof errors.apiTokenInstance?.message === 'string' ? errors.apiTokenInstance.message : ''}
                        label={'apiTokenInstance'}
                        propsClassName={styles.input}
                        type={'password'}
                        {...register('apiTokenInstance', {
                            onChange: () => clearErrors('apiTokenInstance'),
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

