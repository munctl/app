// Manually created, temporary

export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	public: {
		Tables: {
			caucus: {
				Row: {
					created: string | null;
					id: string;
					queue: string[] | null;
					session: string;
					speaker: string | null;
					speakerTime: number | null;
					speakerTimeRemaining: number | null;
					timeRemaining: number;
					topic: string;
					totalTime: number;
					type: Database["public"]["Enums"]["caucus_types"];
					updated: string | null;
				};
				Insert: {
					created?: string | null;
					id?: string;
					queue?: string[] | null;
					session: string;
					speaker?: string | null;
					speakerTime?: number | null;
					speakerTimeRemaining?: number | null;
					timeRemaining: number;
					topic: string;
					totalTime: number;
					type: Database["public"]["Enums"]["caucus_types"];
					updated?: string | null;
				};
				Update: {
					created?: string | null;
					id?: string;
					queue?: string[] | null;
					session?: string;
					speaker?: string | null;
					speakerTime?: number | null;
					speakerTimeRemaining?: number | null;
					timeRemaining?: number;
					topic?: string;
					totalTime?: number;
					type?: Database["public"]["Enums"]["caucus_types"];
					updated?: string | null;
				};
				Relationships: [];
			};
			committees: {
				Row: {
					admins: string[];
					date: string | null;
					id: string;
					name: string;
					users: string[];
				};
				Insert: {
					admins: string[];
					date?: string | null;
					id?: string;
					name: string;
					users: string[];
				};
				Update: {
					admins?: string[];
					date?: string | null;
					id?: string;
					name?: string;
					users?: string[];
				};
				Relationships: [];
			};
			countries: {
				Row: {
					code: string;
					flag: string | null;
					name: string;
				};
				Insert: {
					code: string;
					flag?: string | null;
					name: string;
				};
				Update: {
					code?: string;
					flag?: string | null;
					name?: string;
				};
				Relationships: [];
			};
			countries_to_committees: {
				Row: {
					committee: string;
					country: string;
				};
				Insert: {
					committee: string;
					country: string;
				};
				Update: {
					committee?: string;
					country?: string;
				};
				Relationships: [
					{
						foreignKeyName: "countries_to_committees_committee_committees_id_fk";
						columns: ["committee"];
						isOneToOne: false;
						referencedRelation: "committees";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "countries_to_committees_country_countries_code_fk";
						columns: ["country"];
						isOneToOne: false;
						referencedRelation: "countries";
						referencedColumns: ["code"];
					},
				];
			};
			countries_to_sessions: {
				Row: {
					country: string;
					session: string;
					status: Database["public"]["Enums"]["status"];
				};
				Insert: {
					country: string;
					session: string;
					status: Database["public"]["Enums"]["status"];
				};
				Update: {
					country?: string;
					session?: string;
					status?: Database["public"]["Enums"]["status"];
				};
				Relationships: [
					{
						foreignKeyName: "countries_to_sessions_country_countries_code_fk";
						columns: ["country"];
						isOneToOne: false;
						referencedRelation: "countries";
						referencedColumns: ["code"];
					},
					{
						foreignKeyName: "countries_to_sessions_session_sessions_id_fk";
						columns: ["session"];
						isOneToOne: false;
						referencedRelation: "sessions";
						referencedColumns: ["id"];
					},
				];
			};
			sessions: {
				Row: {
					created: string | null;
					id: string;
				};
				Insert: {
					created?: string | null;
					id?: string;
				};
				Update: {
					created?: string | null;
					id?: string;
				};
				Relationships: [];
			};
			sessions_to_committees: {
				Row: {
					committee: string;
					session: string;
				};
				Insert: {
					committee: string;
					session: string;
				};
				Update: {
					committee?: string;
					session?: string;
				};
				Relationships: [
					{
						foreignKeyName: "sessions_to_committees_committee_committees_id_fk";
						columns: ["committee"];
						isOneToOne: false;
						referencedRelation: "committees";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "sessions_to_committees_session_sessions_id_fk";
						columns: ["session"];
						isOneToOne: false;
						referencedRelation: "sessions";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			caucus_types: "moderated" | "unmoderated" | "gsl";
			status: "present" | "absent" | "presentVoting";
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
				DefaultSchema["Views"])
		? (DefaultSchema["Tables"] &
				DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema["Enums"]
		| { schema: keyof Database },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
		? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema["CompositeTypes"]
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
		? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	public: {
		Enums: {
			caucus_types: ["moderated", "unmoderated", "gsl"],
			status: ["present", "absent", "presentVoting"],
		},
	},
} as const;
