"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "../components/AppShell";
import { useToast } from "../components/ToastProvider";
import { useSession } from "../hooks/useSession";

type Transaction = {
  id: number;
  sender_id: number;
  receiver_id: number;
  sender_email: string;
  receiver_email: string;
  amount: string;
  created_at: string;
};

export default function ActivityPage() {
  const toast = useToast();
  const router = useRouter();
  const { error } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "sent" | "received">("all");

  useEffect(() => {
    if (error === "Not authenticated") {
      router.replace("/login?next=/activity");
    }
  }, [error, router]);

  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => (res.ok ? res.json() : { transactions: [], userId: null }))
      .then((data: { transactions: Transaction[]; userId: number | null }) => {
        setTransactions(data.transactions ?? []);
        setUserId(data.userId);
      })
      .catch(() => {});
  }, []);

  const filtered = transactions.filter((t) => {
    if (filter === "sent") return t.sender_id === userId;
    if (filter === "received") return t.receiver_id === userId;
    return true;
  });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
      " \u00b7 " +
      d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-8">
        <header className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-2 lg:hidden">
            <Link href="/dashboard" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-highest transition-all active:scale-90">
              <span className="material-symbols-outlined text-primary">arrow_back</span>
            </Link>
            <h1 className="text-3xl font-bold font-headline tracking-tight text-on-background">Activity</h1>
          </div>
          <div className="hidden lg:block">
            <h2 className="text-4xl font-headline font-extrabold tracking-tight text-on-background mb-2">Transaction History</h2>
            <p className="text-on-surface-variant">All your USDM transactions in one place.</p>
          </div>
        </header>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-8 animate-fade-in-up delay-100">
          {(["all", "sent", "received"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-all capitalize ${
                filter === f
                  ? "bg-primary text-white shadow-md"
                  : "bg-surface-container-low text-secondary hover:bg-surface-container-high active:scale-95"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 animate-fade-in-up delay-200">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">receipt_long</span>
            <p className="text-on-surface-variant font-medium text-lg">No transactions yet</p>
            <p className="text-sm text-outline mt-2 mb-8">
              {filter === "all"
                ? "Send or receive USDM to see your activity here."
                : filter === "sent"
                ? "You haven't sent any USDM yet."
                : "You haven't received any USDM yet."}
            </p>
            <Link
              href="/send"
              className="inline-flex items-center gap-2 primary-gradient text-white px-6 py-3 rounded-xl font-bold active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-sm">send</span>
              Send Payment
            </Link>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in-up delay-200">
            {filtered.map((t, i) => {
              const isSender = t.sender_id === userId;
              const otherEmail = isSender ? t.receiver_email : t.sender_email;
              const amountNum = Number(t.amount);
              const amountStr = isSender
                ? `-${amountNum.toLocaleString()} USDM`
                : `+${amountNum.toLocaleString()} USDM`;

              return (
                <div
                  key={t.id}
                  className="bg-surface-container-lowest rounded-2xl p-5 flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${(i + 1) * 60}ms` }}
                  onClick={() => toast(`Transaction #${t.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isSender ? "bg-primary/10" : "bg-tertiary/10"}`}>
                      <span className={`material-symbols-outlined ${isSender ? "text-primary" : "text-tertiary"}`}>
                        {isSender ? "north_east" : "south_west"}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-on-background">{otherEmail}</p>
                      <p className="text-xs text-on-surface-variant">{formatDate(t.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${isSender ? "text-on-background" : "text-tertiary"}`}>
                      {amountStr}
                    </p>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${isSender ? "bg-primary/10 text-primary" : "bg-tertiary/10 text-on-tertiary-fixed-variant"}`}>
                      {isSender ? "Sent" : "Received"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
