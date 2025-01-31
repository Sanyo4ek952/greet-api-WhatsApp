import {
  ComponentPropsWithoutRef,
  ElementRef,
  ElementType,
  ReactNode,
  Ref,
  forwardRef,
} from 'react'


import s from './button.module.scss'
import clsx from "clsx";

type ButtonOwnProps = {
  type?: 'button' | 'reset' | 'submit'
  variant?: 'icon' | 'link' | 'outline' | 'primary' | 'secondary'
} & ComponentPropsWithoutRef<'button'>




export const Button = (props:ButtonOwnProps)=>{

    const {  className, variant = 'primary', ...rest } = props
    const classNames = clsx(s.button, s[variant], className)

    return <button className={classNames} {...rest} />
  }

