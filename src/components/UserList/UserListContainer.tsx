import React, { useEffect, useState } from "react";
import { ResponseBody, User } from "../../types";
import { authObject } from "../../pages/Home";
import UserList from "./UserList";

const url = "http://localhost:8080";

export default function UserListContainer() {
  const [isFetching, setFetching] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setFetching(true);

    let json: ResponseBody | undefined;
    try {
      const data = await fetch(url + "/users", {
        method: "GET",
        headers: {
          Origin: "example.com",
          ...authObject,
        },
      });
      json = await data.json();
      console.log(json);
    } catch (err) {
      console.log(err);
      window.alert(err);
    }

    if (json) {
      setUsers(json.users);
    }

    setFetching(false);
  };

  const deleteUser = async (id: number) => {
    if (!window.confirm("Are you sure?")) {
      return;
    }
    setFetching(true);

    let json: ResponseBody | undefined;
    try {
      const data = await fetch(url + "/users/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      json = await data.json();
    } catch (err) {
      console.log(err);
      window.alert(err);
    }
    setFetching(false);

    fetchUsers();
  };

  return (
    <div>
      <UserList
        users={users}
        isFetching={isFetching}
        handleDelete={deleteUser}
      />
    </div>
  );
}
