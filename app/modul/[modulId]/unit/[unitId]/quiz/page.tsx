'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FC } from 'react';
import Keyboard from './keyboard';
import Link from 'next/link';
import useTTS from '@/hooks/useTTS'
import { Volume2 } from 'lucide-react'



interface PageProps {
  params: Promise<{
    modulId: string;
    unitId: string;
  }>;
}

type VocabData = {
  wordid: number;
  wordeng: string;
  worduzb: string;
  unitid: number | null;
};

const Quiz: FC<PageProps> = ({ params }) => {
  const [vocabList, setVocabList] = useState<VocabData[]>([])
  const [modulId, setModulId] = useState<string | null>(null)
  const [unitId, setUnitId] = useState<string | null>(null)
  const router = useRouter();
  const { handleNormalSpeech } = useTTS()


  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setModulId(resolvedParams.modulId);
      setUnitId(resolvedParams.unitId);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    const fetchData = async () => {
      if (!unitId || !modulId) return;
      try {
        const response = await fetch(`/api/vocab?unitId=${unitId}&modulId=${modulId}`);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setVocabList(data);
      } catch (error) {
        console.error('There was an error!', error);
      }
    };

    fetchData();
  }, [unitId, modulId]);
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lossCount, setLossCount] = useState(5)
  const [progress, setProgress] = useState(1)
  const [gameState, setGameState] = useState<
    'playing' | 'continue' | 'lose' | 'win' | 'start'
  >('playing')
  const [inputSpaces, setInputSpaces] = useState<string[]>([])
  const [clickedLetters, setClickedLetters] = useState<Record<string, boolean>>(
    {}
  )
  const currentWord = vocabList[currentIndex]?.wordeng || ''
  const currentHint = vocabList[currentIndex]?.worduzb || ''

  const initializeWord = useCallback(() => {
    setInputSpaces(Array(currentWord.length).fill('_'))
    setClickedLetters({})
  }, [currentWord])

  const handleWin = useCallback(
    (currentWord: string) => {
      const isLastWord = currentIndex === vocabList.length - 1
      if (!isLastWord) {
        setLossCount(5)
        setGameState('continue')
        if (progress === 1) {
          setCurrentIndex(prev => prev + 1);
        }
      } else {
        setGameState('win')
      }
    },
    [currentIndex, vocabList]
  )

  const handleLoss = useCallback(() => {
    setLossCount(5)
    setCurrentIndex(0)
    setGameState('lose')
  }, [])

  const handleStart = useCallback(() => {
    setLossCount(5)
    setCurrentIndex(0)
    setGameState('playing')
  }, [])

  const handleLetterClick = useCallback(
    (letter: string) => {
      if (clickedLetters[letter]) return
      setClickedLetters(prev => ({ ...prev, [letter]: true }))
      const charArray = currentWord.toUpperCase().split('')
      if (charArray.includes(letter)) {
        setInputSpaces(prev =>
          prev.map((char, index) =>
            charArray[index] === letter ? letter : char
          )
        )
        if (
          charArray.every(
            (char, index) => inputSpaces[index] === char || char === letter
          )
        ) {
          handleWin(currentWord)
        }
      } else {
        setLossCount(prev => {
          const newLossCount = prev - 1
          if (newLossCount === 0) {
            handleLoss()
          }
          return newLossCount
        })
      }
    },
    [clickedLetters, currentWord, inputSpaces, handleWin, handleLoss]
  )

  useEffect(() => {
    if (gameState === 'playing') {
      initializeWord()
    }
  }, [gameState, initializeWord])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const letter = event.key.toUpperCase()
      if (/[A-Z]/.test(letter) && letter.length === 1) {
        handleLetterClick(letter)
      }
      if (event.key === 'Enter' && gameState === 'continue') {
        setGameState('playing')
      }
    },
    [handleLetterClick, gameState]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <>
      <div className='w-full lg:max-w-5xl mx-auto flex flex-col items-center'>
        <div className='w-full h-[calc(50vh)] lg:h-[450px] min-[320px]:h-full py-2 md:p-4 text-center rounded-2xl border-none flex flex-col justify-center items-center'>
          {gameState === 'playing' && (
            <React.Fragment>
              <div className=' flex justify-center flex-col items-center'>
                <p className='mb-4 text-sm sm:text-lg'>
                  <span className='font-bold'>Your chance:</span> {lossCount}
                </p>
                <p className='mb-4 text-sm sm:text-lg'>
                  <span className='font-bold'>Hint:</span> {currentHint}
                </p>
                <Keyboard
                  clickedLetters={clickedLetters}
                  currentWord={currentWord}
                  inputSpaces={inputSpaces}
                  handleLetterClick={handleLetterClick}
                />
              </div>
            </React.Fragment>
          )}

          {gameState === 'continue' && (
            <React.Fragment>
              <Keyboard
                clickedLetters={clickedLetters}
                currentWord={currentWord}
                inputSpaces={inputSpaces}
                handleLetterClick={handleLetterClick}
                alwaysDisabled={true}
                buttonColorDisabled={true}
              />
              <div
                className='w-full absolute bottom-0 px-3 sm::px-0 sm::pb-0 h-24 sm::h-24 
										bg-green-500/20 flex justify-end items-center'
              >
                <div
                  className='w-full lg:max-w-5xl mx-auto flex flex-col md:flex-row items-center
											justify-between
										'
                >
                  <button
                    className=' cursor-pointer border-2 shadow-lg border-green-700 p-3 rounded'
                    onClick={evt => handleNormalSpeech(evt, vocabList[currentIndex - 1]?.wordeng)}
                  >
                    <Volume2 className=' w-full text-green-700' aria-hidden='true' />
                  </button>
                  <button
                    className='w-full md:max-w-28 text-lg cursor-pointer middle none center rounded-lg bg-blue-500 py-3 px-6 font-sans text-[10px] sm:text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none '
                    onClick={() => {
                      setGameState('playing'); setProgress(1);
                    }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </React.Fragment>
          )}

          {gameState === 'lose' && (
            <React.Fragment>
              <div className=' flex flex-col justify-center items-center'>

                <Keyboard
                  clickedLetters={clickedLetters}
                  currentWord={currentWord}
                  inputSpaces={inputSpaces}
                  handleLetterClick={handleLetterClick}
                  alwaysDisabled={true}
                />
              </div>
              <div
                className='w-full absolute bottom-0 px-3 sm::px-0 sm::pb-0 h-24 sm::h-24
										bg-red-500/20 flex justify-end items-center'
              >
                <div
                  className='w-full lg:max-w-5xl mx-auto flex flex-col md:flex-row items-center
                  justify-end
                  '
                >
                  <button
                    className='w-full md:max-w-28 text-lg cursor-pointer middle none center rounded-lg bg-red-500 py-3 px-6 font-sans text-[10px] sm:text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none '
                    onClick={() => setGameState('playing')}
                  >
                    Restart
                  </button>
                </div>
              </div>
            </React.Fragment>
          )}

          {gameState === 'win' && (
            <React.Fragment>
              <Keyboard
                clickedLetters={clickedLetters}
                currentWord={currentWord}
                inputSpaces={inputSpaces}
                handleLetterClick={handleLetterClick}
                alwaysDisabled={true}
              />
              <div className='w-full absolute bottom-0 px-3 h-24 
										bg-green-500/20 flex justify-center items-center'>
                <div className=' w-[90%] sm:w-[70%] flex justify-between items-center gap-1'>
                  <button
                    onClick={handleStart}
                    className='w-full md:max-w-[200px] text-lg cursor-pointer middle none center rounded-lg bg-blue-500 py-3 px-6 font-sans text-[10px] sm:text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none '
                  >
                    Train some more
                  </button>
                  <button
                    className=' cursor-pointer'
                    onClick={evt => handleNormalSpeech(evt, vocabList[currentIndex - 1]?.wordeng)}
                  >
                    <Volume2 className='h-5 w-5 text-blue-500' aria-hidden='true' />
                  </button>
                  <Link href={`/modul/${modulId}`}>
                    <button
                      className='w-full md:max-w-28 text-lg cursor-pointer middle none center rounded-lg bg-green-500 py-3 px-6 font-sans text-[10px] sm:text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none '
                    >
                      Finish
                    </button>
                  </Link>
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </>
  )
}

export default Quiz