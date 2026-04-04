"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

export default function DashboardPage() {
  const toast = useToast();
  const router = useRouter();
  const { user, error } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txUserId, setTxUserId] = useState<number | null>(null);

  useEffect(() => {
    if (error === "Not authenticated") {
      router.replace("/login?next=/dashboard");
    }
  }, [error, router]);

  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => (res.ok ? res.json() : { transactions: [], userId: null }))
      .then((data: { transactions: Transaction[]; userId: number | null }) => {
        setTransactions(data.transactions ?? []);
        setTxUserId(data.userId);
      })
      .catch(() => {});
  }, []);

  const formattedBalance = useMemo(() => {
    const parsed = Number(user?.balance ?? 0);
    return parsed.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " USDM";
  }, [user?.balance]);

  const formatTxDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
      " \u00b7 " +
      d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 lg:py-12">
        {/* Hero Balance + Exchange Rates */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 animate-fade-in-up">
          {/* Balance Card */}
          <div className="lg:col-span-8 primary-gradient p-10 rounded-[2rem] text-white relative overflow-hidden shadow-[0px_24px_48px_-12px_rgba(11,28,48,0.08)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="relative z-10">
              <p className="text-sm font-medium opacity-80 uppercase tracking-widest mb-2">
                Total Balance
              </p>
              <h2 className="text-5xl font-bold font-headline tracking-tight mb-2 animate-count-up">
                {formattedBalance}
              </h2>
              <p className="text-xs opacity-80 mb-1">{user?.email ?? "Loading account..."}</p>
              {error ? <p className="text-xs text-error font-semibold mb-4">{error}</p> : <div className="mb-4" />}
              <div className="flex flex-wrap gap-4 mt-4">
                <Link
                  href="/send"
                  className="flex-1 min-w-[120px] bg-white/20 backdrop-blur-lg hover:bg-white/30 transition-all py-4 rounded-xl flex items-center justify-center gap-2 font-semibold active:scale-95"
                >
                  <span className="material-symbols-outlined">north_east</span>
                  Send
                </Link>
                <Link
                  href="/receive"
                  className="flex-1 min-w-[120px] bg-white/20 backdrop-blur-lg hover:bg-white/30 transition-all py-4 rounded-xl flex items-center justify-center gap-2 font-semibold active:scale-95"
                >
                  <span className="material-symbols-outlined">south_west</span>
                  Receive
                </Link>
                <Link
                  href="/cashout"
                  className="flex-1 min-w-[120px] bg-white/20 backdrop-blur-lg hover:bg-white/30 transition-all py-4 rounded-xl flex items-center justify-center gap-2 font-semibold active:scale-95"
                >
                  <span className="material-symbols-outlined">swap_horiz</span>
                  Cash Out
                </Link>
              </div>
            </div>
          </div>

          {/* Exchange Rates */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-surface-container-low p-6 rounded-[2rem] hover:bg-surface-container-high transition-colors animate-fade-in-up delay-200">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary font-bold">&euro;</div>
                  <div>
                    <p className="text-sm font-headline font-bold">EUR / USDM</p>
                    <p className="text-xs text-secondary">Euro</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-headline font-bold">0.9242</p>
                  <p className="text-xs text-tertiary font-semibold">+0.04%</p>
                </div>
              </div>
              <div className="h-16 w-full opacity-40 bg-gradient-to-t from-primary/20 to-transparent rounded-b-xl relative">
                <div className="absolute inset-0 flex items-end">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path className="text-primary" d="M0 80 Q 25 70, 50 85 T 100 60" fill="none" stroke="currentColor" strokeWidth="3" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-low p-6 rounded-[2rem] hover:bg-surface-container-high transition-colors animate-fade-in-up delay-300">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary font-bold">&pound;</div>
                  <div>
                    <p className="text-sm font-headline font-bold">GBP / USDM</p>
                    <p className="text-xs text-secondary">British Pound</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-headline font-bold">0.7841</p>
                  <p className="text-xs text-error font-semibold">-0.12%</p>
                </div>
              </div>
              <div className="h-16 w-full opacity-40 bg-gradient-to-t from-error/10 to-transparent rounded-b-xl relative">
                <div className="absolute inset-0 flex items-end">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path className="text-error" d="M0 40 Q 20 60, 40 45 T 70 80 T 100 90" fill="none" stroke="currentColor" strokeWidth="3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="bg-surface-container-lowest rounded-[2rem] p-6 lg:p-8 ambient-shadow animate-fade-in-up delay-300">
          <div className="flex justify-between items-center mb-8 lg:mb-10">
            <h3 className="text-xl font-headline font-extrabold tracking-tight">Recent Activity</h3>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-5xl text-outline-variant mb-4">receipt_long</span>
              <p className="text-on-surface-variant font-medium">No transactions yet</p>
              <p className="text-sm text-outline mt-1">Send USDM to another user to see activity here.</p>
            </div>
          ) : (
            <>
              {/* Mobile list */}
              <div className="space-y-6 lg:hidden">
                {transactions.map((t, i) => {
                  const isSender = t.sender_id === txUserId;
                  const otherEmail = isSender ? t.receiver_email : t.sender_email;
                  const amountStr = isSender
                    ? `-${Number(t.amount).toLocaleString()} USDM`
                    : `+${Number(t.amount).toLocaleString()} USDM`;

                  return (
                    <div
                      key={t.id}
                      className="flex items-center justify-between animate-fade-in-up"
                      style={{ animationDelay: `${(i + 1) * 100}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary">
                            {isSender ? "north_east" : "south_west"}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-on-surface">{otherEmail}</p>
                          <p className="text-xs text-on-surface-variant">{formatTxDate(t.created_at)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-lg ${isSender ? "text-on-surface" : "text-tertiary"}`}>
                          {amountStr}
                        </p>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full inline-block text-on-tertiary-fixed-variant bg-tertiary/10">
                          Completed
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-on-surface-variant/60 font-label text-xs uppercase tracking-[0.15em]">
                      <th className="pb-6 px-4">User</th>
                      <th className="pb-6 px-4">Date &amp; Time</th>
                      <th className="pb-6 px-4 text-right">Amount</th>
                      <th className="pb-6 px-4 text-center">Type</th>
                      <th className="pb-6 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {transactions.map((t, i) => {
                      const isSender = t.sender_id === txUserId;
                      const otherEmail = isSender ? t.receiver_email : t.sender_email;
                      const amountStr = isSender
                        ? `-${Number(t.amount).toLocaleString()} USDM`
                        : `+${Number(t.amount).toLocaleString()} USDM`;

                      return (
                        <tr
                          key={t.id}
                          className="tonal-shift hover:bg-surface-container-low group cursor-pointer animate-fade-in-up"
                          style={{ animationDelay: `${(i + 2) * 100}ms` }}
                          onClick={() => toast(`Transaction #${t.id}`)}
                        >
                          <td className="py-5 px-4 rounded-l-2xl">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary">
                                  {isSender ? "north_east" : "south_west"}
                                </span>
                              </div>
                              <div>
                                <p className="font-bold text-on-background">{otherEmail}</p>
                                <p className="text-xs text-on-surface-variant">
                                  {isSender ? "Sent USDM" : "Received USDM"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-5 px-4 text-on-surface-variant font-medium">{formatTxDate(t.created_at)}</td>
                          <td className="py-5 px-4 text-right">
                            <p className={`font-bold ${isSender ? "text-on-background" : "text-tertiary"}`}>{amountStr}</p>
                          </td>
                          <td className="py-5 px-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isSender ? "bg-primary/10 text-primary" : "bg-tertiary/10 text-on-tertiary-fixed-variant"}`}>
                              {isSender ? "Sent" : "Received"}
                            </span>
                          </td>
                          <td className="py-5 px-4 rounded-r-2xl text-center">
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-tertiary/10 text-on-tertiary-fixed-variant">
                              Completed
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </div>
    </AppShell>
  );
}
