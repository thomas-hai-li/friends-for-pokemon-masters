import React, { Component } from 'react';
import { StyleSheet, View, Text, Clipboard, ToastAndroid } from 'react-native';
import { ListItem, Avatar, Button, ButtonGroup } from 'react-native-elements';
import iconRefs from '../components/ProfileIconRefs';
import RateTrainerButtons from './RateTrainerButtons';

class TrainerListItem extends Component {
  handleCopy = () => {
    Clipboard.setString(this.props.id);
    ToastAndroid.show('Trainer ID has been copied to clipboard!', ToastAndroid.SHORT);
  };

  render() {
    let { id, name, message, iconIndex } = this.props;
    // format id, adding a space every 4 digits
    let idFormatted = '';
    for (let i = 0; i < id.length; i += 4) {
      idFormatted += id.substring(i, i + 4) + ' ';
    }
    idFormatted = idFormatted.trim();

    return (
      <ListItem
        title={
          // contains trainer icon + name + msg, and up/down vote buttons
          <View style={styles.title}>
            <View style={styles.trainerInfo}>
              <Avatar rounded source={iconRefs[iconIndex - 1]} />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.message}>{message}</Text>
              </View>
            </View>
            {RateTrainerButtons}
          </View>
        }
        subtitle={
          // contains formatted ID and "Copy ID" button
          <View style={styles.subtitle}>
            <Text style={styles.id}>{idFormatted}</Text>
            <Button
              title="Copy ID"
              type="outline"
              onPress={this.handleCopy}
              buttonStyle={{
                maxWidth: 75,
                maxHeight: 25
              }}
            />
          </View>
        }
        topDivider
        bottomDivider
      />
    );
  }
}

const styles = StyleSheet.create({
  title: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  subtitle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  trainerInfo: {
    flex: 1,
    flexDirection: 'row'
  },
  name: {
    fontWeight: '500'
  },
  message: {
    fontSize: 12
  },
  id: {
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 20,
    color: '#0260a8'
  }
});

export default TrainerListItem;
