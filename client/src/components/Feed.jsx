import { Post } from "./Post";

export function Feed() {
    return (
      <section className="basis-1/2">
        <div className="create-new-post">
          <div className="flex">
            <div className="basis-1/4">dp</div>
            <div className="basis-3/4">what's happening</div>
          </div>
          <div className="flex">
            <div className="basis-1/3">add image</div>
            <div className="basis-1/3">add poll</div>
            <div className="basis-1/3">more</div>
          </div>
        </div>
        {/* Main feed starts from here */}
        <div>
            <Post/>
        </div>
      </section>
    );
}