import { MouseEvent, useCallback, useEffect } from 'react'

const useTTS = (lang: 'en-US' | 'en-GB' = 'en-US') => {
	const handleSpeech = useCallback(
		(text: string, rate: number, evt: MouseEvent<HTMLButtonElement>) => {
			if (typeof window !== 'undefined' && window.speechSynthesis) {
				const utterance = new SpeechSynthesisUtterance()
				utterance.volume = 1
				utterance.rate = rate
				utterance.pitch = 1
				utterance.text = text
				utterance.lang = lang
				window.speechSynthesis.cancel() // Ensure no previous speeches are queued
				window.speechSynthesis.speak(utterance)
				evt.stopPropagation()
			}
		},
		[lang]
	)

	const handleNormalSpeech = useCallback(
		(evt: MouseEvent<HTMLButtonElement>, text: string) => {
			handleSpeech(text, 0.8, evt) // Normal rate
		},
		[handleSpeech]
	)

	const handleSlowSpeech = useCallback(
		(evt: MouseEvent<HTMLButtonElement>, text: string) => {
			handleSpeech(text, 0.1, evt) // Slow rate
		},
		[handleSpeech]
	)

	useEffect(() => {
		return () => {
			if (typeof window !== 'undefined' && window.speechSynthesis) {
				window.speechSynthesis.cancel() // Clean up any ongoing speech synthesis on unmount
			}
		}
	}, [])

	return { handleNormalSpeech, handleSlowSpeech }
}

export default useTTS
