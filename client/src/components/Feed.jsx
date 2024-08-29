import { Post } from "./Post";

export function Feed() {
  return (
    <section className="basis-1/2">
      <div className="create-new-post bg-slate-100 px-4 py-2">
        <div className="flex items-center">
          <div className="basis-1/6 ">
            <img
              className="rounded-full m-auto"
              src="https://via.placeholder.com/40"
              alt="photo"
            />
          </div>
          <div className="basis-5/6">what's happening?</div>
        </div>

        <div className="flex items-center text-center">
          <div className="flex basis-1/3 items-center p-2">
            <span className="material-symbols-outlined">
              add_photo_alternate
            </span>
            <span>add image</span>
          </div>
          <div className="flex basis-1/3 items-center">
            <span className="material-symbols-outlined">ballot</span>
            <span>add poll</span>
          </div>
          <div className="flex basis-1/3 items-center">
            <span className="material-symbols-outlined">
              expand_circle_right
            </span>
            <span>more</span>
          </div>
        </div>
      </div>

      {/* Main feed starts from here */}
      <div>
        <Post />
      </div>
    </section>
  );
}
