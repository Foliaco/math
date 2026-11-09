
'use client'

import { useState, useEffect } from 'react'
import Markdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Typewriter } from '@/module/common/components/type-write'
import { useUser } from '@/module/auth/context/useUser';
import 'katex/dist/katex.min.css'
import { searchFunction, type SearchFunctionResult } from './../action/search';


const arrayQuestions = [
    'Función cuadrática',
    'Función general',
    'Ecuaciones diferenciales',
    'Hallar el área de un círculo',
    'Hallar el volumen de un cilindro',
    'Calcular el volumen de un cono',
    'Como calcular el área de un triángulo',
    'Hipotenusa de un triángulo rectángulo',
]

const getRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * arrayQuestions.length)
    return arrayQuestions[randomIndex]
}

export const MainContent = () => {
    const { user } = useUser()
    const [value, setValue] = useState('')
    const [result, setResult] = useState<SearchFunctionResult>([])
    const [valueRandom, setValueRandom] = useState(getRandomQuestion())
    const [loadingSearch, setLoadingSearch] = useState(false);


    useEffect(() => {
        const interval = setInterval(() => {
            setValueRandom(getRandomQuestion())
        }, 5000)


        const handleKeyDown = (event: KeyboardEvent) => {
            console.log(event)
            if (event.shiftKey && event.key === 'Tab') {
                setValue(valueRandom)
                clearInterval(interval)
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            clearInterval(interval)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])


    const search = async () => {
        if (!value) return
        setLoadingSearch(true)
        const result = await searchFunction(value)
        if (result.error) {
            console.error('Error searching functions:', result.error)
            setLoadingSearch(false)
            alert(result.error.message)
            return
        }
        setResult(result.data!)
        setLoadingSearch(false)
    }


    return (
        <div className="w-full max-w-300 flex flex-col justify-center items-center">

            <h2 className="font-semibold text-2xl text-center">
                {
                    user && <>
                        Hola {user?.email?.split('@')[0]} dinos... <br />
                    </>
                }

                ¿Que necesitas?</h2>

            <div className="mt-5 text-sm opacity-80 font-medium mb-10">
                <Typewriter
                    text={valueRandom}

                />

                <kbd className="kbd ml-2">Shift</kbd> + <kbd className="kbd">Tab</kbd>
            </div>

            <div className='join mx-auto w-[70%] '>

                <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                    className="
                focus:outline-none
                bg-base-300
                input resize-none
                rounded-sm
                border-none
                rounded-r-none
                w-full
                "
                />
                <button className='btn join-item btn-primary rounded-r-sm' disabled={loadingSearch} onClick={search}> Buscar </button>
            </div>
            <div className="mt-5 text-sm opacity-80">
                <p>Esto no es una IA. Es un diccionario de funciones matemáticas</p>
            </div>


            <div className="mt-10 w-full">
                {loadingSearch && <p className="text-center">Buscando... <span className="loading loading-dots loading-lg" /></p>}
                {!loadingSearch && result.length === 0 && value && <p className="text-center">No se encontraron resultados</p>}
                {!loadingSearch && result.length > 0 && <p className="text-center">Resultados:</p>}
                {!loadingSearch && result.length > 0 && result.map((item, index) => (
                    <div
                        key={index}
                        className="group border border-base-300 bg-base-100 rounded-xl p-5 mb-4 hover:border-primary/50 transition-colors"
                    >
                        {/* Nombre */}
                        <h3 className="text-lg font-bold text-base-content mb-4">
                            {item.name}
                        </h3>

                        {/* Fórmula */}
                        <div className="bg-base-200/60 border border-base-300 rounded-lg p-5 mb-4 overflow-x-auto">
                            <div className="text-xs uppercase tracking-wider text-base-content/50 font-semibold mb-3">
                                Expresión matemática
                            </div>

                            <div className="formula-markdown">
                                <Markdown
                                remarkPlugins={[remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                                >{item.latex}</Markdown>
                            </div>
                        </div>

                        {/* Descripción */}
                        <div className="text-base-content/80">
                            <Markdown
                                remarkPlugins={[remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                            >
                                {item.description.substring(0, 500) +
                                    (item.description.length > 500 ? '...' : '')}
                            </Markdown>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
