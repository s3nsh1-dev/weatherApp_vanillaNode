import headerDesign from "./design/heading";
import chooseCity from "./design/chooseCity";
import randomCity from "./design/randomCity";
import displayForecast from "./design/displayForecast";

const main = () => {
  let nextToDisplay = "weatherHistory";
  let currentDisplay = "choices";
  const userChoice = document.getElementById("user-choice")!;
  const choiceResult = document.getElementById("choice-result")!;

  headerDesign();
  chooseCity();
  randomCity();
  displayForecast();

  if (currentDisplay === "choicess") {
    nextToDisplay = "weatherHistory";
    choiceResult.style.display = "none";
  } else {
    nextToDisplay = "choices";
    userChoice.style.display = "none";
  }
};

main();
