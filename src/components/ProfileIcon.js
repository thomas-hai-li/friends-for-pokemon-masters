import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';

class ProfileIcon extends Component {
  handlePress = () => {
    this.props.onPress(this.props.index);
  };

  render() {
    return (
      <TouchableOpacity onPress={this.handlePress}>
        <Image source={this.props.uriRef} style={styles.icon} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 25,
    height: 25,
    margin: 8
  }
});

export default ProfileIcon;
