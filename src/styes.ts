import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  pretag: {
    marginLeft: 0,
    paddingRight: 16,
    paddingTop: 0,
    paddingBottom: 0,
  },
  codetag: {
    paddingBottom: 16,
    margin: 0,
  },
  row_container: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  number_container: {
    height: 20,
    justifyContent: "center",
    alignItems: "flex-end",
    opacity: 0.8,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 9999,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    borderColor: "#333333",
  },
  number: {
    fontWeight: "500",
    textAlign: "right",
    opacity: 0.75,
  },
  text_container: {
    transform: [
      {
        translateY: 2.8,
      },
    ],
  },
});

export default styles;
