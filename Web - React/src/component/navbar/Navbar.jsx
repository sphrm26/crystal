import { useState } from "react";
import { NavLink} from "react-router-dom";

import styles from "./Navbar.module.css";

const Navbar = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    console.log(isMenuOpen);
  };

  return (
    <nav className={styles.nav}>
      <button className={styles.menuIcon} onClick={toggleMenu}>
        ☰
      </button>

      <div className={`${styles.body} ${isMenuOpen ? styles.show : ""}`}>
        <ul>
          <li>
            <NavLink to="/filesManager" activeClassName={styles.active}>
              Files
            </NavLink>
          </li>
          <li>
            <NavLink to="/taskManager" activeClassName={styles.active}>
              Tasks
            </NavLink>
          </li>
          <li>
            <NavLink to="/eventManager" activeClassName={styles.active}>
              Event
            </NavLink>
          </li>
          <li>
            <NavLink to="/account" activeClassName={styles.active}>
              Account
            </NavLink>
          </li>
        </ul>
      </div>

      {children}
    </nav>
  );
};

export default Navbar;
