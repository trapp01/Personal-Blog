import { type CollectionEntry, getCollection } from "astro:content";
import { collectionDateSort } from "@/utils/date";

export type MediaType = CollectionEntry<"media">["data"]["type"];

/** Display metadata per media type — single source of truth for labels, plurals and icons. */
export const MEDIA_TYPES: Record<MediaType, { label: string; plural: string; icon: string }> = {
	music: { label: "Music", plural: "albums", icon: "mdi:music" },
	movie: { label: "Film", plural: "films", icon: "mdi:movie-open" },
	show: { label: "Show", plural: "shows", icon: "mdi:television-classic" },
	game: { label: "Game", plural: "games", icon: "mdi:controller" },
	book: { label: "Book", plural: "books", icon: "mdi:book-open-page-variant" },
};

/** Order types appear in filter chips and the stats strip. */
export const MEDIA_TYPE_ORDER: MediaType[] = ["music", "movie", "show", "game", "book"];

/** filter out draft entries based on the environment (mirrors getAllPosts) */
export async function getAllMedia(): Promise<CollectionEntry<"media">[]> {
	return await getCollection("media", ({ data }) => {
		return import.meta.env.PROD ? !data.draft : true;
	});
}

/** entries I'm currently into (status === "now"), newest first
 *  Note: pass the result of getAllMedia to respect draft filtering. */
export function getNowItems(media: CollectionEntry<"media">[]): CollectionEntry<"media">[] {
	return media.filter((item) => item.data.status === "now").sort(collectionDateSort);
}

export interface YearInMedia {
	year: number;
	total: number;
	byType: Partial<Record<MediaType, number>>;
}

/** counts of what I logged in a given year (defaults to the build year), for the stats strip
 *  Note: pass the result of getAllMedia to respect draft filtering. */
export function getYearInMedia(media: CollectionEntry<"media">[], year?: number): YearInMedia {
	const target = year ?? new Date().getFullYear();
	const inYear = media.filter((item) => item.data.publishDate.getFullYear() === target);
	const byType = inYear.reduce<Partial<Record<MediaType, number>>>((acc, item) => {
		acc[item.data.type] = (acc[item.data.type] ?? 0) + 1;
		return acc;
	}, {});
	return { year: target, total: inYear.length, byType };
}
