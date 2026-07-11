import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">De Fryhof</p>
      <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight">
        Marketing site and CMS for group accommodation content.
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-neutral-600">
        Payload manages pages, media, SEO, localization, and layout blocks. Booking remains an
        external widget.
      </p>
      <div className="mt-8">
        <Button asChild>
          <a href="/admin">Open CMS</a>
        </Button>
      </div>
    </main>
  );
}
