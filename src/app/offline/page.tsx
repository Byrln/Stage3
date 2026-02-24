'use client';

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-4 text-center text-neutral-100">
      <div className="max-w-md space-y-4">
        <h1 className="font-heading text-2xl tracking-tight text-neutral-50">
          You are offline
        </h1>
        <p className="text-sm text-neutral-400">
          Tripsaas needs a network connection to sync bookings and availability. Check your
          connection and try again.
        </p>
        <button
          type="button"
          onClick={() => {
            window.location.reload();
          }}
          className="mt-4 h-10 rounded-full bg-emerald-500 px-6 text-sm font-semibold text-neutral-950 hover:bg-emerald-400"
        >
          Retry
        </button>
      </div>
    </main>
  );
}

