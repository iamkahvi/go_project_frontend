import React from "react";
import { User } from "../../types";
import { CSSTransition } from "react-transition-group";

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
          <CSSTransition classNames="example" in={true} timeout={300}>
            <>
              {users.map((user, key) => (
                <li key={key}>
                  <div className="item">
                    {user.Name}
                    <button onClick={() => handleDelete(user.ID)}>
                      delete
                    </button>
                  </div>
                </li>
              ))}
            </>
          </CSSTransition>
        )}
      </ul>
    </div>
  );
}
