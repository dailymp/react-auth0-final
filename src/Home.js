import React, { Component } from "react";
import { Link } from "react-router-dom";
const {
  Stitch,
  RemoteMongoClient,
  AnonymousCredential
} = require('mongodb-stitch-browser-sdk');

class Home extends Component {
  render() {
    const { isAuthenticated, login } = this.props.auth;
    return (
      <div>
        <h1>Home</h1>
        {isAuthenticated() ? (
          <Link to="/profile">View profile</Link>
        ) : (
          <button onClick={login1}>Log In</button>
        )}
      </div>
    );
  }
}

export default Home;



const client = Stitch.initializeDefaultAppClient('demo-kflbk');

const db = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('test');

const login1 = () => {
  client.auth.loginWithCredential(new AnonymousCredential()).then(user =>
  db.collection('users').updateOne({
    owner_id: client.auth.user.id
  }, {
    $set: {
      number: 77
    }
  }, {
    upsert: true
  })
).then(() =>
  db.collection('users').find({
    owner_id: client.auth.user.id
  }, {
    limit: 100
  }).asArray()
).then(docs => {
  console.log("Found docs", docs)
  console.log("[MongoDB Stitch] Connected to Stitch")
}).catch(err => {
  console.error(err)
});
}
