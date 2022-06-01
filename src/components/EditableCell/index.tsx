import box from '../../assets/box.svg';
import goal from '../../assets/goal.svg';
import player from '../../assets/player.svg';
import { Grid } from '../EditableGrid';
import style from './style.module.css';

export enum CellType {
	Empty = 'empty',
	Box = 'box',
	Wall = 'wall',
	Hole = 'hole',
	Goal = 'goal',
	Player = 'player'
}

export interface Cell {
	type: CellType;
}

export interface EditableCellProps {
	row: number;
	col: number;
	grid: Grid;
	onClick: (position: { x: number; y: number }, cell: Cell) => void;
}

export default function EditableCell({ row, col, grid, onClick }: EditableCellProps) {
	const index = grid.size.width * row + col;
	const cell = grid.cells[index];

	const handleClick = () => {
		onClick({ x: col, y: row }, cell);
	};

	const css: Record<string, string> = {};

	if (cell.type === CellType.Wall) {
		if (index - grid.size.width > -1) {
			const above = grid.cells[index - grid.size.width];

			if (above.type === cell.type) {
				css.borderTopLeftRadius = '0';
				css.borderTopRightRadius = '0';
			}
		}

		if (index + grid.size.width < grid.cells.length - 1) {
			const below = grid.cells[index + grid.size.width];

			if (below.type === cell.type) {
				css.borderBottomLeftRadius = '0';
				css.borderBottomRightRadius = '0';
			}
		}

		if (col - 1 > -1) {
			const prev = grid.cells[index - 1];

			if (prev.type === cell.type) {
				css.borderTopLeftRadius = '0';
				css.borderBottomLeftRadius = '0';
			}
		}

		if (col + 1 < grid.size.width) {
			const next = grid.cells[index + 1];

			if (next.type === cell.type) {
				css.borderTopRightRadius = '0';
				css.borderBottomRightRadius = '0';
			}
		}

		if (col === 0) {
			css.borderTopLeftRadius = '0';
			css.borderBottomLeftRadius = '0';
		}

		if (col === grid.size.width - 1) {
			css.borderTopRightRadius = '0';
			css.borderBottomRightRadius = '0';
		}
	}

	if (index === 0) {
		css.borderTopLeftRadius = 'var(--round2)';
	} else if (index === grid.size.width - 1) {
		css.borderTopRightRadius = 'var(--round2)';
	} else if (index === grid.cells.length - grid.size.width) {
		css.borderBottomLeftRadius = 'var(--round2)';
	} else if (index === grid.cells.length - 1) {
		css.borderBottomRightRadius = 'var(--round2)';
	}

	const renderSprite = () => {
		switch (cell.type) {
			case CellType.Box:
				return <img class={style.sprite} src={box} />;
			case CellType.Goal:
				return <img class={style.sprite} src={goal} />;
			case CellType.Player:
				return <img class={style.sprite} src={player} />;
			default:
				return null;
		}
	};

	return (
		<div
			style={css}
			class={`${style.EditableCell} ${style[cell.type]}`}
			onClick={handleClick}
			aria-label={`${cell.type} cell`}
		>
			{renderSprite()}
		</div>
	);
}
