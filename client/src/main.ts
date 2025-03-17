import headerDesign from "./design/heading";
import chooseCity from "./design/chooseCity";
import randomCity from "./design/randomCity";
import displayForecast from "./design/displayForecast";

let nextToDisplay: string = "weatherHistory";
let currentDisplay: string = "choices";
const userChoice: HTMLElement = document.getElementById("user-choice")!;
const choiceResult: HTMLElement = document.getElementById("choice-result")!;

const main = (): void => {
  console.log("reloaded hey");

  headerDesign();
  chooseCity();
  randomCity();
  displayForecast();

  console.log("main called with..........", currentDisplay);
  if (currentDisplay === "choices") {
    nextToDisplay = "weatherHistory";
    choiceResult.style.display = "none";
    userChoice.style.display = "flex";
    console.log("displaying choices");
  } else {
    nextToDisplay = "choices";
    console.log("displaying weather history");
    userChoice.style.display = "none";
    choiceResult.style.display = "block";
  }
};

main();

export const changeButtonValues = () => {
  console.log("changeButtonValues");
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
