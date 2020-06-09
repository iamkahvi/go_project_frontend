import React from "react";
import * as styles from "./layout.module.scss";
import { NavLink } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

export default function UserList(props: Props) {
  return (
    <div className={styles.wrapper}>
      <nav className={styles.navContainer}>
        <NavLink exact={true} to="/">
          Home
        </NavLink>
        <NavLink exact={true} to="/login">
          Login
        </NavLink>
      </nav>
      <div className={styles.contentContainer}>{props.children}</div>
    </div>
  );
}
