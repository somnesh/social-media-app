export function SearchBar() {
  return (
    <div className="flex bg-[#f0f2f5] dark:bg-[#3a3b3c] px-2 py-2 rounded-full text-[#b0b3b8] max-w-64">
      <div>
        <span className="material-symbols-outlined flex pl-1">search</span>
      </div>
      <input
        className="basis-full outline-none px-2 bg-[#f0f2f5] dark:bg-[#3a3b3c] dark:text-[#1b0505] text-black"
        type="text"
        name="search"
        id="search"
        placeholder="Find people"
      />
    </div>
  );
}
