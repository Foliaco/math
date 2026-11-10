'use client';
import React from 'react'
import { useLanguage } from './language';

export const ButtonLang = () => {

    const { language, setLanguage } = useLanguage()

    return (
        <>
            {
                language === 'es'
                    ? <button className='btn btn-circle btn-primary' onClick={() => setLanguage('en')}>EN</button>
                    : language === 'en'
                        ? <button className='btn btn-circle btn-error' onClick={() => setLanguage('ja')}>JA</button>
                        : <button className='btn btn-circle btn-secondary' onClick={() => setLanguage('es')}>ES</button>
            }
        </>
    )
}
