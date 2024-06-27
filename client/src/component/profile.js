import React, { Component } from "react";
import getWeb3 from "../getWeb3";
import Election from "../contracts/Election.json";
import Navbar from "./Navbar/Navigation";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      ElectionInstance: null,
      account: null,
      profile: null,
      loading: true
    };
  }

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Election.networks[networkId];
      const instance = new web3.eth.Contract(
        Election.abi,
        deployedNetwork && deployedNetwork.address
      );

      this.setState({
        web3: web3,
        ElectionInstance: instance,
        account: accounts[0]
      });

      const voter = await instance.methods
        .voterDetails(accounts[0])
        .call();
      const phoneNumber = voter.phone;

      const response = await fetch(`http://localhost:3001/profile/${phoneNumber}`);
      if (response.ok) {
        const profile = await response.json();
        this.setState({
          profile: profile,
          loading: false
        });
      } else {
        console.error('Failed to fetch user profile');
        this.setState({ loading: false });
      }
    } catch (error) {
      console.error(error);
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      this.setState({ loading: false });
    }
  };

  formatDOB = (dob) => {
    const dateOfBirth = new Date(dob);
    return dateOfBirth.toLocaleDateString('en-US');
  };

  render() {
    const { profile, loading } = this.state;

    return (
      <div>
        <Navbar />
        <div style={styles.container}>
          <h2 style={styles.heading}>Profile</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div style={styles.details}>
              <p style={{ ...styles.field, ...styles.blueBackground }}><strong>Name:</strong> {profile.name}</p>
              <p style={{ ...styles.field, ...styles.whiteBackground }}><strong>Date of Birth:</strong> {this.formatDOB(profile.date_of_birth)}</p>
              <p style={{ ...styles.field, ...styles.blueBackground }}><strong>Phone Number:</strong> {profile.phone_number}</p>
              <p style={{ ...styles.field, ...styles.whiteBackground }}><strong>Email:</strong> {profile.email}</p>
              <p style={{ ...styles.field, ...styles.blueBackground }}><strong>Address:</strong> {profile.address}</p>
              <p style={{ ...styles.field, ...styles.whiteBackground }}><strong>Gender:</strong> {profile.gender}</p>
              <p style={{ ...styles.field, ...styles.blueBackground }}><strong>Education:</strong> {profile.education}</p>
              <p style={{ ...styles.field, ...styles.whiteBackground }}><strong>Employment History:</strong> {profile.employment_history}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    margin: '20px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: 'white',
    width: '50%',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '10px',
    textAlign: 'center',
  },
  details: {
    marginTop: '20px',
  },
  field: {
    padding: '10px',
    borderBottom: '1px solid #ccc',
  },
  blueBackground: {
    backgroundColor: 'green',
    color: 'white',
  },
  whiteBackground: {
    backgroundColor: 'white',
    color: 'blue',
  },
};
