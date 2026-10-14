// import { APP_NAME, APP_DESCRIPTION } from "./utils/constants";
import Header from "./components/Header/Header";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.app} id="inicio">
      <Header />
      <main className={styles.main}></main>
    </div>
  );
}

export default App;
