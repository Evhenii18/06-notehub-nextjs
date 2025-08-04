"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import debounce from "debounce";
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
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSetSearch = useMemo(() => {
    const func = debounce((value: string) => {
      setSearch(value);
      setCurrentPage(1);
    }, 300);
    return func;
  }, []);

  useEffect(() => {
    return () => {
      debouncedSetSearch.clear?.();
    };
  }, [debouncedSetSearch]);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    debouncedSetSearch(value);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", currentPage, search],
    queryFn: () => fetchNotes(currentPage, ITEMS_PER_PAGE, search),
    placeholderData: initialData,
  });

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div className={css.navbar}>
        <SearchBox value={inputValue} onChange={handleSearchChange} />
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
