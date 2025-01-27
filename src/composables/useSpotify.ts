import { ref } from 'vue';
import axios, { type AxiosError, type AxiosResponse } from 'axios'
import type {
  ApiErrorResponse,
  SpotifySearchRequest,
  SpotifySearchResponse,
} from '@/types'

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = window.location.origin;
const BASE_URL = 'https://api.spotify.com/v1';

const REQUIRED_SCOPES = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-library-read',
  'playlist-read-private',
].join(' ');

export const useSpotify = () => {
  const accessToken = ref<string|null>(null);
  const spotifySearchError = ref<string|null>(null);
  const spotifySearchLoading = ref(false);

  const getAccessToken = async ():Promise<string|null> => {
    let token = localStorage.getItem('spotify_token');
    const tokenExpiry = localStorage.getItem('spotify_token_expiry');

    // If token is not available or has expired
    if (!token || (tokenExpiry && Date.now() > parseInt(tokenExpiry))) {
      const params = new URLSearchParams(window.location.hash.substring(1));
      token = params.get('access_token');
      const expiresIn = Number(params.get('expires_in'));

      if (token) {
        localStorage.setItem('spotify_token', token);
        localStorage.setItem('spotify_token_expiry', String(Date.now() + (expiresIn * 1000)));
        window.location.hash = '';
      } else {
        const authUrl = new URL('https://accounts.spotify.com/authorize');
        authUrl.searchParams.append('client_id', CLIENT_ID);
        authUrl.searchParams.append('response_type', 'token');
        authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
        authUrl.searchParams.append('scope', REQUIRED_SCOPES);
        authUrl.searchParams.append('show_dialog', 'true');

        window.location.href = authUrl.toString();
        return null;
      }
    }

    accessToken.value = token;

    return token;
  };

  const searchTrackByName = async (name: string): Promise<SpotifySearchResponse> => {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      throw new Error('Access Token not available');
    }

    const createSearchRequest = (accessToken: string, name: string):SpotifySearchRequest => {
      return {
        params: {
          q: name,
          type: 'track',
          limit: 1,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      }
    }

    try {
      const response: AxiosResponse<SpotifySearchResponse> = await axios.get(
        `${BASE_URL}/search`,
        createSearchRequest(accessToken, name)
      )

      return response.data
    } catch (error) {
      const err = error as AxiosError<ApiErrorResponse>
      spotifySearchError.value = err.response?.data?.error || 'An error occurred while fetching data'
      throw new Error(spotifySearchError.value)
    } finally {
      spotifySearchLoading.value = false
    }
  };

  return {
    searchTrackByName,
    getAccessToken,
    spotifySearchError,
    spotifySearchLoading
  }
}
