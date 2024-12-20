export const adjustBackgroundColor = (color: string, amount: number): string => {
	const usePound = color[0] === "#";
	const num = parseInt(usePound ? color.slice(1) : color, 16);

	let r = (num >> 16) + amount;
	let g = ((num >> 8) & 0x00ff) + amount;
	let b = (num & 0x0000ff) + amount;

	r = Math.min(255, Math.max(0, r));
	g = Math.min(255, Math.max(0, g));
	b = Math.min(255, Math.max(0, b));

	return (usePound ? "#" : "") + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
};
