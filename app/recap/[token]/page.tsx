"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function RecapPage() {
  const params = useParams();
  const token = params.token as string;

  const [recapData, setRecapData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    // Menghubungkan ke koleksi "recaps" di Firestore
    const docRef = doc(db, "recaps", token);

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setRecapData(docSnap.data());
        } else {
          setRecapData(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error reading recap: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [token]);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">
        <h1 className="text-xl font-bold text-blue-400 mb-2">Match Recap Report</h1>
        <p className="text-slate-400 text-sm mb-4">Token Rekap: <span className="font-mono text-white font-bold">{token}</span></p>

        {loading ? (
          <p className="text-yellow-400">Memuat data ringkasan...</p>
        ) : recapData ? (
          <div className="space-y-4">
            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Hasil Akhir</p>
              <pre className="bg-slate-950 p-3 rounded font-mono text-xs text-blue-400 overflow-x-auto">
                {JSON.stringify(recapData, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-sm">
            Data rekap dengan token <strong>{token}</strong> tidak ditemukan.
          </div>
        )}
      </div>
    </main>
  );
}