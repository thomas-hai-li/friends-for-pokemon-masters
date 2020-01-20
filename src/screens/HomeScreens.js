import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text, Image, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { Header } from 'react-native-elements';
import TrainerListItem from '../components/TrainerListItem';
import * as firebase from 'firebase';

const database = firebase.database();

class TrainerListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isFetching: false,
      isRefreshing: false,
      trainerData: {},
      referenceToOldestKey: null
    };
  }

  componentDidMount() {
    this.fetchTrainers();
  }

  fetchTrainers = () => {
    console.log('FETCHING');
    const trainersRef = database.ref('trainers');
    const FETCH_LIMIT = 100;
    // first fetch or onRefresh:
    if (this.state.referenceToOldestKey === null || this.state.isRefreshing) {
      trainersRef.limitToLast(FETCH_LIMIT).once('value', (snapshot) => {
        // index 0 = uid (key), index 1 = trainer attributes (value); [uid, trainer]
        let trainerData = Object.entries(snapshot.val());
        // sort by most recent date
        trainerData.sort((a, b) => b[1].date - a[1].date);

        this.setState({
          isLoading: false,
          isFetching: false,
          isRefreshing: false,
          trainerData,
          referenceToOldestKey: trainerData[trainerData.length - 1][0]
        });
      });
    } else {
      // subsequent fetches
      trainersRef
        .orderByKey()
        .endAt(this.state.referenceToOldestKey)
        .limitToLast(FETCH_LIMIT)
        .once('value', (snapshot) => {
          let trainerData = Object.entries(snapshot.val());
          trainerData.sort((a, b) => b[1].date - a[1].date);

          // if same as before (reached oldest post)
          if (trainerData[trainerData.length - 1][0] === this.state.referenceToOldestKey) {
            this.setState({ isLoading: false, isFetching: false });
            return;
          }

          this.setState((prevState) => ({
            isLoading: false,
            isFetching: false,
            trainerData: [ ...prevState.trainerData, ...trainerData.slice(1) ], // .endAt() is inclusive
            referenceToOldestKey: trainerData[trainerData.length - 1][0]
          }));
        });
    }
  };

  handleRefresh = (evt) => {
    this.setState({ isFetching: true, isRefreshing: true }, () => {
      this.fetchTrainers();
    });
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.trainers}>
        <Header centerComponent={{ text: 'Find Pokemon Masters!' }} backgroundColor="#cceaff" />
        <FlatList
          data={this.state.trainerData}
          keyExtractor={(entry) => entry[0]} // key = uid
          renderItem={({ item }) => (
            <TrainerListItem
              id={item[1].trainerID}
              name={item[1].trainerName}
              message={item[1].trainerMsg}
              iconIndex={item[1].trainerIconIndex} // for avatar
            />
          )}
          refreshing={this.state.isRefreshing}
          onRefresh={this.handleRefresh}
          onEndReached={() => {
            if (!this.state.isFetching) {
              this.fetchTrainers();
            }
          }} // ONLY FETCH IF NOT CURRENTLY FETCHINGGGGGGGGGGGGGG
        >
          {/* {this.state.isFetching && (
            <ListItem>
              <ActivityIndicator />
            </ListItem>
          )} */}
        </FlatList>
      </View>
    );
  }
}

class AboutScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', margin: 50 }}>
        <Text>New features will be added soon, such as:</Text>
        <View>
          <Text>{'\u2022 customization options'}</Text>
          <Text>{'\u2022 direct messaging'}</Text>
          <Text>{'\u2022 and chat rooms!'}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  trainers: {
    marginBottom: 80 // bottom tab bar covers flatlist
  },
  tabBarIcon: {
    width: 26,
    height: 26
  }
});

const TabNavigator = createBottomTabNavigator(
  {
    Trainers: TrainerListScreen,
    About: AboutScreen
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let src;
        if (routeName === 'Trainers') {
          src = require('../../assets/img/add-user.png');
        } else if (routeName === 'About') {
          src = require('../../assets/img/info.png');
        }
        return <Image source={src} style={[ styles.tabBarIcon, { tintColor } ]} />;
      }
    }),
    tabBarOptions: {
      activeTintColor: '#0260a8',
      inactiveTintColor: 'gray'
    }
  }
);

export default createAppContainer(TabNavigator);
