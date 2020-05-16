import * as React from "react";
import "./Home.scss";

interface ResponseBody {
  list: {
    users: User[];
  };
}

interface User {
  Name: string;
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
}

interface State {
  users: User[];
  inputs: {
    name: string;
  };
}

const INIT_STATE: State = {
  users: [
    {
      Name: "Kahvi",
      ID: 0,
      CreatedAt: "now",
      UpdatedAt: "now",
      DeletedAt: "now",
    },
  ],
  inputs: {
    name: "",
  },
};

class Home extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = INIT_STATE;

    this.fetchData = this.fetchData.bind(this);
    this.addUser = this.addUser.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    this.fetchData();
  }
  async fetchData() {
    const data = await fetch("http://192.168.0.14:8080/users", {
      headers: { Origin: "example.com" },
    });
    const json: ResponseBody = await data.json();
    console.log(json);

    if (json !== null) {
      const { users } = json.list;
      this.setState({ users });
    }
  }

  updateInput(key: string, value: any) {
    this.setState((prevState: State) => ({
      ...prevState,
      inputs: {
        ...prevState.inputs,
        [key]: value,
      },
    }));
  }

  capitalize = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  async addUser() {
    const { name } = this.state.inputs;
    const Name = name
      .split(" ")
      .map((word) => {
        return this.capitalize(word);
      })
      .join(" ");
    const data = await fetch("http://192.168.0.14:8080/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: Name }),
    });
    const json: ResponseBody = await data.json();
    console.log(json);

    if (json !== null) {
      const { users } = json.list;
      this.setState({ users });
    }

    this.updateInput("name", "");
  }
  async deleteUser(id: number) {
    if (!window.confirm("Are you sure?")) {
      return;
    }
    const data = await fetch("http://192.168.0.14:8080/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    const json: ResponseBody = await data.json();
    console.log(json);

    if (json !== null) {
      const { users } = json.list;
      this.setState({ users });
    }
  }
  handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    this.addUser();
  }
  render() {
    return (
      <div className="Home">
        <h2>Users</h2>
        <ul>
          {this.state.users.map((user, key) => (
            <li key={key}>
              <div className="item">
                {user.Name}
                <button onClick={() => this.deleteUser(user.ID)}>X</button>
              </div>
            </li>
          ))}
        </ul>
        <form onSubmit={this.handleSubmit}>
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
            <button type="submit">submit</button>
          </fieldset>
        </form>
      </div>
    );
  }
}

export default Home;
