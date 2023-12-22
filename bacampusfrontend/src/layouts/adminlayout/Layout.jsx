import { Outlet } from "react-router-dom";
import Aside from "../adminlayout/components/Aside";
import Main from "../adminlayout/components/Main";
import "../../assets/scss/app.scss";
import "./scss/main.scss";
import "./components/Right";
import Right from "./components/Right";

export function Layout() {
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

export default Layout;