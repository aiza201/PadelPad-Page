"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function DisplayPage() {
  const params = useParams();
  const kode = params.kode as string;

  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!kode) return;

    // Menghubungkan ke koleksi "sessions" di Firestore
    const docRef = doc(db, "sessions", kode);

    // Listener Real-time
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setSessionData(docSnap.data());
        } else {
          setSessionData(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error reading document: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [kode]);

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
        <h1 className="text-xl font-bold text-emerald-400 mb-2">Live Scoreboard Display</h1>
        <p className="text-slate-400 text-sm mb-4">Kode Sesi / Lapangan: <span className="font-mono text-white font-bold">{kode}</span></p>

        {loading ? (
          <p className="text-yellow-400">Memuat data sesi real-time...</p>
        ) : sessionData ? (
          <div className="space-y-4">
            <div className="bg-slate-700 p-4 rounded-lg">
              <p className="text-xs text-slate-400 uppercase tracking-wider">Status Pertandingan</p>
              <p className="text-lg font-semibold text-emerald-300">{sessionData.status || "BERLANGSUNG"}</p>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Skor Pertandingan</p>
              <pre className="bg-slate-950 p-3 rounded font-mono text-xs text-emerald-400 overflow-x-auto">
                {JSON.stringify(sessionData, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-sm">
            Sesi dengan kode <strong>{kode}</strong> belum ditemukan di database.
          </div>
        )}
      </div>
    </main>
  );
}