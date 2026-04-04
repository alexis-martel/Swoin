"use client";

import Link from "next/link";
import AppShell from "../components/AppShell";
import { useToast } from "../components/ToastProvider";

export default function ProfilePage() {
  const toast = useToast();

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-8 space-y-8">
        <section className="flex items-center gap-5">
          <img
            alt="Profile avatar"
            className="w-20 h-20 rounded-3xl object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7laqlxI9qFopTzyzkoehzFB4QZPEbcnSs9PIcAFaL0qTYaqBqN1s-yPWGT_cVzalJ_EgmB4je9ozTl3icEegg0q-KYqs3V1mZMk0q2L80p961O9s5DRtwU4O91JSYZTEoIzYMuFP0uZ1sYChDhKjY1Q0axYJZ3-_N2qNIKOX61wF4Nd5-j6ow9hA8MxAqut3g0w4Q84FWzcAS4HTZ1sWM4dxjcz_FT1keyWhvnz1hfUD9JRNOyje0pLpIAjFYwOU6ZfDmKO_oFYU"
          />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary">Profile</p>
            <h1 className="text-4xl font-headline font-extrabold tracking-tight">Ari Morgan</h1>
            <p className="text-on-surface-variant">Premium Sovereign Account · Verified</p>
          </div>
        </section>

        <section className="bg-surface-container-low rounded-[2rem] p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileField label="Email" value="ari.morgan@sovereignpay.com" />
          <ProfileField label="Phone" value="+1 (415) 555-0192" />
          <ProfileField label="Country" value="United States" />
          <ProfileField label="Default Currency" value="USDC" />
        </section>

        <section className="bg-surface-container-lowest rounded-[2rem] p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p className="font-bold">Need to update account details?</p>
            <p className="text-sm text-on-surface-variant">Changes are securely reviewed before going live.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => toast("Edit profile request — Coming soon")}
              className="primary-gradient text-white px-5 py-3 rounded-xl font-bold active:scale-95"
            >
              Request Edit
            </button>
            <Link href="/settings" className="px-5 py-3 rounded-xl bg-surface-container-high font-bold">
              Security Settings
            </Link>
            <Link href="/cards" className="px-5 py-3 rounded-xl bg-surface-container-high font-bold">
              My Cards
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">{label}</p>
      <p className="font-semibold text-on-background">{value}</p>
    </div>
  );
}
