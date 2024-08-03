import SearchBar from "./SearchBar";
import Logo from "./Logo";

function Header() {
  return (
    <>
      <div className="header">
        <div className="left-section">
          <Logo />
          <div>&nbsp;</div>
          <SearchBar />
        </div>
        <div
          className="right-section"
          aria-label="Account controls and settings"
        >
          <div className="user-name">
            <span>Somnesh Mukhopadhyay</span>
          </div>
          <div className="user-dp">
            <img
              style={{ borderRadius: "20px" }}
              src="https://via.placeholder.com/40"
              alt="user profile picture"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
