export function Sidebar(params) {
  return (
    <section className="dark:bg-[18191a] basis-1/4">
      <div className="flex items-center gap-1 p-2">
        <span className="material-symbols-outlined">home</span>
        <span>Home</span>
      </div>
      <div className="flex items-center gap-1 p-2">
        <span className="material-symbols-outlined">group</span>
        <span>Friends</span>
      </div>
      <div className="flex items-center gap-1 p-2">
        <span className="material-symbols-outlined">group_add</span>
        <span>Friend Requests</span>
      </div>
      <div className="flex items-center gap-1 p-2">
        <span className="material-symbols-outlined">bookmark</span>
        <span>Saved</span>
      </div>
      <div className="flex items-center gap-1 p-2">
        <span className="material-symbols-outlined">diamond</span>
        <span>Premium</span>
      </div>
    </section>
  );
}
