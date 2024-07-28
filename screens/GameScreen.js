import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, FlatList, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from 'react-native';

import NumberContainer from '../components/game/NumberContainer';
import Card from '../components/ui/Card';
import InstructionText from '../components/ui/InstructionText';
import PrimaryButton from '../components/ui/PrimaryButton';
import Title from '../components/ui/Title';
import GuessLogItem from '../components/game/GuessLogItem';

/**
 * 
 * @param {number} min 
 * @param {number} max 
 * @returns 
 */
function generateRandomBetween(min, max, exclude) {
   const rndNum = Math.floor(Math.random() * (max - min)) + min;

   if (rndNum === exclude) {
      return generateRandomBetween(min, max, exclude);
   } else {
      return rndNum;
   }
}

let minBoundary = 1;
let maxBoundary = 100;

/**
 * 
 * @param {Object} params 
 * @param {number} params.userNumber
 * @param {(numberOfRoundes: number)=> void} params.onGameOver
 */
function GameScreen({ userNumber, onGameOver }) {
   const initialGuess = generateRandomBetween(1, 100, userNumber);
   const [currentGuess, setCurrentGuess] = useState(initialGuess);
   const [guessRounds, setGuessRounds] = useState([initialGuess]);

   useEffect(() => {
      minBoundary = 1;
      maxBoundary = 100;
   }, []);

   /**
    * @param {"lower" | "greater" | "Bingo" } direction 
    */
   function nextGuessHandler(direction) {
      if (direction === 'Bingo') {
         if (currentGuess === userNumber) {
            onGameOver(guessRounds.length);
         } else {
            Alert.alert('Oops!', 'The computer made an incorrect guess. Please try again.', [
               { text: 'OK', style: 'cancel' },
            ]);
         }
         return;
      }

      if (
         (direction === 'lower' && currentGuess < userNumber) ||
         (direction === 'greater' && currentGuess > userNumber)
      ) {
         Alert.alert("Don't lie!", "Don't joke with me :)))", [
            { text: "It's my fault! :(((", style: 'cancel' },
         ]);
         return;
      }

      if (
         (direction ==='lower' && currentGuess === userNumber) ||
         (direction ==='greater' && currentGuess === userNumber)
      ) {
         Alert.alert("Are you sure???", "Is it the correct number?", [
            { text: "It's my fault! :(((", style: 'cancel' },
         ]);
         return;
      }

      if (direction === 'lower') {
         maxBoundary = currentGuess;
      } else {
         minBoundary = currentGuess + 1;
      }

      const newRndNumber = generateRandomBetween(
         minBoundary,
         maxBoundary,
         currentGuess
      );
      setCurrentGuess(newRndNumber);
      setGuessRounds((prevGuessRounds) => [newRndNumber, ...prevGuessRounds]);
   }

   const guessRoundsListLength = guessRounds.length;


   return (
      <View style={styles.screen}>
         <Title>Opponent's Guess</Title>
         <NumberContainer>{currentGuess}</NumberContainer>
      <Card>
         <InstructionText style={styles.instructionText}>
            Higher or lower?
         </InstructionText>
         <View style={styles.buttonsContainer}>
            <View style={styles.buttonContainer}>
               <PrimaryButton onPress={nextGuessHandler.bind(this, 'lower')}>
                  <Ionicons name="remove-outline" size={24} color="black" />
               </PrimaryButton>
            </View>
            <View style={styles.buttonContainer}>
               <PrimaryButton onPress={nextGuessHandler.bind(this, 'Bingo')}>                  
                  <Text style={{ color: 'black', fontSize: 18 }}>Bingo</Text>
               </PrimaryButton>
            </View>
            <View style={styles.buttonContainer}>
               <PrimaryButton onPress={nextGuessHandler.bind(this, 'greater')}>
                  <Ionicons name="add-outline" size={24} color="black" />
               </PrimaryButton>
            </View>
         </View>
      </Card>
         <View style={styles.listContainer}>
            <FlatList
               data={guessRounds}
               renderItem={(itemData) => (
                  <GuessLogItem
                     roundNumber={guessRoundsListLength - itemData.index}
                     guess={itemData.item}
                  />
               )}
               keyExtractor={(item) => item}
            />
         </View>
      </View>
   );
}

export default GameScreen;

const styles = StyleSheet.create({
   screen: {
      flex: 1,
      padding: 24,
      alignItems: 'center',
      marginTop: 20,
      ...Platform.select({
         ios: {
             paddingTop: 20,
         },
         android: {
             paddingTop: 40,
         },
      }),
   },
   instructionText: {
      marginBottom: 12,
   },
   buttonsContainer: {
      flexDirection: 'row',
   },
   buttonContainer: {
      flex: 1,
   },
   buttonsContainerWide: {
      flexDirection: "row",
      alignItems: "center"
   },
   listContainer: {
      flex: 1,
      padding: 16,
      paddingBottom: 2
   },
});
