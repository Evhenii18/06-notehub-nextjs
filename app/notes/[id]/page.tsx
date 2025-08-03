import { fetchNoteById } from "@/lib/api";
import type { Note } from "@/types/note";
import css from "./NoteDetails.module.css";

export default async function NoteDetailsPage(props: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const params = "then" in props.params ? await props.params : props.params;
  let note: Note | null = null;

  try {
    note = await fetchNoteById(params.id);
  } catch (error) {
    console.error("Failed to fetch note by id:", error);
  }

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
}
