/* eslint-disable */
import type * as Router from "expo-router";

export * from "expo-router";

declare module "expo-router" {
	export namespace ExpoRouter {
		export interface __routes<T extends string | object = string> {
			hrefInputParams:
				| {
						pathname: Router.RelativePathString;
						params?: Router.UnknownInputParams;
				  }
				| {
						pathname: Router.ExternalPathString;
						params?: Router.UnknownInputParams;
				  }
				| { pathname: `/_sitemap`; params?: Router.UnknownInputParams }
				| {
						pathname: `${"/(app)"}/account` | `/account`;
						params?: Router.UnknownInputParams;
				  }
				| {
						pathname: `${"/(app)"}/login` | `/login`;
						params?: Router.UnknownInputParams;
				  }
				| {
						pathname: `${"/(app)"}/committee/create` | `/committee/create`;
						params?: Router.UnknownInputParams;
				  }
				| { pathname: `${"/(tabs)"}` | `/`; params?: Router.UnknownInputParams }
				| {
						pathname: `${"/(tabs)"}/settings` | `/settings`;
						params?: Router.UnknownInputParams;
				  }
				| {
						pathname: `${"/(app)"}/committee/[cid]` | `/committee/[cid]`;
						params: Router.UnknownInputParams & { cid: string | number };
				  }
				| {
						pathname:
							| `${"/(app)"}/committee/[cid]/delegation/[did]`
							| `/committee/[cid]/delegation/[did]`;
						params: Router.UnknownInputParams & {
							cid: string | number;
							did: string | number;
						};
				  }
				| {
						pathname:
							| `${"/(app)"}/committee/[cid]/session/[sid]`
							| `/committee/[cid]/session/[sid]`;
						params: Router.UnknownInputParams & {
							cid: string | number;
							sid: string | number;
						};
				  }
				| {
						pathname:
							| `${"/(app)"}/committee/[cid]/session/[sid]/caucus/[caid]`
							| `/committee/[cid]/session/[sid]/caucus/[caid]`;
						params: Router.UnknownInputParams & {
							cid: string | number;
							sid: string | number;
							caid: string | number;
						};
				  }
				| {
						pathname:
							| `${"/(app)"}/committee/[cid]/session/[sid]/vote/[vid]`
							| `/committee/[cid]/session/[sid]/vote/[vid]`;
						params: Router.UnknownInputParams & {
							cid: string | number;
							sid: string | number;
							vid: string | number;
						};
				  };
			hrefOutputParams:
				| {
						pathname: Router.RelativePathString;
						params?: Router.UnknownOutputParams;
				  }
				| {
						pathname: Router.ExternalPathString;
						params?: Router.UnknownOutputParams;
				  }
				| { pathname: `/_sitemap`; params?: Router.UnknownOutputParams }
				| {
						pathname: `${"/(app)"}/account` | `/account`;
						params?: Router.UnknownOutputParams;
				  }
				| {
						pathname: `${"/(app)"}/login` | `/login`;
						params?: Router.UnknownOutputParams;
				  }
				| {
						pathname: `${"/(app)"}/committee/create` | `/committee/create`;
						params?: Router.UnknownOutputParams;
				  }
				| {
						pathname: `${"/(tabs)"}` | `/`;
						params?: Router.UnknownOutputParams;
				  }
				| {
						pathname: `${"/(tabs)"}/settings` | `/settings`;
						params?: Router.UnknownOutputParams;
				  }
				| {
						pathname: `${"/(app)"}/committee/[cid]` | `/committee/[cid]`;
						params: Router.UnknownOutputParams & { cid: string };
				  }
				| {
						pathname:
							| `${"/(app)"}/committee/[cid]/delegation/[did]`
							| `/committee/[cid]/delegation/[did]`;
						params: Router.UnknownOutputParams & { cid: string; did: string };
				  }
				| {
						pathname:
							| `${"/(app)"}/committee/[cid]/session/[sid]`
							| `/committee/[cid]/session/[sid]`;
						params: Router.UnknownOutputParams & { cid: string; sid: string };
				  }
				| {
						pathname:
							| `${"/(app)"}/committee/[cid]/session/[sid]/caucus/[caid]`
							| `/committee/[cid]/session/[sid]/caucus/[caid]`;
						params: Router.UnknownOutputParams & {
							cid: string;
							sid: string;
							caid: string;
						};
				  }
				| {
						pathname:
							| `${"/(app)"}/committee/[cid]/session/[sid]/vote/[vid]`
							| `/committee/[cid]/session/[sid]/vote/[vid]`;
						params: Router.UnknownOutputParams & {
							cid: string;
							sid: string;
							vid: string;
						};
				  };
			href:
				| Router.RelativePathString
				| Router.ExternalPathString
				| `/_sitemap${`?${string}` | `#${string}` | ""}`
				| `${"/(app)"}/account${`?${string}` | `#${string}` | ""}`
				| `/account${`?${string}` | `#${string}` | ""}`
				| `${"/(app)"}/login${`?${string}` | `#${string}` | ""}`
				| `/login${`?${string}` | `#${string}` | ""}`
				| `${"/(app)"}/committee/create${`?${string}` | `#${string}` | ""}`
				| `/committee/create${`?${string}` | `#${string}` | ""}`
				| `${"/(tabs)"}${`?${string}` | `#${string}` | ""}`
				| `/${`?${string}` | `#${string}` | ""}`
				| `${"/(tabs)"}/settings${`?${string}` | `#${string}` | ""}`
				| `/settings${`?${string}` | `#${string}` | ""}`
				| {
						pathname: Router.RelativePathString;
						params?: Router.UnknownInputParams;
				  }
				| {
						pathname: Router.ExternalPathString;
						params?: Router.UnknownInputParams;
				  }
				| { pathname: `/_sitemap`; params?: Router.UnknownInputParams }
				| {
						pathname: `${"/(app)"}/account` | `/account`;
						params?: Router.UnknownInputParams;
				  }
				| {
						pathname: `${"/(app)"}/login` | `/login`;
						params?: Router.UnknownInputParams;
				  }
				| {
						pathname: `${"/(app)"}/committee/create` | `/committee/create`;
						params?: Router.UnknownInputParams;
				  }
				| { pathname: `${"/(tabs)"}` | `/`; params?: Router.UnknownInputParams }
				| {
						pathname: `${"/(tabs)"}/settings` | `/settings`;
						params?: Router.UnknownInputParams;
				  }
				| `${"/(app)"}/committee/${Router.SingleRoutePart<T>}${`?${string}` | `#${string}` | ""}`
				| `/committee/${Router.SingleRoutePart<T>}${`?${string}` | `#${string}` | ""}`
				| `${"/(app)"}/committee/${Router.SingleRoutePart<T>}/delegation/${Router.SingleRoutePart<T>}${`?${string}` | `#${string}` | ""}`
				| `/committee/${Router.SingleRoutePart<T>}/delegation/${Router.SingleRoutePart<T>}${`?${string}` | `#${string}` | ""}`
				| `${"/(app)"}/committee/${Router.SingleRoutePart<T>}/session/${Router.SingleRoutePart<T>}${`?${string}` | `#${string}` | ""}`
				| `/committee/${Router.SingleRoutePart<T>}/session/${Router.SingleRoutePart<T>}${`?${string}` | `#${string}` | ""}`
				| `${"/(app)"}/committee/${Router.SingleRoutePart<T>}/session/${Router.SingleRoutePart<T>}/caucus/${Router.SingleRoutePart<T>}${`?${string}` | `#${string}` | ""}`
				| `/committee/${Router.SingleRoutePart<T>}/session/${Router.SingleRoutePart<T>}/caucus/${Router.SingleRoutePart<T>}${`?${string}` | `#${string}` | ""}`
				| `${"/(app)"}/committee/${Router.SingleRoutePart<T>}/session/${Router.SingleRoutePart<T>}/vote/${Router.SingleRoutePart<T>}${`?${string}` | `#${string}` | ""}`
				| `/committee/${Router.SingleRoutePart<T>}/session/${Router.SingleRoutePart<T>}/vote/${Router.SingleRoutePart<T>}${`?${string}` | `#${string}` | ""}`
				| {
						pathname: `${"/(app)"}/committee/[cid]` | `/committee/[cid]`;
						params: Router.UnknownInputParams & { cid: string | number };
				  }
				| {
						pathname:
							| `${"/(app)"}/committee/[cid]/delegation/[did]`
							| `/committee/[cid]/delegation/[did]`;
						params: Router.UnknownInputParams & {
							cid: string | number;
							did: string | number;
						};
				  }
				| {
						pathname:
							| `${"/(app)"}/committee/[cid]/session/[sid]`
							| `/committee/[cid]/session/[sid]`;
						params: Router.UnknownInputParams & {
							cid: string | number;
							sid: string | number;
						};
				  }
				| {
						pathname:
							| `${"/(app)"}/committee/[cid]/session/[sid]/caucus/[caid]`
							| `/committee/[cid]/session/[sid]/caucus/[caid]`;
						params: Router.UnknownInputParams & {
							cid: string | number;
							sid: string | number;
							caid: string | number;
						};
				  }
				| {
						pathname:
							| `${"/(app)"}/committee/[cid]/session/[sid]/vote/[vid]`
							| `/committee/[cid]/session/[sid]/vote/[vid]`;
						params: Router.UnknownInputParams & {
							cid: string | number;
							sid: string | number;
							vid: string | number;
						};
				  };
		}
	}
}
