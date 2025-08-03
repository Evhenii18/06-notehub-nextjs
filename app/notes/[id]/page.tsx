// app/notes/[id]/page.tsx

import { fetchNoteById } from "@/lib/api";
import type { Note } from "@/types/note";
import css from "./NoteDetails.module.css";

interface NoteDetailsPageProps {
  params: { id: string }; // <-- обычный объект, не Promise
}

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  try {
    const note: Note = await fetchNoteById(params.id);

    if (!note) return <p>Note not found.</p>;

    return (
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
            <span className={css.tag}>{note.tag}</span>
          </div>
          <div className={css.content}>{note.content}</div>
          <div className={css.date}>
            {new Date(note.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch note by id:", error);
    return <p>Failed to load note details.</p>;
  }
}
