import icon from '../../assets/icon.svg';
import Gap from '../../components/Gap';
import style from './style.module.css';

export const Home = () => (
	<main class={style.Home}>
		<img src={icon} width="150" height="150" />
		<Gap size={1.5} vertical />
		<h1 class={style.title}>sokoban.app</h1>
		<Gap size={3} vertical />
		<a href="/create" class={style.linkButton}>
			Create A Puzzle
		</a>
	</main>
);
