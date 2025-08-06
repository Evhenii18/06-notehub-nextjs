"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import css from "./Notes.client.module.css";

import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

import { fetchNotes } from "@/lib/api";
import type { Note } from "@/types/note";

interface NotesClientProps {
  initialData: { notes: Note[]; totalPages: number };
}

const ITEMS_PER_PAGE = 12;

export default function NotesClient({ initialData }: NotesClientProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, 300);

  const handleSearchChange = (value: string) => {
    debouncedSetSearch(value);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", search, currentPage],
    queryFn: ({ queryKey }) => {
      const [search, currentPage] = queryKey;
      return fetchNotes(
        currentPage as number,
        ITEMS_PER_PAGE,
        search as string
      );
    },
    initialData,
    placeholderData: initialData,
  });

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div className={css.navbar}>
        <SearchBox onChange={handleSearchChange} />
        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            pageCount={data.totalPages}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </div>

      <main style={{ flexGrow: 1, overflowY: "auto" }}>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error loading notes.</p>}
        {data?.notes?.length ? (
          <NoteList notes={data.notes} />
        ) : (
          <p>No notes found.</p>
        )}
      </main>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
