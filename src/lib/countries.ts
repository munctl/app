import worldCountries from "world-countries";

export interface CountryEntry {
	code: string;
	name: string;
	flag: string;
}

const countries: CountryEntry[] = worldCountries
	.map((c) => ({
		code: c.cca2.toLowerCase(),
		name: c.name.common,
		flag: `https://flagcdn.com/w80/${c.cca2.toLowerCase()}.png`,
	}))
	.sort((a, b) => a.name.localeCompare(b.name));

export default countries;

export function searchCountries(
	query: string,
	excludeCodes: string[] = [],
): CountryEntry[] {
	const q = query.toLowerCase().trim();
	return countries.filter(
		(c) =>
			!excludeCodes.includes(c.code) &&
			(q === "" || c.name.toLowerCase().includes(q) || c.code.includes(q)),
	);
}
