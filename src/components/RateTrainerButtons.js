import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';

class RateTrainerButtons extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Button
          title="Up"
          type="outline"
          buttonStyle={{
            maxWidth: 75,
            maxHeight: 25
          }}
        />;
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  }
});

export default RateTrainerButtons;
