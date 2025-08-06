import axios from 'axios';
import type { Note } from '@/types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const headers = {
  Authorization: `Bearer ${token}`,
};

export const fetchNotes = async (
  page: number,
  perPage: number,
  search: string = ""
): Promise<{ notes: Note[]; totalPages: number }> => {
  const params: { page: number; perPage: number; search?: string } = {
    page,
    perPage,
  };
  if (search.trim()) params.search = search.trim();

  const response = await axios.get<{ notes: Note[]; totalPages: number }>(
    `${BASE_URL}/notes`,
    { headers, params }
  );
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  if (!id) throw new Error('No note ID provided');
  const response = await axios.get<Note>(`${BASE_URL}/notes/${id}`, {
    headers,
  });
  return response.data;
};

export const createNote = async (
  note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Note> => {
  const response = await axios.post<Note>(`${BASE_URL}/notes`, note, {
    headers,
  });
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(`${BASE_URL}/notes/${id}`, {
    headers,
  });
  return response.data;
};
