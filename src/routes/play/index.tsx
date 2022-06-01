import { useRoute } from 'preact-iso';
import { useEffect, useState } from 'preact/hooks';
import icon from '../../assets/icon.svg';
import Gap from '../../components/Gap';
import Player from '../../components/Player';
import { deserialize } from '../../util/share';
import style from './style.module.css';

export default function Play() {
	const [isToastVisible, setIsToastVisible] = useState(false);
	const { grid, moves } = deserialize(window.location.href);

	const handleShareClick = () => {
		setIsToastVisible(true);
		navigator.clipboard.writeText(window.location.href);
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
		<main class={style.Play}>
			<div class={style.header}>
				<div class={style.headerLeft}>
					<a class={`${style.link} ${style.home}`} href="/">
						<img src={icon} width="24" height="24" /> sokoban.app
					</a>
				</div>
				<div class={style.headerRight}>
					<button class={style.shareButton} onClick={handleShareClick}>
						Share
						{isToastVisible ? <div class={style.toast}>Link Copied!</div> : null}
					</button>
				</div>
			</div>
			<Gap size={4} vertical />

			<Player grid={grid} moves={moves} />
		</main>
	);
}
