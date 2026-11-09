import { useEffect, useState } from "react";

interface TypewriterProps {
    text: string
    speed?: number
    delay?: number
    cursor?: boolean
}

export const Typewriter = ({
    text,
    speed = 50,
    delay = 0,
    cursor = true
}: TypewriterProps) => {
    const [displayedText, setDisplayedText] = useState('')

    useEffect(() => {
        let index = 0
        let interval: ReturnType<typeof setInterval>

        const timeout = setTimeout(() => {
            interval = setInterval(() => {
                index++

                setDisplayedText(text.slice(0, index))

                if (index >= text.length) {
                    clearInterval(interval)
                }
            }, speed)
        }, delay)

        return () => {
            clearTimeout(timeout)
            clearInterval(interval)
        }
    }, [text, speed, delay])

    return (
        <span>
            {displayedText}
            {cursor && (
                <span className="animate-pulse text-primary">|</span>
            )}
        </span>
    )
}
