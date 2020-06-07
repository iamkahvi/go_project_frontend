import React from "react";
import { User } from "../../types";
import { item as ItemStyles } from "./userlist.module.scss";

interface Props {
  isFetching: boolean;
  users: User[];
  handleDelete: (id: number) => void;
}

export default function UserList(props: Props) {
  const { isFetching, users, handleDelete } = props;

  return (
    <div>
      <ul>
        {isFetching ? (
          "Loading..."
        ) : (
          <div>
            {users.map((user, key) => (
              <li key={key}>
                <div className={ItemStyles}>
                  {user.Name}
                  <button onClick={() => handleDelete(user.ID)}>delete</button>
                </div>
              </li>
            ))}
          </div>
        )}
      </ul>
    </div>
  );
}
