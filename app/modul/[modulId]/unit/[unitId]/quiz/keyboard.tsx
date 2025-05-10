import React from 'react'

interface KeyboardProps {
	clickedLetters: { [key: string]: boolean };
	currentWord: string;
	inputSpaces: string[];
	handleLetterClick: (letter: string) => void;
	alwaysDisabled?: boolean;
	buttonColorDisabled?: boolean;
}

const Keyboard: React.FC<KeyboardProps> = ({
	clickedLetters,
	currentWord,
	inputSpaces,
	handleLetterClick,
	alwaysDisabled = false,
	buttonColorDisabled = false,
}) => {
	const keyboardRows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']

	return (
		<div className=' flex flex-col justify-center items-center py-10 px-1 sm:py-10 sm:px-20 shadow-2xl rounded-xl'>
			<div className='flex flex-col justify-center gap-2 items-center'>
				<p className='flex gap-2 text-base sm:text-lg'>
					{inputSpaces.map((char, idx) => (
						<span key={idx}>{char}</span>
					))}
				</p>
			</div>
			<ul className='mt-6 grid grid-cols-10 gap-1 md:gap-3'>
				{keyboardRows.map((row, rowIndex) => (
					<li
						key={rowIndex}
						className='flex justify-center col-span-full gap-1 sm:gap-2'
					>
						{row.split('').map(letter => (
							<button
								key={letter}
								onClick={() => handleLetterClick(letter)}
								disabled={alwaysDisabled || clickedLetters[letter]}
								className={` flex justify-center items-center shadow-md rounded-md px-2 py-2 w-[25px] h-[25px] sm:w-[35px] sm:h-[35px] cursor-pointer border border-gray-300 ${clickedLetters[letter]
										? currentWord.toUpperCase().includes(letter)
											? 'bg-green-500 text-white'
											: buttonColorDisabled === true ? 'bg-green-500 text-white' : 'bg-pink-500 text-white'
										: ''
									}`}
							>
								<span className=' text-sm sm:text-xl'>
									{letter}
								</span>
							</button>
						))}
					</li>
				))}
			</ul>
		</div>
	)
}

export default Keyboard
