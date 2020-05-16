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
  user: string;
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
  user: "",
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
  async addUser() {
    const user = this.state.user;
    const data = await fetch("http://192.168.0.14:8080/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user }),
    });
    const json: ResponseBody = await data.json();
    console.log(json);

    if (json !== null) {
      const { users } = json.list;
      this.setState({ users });
    }
    this.setState({ user: "" });
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
            <li key={key}>{user.Name}</li>
          ))}
        </ul>
        <form onSubmit={this.handleSubmit}>
          <fieldset>
            <h3>Add User</h3>
            <input
              id="user"
              type="text"
              placeholder="user"
              value={this.state.user}
              onChange={(e) => {
                this.setState({ user: e.target.value });
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
