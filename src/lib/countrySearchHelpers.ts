import { countries } from "./countries";

export function filterCountries(query: string) {
	if (!query.trim()) return [];
	const lower = query.toLowerCase();
	return countries.filter(
		(c) =>
			c.name.toLowerCase().includes(lower) ||
			c.code.toLowerCase().includes(lower),
	);
}

export function getCountryName(country: (typeof countries)[number]) {
	return country.name;
}
