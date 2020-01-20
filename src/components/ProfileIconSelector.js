import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import ProfileIcon from './ProfileIcon';
import iconRefs from './ProfileIconRefs';

class ProfileIconSelector extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedIcon: null };
  }

  static defaultProps = { iconRefs };

  handleSelection = (index) => {
    this.setState({ selectedIcon: this.props.iconRefs[index] }, () => {
      this.props.handleChange(this.state.selectedIcon);
    });
  };

  render() {
    let icons = this.props.iconRefs.map((ref, i) => (
      <ProfileIcon key={i} index={i} uriRef={ref} onPress={this.handleSelection} />
    ));
    return <View style={styles.container}>{icons}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
});

export default ProfileIconSelector;
