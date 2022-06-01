import { lazy, Router } from 'preact-iso';
import { Header } from './components/header';

// Statically-imported routes are loaded with your main bundle:
import { Home } from './routes/home';

// ... whereas dynamically imported routes are loaded on-demand:
const About = lazy(() => import('./routes/about'));
const Play = lazy(() => import('./routes/play'));
const Create = lazy(() => import('./routes/create'));

export function App() {
	return (
		<div class="app">
			{/* <Header /> */}
			<Router>
				<Home path="/" />
				<Create path="/create" />
				<About path="/about" />
				<Play path="/play" />
			</Router>
		</div>
	);
}
