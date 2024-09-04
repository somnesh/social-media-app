import { Image, ListTodo, MapPin, X } from "lucide-react";
import { Button } from "./ui/button";

export function CreatePost({ newPost, setNewPost }) {
  const closePopup = () => {
    if (newPost) {
      setNewPost(false);
    }
    document.body.classList.remove("overflow-hidden");
  };
  return (
    <div className="fixed inset-0 flex justify-center bg-opacity-30 backdrop-blur-sm items-center">
      <div className="bg-white px-4 rounded-md md:min-w-[30rem]">
        <div className="flex relative border-b">
          <h2 className="text-xl py-2 grow text-center">Create Post</h2>
          <div className="py-3 px-4 absolute right-0">
            <X className="cursor-pointer" onClick={closePopup}></X>
          </div>
        </div>

        <form>
          <div className="flex justify-between items-center">
            <div className="flex gap-2 py-2 items-center">
              <img
                className="rounded-full "
                src="https://via.placeholder.com/40"
                alt="photo"
              />
              <span>Username</span>
            </div>
            <div>
              <h3>Dropdown</h3>
            </div>
          </div>
          <div className="my-4">
            <textarea
              className="min-w-full min-h-32 p-2 rounded-md border bg-[#F0F2F5]"
              name="post"
              id=""
              placeholder="Start writing here ..."
            ></textarea>
          </div>
          <div className="flex justify-between my-4 items-center">
            <div className="w-full flex gap-4">
              <span className="">Add to your post</span>
              <div className="flex gap-3 cursor-pointer">
                <Image />
                <ListTodo />
                <MapPin />
              </div>
            </div>
            <div>
              <Button className="bg-indigo-500 px-8">Post</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
