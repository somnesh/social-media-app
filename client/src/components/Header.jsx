import { SearchBar } from "./SearchBar";

export function Header() {
  return (
    <header className="flex p-2 bg-[#242526] items-center">
      <section className="basis-1/4">
        <SearchBar />
      </section>
      <section className="basis-1/2 text-center">
        <h2>
          <span className="material-symbols-outlined text-white">token</span>
        </h2>
      </section>
      <section className="flex basis-1/4 justify-end items-center gap-2">
        <h2 className="text-white">Profile</h2>
        <img
          className="rounded-full"
          src="https://via.placeholder.com/40"
          alt="photo"
        />
      </section>
    </header>
  );
}
