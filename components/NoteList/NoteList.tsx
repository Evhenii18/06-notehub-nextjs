import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api";
import Link from "next/link";
import css from "./NoteList.module.css";
import type { Note } from "@/types/note";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (!notes.length) return null;

  return (
    <ul className={css.list}>
      {notes.map(({ id, title, content, tag }) => (
        <li className={css.listItem} key={id}>
          <h2 className={css.title}>
            <Link href={`/notes/${id}`}>{title}</Link>
          </h2>
          <p className={css.content}>{content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{tag}</span>
            <button
              className={css.button}
              onClick={() => handleDelete(id)}
              disabled={deleteMutation.status === "pending"}
            >
              {deleteMutation.status === "pending" ? "Deleting..." : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
