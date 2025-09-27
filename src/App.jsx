import React, { useEffect, useState } from "react";
// import { supabase } from "./supabaseClient";
// import AuthForm from "./Components/AuthForm";
import { IonCheckmarkDoneCircleOutline } from "./Component/FaviconIcon";
import "./index.css";

// ---------- useLocalStorage Hook ----------
function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {""}
  }, [key, state]);

  return [state, setState];
}

// ---------- App Component ----------
export default function App() {
  const [items, setItems] = useLocalStorage("DoneMateItems", []);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showDeleteAll, setShowDeleteAll] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [user /*, setUser*/] = useState(null); // supabase user
  const [Theme, SetTheme] = useState("light");

  // Theme: system preference & changes
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    // Initial theme
    SetTheme(mq.matches ? "dark" : "light");

    // Listener for system changes
    const handleChange = (e) => SetTheme(e.matches ? "dark" : "light");

    if (mq.addEventListener) {
      mq.addEventListener("change", handleChange);
    } else if (mq.addListener) {
      mq.addListener(handleChange);
    }

    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener("change", handleChange);
      } else if (mq.removeListener) {
        mq.removeListener(handleChange);
      }
    };
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", Theme);
  }, [Theme]);

  // Toggle theme manually
  const ToggleTheme = () => SetTheme(Theme === "light" ? "dark" : "light");

  // Add item
  function handleAddItem(item) {
    setItems((prev) => [...prev, item]);
  }

  // Delete single
  function handleDelete(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  // Toggle done
  function handleToggleDone(id) {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? { ...it, packed: !it.packed, doneAt: it.packed ? null : new Date() }
          : it
      )
    );
  }

  // Save edited description
  function handleSaveEdit(id, newDesc) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, description: newDesc } : it)));
  }

  // Clear all
  function handleClearAll() {
    setItems([]);
  }

  return (
    <div className="dm-app">
      <Header ToggleTheme={ToggleTheme} Theme={Theme} user={user} />

      <div className="dm-container">
        <aside className="dm-sidebar">
          <div className="sidebar-section">
            <p className="muted">Quick actions</p>
            <button className="btn ghost" onClick={() => setShowDeleteAll(true)} disabled={items.length === 0}>
              Clear all
            </button>
          </div>

          <div className="sidebar-section stats-box">
            <h4>Stats</h4>
            <Stats items={items} />
          </div>
        </aside>

        <main className="dm-main">
          <AddBar
            onAdd={(desc) =>
              handleAddItem({
                description: desc,
                packed: false,
                id: Date.now(),
                createdAt: new Date(),
                doneAt: null,
              })
            }
          />

          <section className="list-wrap">
            {items.length === 0 ? (
              <div className="no-items-card">
                <p>No tasks yet — add something to get started</p>
              </div>
            ) : (
              <ul className="task-list">
                {items.map((item) => (
                  <TaskItem
                    key={item.id}
                    item={item}
                    onToggle={() => handleToggleDone(item.id)}
                    onAskDelete={() => setItemToDelete(item.id)}
                    onEdit={() => setItemToEdit(item)}
                  />
                ))}
              </ul>
            )}
          </section>
        </main>
      </div>

      {/* Modals */}
      {itemToDelete !== null && (
        <>
          <div className="overlay" onClick={() => setItemToDelete(null)} />
          <ConfirmModal
            title="Delete task"
            description="Are you sure you want to delete this task?"
            onConfirm={() => {
              handleDelete(itemToDelete);
              setItemToDelete(null);
            }}
            onCancel={() => setItemToDelete(null)}
          />
        </>
      )}

      {showDeleteAll && (
        <>
          <div className="overlay" onClick={() => setShowDeleteAll(false)} />
          <ConfirmModal
            title="Delete all tasks"
            description="This will remove all tasks permanently."
            onConfirm={() => {
              handleClearAll();
              setShowDeleteAll(false);
            }}
            onCancel={() => setShowDeleteAll(false)}
          />
        </>
      )}

      {itemToEdit && (
        <>
          <div className="overlay" onClick={() => setItemToEdit(null)} />
          <EditModal
            item={itemToEdit}
            onSave={(id, newDescription) => {
              handleSaveEdit(id, newDescription);
              setItemToEdit(null);
            }}
            onCancel={() => setItemToEdit(null)}
          />
        </>
      )}
    </div>
  );
}

// ---------- Components: Header, AddBar, TaskItem, Modals, Stats ----------
// Keep all other components unchanged from your original code


