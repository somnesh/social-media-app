import { SearchBar } from "./SearchBar";

export function Header() {
  return (
    <header className="flex p-2 bg-[#242526]">
      <section className="basis-1/4">
        <SearchBar />
      </section>
      <section className="basis-1/2 text-center">
        <h2>logo</h2>
      </section>
      <section className="basis-1/4 text-right">
        <h2>Profile</h2>
      </section>
    </header>
  );
}
