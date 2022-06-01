import { useEffect, useState } from 'preact/hooks';
import { JSXInternal } from 'preact/src/jsx';
import icon from '../../assets/icon.svg';
import { Cell, CellType } from '../../components/EditableCell';
import EditableGrid, { Grid } from '../../components/EditableGrid';
import Gap from '../../components/Gap';
import GridSizeInput, { GridSize } from '../../components/GridSizeInput';
import GridTools from '../../components/GridTools';
import Player from '../../components/Player';
import { serialize } from '../../util/share';
import style from './style.module.css';

export default function Create() {
	const [isEditing, setIsEditing] = useState(true);

	const [moves, setMoves] = useState(3);

	const [grid, setGrid] = useState<Grid>(() => {
		const size = { width: 5, height: 5 };

		const cells: Array<Cell> = [];

		for (let i = 0; i < size.height; i++) {
			for (let j = 0; j < size.width; j++) {
				cells.push({
					type: CellType.Empty
				});
			}
		}

		cells[6] = {
			type: CellType.Wall
		};

		cells[7] = {
			type: CellType.Wall
		};

		cells[8] = {
			type: CellType.Wall
		};

		cells[10] = {
			type: CellType.Player
		};

		cells[12] = {
			type: CellType.Box
		};

		cells[14] = {
			type: CellType.Goal
		};

		cells[16] = {
			type: CellType.Wall
		};

		cells[17] = {
			type: CellType.Wall
		};

		cells[18] = {
			type: CellType.Wall
		};

		return { size, cells };
	});

	const [tool, setTool] = useState(CellType.Empty);

	const handleGridSizeChange = (size: GridSize) => {
		const newCells: Array<Cell> = Array.from({ length: size.width * size.height }, () => ({
			type: CellType.Empty
		}));

		for (let row = 0; row < Math.min(grid.size.height, size.height); row++) {
			for (let col = 0; col < Math.min(grid.size.width, size.width); col++) {
				const index = row * grid.size.width + col;

				const cell = grid.cells[index];

				const newIndex = row * size.width + col;
				newCells[newIndex] = cell;
			}
		}

		setGrid(oldGrid => ({
			size,
			cells: newCells
		}));
	};

	const handleGridClick = (position: { x: number; y: number }, cell: Cell) => {
		const index = position.y * grid.size.width + position.x;

		setGrid(oldGrid => {
			const cells = oldGrid.cells.map((oldCell, i) => {
				if (i === index) {
					return {
						type: tool
					};
				} else {
					return oldCell;
				}
			});

			return {
				...oldGrid,
				cells
			};
		});
	};

	const handleToolChange = (type: CellType) => {
		setTool(type);
	};

	const handleEditingToggle = () => {
		setIsEditing(isEditing => !isEditing);
	};

	const handleMovesInput = event => {
		if (event.target.valueAsNumber > 0) {
			setMoves(event.target.valueAsNumber);
		}
	};

	const [isToastVisible, setIsToastVisible] = useState(false);

	const handleShareClick = () => {
		setIsToastVisible(true);
		navigator.clipboard.writeText(serialize(grid, moves));
	};

	useEffect(() => {
		if (isToastVisible) {
			const timeout = setTimeout(() => {
				setIsToastVisible(false);
			}, 3_000);

			return () => {
				clearTimeout(timeout);
			};
		}
	}, [isToastVisible]);

	return (
		<main class={style.Create}>
			<div class={style.header}>
				<div class={style.headerLeft}>
					<a class={`${style.link} ${style.home}`} href="/">
						<img src={icon} width="24" height="24" /> sokoban.app
					</a>
				</div>
				<div class={style.headerRight}>
					<button class={style.editingToggle} onClick={handleEditingToggle}>
						{isEditing ? 'Preview' : 'Edit'}
					</button>
					<button class={style.shareButton} onClick={handleShareClick}>
						Share
						{isToastVisible ? <div class={style.toast}>Link Copied!</div> : null}
					</button>
				</div>
			</div>
			<Gap size={4} vertical />
			{isEditing ? (
				<>
					<input min="1" value={moves} type="number" class={style.movesInput} onInput={handleMovesInput} />
					<Gap vertical />
					<GridSizeInput size={grid.size} onChange={handleGridSizeChange} />
					<Gap size={2} vertical />
					<GridTools tool={tool} onClick={handleToolChange} />
					<Gap size={2} vertical />
					<EditableGrid grid={grid} onClick={handleGridClick} />
				</>
			) : (
				<>
					<Player grid={grid} moves={moves} />
				</>
			)}
		</main>
	);
}