/* ---------- Header ---------- */
function Header({ToggleTheme, Theme}) {
  return (
    <header className="dm-header">
      <div className="header-inner">
        <div className="title">
          <div className="brand">
            <IonCheckmarkDoneCircleOutline width={36} height={36} />
            <h1>DoneMate</h1>
          </div>
          
          <p className="tagline">Focus. Finish. Repeat.</p>
        </div>
        <div className="header-right">
            <button onClick={ToggleTheme} className="toggletheme">{Theme === "light" ? <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
	<g fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
		<path stroke-dasharray="36" stroke-dashoffset="36" d="M12 7c2.76 0 5 2.24 5 5c0 2.76 -2.24 5 -5 5c-2.76 0 -5 -2.24 -5 -5c0 -2.76 2.24 -5 5 -5">
			<animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="36;0" />
		</path>
		<path stroke-dasharray="2" stroke-dashoffset="2" d="M12 19v1M19 12h1M12 5v-1M5 12h-1" opacity="0">
			<animate fill="freeze" attributeName="d" begin="0.6s" dur="0.2s" values="M12 19v1M19 12h1M12 5v-1M5 12h-1;M12 21v1M21 12h1M12 3v-1M3 12h-1" />
			<animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="2;0" />
			<set fill="freeze" attributeName="opacity" begin="0.6s" to="1" />
		</path>
		<path stroke-dasharray="2" stroke-dashoffset="2" d="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5" opacity="0">
			<animate fill="freeze" attributeName="d" begin="0.8s" dur="0.2s" values="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5;M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5" />
			<animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="2;0" />
			<set fill="freeze" attributeName="opacity" begin="0.8s" to="1" />
		</path>
	</g>
</svg> : <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
	<path fill="none" stroke="#fff" stroke-dasharray="64" stroke-dashoffset="64" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3c-4.97 0 -9 4.03 -9 9c0 4.97 4.03 9 9 9c3.53 0 6.59 -2.04 8.06 -5c0 0 -6.06 1.5 -9.06 -3c-3 -4.5 1 -10 1 -10Z">
		<animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0" />
	</path>
</svg>}</button>
          </div>
      </div>
    </header>
  );
}

/* ---------- AddBar ---------- */
function AddBar({ onAdd }) {
  const [text, setText] = useState("");

  function submit(e) {
    e.preventDefault();
    const val = text.trim();
    if (!val) return;
    onAdd(val);
    setText("");
  }

  return (
    <form className="add-bar" onSubmit={submit}>
      <input
        className="add-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add new task — press Enter to add"
        aria-label="Add new task"
      />
      <button className="btn add" type="submit">Add</button>
    </form>
  );
}

/* ---------- TaskItem ---------- */
function TaskItem({ item, onToggle, onAskDelete, onEdit }) {
  return (
    <li className="task-card" aria-live="polite">
      <div className="task-left">
        <label className="checkbox">
          <input type="checkbox" checked={item.packed} onChange={onToggle} />
          <span className="checkmark" />
        </label>
        <div className="task-content">
          <div className={`task-desc ${item.packed ? "completed" : ""}`}>{item.description}</div>
          <div className="meta">
            <span className="muted">Added: {new Date(item.createdAt).toLocaleString([], { hour: "2-digit", minute: "2-digit" })}</span>
            {item.doneAt && <span className="muted"> • Done: {new Date(item.doneAt).toLocaleString([], { hour: "2-digit", minute: "2-digit" })}</span>}
          </div>
        </div>
      </div>

      <div className="">
        <button className="icon-btn" title="Edit" onClick={onEdit} aria-label={`Edit ${item.description}`}>
          {/* pencil icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
        </button>

        <button className="icon-btn danger" title="Delete" onClick={onAskDelete} aria-label={`Delete ${item.description}`}>
          {/* trash icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff4d4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6L18.1 19a2 2 0 0 1-2 1.9H8a2 2 0 0 1-2-1.9L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /></svg>
        </button>
      </div>
    </li>
  );
}

/* ---------- ConfirmModal ---------- */
function ConfirmModal({ title, description, onConfirm, onCancel }) {
  return (
    <div className="modal confirm-modal" role="dialog" aria-modal="true">
      <h3>{title}</h3>
      <p className="muted">{description}</p>
      <div className="modal-actions">
        <button className="btn danger" onClick={onConfirm}>Delete</button>
        <button className="btn ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

/* ---------- EditModal ---------- */
function EditModal({ item, onSave, onCancel }) {
  const [val, setVal] = useState(item.description);

  function handleSave() {
    const v = val.trim();
    if (!v) return;
    onSave(item.id, v);
  }

  function onKeyDown(e) {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") onCancel();
  }

  return (
    <div className="modal edit-modal" role="dialog" aria-modal="true">
      <h3>Edit task</h3>
      <input value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={onKeyDown} className="edit-input" />
      <div className="modal-actions">
        <button className="btn primary" onClick={handleSave}>Save</button>
        <button className="btn ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

/* ---------- Stats ---------- */
function Stats({ items }) {
  const total = items.length;
  const done = items.filter((i) => i.packed).length;
  const perc = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className="stats">
      <div><strong>{total}</strong> tasks</div>
      <div><strong>{done}</strong> done</div>
      <div>{perc}% complete</div>
    </div>
  );
}
