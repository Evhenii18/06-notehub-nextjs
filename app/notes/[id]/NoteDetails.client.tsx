"use client";

import * as React from "react";
import { fetchNoteById } from "@/lib/api";
import type { Note } from "@/types/note";
import css from "./NoteDetails.module.css";

interface NoteDetailsPageProps {
  params: { id: string };
}

export default function NoteDetailsPage({ params }: NoteDetailsPageProps) {
  const { id } = params;
  const [note, setNote] = React.useState<Note | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    async function loadNote() {
      try {
        const fetchedNote = await fetchNoteById(id);
        setNote(fetchedNote);
      } catch (e) {
        console.error("Failed to fetch note by id:", e);
        setError("Failed to load note details.");
      } finally {
        setLoading(false);
      }
    }
    loadNote();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
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
