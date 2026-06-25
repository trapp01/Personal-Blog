import { type CollectionEntry, getCollection } from "astro:content";

/** filter out draft posts based on the environment */
export async function getAllPosts(): Promise<CollectionEntry<"post">[]> {
	return await getCollection("post", ({ data }) => {
		return import.meta.env.PROD ? !data.draft : true;
	});
}

/** Get tag metadata by tag name */
export async function getTagMeta(tag: string): Promise<CollectionEntry<"tag"> | undefined> {
	const tagEntries = await getCollection("tag", (entry) => {
		return entry.id === tag;
	});
	return tagEntries[0];
}

/** groups posts by year (based on option siteConfig.sortPostsByUpdatedDate), using the year as the key
 *  Note: This function doesn't filter draft posts, pass it the result of getAllPosts above to do so.
 */
export function groupPostsByYear(posts: CollectionEntry<"post">[]) {
	return Object.groupBy(posts, (post) => post.data.publishDate.getFullYear().toString());
}

/** Anything that carries a `tags` array — posts and media both qualify. */
export type Taggable = CollectionEntry<"post"> | CollectionEntry<"media">;

/** returns all tags across the given entries (inc duplicate tags)
 *  Note: This function doesn't filter drafts, pass it the result of getAllPosts/getAllMedia to do so.
 *  */
export function getAllTags(entries: Taggable[]) {
	return entries.flatMap((entry) => [...entry.data.tags]);
}

/** returns all unique tags across the given entries
 *  Note: This function doesn't filter drafts, pass it the result of getAllPosts/getAllMedia to do so.
 *  */
export function getUniqueTags(entries: Taggable[]) {
	return [...new Set(getAllTags(entries))];
}

/** returns a count of each unique tag - [[tagName, count], ...]
 *  Note: This function doesn't filter drafts, pass it the result of getAllPosts/getAllMedia to do so.
 *  */
export function getUniqueTagsWithCount(entries: Taggable[]): [string, number][] {
	return [
		...getAllTags(entries).reduce(
			(acc, t) => acc.set(t, (acc.get(t) ?? 0) + 1),
			new Map<string, number>(),
		),
	].sort((a, b) => b[1] - a[1]);
}
