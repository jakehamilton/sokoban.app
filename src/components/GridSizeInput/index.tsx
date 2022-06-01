import style from './style.module.css';

export interface GridSize {
	width: number;
	height: number;
}

export interface GridSizeInputProps {
	size: GridSize;
	onChange: (size: GridSize) => void;
}

export default function GridSizeInput({ size, onChange }: GridSizeInputProps) {
	const handleWidthChange = event => {
		const number = event.target.valueAsNumber;

		onChange({
			width: number,
			height: size.height
		});
	};

	const handleHeightChange = event => {
		const number = event.target.valueAsNumber;

		onChange({
			width: size.width,
			height: number
		});
	};

	return (
		<div class={style.GridSizeInput}>
			<input
				class={`${style.WidthInput} ${style.Input}`}
				type="number"
				value={size.width}
				min="3"
				max="30"
				onInput={handleWidthChange}
			/>
			<span class={style.x}></span>
			<input
				class={`${style.HeightInput} ${style.Input}`}
				type="number"
				value={size.height}
				min="3"
				max="30"
				onInput={handleHeightChange}
			/>
		</div>
	);
}
