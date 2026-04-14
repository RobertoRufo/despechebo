import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const CREW_NAMES = ["Roberto", "Jorge", "Sebastian", "Pablo"] as const;
type CrewName = typeof CREW_NAMES[number];

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

interface Props { pin: string; }

export default function JournalSection({ pin }: Props) {
  const [posterName, setPosterName] = useState<CrewName>("Roberto");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const utils = trpc.useUtils();
  const { data: posts = [], isLoading } = trpc.journal.list.useQuery();

  const uploadPhoto = trpc.journal.uploadPhoto.useMutation();
  const createPost = trpc.journal.create.useMutation({
    onSuccess: () => {
      utils.journal.list.invalidate();
      setFile(null);
      setPreview(null);
      setCaption("");
      toast.success("Memory posted! 📸");
    },
    onError: (e) => toast.error(e.message),
  });

  const deletePost = trpc.journal.delete.useMutation({
    onSuccess: () => { utils.journal.list.invalidate(); toast.success("Post deleted."); },
    onError: (e) => toast.error(e.message),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 16 * 1024 * 1024) { toast.error("File too large (max 16MB)"); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { toast.error("Please select a photo first."); return; }
    setUploading(true);
    try {
      const base64 = await toBase64(file);
      const { url, key } = await uploadPhoto.mutateAsync({
        pin, fileName: file.name, fileBase64: base64, mimeType: file.type,
      });
      await createPost.mutateAsync({ pin, posterName, photoUrl: url, photoKey: key, caption: caption.trim() || undefined });
    } catch (err: any) {
      toast.error(err.message ?? "Failed to upload photo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-gold-gradient mb-2">Trip Journal</h2>
        <p className="text-muted-foreground text-sm mb-8">Share the best moments from Madrid 📸</p>

        {/* Upload Form */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-10">
          <p className="font-semibold text-foreground mb-4">Add a memory</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name selector */}
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">Who are you?</label>              <div className="flex gap-2 flex-wrap">
                {CREW_NAMES.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setPosterName(name)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                      posterName === name
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo upload */}
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">Photo</label>
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="Preview" className="w-full max-h-64 object-cover rounded-xl border border-border" />
                  <button
                    type="button"
                    onClick={() => { setFile(null); setPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                    className="absolute top-2 right-2 bg-background/80 backdrop-blur rounded-full w-7 h-7 flex items-center justify-center text-foreground hover:bg-background transition text-sm"
                  >✕</button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full py-10 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary hover:text-primary transition flex flex-col items-center gap-2"
                >
                  <span className="text-3xl">📷</span>
                  <span className="text-sm">Tap to select a photo</span>
                  <span className="text-xs opacity-60">JPEG, PNG, HEIC · Max 16MB</span>
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>

            {/* Caption */}
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">Caption (optional)</label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                maxLength={500}
                rows={2}
                placeholder="What's happening here? 🎉"
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={!file || uploading || createPost.isPending}
              className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading || createPost.isPending ? "Uploading..." : "Post to Journal 🎉"}
            </button>
          </form>
        </div>

        {/* Feed */}
        <div>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            {posts.length > 0 ? `${posts.length} memor${posts.length !== 1 ? 'ies' : 'y'}` : "No memories yet — be the first to post!"}
          </p>

          {isLoading && (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => <div key={i} className="h-64 bg-card rounded-2xl animate-pulse" />)}
            </div>
          )}

          <div className="space-y-5">
            {posts.map((post) => (
              <div key={post.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                <img
                  src={post.photoUrl}
                  alt={post.caption ?? "Journal photo"}
                  className="w-full max-h-96 object-cover"
                />
                <div className="px-5 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/30">
                        {post.posterName}
                      </span>
                      <span className="text-muted-foreground text-xs">{formatDate(post.createdAt)}</span>
                    </div>
                    <button
                      onClick={() => { if (confirm("Delete this post?")) deletePost.mutate({ pin, id: post.id }); }}
                      className="text-muted-foreground hover:text-red-400 transition text-xs px-2 py-1 rounded border border-border hover:border-red-400"
                    >
                      Delete
                    </button>
                  </div>
                  {post.caption && (
                    <p className="text-foreground text-sm leading-relaxed">{post.caption}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
