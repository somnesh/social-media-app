import { Feed } from "../components/Feed";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";

export const Home = () => {
  return (
    <>
      <Header />
      <main className="flex px-2 py-4 bg-[#f0f2f5] dark:bg-[#18191a] min-h-screen dark:text-[#e2e4e9] transition-colors duration-500">
        <Sidebar />
        <Feed />
        {/* --------------------------------------- */}
        <section className="basis-1/4">
          <h2>unknown section</h2>
        </section>
      </main>
    </>
  );
};
