import { useEffect, useState } from "react";
import { ProfileCard } from "./ProfileCard";
import axios from "axios";
import { ProfileCardLoader } from "./loaders/ProfileCardLoader";

export function FollowingList() {
  const [isLoading, setIsLoading] = useState(true);
  const [followingList, setFollowingList] = useState([]);
  const [followingListSkip, setFollowingListSkip] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const API_URL = import.meta.env.VITE_API_URL;

  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      try {
        const response = await axios.get(
          `${API_URL}/user/fetch/followingList`,
          {
            params: { limit: 10, skip: followingListSkip },
            withCredentials: true,
          }
        );

        setTotalCount(response.data.totalCount);

        console.log(
          "FollowerList.jsx : response.data: ",
          response.data.following
        );
        setFollowingListSkip((prev) => prev + response.data.length);

        const followingChunks = chunkArray(response.data.following, 2);
        console.log("followingChunks: ", followingChunks);

        setFollowingList(followingChunks);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <>
      {isLoading ? (
        <ProfileCardLoader />
      ) : (
        <div className="px-2 sm:px-0">
          <div className="mb-4">
            <span className="text-2xl font-bold">Following ({totalCount})</span>
          </div>
          <div className="flex items-center flex-col gap-3">
            {totalCount !== 0 ? (
              followingList.map((chunk, index) => (
                <div
                  className="flex flex-col w-full gap-3 md:flex-row"
                  key={index}
                >
                  {chunk.map((follower) => (
                    <ProfileCard
                      key={follower._id}
                      details={follower.followed}
                      followingBack={null}
                    />
                  ))}
                </div>
              ))
            ) : (
              <span className="block mt-10 font-medium text-center">
                You don't follow anyone right now, start following your friends
                and family.
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
