import * as React from "react";
import "./Home.scss";

interface ResponseBody {
  list: {
    users: string[];
  };
}

interface State {
  data: string[];
  user: string;
}

class Home extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: [""],
      user: "",
    };

    this.fetchData = this.fetchData.bind(this);
    this.addUser = this.addUser.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    this.fetchData();
  }
  async fetchData() {
    console.log("hey there");
    const data = await fetch("http://192.168.0.14:8080/users", {
      headers: { Origin: "example.com" },
    });
    const json: ResponseBody = await data.json();

    const users = json.list.users === null ? [] : json.list.users;

    console.log(users);
    this.setState({ data: users });
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
    const json: { list: { users: [string] } } = await data.json();

    const { users = [""] } = json.list;

    console.log(json.list.users);
    this.setState({ data: users, user: "" });
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
          {this.state.data.map((user, key) => (
            <li key={key}>{user}</li>
          ))}
        </ul>
        <form onSubmit={this.handleSubmit}>
          <fieldset>
            <label>Add User</label>
            <br></br>
            <input
              id="user"
              type="text"
              placeholder="user name"
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
