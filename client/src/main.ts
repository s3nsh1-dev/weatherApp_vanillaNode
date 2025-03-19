import headerDesign from "./design/heading";
import chooseCity from "./design/chooseCity";
import randomCity from "./design/randomCity";
import displayForecast from "./design/displayForecast";

let nextToDisplay: string = "weatherHistory";
let currentDisplay: string = "choices";
const userChoice: HTMLElement = document.getElementById("user-choice")!;
const choiceResult: HTMLElement = document.getElementById("choice-result")!;

const main = (): void => {
  headerDesign();
  chooseCity();
  randomCity();
  displayForecast();

  if (currentDisplay === "choices") {
    nextToDisplay = "weatherHistory";
    choiceResult.style.display = "none";
    userChoice.style.display = "flex";
  } else {
    nextToDisplay = "choices";
    userChoice.style.display = "none";
    choiceResult.style.display = "block";
  }
};

main();

export const changeButtonValues = () => {
  if (currentDisplay === "choices") {
    nextToDisplay = "choices";
    currentDisplay = "weatherHistory";
    userChoice.style.display = "none";
  } else {
    nextToDisplay = "weatherHistory";
    currentDisplay = "choices";
    choiceResult.style.display = "none";
  }
  main();
};
