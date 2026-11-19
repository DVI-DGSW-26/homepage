// The demo video (DEMO_VIDEO in src/lib/media.ts), opened from the hero and from "How it works". The
// YouTube player is created only when the dialog opens and goes with it, so nothing of YouTube loads
// for a visitor who never asks, and closing stops the film. Subtitles on, in the language being read
// (the film carries English ones).
import { useLang, useT } from '../../i18n';
import { DEMO_VIDEO, openVideo, useVideoOpen } from '../../lib/media';
import { Modal } from '../Modal';

export function VideoDialog() {
  const open = useVideoOpen(), lang = useLang(), m = useT().media;
  if (!DEMO_VIDEO) return null;
  const params = new URLSearchParams({ autoplay: '1', rel: '0', playsinline: '1', cc_load_policy: '1', cc_lang_pref: lang, hl: lang });
  return (
    <Modal open={open} onClose={() => openVideo(false)} closeLabel={m.close} aria-label={m.title}>
      <div className="aspect-video w-[min(72rem,calc(100vw-2rem),(100dvh-7rem)*16/9)] overflow-hidden rounded-card bg-glass">
        <iframe src={`https://www.youtube-nocookie.com/embed/${DEMO_VIDEO.youtube}?${params}`} title={m.title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen className="size-full border-0" />
      </div>
    </Modal>
  );
}
