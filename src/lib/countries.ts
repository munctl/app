import ct from "world-countries";

export const countries = ct.map((c) => ({
	name: c.name.common,
	code: c.cca2,
	image:
		"https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/624px-No-Image-Placeholder.svg.png",
}));
