import { ProfileMenu } from "./ProfileMenu";
import { SearchBar } from "./SearchBar";

export function Header() {
  return (
    <header className="flex py-1 pl-3 pr-2 bg-white dark:bg-[#242526] items-center sticky top-0 transition-colors duration-500 shadow-md">
      <section className="basis-1/4">
        <SearchBar />
      </section>
      <section className="basis-1/2 text-center">
        <a href="/">
          <span className="material-symbols-outlined dark:text-white">
            token
          </span>
        </a>
      </section>

      <section className="flex basis-1/4 justify-end items-center gap-2">
        <ProfileMenu />
      </section>
    </header>
  );
}
