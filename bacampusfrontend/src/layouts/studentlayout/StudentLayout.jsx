import { Outlet } from "react-router-dom";
import "./components/Right";
import Right from "./components/Right";
import Aside from "./components/Aside";
export function StudentLayout() {
  return (
    <div className="container">
     <Aside />
      <Right />
      <main>
        <section>
          <Outlet/>
        </section>
      </main>

    </div>
  );
}

export default StudentLayout;