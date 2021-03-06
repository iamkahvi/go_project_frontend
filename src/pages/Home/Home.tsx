import * as React from "react";
import { home as HomeStyles } from "./home.module.scss";
import { ResponseBody, User } from "../../types";
import UserList from "../../components/UserList/UserList";

// TODO:
// - implement redux with async actionsk

interface State {
  isFetching: boolean;
  users: User[];
  inputs: {
    name: string;
    deleteId: number;
  };
}

export const authObject = {
  Authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlhbWthaHZpQGdtYWlsLmNvbSJ9.1fFHKGQ8a9CVHyVei0dTEo8ErZbS6SNDXfwuyy4eMis",
};

const INIT_STATE: State = {
  isFetching: false,
  users: [
    {
      Name: "",
      ID: 0,
      CreatedAt: "",
      UpdatedAt: "",
      DeletedAt: "",
    },
  ],
  inputs: {
    name: "",
    deleteId: -1,
  },
};

const url = "http://localhost:8080";

class Home extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = INIT_STATE;
  }

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = async () => {
    this.setState({ isFetching: true });

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
      const { users } = json;
      this.setState({ users });
    }

    this.setState({ isFetching: false });
  };

  addUser = async (name: string) => {
    this.setState({ isFetching: true });

    let json: ResponseBody | undefined;
    try {
      const data = await fetch(url + "/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authObject,
        },
        body: JSON.stringify({ user: name }),
      });
      json = await data.json();
    } catch (err) {
      console.log(err);
      window.alert(err);
    }

    if (json) {
      const { users } = json;
      this.setState({ users });
    }
    this.setState({ isFetching: false });
  };

  deleteUser = async (id: number) => {
    if (!window.confirm("Are you sure?")) {
      return;
    }
    this.setState({ isFetching: true });

    let json: ResponseBody | undefined;
    try {
      const data = await fetch(url + "/users/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...authObject,
        },
      });
      json = await data.json();
    } catch (err) {
      console.log(err);
      window.alert(err);
    }
    this.setState({ isFetching: false });

    this.fetchUsers();
  };

  updateInput = (key: string, value: any) => {
    this.setState((prevState: State) => ({
      ...prevState,
      inputs: {
        ...prevState.inputs,
        [key]: value,
      },
    }));
  };

  capitalize = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  handleAddUser = () => {
    const Name = this.state.inputs.name
      .split(" ")
      .map((word) => {
        return this.capitalize(word);
      })
      .join(" ");

    this.addUser(Name);
    this.updateInput("name", "");
  };

  handleDeleteUser = (id: number) => {
    if (id > 0) {
      this.deleteUser(id);
    }
  };

  render() {
    const { isFetching } = this.state;
    return (
      <div className={HomeStyles}>
        <h2>Users</h2>
        <UserList
          users={this.state.users}
          isFetching={this.state.isFetching}
          handleDelete={this.handleDeleteUser}
        />
        <form>
          <fieldset>
            <h3>Add User</h3>
            <input
              id="add"
              type="text"
              placeholder="user"
              value={this.state.inputs.name}
              onChange={(e) => {
                this.updateInput("name", e.target.value);
              }}
            ></input>
            <button type="button" onClick={() => this.handleAddUser()}>
              add
            </button>
          </fieldset>
          <fieldset>
            <h3>Delete User</h3>
            {isFetching ? (
              "Loading..."
            ) : (
              <select
                id="edit"
                value={this.state.inputs.deleteId}
                onChange={(e) => {
                  this.updateInput("deleteId", e.target.value);
                }}
              >
                <option disabled={true}>Select User</option>
                <option></option>
                {this.state.users.map((el, i) => (
                  <option key={i} value={el.ID}>
                    {el.Name}
                  </option>
                ))}
              </select>
            )}
            <button
              type="button"
              onClick={() => this.handleDeleteUser(this.state.inputs.deleteId)}
            >
              delete
            </button>
          </fieldset>
        </form>
      </div>
    );
  }
}

export default Home;
