import axios from 'axios';

export const buildUrlWithParams = (baseUrl: string, params: Record<string, string>) => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, value);
  })
  return `${baseUrl}?${searchParams.toString()}`
}

export const getQuote = async (URL: string) => {
  try {
    const res = await axios.get(URL);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to get quote: ${error.message}. Status: ${error.response?.status}`);
    }
    throw new Error(`Failed to get quote: ${error}`);
  }
};

export const getSwapInstruction = async (URL: string, body: string) => {
  try {
    const res = await axios.post(URL, body, {
      headers: { 'Content-Type': 'application/json' }
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to get swap instructions: ${error.message}. Status: ${error.response?.status}`);
    }
    throw new Error(`Failed to get swap instructions: ${error}`);
  }
};
