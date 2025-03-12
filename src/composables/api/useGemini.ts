import axios, { type AxiosError, type AxiosResponse } from 'axios'
import { ref } from 'vue'
import type {
  ApiErrorResponse,
  GeminiMovieOSTResponse,
  GeminiPrompt,
  GeminiRequest,
  GeminiResponse,
  GeminiSimilarMoviesResponse
} from '@/types'
import { GEMINI_PROMPT_MOVIE_OST, GEMINI_PROMPT_SIMILAR_MOVIES } from '@/constants.ts'

const API_KEY: ApiKeyString = import.meta.env.VITE_GEMINI_API_KEY as ApiKeyString
const BASE_URL: string = 'https://generativelanguage.googleapis.com/v1beta'

export const useGemini = () => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const createGeminiRequest = (prompt: string): GeminiRequest => {
    return {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }
  }

  const cleanResponse = (response: string): string => {
    return response.replace(/\n|```json|```/gi, '')
  }

  function sendMessageToGemini(prompt: 'similar_movies', title: string, release_date: string): Promise<GeminiSimilarMoviesResponse[]>;
  function sendMessageToGemini(prompt: 'movie_ost', title: string, release_date: string): Promise<GeminiMovieOSTResponse[]>;

  async function sendMessageToGemini(
    prompt: GeminiPrompt,
    title: string,
    release_date: string
  ): Promise<GeminiSimilarMoviesResponse[] | GeminiMovieOSTResponse[]> {
    isLoading.value = true
    error.value = null

    const requestPrompt =
      prompt === 'similar_movies'
        ? GEMINI_PROMPT_SIMILAR_MOVIES(title, release_date)
        : GEMINI_PROMPT_MOVIE_OST(title, release_date);

    try {
      const response: AxiosResponse<GeminiResponse> = await axios.post(
        `${BASE_URL}/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`,
        createGeminiRequest(requestPrompt),
      )

      console.log('Fetching data from Gemini')

      const cleanedData: string = cleanResponse(response.data.candidates[0].content.parts[0].text)

      return JSON.parse(cleanedData)
    } catch (e) {
      const err = e as AxiosError<ApiErrorResponse>
      error.value = err.response?.data?.error || 'An error occurred while fetching data'
      throw new Error(error.value)
    } finally {
      isLoading.value = false
    }
  }

  return {
    sendMessageToGemini,
    isLoading,
    error,
  }
}
