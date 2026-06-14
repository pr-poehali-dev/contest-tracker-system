import { useState, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { api } from "@/lib/api";

interface Props {
  userId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const LEVELS = [
  { value: "gold", label: "🥇 Золото / 1 место", color: "border-amber-400/40 bg-amber-400/5" },
  { value: "silver", label: "🥈 Серебро / 2 место", color: "border-slate-400/40 bg-slate-400/5" },
  { value: "bronze", label: "🥉 Бронза / 3 место", color: "border-orange-500/40 bg-orange-500/5" },
  { value: "participation", label: "🎖️ Участие / Грамота", color: "border-blue-400/40 bg-blue-400/5" },
];

export default function UploadDiplomaModal({ userId, onClose, onSuccess }: Props) {
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("gold");
  const [date, setDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f.size > 10 * 1024 * 1024) {
      setError("Файл не должен превышать 10 МБ");
      return;
    }
    setFile(f);
    setError(null);
    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const toBase64 = (f: File): Promise<string> =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => {
        const result = r.result as string;
        res(result.split(",")[1]);
      };
      r.onerror = rej;
      r.readAsDataURL(f);
    });

  const handleSubmit = async () => {
    if (!title.trim()) { setError("Укажите название достижения"); return; }
    if (!file) { setError("Прикрепите файл диплома или грамоты"); return; }
    setError(null);
    setLoading(true);
    try {
      const file_base64 = await toBase64(file);
      const res = await api.post("upload_diploma", {
        user_id: userId,
        title: title.trim(),
        level,
        date_received: date || null,
        file_base64,
        file_name: file.name,
      });
      if (res.error) throw new Error(res.error);
      onSuccess();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка при загрузке");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl animate-scale-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gold top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
              <Icon name="Award" size={18} className="text-primary" />
            </div>
            <div>
              <h2 className="font-oswald font-semibold text-foreground text-base">Загрузить диплом</h2>
              <p className="text-[11px] text-muted-foreground">Фото, скан или PDF</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
            <Icon name="X" size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">

          {/* Title */}
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Название достижения *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Победитель олимпиады по математике 2026"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* Level */}
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Уровень достижения *</label>
            <div className="grid grid-cols-2 gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l.value}
                  onClick={() => setLevel(l.value)}
                  className={`px-3 py-2 rounded-lg border text-sm text-left transition-all ${
                    level === l.value
                      ? l.color + " border-opacity-100"
                      : "border-border text-muted-foreground hover:bg-secondary/50"
                  }`}
                >
                  <span className={level === l.value ? "text-foreground font-medium" : ""}>{l.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Дата получения</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all [color-scheme:dark]"
            />
          </div>

          {/* File Drop Zone */}
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Файл диплома *</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                drag
                  ? "border-primary bg-primary/10 scale-[1.01]"
                  : file
                  ? "border-emerald-400/50 bg-emerald-400/5"
                  : "border-border hover:border-primary/50 hover:bg-secondary/30"
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
              />

              {preview ? (
                <div className="space-y-2">
                  <img src={preview} alt="preview" className="mx-auto max-h-28 rounded-lg object-contain" />
                  <p className="text-xs text-emerald-400 flex items-center justify-center gap-1">
                    <Icon name="CheckCircle" size={12} />
                    {file?.name}
                  </p>
                </div>
              ) : file ? (
                <div className="space-y-2">
                  <div className="mx-auto w-12 h-12 rounded-xl bg-emerald-400/10 flex items-center justify-center">
                    <Icon name="FileText" size={24} className="text-emerald-400" />
                  </div>
                  <p className="text-xs text-emerald-400 flex items-center justify-center gap-1">
                    <Icon name="CheckCircle" size={12} />
                    {file.name}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="mx-auto w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                    <Icon name="Upload" size={22} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground font-medium">Перетащите файл или кликните</p>
                    <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG, PDF — до 10 МБ</p>
                  </div>
                </div>
              )}

              {file && (
                <button
                  onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon name="X" size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              <Icon name="AlertCircle" size={14} />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-secondary text-foreground text-sm hover:bg-secondary/80 transition-colors border border-border">
            Отмена
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? (
              <>
                <Icon name="Loader" size={14} className="animate-spin" />
                Загружаю...
              </>
            ) : (
              <>
                <Icon name="Upload" size={14} />
                Сохранить достижение
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
