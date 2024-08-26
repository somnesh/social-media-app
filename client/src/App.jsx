import { Feed } from "./components/Feed";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";

function App() {
return (
  <>
    <Header />
    <main className="flex p-4">
      <Sidebar/>
      <Feed/>
      {/* --------------------------------------- */}
      <section className="basis-1/4">
        <h2>unknown section</h2>
      </section>
    </main>
  </>
);
}

export default App;