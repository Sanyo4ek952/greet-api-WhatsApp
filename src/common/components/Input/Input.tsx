'use client'

import React, { forwardRef, useState } from 'react'



import styles from '../Input/input.module.scss'
import EyeOffOutline from "../../../assets/icon/components/EyeOffOutline";
import EyeOutline from "../../../assets/icon/components/EyeOutline";
import clsx from "clsx";

export type InputProps = {
  errorMessage?: string
  label: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFocus?: () => void
  propsClassName?: string
  type?: 'password' | 'search' | 'text'
} & React.InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ errorMessage, label, onChange, onFocus, propsClassName, type, ...inputProps }, ref) => {
    const [showText, setShowText] = useState(true)

    const togglePasswordVisibility = () => {
      setShowText(prev => !prev)
    }

    const classNameInput =
      type === 'search' ? `${styles.input} ${styles.inputSearch}` : styles.input

    const inputType = type === 'password' && showText ? 'password' : 'text'

    let buttonType = null

    if (type === 'password') {
      buttonType = (
        <button className={styles.button} onClick={togglePasswordVisibility} type={'button'}>
          {showText ? <EyeOffOutline /> : <EyeOutline />}
        </button>
      )
    } else if (type === 'search') {
      buttonType = (
        <button className={styles.buttonSearch} onClick={() => {}} type={'button'}></button>
      )
    }

    return (
      <div
        className={clsx(styles.container, propsClassName, errorMessage && styles.error)}
      >
        <label className={styles.label} htmlFor={label}>
          {label}
        </label>
        <input
          className={classNameInput}
          name={label}
          onChange={onChange}
          onFocus={onFocus}
          ref={ref}
          type={inputType}
          {...inputProps}
        ></input>
        <p className={styles.errorMessage}>{errorMessage}</p>
        {/*{errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}*/}
        {buttonType}
      </div>
    )
  }
)
