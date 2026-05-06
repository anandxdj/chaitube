// API base URL
const BASE_URL = "https://api.freeapi.app/api/v1/public/youtube";

/**
 * Fetch a paginated list of YouTube videos.
 * @param {Object} params - { page, limit, query, sortBy }
 */
export async function getVideos({ page = 1, limit = 20, query = "", sortBy = "latest" } = {}) {
  const url = new URL(`${BASE_URL}/videos`);
  url.searchParams.set("page", page);
  url.searchParams.set("limit", limit);
  if (query) url.searchParams.set("query", query);
  if (sortBy) url.searchParams.set("sortBy", sortBy);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to fetch videos: ${res.status}`);
  return res.json();
}

/**
 * Fetch a single video's full details by ID.
 * @param {string} videoId
 */
export async function getVideoById(videoId) {
  const res = await fetch(`${BASE_URL}/videos/${videoId}`);
  if (!res.ok) throw new Error(`Failed to fetch video: ${res.status}`);
  return res.json();
}

/**
 * Fetch comments for a video.
 * @param {string} videoId
 */
export async function getVideoComments(videoId) {
  const res = await fetch(`${BASE_URL}/comments/${videoId}`);
  if (!res.ok) throw new Error(`Failed to fetch comments: ${res.status}`);
  return res.json();
}

/**
 * Fetch related videos for a given videoId.
 * @param {string} videoId
 * @param {Object} params - { page, limit }
 */
export async function getRelatedVideos(videoId, { page = 1, limit = 10 } = {}) {
  const url = new URL(`${BASE_URL}/related/${videoId}`);
  url.searchParams.set("page", page);
  url.searchParams.set("limit", limit);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to fetch related videos: ${res.status}`);
  return res.json();
}

/**
 * Fetch all playlists for the channel.
 * @param {Object} params - { page, limit }
 */
export async function getPlaylists({ page = 1, limit = 10 } = {}) {
  const url = new URL(`${BASE_URL}/playlists`);
  url.searchParams.set("page", page);
  url.searchParams.set("limit", limit);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to fetch playlists: ${res.status}`);
  return res.json();
}

/**
 * Fetch details and items for a specific playlist.
 * @param {string} playlistId
 */
export async function getPlaylistById(playlistId) {
  const res = await fetch(`${BASE_URL}/playlists/${playlistId}`);
  if (!res.ok) throw new Error(`Failed to fetch playlist: ${res.status}`);
  return res.json();
}

/**
 * Fetch channel details.
 * Returns: { data: { kind, info: { snippet, statistics, brandingSettings } } }
 */
export async function getChannel() {
  const res = await fetch(`${BASE_URL}/channel`);
  if (!res.ok) throw new Error(`Failed to fetch channel: ${res.status}`);
  return res.json();
}
