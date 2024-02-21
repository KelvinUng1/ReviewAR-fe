import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Platform } from 'react-native';
const CommentPage = () => {
  const [commentBody, setCommentBody] = useState("");
  const [showPostComment, setShowPostComment] = useState(false);
  const [isPostingComment, setIsPostingComment] = useState(false);
const navigation = useNavigation();
  const togglePostComment = () => {
    setShowPostComment(!showPostComment);
  };

  const handleNewCommentSubmit = () => {
    // Handle submitting the comment
    setIsPostingComment(true);
    // Example: You can add your logic here to submit the comment
  };

  return (
    <View style={styles.container}>
      <Button
        title="Write a Comment ✍🏻"
        onPress={togglePostComment}
        color="green"
      />
      {showPostComment && (
        <View style={styles.formContainer}>
          <TextInput
            multiline={true}
            style={styles.input}
            placeholder="My Comment..."
            value={commentBody}
            onChangeText={setCommentBody}
            editable={!isPostingComment}
          />
          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              onPress={() => Platform.OS === 'ios'
              ? navigation.navigate("Home")
              : navigation.push("Home")
          }
              color="green"
              
            />
            <Button
              title="Post 📨"
              onPress={handleNewCommentSubmit}
              color="green"
              disabled={isPostingComment}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "aquamarine",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  formContainer: {
    marginTop: 20,
  },
  input: {
    backgroundColor: "yellow",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: "black",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default CommentPage;