import TabsLayout from "@/views/TabsLayout.vue";
import { createRouter, createWebHistory } from "@ionic/vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
	{
		path: "/",
		redirect: "/tabs/home",
	},
	{
		path: "/tabs/",
		component: TabsLayout,
		children: [
			{
				path: "",
				redirect: "/tabs/home",
			},
			{
				path: "home",
				name: "Home",
				component: () => import("@/views/HomePage.vue"),
			},
			{
				path: "settings",
				name: "Settings",
				component: () => import("@/views/SettingsPage.vue"),
			},
		],
	},
	{
		path: "/login",
		name: "Login",
		component: () => import("@/views/LoginPage.vue"),
	},
	{
		path: "/account",
		name: "Account",
		component: () => import("@/views/AccountPage.vue"),
	},
	{
		path: "/committee/create",
		name: "CommitteeCreate",
		component: () => import("@/views/CommitteeCreatePage.vue"),
	},
	{
		path: "/committee/:cid",
		name: "CommitteeDetail",
		component: () => import("@/views/CommitteeDetailPage.vue"),
		props: true,
	},
	{
		path: "/committee/:cid/session/:sid",
		name: "SessionDetail",
		component: () => import("@/views/SessionDetailPage.vue"),
		props: true,
	},
	{
		path: "/committee/:cid/session/:sid/caucus/:caid",
		name: "CaucusView",
		component: () => import("@/views/CaucusPage.vue"),
		props: true,
	},
	{
		path: "/committee/:cid/session/:sid/vote/:vid",
		name: "VoteView",
		component: () => import("@/views/VotePage.vue"),
		props: true,
	},
	{
		path: "/committee/:cid/delegation/:did",
		name: "DelegationDetail",
		component: () => import("@/views/DelegationDetailPage.vue"),
		props: true,
	},
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

export default router;
