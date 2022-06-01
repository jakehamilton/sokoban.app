import empty from '../../assets/empty.svg';
import box from '../../assets/box.svg';
import goal from '../../assets/goal.svg';
import player from '../../assets/player.svg';
import { CellType } from '../EditableCell';
import style from './style.module.css';

export interface GridToolsProps {
	tool: CellType;
	onClick: (type: CellType) => void;
}

export default function GridTools({ tool, onClick }: GridToolsProps) {
	const createHandler = (type: CellType) => () => {
		onClick(type);
	};

	return (
		<div class={style.GridTools}>
			<button
				class={`${style.button} ${tool === CellType.Empty ? style.enabled : ''}`}
				onClick={createHandler(CellType.Empty)}
			>
				Empty
				<img src={empty} class={style.empty} width="42" height="42" />
			</button>
			<button
				class={`${style.button} ${tool === CellType.Box ? style.enabled : ''}`}
				onClick={createHandler(CellType.Box)}
			>
				Box
				<img src={box} width="42" height="42" />
			</button>
			<button
				class={`${style.button} ${tool === CellType.Wall ? style.enabled : ''}`}
				onClick={createHandler(CellType.Wall)}
			>
				Wall
				<div class={style.wall} />
			</button>
			{/* <button
				class={`${style.button} ${tool === CellType.Hole ? style.enabled : ''}`}
				onClick={createHandler(CellType.Hole)}
			>
				Hole
			</button> */}
			<button
				class={`${style.button} ${tool === CellType.Goal ? style.enabled : ''}`}
				onClick={createHandler(CellType.Goal)}
			>
				Goal
				<img src={goal} width="42" height="42" />
			</button>
			<button
				class={`${style.button} ${tool === CellType.Player ? style.enabled : ''}`}
				onClick={createHandler(CellType.Player)}
			>
				Player
				<img src={player} width="42" height="42" />
			</button>
		</div>
	);
}
