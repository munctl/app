/**
 * Reduced country representation used throughout the app.
 */
export interface CountryReduced {
	id: string;
	code: string;
	name: string;
	image?: string;
}

/**
 * Reduced NGO representation.
 */
export interface NGOReduced {
	id: string;
	code: string;
	name: string;
	image?: string;
}
