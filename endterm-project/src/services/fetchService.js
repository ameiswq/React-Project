const BASE_URL = "https://rickandmortyapi.com/api/character";

export async function fetchCharacters({ name = "", page = 1 } = {}) {
  const params = new URLSearchParams();
  if (name) params.append("name", name);
  if (page) params.append("page", page);
  const url = `${BASE_URL}?${params.toString()}`;
  const response = await fetch(url);
  if (response.status === 404) {
    return { info: { count: 0, pages: 0 }, results: [] };
  }
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return await response.json();
}
export async function fetchCharacterById(id) {
  const url = `${BASE_URL}/${id}`;
  const response = await fetch(url);
  
  if (response.status === 404) {
    throw new Error(`Character with id ${id} not found`);
  }

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return await response.json(); 
}