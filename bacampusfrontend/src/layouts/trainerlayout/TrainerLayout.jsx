import { Outlet } from "react-router-dom";
import "./components/Right";
import Aside from "./components/Aside";
import Right from "./components/Right";

export function TrainerLayout() {
  return (
    <div className="container">
      <Aside/>
      <Right />
      <main>
        <section>
          <Outlet/>
        </section>
      </main>
    </div>
  );
}

export default TrainerLayout;