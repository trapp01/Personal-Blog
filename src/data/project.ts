import { type CollectionEntry, getCollection } from "astro:content";

export type ProjectStatus = CollectionEntry<"project">["data"]["status"];

/** Label per status — single source of truth for the home list and the index. */
export const PROJECT_STATUS: Record<ProjectStatus, string> = {
	building: "Building",
	shipped: "Shipped",
	ongoing: "Ongoing",
};

/** filter out draft entries based on the environment (mirrors getAllPosts) */
export async function getAllProjects(): Promise<CollectionEntry<"project">[]> {
	return await getCollection("project", ({ data }) => {
		return import.meta.env.PROD ? !data.draft : true;
	});
}
