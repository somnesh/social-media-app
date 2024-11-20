import { useEffect, useState } from "react";
import { ProfileCard } from "./ProfileCard";
import axios from "axios";
import { ProfileCardLoader } from "./loaders/ProfileCardLoader";

export function FollowerList() {
  const [isLoading, setIsLoading] = useState(true);
  const [followerList, setFollowerList] = useState([]);
  const [followerListSkip, setFollowerListSkip] = useState(0);
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
        const response = await axios.get(`${API_URL}/user/fetch/followerList`, {
          params: { limit: 10, skip: followerListSkip },
          withCredentials: true,
        });

        setTotalCount(response.data.totalCount);

        console.log(
          "FollowerList.jsx : response.data: ",
          response.data.followers
        );
        setFollowerListSkip((prev) => prev + response.data.length);

        const followerChunks = chunkArray(response.data.followers, 2);
        console.log("followerChunks: ", followerChunks);

        setFollowerList(followerChunks);
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
        <div className="flex flex-col sm:w-full px-2 sm:px-0">
          <div className="sm:mb-4 my-4">
            <span className="text-2xl font-bold">Followers ({totalCount})</span>
          </div>
          <div className="flex items-center flex-col gap-3">
            {totalCount !== 0 ? (
              followerList.map((chunk, index) => (
                <div
                  className="flex flex-col w-full gap-3 md:flex-row"
                  key={index}
                >
                  {chunk.map((follower) => (
                    <ProfileCard
                      key={follower._id}
                      details={follower.follower}
                      followingBack={follower.followingBack}
                    />
                  ))}
                </div>
              ))
            ) : (
              <span className="block mt-10 font-medium text-center">
                You don't have any followers right now, start following your
                friends and family.
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
