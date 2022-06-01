import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import boxSprite from '../../assets/box.svg';
import playerSprite from '../../assets/player.svg';
import { Cell, CellType } from '../EditableCell';
import EditableGrid, { Grid } from '../EditableGrid';
import Gap from '../Gap';
import style from './style.module.css';

export interface PlayerCell extends Cell {
	index: number;
	x: number;
	y: number;
}

export interface BoxCell extends Cell {
	index: number;
	x: number;
	y: number;
}

export interface GoalCell extends Cell {
	index: number;
	x: number;
	y: number;
}

enum PlayerStatus {
	Playing = 'playing',
	Failure = 'failure',
	Success = 'success'
}

export interface PlayerProps {
	grid: Grid;
	moves: number;
}

export default function Player({ grid, moves: maxMoves }: PlayerProps) {
	const [status, setStatus] = useState(PlayerStatus.Playing);
	const [moves, setMoves] = useState(0);

	const getInitialPlayersState = () => {
		const players: Array<PlayerCell> = [];

		for (let i = 0; i < grid.cells.length; i++) {
			if (grid.cells[i].type === CellType.Player) {
				const row = Math.floor(i / grid.size.width);
				const col = i % grid.size.width;

				players.push({
					...grid.cells[i],
					index: i,
					x: col,
					y: row
				});
			}
		}

		return players;
	};

	const getInitialBoxesState = () => {
		const players: Array<BoxCell> = [];

		for (let i = 0; i < grid.cells.length; i++) {
			if (grid.cells[i].type === CellType.Box) {
				const row = Math.floor(i / grid.size.width);
				const col = i % grid.size.width;

				players.push({
					...grid.cells[i],
					index: i,
					x: col,
					y: row
				});
			}
		}

		return players;
	};

	const [players, setPlayers] = useState(getInitialPlayersState);

	const [boxes, setBoxes] = useState(getInitialBoxesState);

	const goals = useMemo(() => {
		const goals: Array<GoalCell> = [];

		for (let i = 0; i < grid.cells.length; i++) {
			const cell = grid.cells[i];

			const row = Math.floor(i / grid.size.width);
			const col = i % grid.size.width;

			if (cell.type === CellType.Goal) {
				goals.push({
					...cell,
					x: col,
					y: row,
					index: i
				});
			}
		}

		return goals;
	}, [grid]);

	const gridWithoutMovables = useMemo(() => {
		return {
			...grid,
			cells: grid.cells.map(cell =>
				cell.type === CellType.Player || cell.type === CellType.Box ? { type: CellType.Empty } : cell
			)
		};
	}, [grid]);

	const gridRef = useRef<Grid>();
	gridRef.current = gridWithoutMovables;

	const boxesRef = useRef<Array<BoxCell>>();
	boxesRef.current = boxes;

	const playersRef = useRef<Array<PlayerCell>>();
	playersRef.current = players;

	const movesRef = useRef<number>();
	movesRef.current = moves;

	const statusRef = useRef<PlayerStatus>();
	statusRef.current = status;

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'r') {
				setMoves(0);
				setPlayers(getInitialPlayersState());
				setBoxes(getInitialBoxesState());
				setStatus(PlayerStatus.Playing);
				return;
			}

			if (statusRef.current === PlayerStatus.Failure || statusRef.current == PlayerStatus.Success) {
				return;
			}

			const grid = gridRef.current;
			const boxes = boxesRef.current;
			const players = playersRef.current;
			const moves = movesRef.current;

			const newPlayers: Array<PlayerCell> = [];
			const newBoxes: Array<BoxCell> = [];

			switch (event.key) {
				case 'ArrowUp':
				case 'w':
				case 'k':
					for (const player of players) {
						if (player.y - 1 > -1) {
							const box = boxes.find(box => {
								if (box.y === player.y - 1 && box.x === player.x) {
									return true;
								}
							});

							if (box !== undefined && (player.y - 2) * grid.size.width + player.x > -1) {
								const aboveBox = boxes.find(box => {
									if (box.y === player.y - 2 && box.x === player.x) {
										return true;
									}
								});

								const abovePlayer = players.find(p => {
									if (
										p.index !== player.index &&
										p.y === player.y - 2 &&
										p.x === player.x &&
										!newPlayers.find(newPlayer => newPlayer.index === p.index)
									) {
										return true;
									}
								});

								if (!aboveBox && !abovePlayer) {
									const cellAboveBox = grid.cells[(player.y - 2) * grid.size.width + player.x];

									if (cellAboveBox.type === CellType.Empty || cellAboveBox.type === CellType.Goal) {
										newBoxes.push({
											...box,
											y: box.y - 1
										});

										newPlayers.push({
											...player,
											y: player.y - 1
										});
									}
								}

								continue;
							} else if (box !== undefined) {
								continue;
							}

							const playerAbove = players.find(p => {
								if (
									p.index !== player.index &&
									p.y === player.y - 1 &&
									p.x === player.x &&
									!newPlayers.find(newPlayer => newPlayer.index === p.index)
								) {
									return true;
								}
							});
							const above = grid.cells[(player.y - 1) * grid.size.width + player.x];

							if (!playerAbove && (above.type === CellType.Empty || above.type === CellType.Goal)) {
								newPlayers.push({
									...player,
									y: player.y - 1
								});
								continue;
							}
						}
					}
					break;
				case 'ArrowDown':
				case 's':
				case 'j':
					for (let i = players.length - 1; i > -1; i--) {
						const player = players[i];

						if (player.y + 1 < grid.size.height) {
							const box = boxes.find(box => {
								if (box.y === player.y + 1 && box.x === player.x) {
									return true;
								}
							});

							if (box !== undefined && (player.y + 2) * grid.size.width + player.x < grid.cells.length) {
								const belowBox = boxes.find(box => {
									if (box.y === player.y + 2 && box.x === player.x) {
										return true;
									}
								});
								const belowPlayer = players.find(p => {
									if (
										p.index !== player.index &&
										p.y === player.y + 2 &&
										p.x === player.x &&
										!newPlayers.find(newPlayer => newPlayer.index === p.index)
									) {
										return true;
									}
								});

								if (!belowBox && !belowPlayer) {
									const cellBelowBox = grid.cells[(player.y + 2) * grid.size.width + player.x];

									if (cellBelowBox.type === CellType.Empty || cellBelowBox.type === CellType.Goal) {
										newBoxes.push({
											...box,
											y: box.y + 1
										});

										newPlayers.push({
											...player,
											y: player.y + 1
										});
									}
								}

								continue;
							} else if (box !== undefined) {
								continue;
							}

							const playerBelow = players.find(p => {
								if (
									p.index !== player.index &&
									p.y === player.y + 1 &&
									p.x === player.x &&
									!newPlayers.find(newPlayer => newPlayer.index === p.index)
								) {
									return true;
								}
							});

							const below = grid.cells[(player.y + 1) * grid.size.width + player.x];

							if (!playerBelow && (below.type === CellType.Empty || below.type === CellType.Goal)) {
								newPlayers.push({
									...player,
									y: player.y + 1
								});
								continue;
							}
						}
					}
					break;
				case 'ArrowLeft':
				case 'a':
				case 'h':
					for (const player of players) {
						if (player.x - 1 > -1) {
							const box = boxes.find(box => {
								if (box.x === player.x - 1 && box.y === player.y) {
									return true;
								}
							});

							if (box !== undefined && player.x - 2 > -1) {
								const aboveBox = boxes.find(box => {
									if (box.x === player.x - 2 && box.y === player.y) {
										return true;
									}
								});

								const abovePlayer = players.find(p => {
									if (
										p.index !== player.index &&
										p.x === player.x - 2 &&
										p.y === player.y &&
										!newPlayers.find(newPlayer => newPlayer.index === p.index)
									) {
										return true;
									}
								});

								if (!aboveBox && !abovePlayer) {
									const cellBehindBox = grid.cells[player.y * grid.size.width + player.x - 2];

									if (cellBehindBox.type === CellType.Empty || cellBehindBox.type === CellType.Goal) {
										newBoxes.push({
											...box,
											x: box.x - 1
										});

										newPlayers.push({
											...player,
											x: player.x - 1
										});
									}
								}

								continue;
							} else if (box !== undefined) {
								continue;
							}

							const playerBehind = players.find(p => {
								if (
									p.index !== player.index &&
									p.x === player.x - 1 &&
									p.y === player.y &&
									!newPlayers.find(newPlayer => newPlayer.index === p.index)
								) {
									return true;
								}
							});

							const left = grid.cells[player.y * grid.size.width + player.x - 1];

							if (!playerBehind && (left.type === CellType.Empty || left.type === CellType.Goal)) {
								newPlayers.push({
									...player,
									x: player.x - 1
								});
							}
						}
					}
					break;
				case 'ArrowRight':
				case 'd':
				case 'l':
					for (let i = players.length - 1; i > -1; i--) {
						const player = players[i];

						if (player.x + 1 < grid.size.width) {
							const box = boxes.find(box => {
								if (box.x === player.x + 1 && box.y === player.y) {
									return true;
								}
							});

							if (box !== undefined && player.x + 2 < grid.size.width) {
								const aboveBox = boxes.find(box => {
									if (box.x === player.x + 2 && box.y === player.y) {
										return true;
									}
								});

								const abovePlayer = players.find(p => {
									if (
										p.index !== player.index &&
										p.x === player.x + 2 &&
										p.y === player.y &&
										!newPlayers.find(newPlayer => newPlayer.index === p.index)
									) {
										return true;
									}
								});

								if (!aboveBox && !abovePlayer) {
									const cellBehindBox = grid.cells[player.y * grid.size.width + player.x + 2];

									if (cellBehindBox.type === CellType.Empty || cellBehindBox.type === CellType.Goal) {
										newBoxes.push({
											...box,
											x: box.x + 1
										});

										newPlayers.push({
											...player,
											x: player.x + 1
										});
									}
								}

								continue;
							} else if (box !== undefined) {
								continue;
							}

							const playerBehind = players.find(p => {
								if (
									p.index !== player.index &&
									p.x === player.x + 1 &&
									p.y === player.y &&
									!newPlayers.find(newPlayer => newPlayer.index === p.index)
								) {
									return true;
								}
							});

							const left = grid.cells[player.y * grid.size.width + player.x + 1];

							if (!playerBehind && (left.type === CellType.Empty || left.type === CellType.Goal)) {
								newPlayers.push({
									...player,
									x: player.x + 1
								});
							}
						}
					}
					break;
			}

			const updatedPlayers = players.map(oldPlayer => {
				const newPlayer = newPlayers.find(newPlayer => newPlayer.index === oldPlayer.index);

				if (newPlayer) {
					return newPlayer;
				} else {
					return oldPlayer;
				}
			});

			const updatedBoxes = boxes.map(oldBox => {
				const newBox = newBoxes.find(newBox => newBox.index === oldBox.index);

				if (newBox) {
					return newBox;
				} else {
					return oldBox;
				}
			});

			setPlayers(updatedPlayers);

			setBoxes(updatedBoxes);

			let won = true;
			for (const goal of goals) {
				if (!updatedBoxes.find(box => box.x === goal.x && box.y === goal.y)) {
					won = false;
					break;
				}
			}

			if (won) {
				setStatus(PlayerStatus.Success);
			}

			if (newPlayers.length > 0) {
				setMoves(oldMoves => oldMoves + 1);

				if (!won && moves + 1 >= maxMoves) {
					setStatus(PlayerStatus.Failure);
				}
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [grid, maxMoves]);

	const handleMoveReset = () => {
		setMoves(0);
		setPlayers(getInitialPlayersState());
		setBoxes(getInitialBoxesState());
		setStatus(PlayerStatus.Playing);
	};

	const renderPlayers = () => {
		const vdom = [];

		for (const player of players) {
			const css = {
				transform: `translateX(${player.x * 80}px) translateY(${player.y * 80}px)`
			};

			vdom.push(
				<div class={style.player} style={css}>
					<img class={style.sprite} src={playerSprite} />
				</div>
			);
		}

		return vdom;
	};

	const renderBoxes = () => {
		const vdom = [];

		for (const box of boxes) {
			const css: Record<string, string> = {
				transform: `translateX(${box.x * 80}px) translateY(${box.y * 80}px)`
			};

			const goal = goals.find(goal => {
				if (goal.x === box.x && goal.y === box.y) {
					return true;
				}
			});

			if (goal) {
				css.borderColor = 'var(--success)';
				css.borderWidth = '4px';
			}

			vdom.push(
				<div class={style.box} style={css}>
					<img class={style.sprite} src={boxSprite} />
				</div>
			);
		}

		return vdom;
	};

	return (
		<div class={style.Player}>
			<div class={`${style.moves} ${style[status]}`}>{maxMoves - moves}</div>
			<Gap vertical />
			<button class={style.reset} onClick={handleMoveReset}>
				RESET
			</button>
			<Gap size={2} vertical />
			<div class={style.instructions}>
				<div>Click RESET or press R to restart.</div>
				<div>Use Arrow Keys, WASD, or HJKL to move.</div>
			</div>
			<Gap vertical />
			<EditableGrid grid={gridWithoutMovables} onClick={() => {}}>
				{renderPlayers()}
				{renderBoxes()}
			</EditableGrid>
		</div>
	);
}
