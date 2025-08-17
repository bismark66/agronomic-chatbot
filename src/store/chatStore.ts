import { atom } from 'jotai';
import { ChatSession, Message } from '../types';

// Active session atom
export const activeSessionAtom = atom<string | null>(null);

// Sessions atom
export const sessionsAtom = atom<ChatSession[]>([]);

// Current session atom (derived)
export const currentSessionAtom = atom(
  (get) => {
    const activeId = get(activeSessionAtom);
    const sessions = get(sessionsAtom);
    return sessions.find(session => session.id === activeId) || null;
  }
);

// Sidebar collapsed state
export const sidebarCollapsedAtom = atom(false);

// File uploads atom
export const fileUploadsAtom = atom<any[]>([]);