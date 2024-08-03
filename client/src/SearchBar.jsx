function SearchBar() {
  return (
    <>
      <div className="search-box">
        <span className="search-icon">
          <i
            class="fa-solid fa-magnifying-glass"
            style={{ color: "#b0b3b8" }}
          ></i>
        </span>
        <input
          className="search-input"
          aria-autocomplete="list"
          aria-expanded="false"
          type="search"
          placeholder="Search anything"
          spellcheck="false"
        />
      </div>
    </>
  );
}

export default SearchBar;
