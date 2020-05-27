import shortid from "shortid";

class User {
  username: string;

  constructor(public id: string, public room: string) {
    this.username = "User " + shortid();
  }
}

export default User;
