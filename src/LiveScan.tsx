import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Radar, ShieldCheck, Square, RotateCcw } from "lucide-react";

// BlazeFace runs entirely client-side. No frame ever leaves the device.
// tfjs + the model are pulled in via dynamic import on first activation so
// they never touch the initial bundle.

type Status = "idle" | "loading" | "running" | "fallback" | "error";

type ScreenBox = {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  score: number;
};

// BlazeFace prediction shape (returnTensors = false).
type Prediction = {
  topLeft: [number, number] | number[];
  bottomRight: [number, number] | number[];
  probability?: number | number[];
};

type BlazeModel = {
  estimateFaces: (
    input: HTMLVideoElement | HTMLImageElement,
    returnTensors?: boolean,
    flipHorizontal?: boolean
  ) => Promise<Prediction[]>;
};

const DETECT_INTERVAL_MS = 120;
const SAMPLE_IMAGE = `${import.meta.env.BASE_URL}profile-photo.jpg`;

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function coverRect(
  box: { x: number; y: number; w: number; h: number },
  intrinsicW: number,
  intrinsicH: number,
  contW: number,
  contH: number,
  mirror: boolean
) {
  const scale = Math.max(contW / intrinsicW, contH / intrinsicH);
  const dispW = intrinsicW * scale;
  const dispH = intrinsicH * scale;
  const offX = (contW - dispW) / 2;
  const offY = (contH - dispH) / 2;
  let x = box.x * scale + offX;
  const y = box.y * scale + offY;
  const w = box.w * scale;
  const h = box.h * scale;
  if (mirror) x = contW - (x + w);
  return { x, y, w, h };
}

function readScore(prob: Prediction["probability"]): number {
  if (typeof prob === "number") return prob;
  if (Array.isArray(prob) && prob.length > 0) return prob[0];
  return 0;
}

