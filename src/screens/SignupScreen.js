import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, StatusBar, ToastAndroid, TouchableOpacity } from 'react-native';
import ProfileIconSelector from '../components/ProfileIconSelector';
import * as firebase from 'firebase';
import Filter from 'bad-words';

const firebaseConfig = {
  // nope, not gonna push the DEETS in the public repo
  // trying to put this somewhere else at the moment...
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

class SignupScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trainerName: '',
      trainerID: '',
      trainerMsg: '',
      trainerIcon: null // will later point to a number (RN returns a number when using require on PNG)
    };
  }

  toastAndroid = (message) => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      0, // x offset
      400 // y offset (up)
    );
  };

  handleSubmit = () => {
    const { trainerName, trainerID, trainerMsg, trainerIcon } = this.state;
    const onlyDigits = /^\d+$/.test(trainerID);
    const filter = new Filter();

    if (trainerName.length < 3) {
      this.toastAndroid('Put at least 3 characters for your name.');
    } else if (trainerID.length < 16 || !onlyDigits) {
      this.toastAndroid('Please enter a valid 16-digit trainer ID.');
    } else if (filter.isProfane(trainerName) || filter.isProfane(trainerMsg)) {
      this.toastAndroid("Don't swear!");
    } else if (trainerIcon === null) {
      this.toastAndroid('Please choose an icon.');
    } else {
      // log user in as anon
      auth.signInAnonymously();
      const uid = auth.currentUser.uid;
      console.log(`User ${trainerName} (${uid}) has just created an account!`);
      // write data to database
      const date = Date.parse(new Date());
      database.ref(`trainers/${uid}`).set({ trainerName, trainerID, trainerMsg, date, trainerIconIndex: trainerIcon });
      // go to home screen
      this.props.navigation.navigate('Home');
    }
  };

  componentDidMount() {
    // test if user has registered before, by checking database
    auth.signInAnonymously();
    const navigate = this.props.navigation.navigate;
    auth.onAuthStateChanged(function(user) {
      if (user) {
        // user had logged in:
        const uid = user.uid;
        const ref = database.ref(`trainers/${uid}`);
        ref.once('value').then((snapshot) => {
          if (snapshot.exists()) {
            // user had registered before; go to home screen
            navigate('Home');
          }
        });
      } else {
        // user had logged out; go to signup screen
        navigate('Signup');
      }
    });
  }

  handleProfileIconChange = (iconURIRef) => {
    this.setState({ trainerIcon: iconURIRef });
  };

  // async shouldINavigate() {
  //   try {
  //     const uid = auth.currentUser.uid;
  //     const ref = database.ref(`trainers/${uid}`);
  //     let snapshot = await ref.once('value');
  //     if (snapshot.exists()) {
  //       this.props.navigation.navigate('Home');
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 5, marginHorizontal: 50 }}>
          <Text style={styles.title}>Find other Trainers!</Text>

          <Text>Trainer Name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Your Trainer Name"
            maxLength={16}
            returnKeyType={'next'}
            onChangeText={(trainerName) => this.setState({ trainerName })}
            onSubmitEditing={() => {
              this.trainerIDInput.focus();
            }}
            value={this.state.text}
          />

          <Text>16-digit Trainer ID</Text>
          <TextInput
            ref={(input) => {
              this.trainerIDInput = input;
            }}
            style={styles.textInput}
            placeholder="0000 0000 0000 0000"
            maxLength={16}
            returnKeyType={'next'}
            keyboardType="numeric"
            onChangeText={(trainerID) => this.setState({ trainerID })}
            onSubmitEditing={() => {
              this.trainerMsgInput.focus();
            }}
            value={this.state.trainerID}
          />

          <Text>Message (optional)</Text>
          <TextInput
            ref={(input) => {
              this.trainerMsgInput = input;
            }}
            style={styles.textInput}
            placeholder="Battle me nao!!!"
            maxLength={22}
            onChangeText={(trainerMsg) => this.setState({ trainerMsg })}
            value={this.state.trainerMsg}
          />

          <Text>Trainer Icon:</Text>
          <ProfileIconSelector handleChange={this.handleProfileIconChange} />
        </View>

        <View style={{ flex: 2, backgroundColor: '#f4ffeb', justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity style={styles.button} onPress={this.handleSubmit}>
            <Text style={styles.buttonText}>Sign Up!</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#cceaff'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: StatusBar.currentHeight + 10,
    marginBottom: 5,
    alignSelf: 'center'
  },
  textInput: {
    height: 40
  },
  button: {
    borderRadius: 25,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 50,
    paddingRight: 50,
    backgroundColor: '#bfafff',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: { width: 1, height: 13 }
  },
  buttonText: {
    color: 'white',
    fontSize: 16
  }
});

export default SignupScreen;
