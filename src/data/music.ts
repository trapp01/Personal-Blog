import { type CollectionEntry, getCollection } from "astro:content";

export interface FeaturedPlaylist {
	title: string;
	url: string;
}

/** Playlists highlighted at the top of /music, rendered as Spotify embeds.
 *  Replace the example below with your own "Top 10 of YYYY" playlist share links. */
export const FEATURED_PLAYLISTS: FeaturedPlaylist[] = [
	{
		title: "Today's Top Hits (example — replace me)",
		url: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M",
	},
];

/** filter out draft reviews based on the environment (mirrors getAllPosts) */
export async function getAllReviews(): Promise<CollectionEntry<"music">[]> {
	return await getCollection("music", ({ data }) => {
		return import.meta.env.PROD ? !data.draft : true;
	});
}
