import * as React from "react";
import "./styles/Home.scss";
import { ResponseBody, User } from "./types";

// TODO:
// - create UserList component
// - create UserListContainer component
// - implement redux with async actionsk

interface State {
  isFetching: boolean;
  users: User[];
  inputs: {
    name: string;
    deleteId: number;
  };
}

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
        headers: { Origin: "example.com" },
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
      <div className="Home">
        <h2>Users</h2>
        <ul>
          {isFetching ? (
            "Loading..."
          ) : (
            <>
              {this.state.users.map((user, key) => (
                <li key={key}>
                  <div className="item">
                    {user.Name}
                    <button onClick={() => this.handleDeleteUser(user.ID)}>
                      delete
                    </button>
                  </div>
                </li>
              ))}
            </>
          )}
        </ul>
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