export default function LiveScan() {
  const [status, setStatus] = useState<Status>("idle");
  const [statusNote, setStatusNote] = useState("Standing by");
  const [boxes, setBoxes] = useState<ScreenBox[]>([]);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sampleRef = useRef<HTMLImageElement | null>(null);
  const modelRef = useRef<BlazeModel | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastRunRef = useRef(0);
  const busyRef = useRef(false);
  const runningRef = useRef(false);

  const stopStream = useCallback(() => {
    runningRef.current = false;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const loadModel = useCallback(async () => {
    if (modelRef.current) return modelRef.current;
    const tf = await import("@tensorflow/tfjs");
    const blazeface = await import("@tensorflow-models/blazeface");
    await tf.ready();
    const model = (await blazeface.load()) as unknown as BlazeModel;
    modelRef.current = model;
    return model;
  }, []);

  // Detection loop for the live camera feed, throttled to DETECT_INTERVAL_MS.
  const runVideoLoop = useCallback(() => {
    runningRef.current = true;
    const tick = async (now: number) => {
      if (!runningRef.current) return;
      const video = videoRef.current;
      const stage = stageRef.current;
      const model = modelRef.current;

      if (video && stage && model && video.readyState >= 2) {
        if (now - lastRunRef.current >= DETECT_INTERVAL_MS && !busyRef.current) {
          lastRunRef.current = now;
          busyRef.current = true;
          try {
            const faces = await model.estimateFaces(video, false);
            const cw = stage.clientWidth;
            const ch = stage.clientHeight;
            const next = faces.map((face, i) => {
              const tl = face.topLeft as number[];
              const br = face.bottomRight as number[];
              const rect = coverRect(
                { x: tl[0], y: tl[1], w: br[0] - tl[0], h: br[1] - tl[1] },
                video.videoWidth || cw,
                video.videoHeight || ch,
                cw,
                ch,
                true
              );
              return { id: i, ...rect, score: readScore(face.probability) };
            });
            setBoxes(next);
            setStatusNote(
              next.length === 0
                ? "No subject in frame"
                : `${next.length} subject${next.length > 1 ? "s" : ""} locked`
            );
          } catch {
            // transient inference error - keep looping
          } finally {
            busyRef.current = false;
          }
        }
      }
      if (runningRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // Fallback: run the SAME real model on a bundled sample frame.
  const runSample = useCallback(async () => {
    const model = modelRef.current ?? (await loadModel());
    const img = sampleRef.current;
    const stage = stageRef.current;
    if (!img || !stage) return;

    const detectOnImage = async () => {
      try {
        const faces = await model.estimateFaces(img, false);
        const cw = stage.clientWidth;
        const ch = stage.clientHeight;
        const next = faces.map((face, i) => {
          const tl = face.topLeft as number[];
          const br = face.bottomRight as number[];
          const rect = coverRect(
            { x: tl[0], y: tl[1], w: br[0] - tl[0], h: br[1] - tl[1] },
            img.naturalWidth,
            img.naturalHeight,
            cw,
            ch,
            false
          );
          return { id: i, ...rect, score: readScore(face.probability) };
        });
        setBoxes(next);
        setStatusNote(
          next.length > 0 ? "Sample frame analysed" : "Sample frame loaded"
        );
      } catch {
        setStatusNote("Sample frame loaded");
      }
    };

    if (img.complete && img.naturalWidth > 0) {
      await detectOnImage();
    } else {
      img.onload = () => void detectOnImage();
    }
  }, [loadModel]);

  const goFallback = useCallback(
    async (note: string) => {
      stopStream();
      setBoxes([]);
      setStatus("fallback");
      setStatusNote(note);
      await runSample();
    },
    [runSample, stopStream]
  );

  const activate = useCallback(async () => {
    setStatus("loading");
    setStatusNote("Loading model");
    setBoxes([]);

    try {
      await loadModel();
    } catch {
      setStatus("error");
      setStatusNote("Model failed to load");
      return;
    }

    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      await goFallback("No camera on this device. Showing a sample frame.");
      return;
    }

    setStatusNote("Requesting camera");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) {
        await goFallback("Camera unavailable. Showing a sample frame.");
        return;
      }
      video.srcObject = stream;
      await video.play();
      setStatus("running");
      setStatusNote("Locking on");
      runVideoLoop();
    } catch {
      await goFallback("Camera blocked. Showing a sample frame instead.");
    }
  }, [goFallback, loadModel, runVideoLoop]);

  const stop = useCallback(() => {
    stopStream();
    setBoxes([]);
    setStatus("idle");
    setStatusNote("Standing by");
  }, [stopStream]);

  useEffect(() => stopStream, [stopStream]);

  const live = status === "running" || status === "fallback";
  const boxTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 520, damping: 32 };

  return (
    <section id="live-scan" className="scan" aria-label="Live computer vision demo">
      <div className="scan-head">
        <span className="eyebrow eyebrow-live">
          <Radar size={14} aria-hidden="true" /> Signature · Live Model
        </span>
        <h2>This portfolio can see you.</h2>
        <p>
          Not a video, not a mockup. Click activate and a real face-detection
          model (BlazeFace) runs in your browser and draws boxes around whoever
          is in frame. The kind of system I build, pointed back at you.
        </p>
      </div>

      <div
        className={`scan-stage ${live ? "is-live" : ""} status-${status}`}
        ref={stageRef}
      >
        <span className="bracket tl" aria-hidden="true" />
        <span className="bracket tr" aria-hidden="true" />
        <span className="bracket bl" aria-hidden="true" />
        <span className="bracket br" aria-hidden="true" />
        {live ? <span className="scanline" aria-hidden="true" /> : null}

        <video
          ref={videoRef}
          className={`scan-video ${status === "running" ? "show" : ""}`}
          playsInline
          muted
          aria-hidden={status !== "running"}
        />
        <img
          ref={sampleRef}
          src={SAMPLE_IMAGE}
          alt="Sample frame for offline detection"
          className={`scan-sample ${status === "fallback" ? "show" : ""}`}
          aria-hidden={status !== "fallback"}
        />

        <AnimatePresence>
          {boxes.map((box) => (
            <motion.div
              key={box.id}
              className="det-box"
              initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.82 }}
              animate={{
                opacity: 1,
                scale: 1,
                left: box.x,
                top: box.y,
                width: box.w,
                height: box.h,
              }}
              exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.82 }}
              transition={boxTransition}
            >
              <span className="det-label">
                FACE
                <strong>{Math.round(box.score * 100)}%</strong>
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {status === "idle" ? (
          <div className="scan-idle">
            <button type="button" className="scan-cta" onClick={activate}>
              <Camera size={20} aria-hidden="true" />
              Activate live detection
            </button>
            <p className="scan-hint">Uses your camera, only after you click.</p>
          </div>
        ) : null}

        {status === "loading" ? (
          <div className="scan-overlay">
            <span className="scan-spinner" aria-hidden="true" />
            <span className="mono">{statusNote.toUpperCase()}…</span>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="scan-overlay">
            <span className="mono">{statusNote.toUpperCase()}</span>
            <button type="button" className="scan-mini" onClick={activate}>
              <RotateCcw size={15} aria-hidden="true" /> Retry
            </button>
          </div>
        ) : null}

        <div className="scan-readout" role="status">
          <span className={`dot ${live ? "on" : ""}`} aria-hidden="true" />
          <span className="mono">
            {status === "fallback" ? "DEMO MODE" : "STATUS"} · {statusNote}
          </span>
          {live ? (
            <button type="button" className="scan-mini" onClick={stop}>
              <Square size={13} aria-hidden="true" /> Stop
            </button>
          ) : null}
        </div>
      </div>

      <p className="scan-privacy">
        <ShieldCheck size={15} aria-hidden="true" />
        Everything runs on your device. No frame is ever uploaded to any server.
      </p>
    </section>
  );
}
