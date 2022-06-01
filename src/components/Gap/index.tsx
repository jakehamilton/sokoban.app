export interface GapProps {
	size?: number;
	vertical?: boolean;
	horizontal?: boolean;
}

export default function Gap({ size = 1, vertical, horizontal }: GapProps) {
	const space = `calc(var(--space) * ${size})`;

	const styles: Record<string, string> = {};

	if (vertical) {
		styles.paddingTop = space;
	}
	if (horizontal) {
		styles.paddingLeft = space;
	}

	return <div style={styles} />;
}
