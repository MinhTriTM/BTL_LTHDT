import { GpaAssistant } from "./gpa-assistant";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <h1 className="text-2xl font-bold tracking-tight font-headline">
          Student Manager Pro
        </h1>
        <GpaAssistant />
      </div>
    </header>
  );
}
