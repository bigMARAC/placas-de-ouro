import axios from 'axios';

const BASE_URL = 'https://openscriptureapi.org/api/scriptures/v1/lds/en/book';

interface ScriptureResponse {
  chapter: {
    verses: [
      {
        text: string;
      }
    ];
  }
}

export const getChapterVerses = async (book: string, chapter: string): Promise<ScriptureResponse> => {
  try {
    const response = await axios.get<ScriptureResponse>(`${BASE_URL}/${book}/${chapter}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching scripture verses:', error);
    throw error;
  }
};
