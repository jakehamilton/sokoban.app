// CSS Modules
type Mapping = Record<string, string>;
declare module '*.module.css' {
	const mapping: Mapping;
	export default mapping;
}

// Images
declare module '*.png' {
	const url: string;
	export default url;
}
declare module '*.svg' {
	const url: string;
	export default url;
}

// import.meta.env
declare interface ImportMeta {
	env: Record<string, string>;
}
