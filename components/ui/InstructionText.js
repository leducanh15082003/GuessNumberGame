import { Text, StyleSheet } from 'react-native';

import colors from '../../constants/colors';

function InstructionText({ children, style }) {
  return <Text style={[styles.instructionText, style]}>{children}</Text>;
}

export default InstructionText;

const styles = StyleSheet.create({
  instructionText: {
    fontFamily: 'open-sans',
    color: colors.accent500,
    fontSize: 24,
  },
});
