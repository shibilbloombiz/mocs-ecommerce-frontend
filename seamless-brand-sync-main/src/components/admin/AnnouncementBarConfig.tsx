import { useState } from "react";
import {
  Megaphone,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Truck,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Tag,
  Gift,
  Star,
  Zap,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = [Truck, Sparkles, RotateCcw, ShieldCheck, Tag, Gift, Star, Zap, Bell];

type AnnouncementItem = {
  id: number;
  text: string;
};

type Props = {
  announcements: AnnouncementItem[];
  setAnnouncements: (items: AnnouncementItem[]) => void;
};

export function AnnouncementBarConfig({ announcements, setAnnouncements }: Props) {
  const [preview, setPreview] = useState(true);
  const [previewIdx, setPreviewIdx] = useState(0);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const addMessage = () => {
    const maxId = announcements.reduce((m, a) => Math.max(m, a.id), 0);
    setAnnouncements([...announcements, { id: maxId + 1, text: "" }]);
  };

  const removeMessage = (idx: number) => {
    const next = announcements.filter((_, i) => i !== idx);
    setAnnouncements(next);
    if (previewIdx >= next.length) setPreviewIdx(Math.max(0, next.length - 1));
  };

  const updateText = (idx: number, text: string) => {
    setAnnouncements(announcements.map((a, i) => (i === idx ? { ...a, text } : a)));
  };

  // Drag-and-drop reorder
  const onDragStart = (idx: number) => setDraggingIdx(idx);
  const onDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };
  const onDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggingIdx === null || draggingIdx === targetIdx) return;
    const next = [...announcements];
    const [moved] = next.splice(draggingIdx, 1);
    next.splice(targetIdx, 0, moved);
    setAnnouncements(next);
    setDraggingIdx(null);
    setDragOverIdx(null);
  };

  const PreviewIcon = ICONS[previewIdx % ICONS.length];
  const previewText = announcements[previewIdx]?.text || "";

  return (
    <section id="announcement-bar" className="scroll-mt-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
            <Megaphone className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight">Announcement Bar</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Rotating messages shown at the very top of your site • changes every 5 seconds
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setPreview((v) => !v)}
          className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted/60 transition-all cursor-pointer"
        >
          {preview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {preview ? "Hide Preview" : "Show Preview"}
        </button>
      </div>

      {/* Live Preview */}
      {preview && (
        <div className="rounded-2xl border border-border bg-muted/30 overflow-hidden">
          <div className="px-4 py-2 border-b border-border bg-muted/50 flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
            </div>
            <span className="text-[10px] font-medium text-muted-foreground ml-1">Live Preview</span>
          </div>

          {/* Simulated announcement bar */}
          <div className="bg-[#18181b] h-9 flex items-center justify-center px-4">
            {previewText ? (
              <div className="flex items-center gap-2 text-white/90 text-xs font-medium">
                <PreviewIcon className="h-3.5 w-3.5 text-[#d97736] shrink-0 stroke-[2]" />
                <span>{previewText}</span>
              </div>
            ) : (
              <span className="text-white/30 text-xs italic">No message to preview</span>
            )}
          </div>

          {/* Preview selector dots */}
          {announcements.length > 1 && (
            <div className="flex justify-center gap-1.5 py-2 bg-[#18181b] border-t border-white/5">
              {announcements.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPreviewIdx(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-200 cursor-pointer",
                    i === previewIdx ? "w-4 bg-[#d97736]" : "w-1.5 bg-white/20 hover:bg-white/40"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Message List */}
      <div className="space-y-2">
        {announcements.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 py-10 text-center">
            <Megaphone className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">No messages yet. Add your first announcement below.</p>
          </div>
        )}

        {announcements.map((msg, idx) => {
          const ItemIcon = ICONS[idx % ICONS.length];
          return (
            <div
              key={msg.id}
              draggable
              onDragStart={() => onDragStart(idx)}
              onDragOver={(e) => onDragOver(e, idx)}
              onDrop={(e) => onDrop(e, idx)}
              onDragEnd={() => { setDraggingIdx(null); setDragOverIdx(null); }}
              onClick={() => setPreviewIdx(idx)}
              className={cn(
                "group flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 transition-all cursor-pointer",
                draggingIdx === idx
                  ? "opacity-50 scale-[0.98] border-primary/40"
                  : dragOverIdx === idx
                  ? "border-primary bg-primary/5 shadow-md"
                  : previewIdx === idx
                  ? "border-primary/50 bg-primary/5 shadow-sm"
                  : "border-border hover:border-border/80 hover:bg-muted/30"
              )}
            >
              {/* Drag handle */}
              <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/40 cursor-grab group-hover:text-muted-foreground transition-colors" />

              {/* Icon indicator */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-muted/60">
                <ItemIcon className="h-4 w-4 text-[#d97736]" />
              </div>

              {/* Index badge */}
              <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                {idx + 1}
              </span>

              {/* Text input */}
              <input
                type="text"
                value={msg.text}
                onChange={(e) => updateText(idx, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder={`Message ${idx + 1} — e.g. "Free shipping above ₹500"`}
                maxLength={120}
                className="flex-1 bg-transparent text-sm font-medium placeholder:text-muted-foreground/50 outline-none focus:placeholder-transparent transition-all"
              />

              {/* Char count */}
              <span className="hidden sm:block shrink-0 text-[10px] text-muted-foreground/50 tabular-nums">
                {msg.text.length}/120
              </span>

              {/* Delete */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeMessage(idx); }}
                className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground/40 hover:bg-destructive/10 hover:text-destructive transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                aria-label="Remove message"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Button */}
      <button
        type="button"
        onClick={addMessage}
        disabled={announcements.length >= 8}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-3 text-sm font-semibold text-muted-foreground transition-all hover:border-primary hover:bg-primary/5 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <Plus className="h-4 w-4" />
        Add Message
        <span className="text-xs font-normal text-muted-foreground/60">
          ({announcements.length}/8)
        </span>
      </button>

      {/* Tips */}
      <div className="rounded-2xl bg-muted/30 border border-border p-4 space-y-1.5">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tips</p>
        <ul className="space-y-1 text-xs text-muted-foreground/80 list-disc list-inside">
          <li>Drag the <span className="font-semibold text-foreground">⋮⋮</span> handle to reorder messages</li>
          <li>Click a row to preview it in the bar above</li>
          <li>Keep messages short — they rotate every 5 seconds</li>
          <li>Use • or | to separate multiple offers in one message</li>
        </ul>
      </div>
    </section>
  );
}
