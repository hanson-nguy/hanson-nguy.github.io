const base = import.meta.env.BASE_URL;

export function withBase(path: string): string {
	return base + path.replace(/^\//, '');
}
