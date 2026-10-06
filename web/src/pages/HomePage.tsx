import { Navigate } from "react-router-dom";
import { readSession, writeSession } from "../auth/storage";
import { EyeLogo } from "../components/EyeLogo";
import "./auth.css";

export function HomePage() {
  const session = readSession();
  if (!session) return <Navigate to="/login" replace />;

  return (
    <main className="shell">
      <header className="chrome">
        <div />
        <div>Кабинет</div>
      </header>
      <section className="home">
        <EyeLogo to="/" />
        <div className="kicker">Сессия</div>
        <h1>
          Здравствуйте,
          <br />
          {session.name}
        </h1>
        <p>{session.login}</p>
        <button
          className="ghost"
          type="button"
          onClick={() => {
            writeSession(null);
            window.location.assign("/login");
          }}
        >
          Выйти
        </button>
      </section>
    </main>
  );
}
