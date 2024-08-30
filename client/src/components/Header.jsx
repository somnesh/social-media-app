import { ProfileMenu } from "./ProfileMenu";
import { SearchBar } from "./SearchBar";

export function Header() {
  const buttonClick = () => {};

  return (
    <header className="flex py-2 px-4 bg-white dark:bg-[#242526] items-center">
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
        <h2>
          <ProfileMenu />
        </h2>
        <img
          className="rounded-full"
          src="https://via.placeholder.com/40"
          alt="photo"
        />
      </section>
    </header>
  );
}
