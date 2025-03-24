import headerDesign from "./design/heading";
import chooseCity from "./design/chooseCity";
import randomCity from "./design/randomCity";
import displayForecast from "./design/displayForecast";

let currentDisplay: string = "choices";
const userChoice: HTMLElement = document.getElementById("user-choice")!;
const choiceResult: HTMLElement = document.getElementById("choice-result")!;

const main = (): void => {
  headerDesign();
  chooseCity();
  randomCity();

  if (currentDisplay === "choices") {
    choiceResult.style.display = "none";
    userChoice.style.display = "flex";
  } else {
    userChoice.style.display = "none";
    choiceResult.style.display = "block";
    displayForecast();
  }
};

main();

// Hide loader once main is done
const loader = document.getElementById("loader") as HTMLDivElement;
if (loader) {
  loader.style.display = "none";
}

export const changeButtonValues = () => {
  if (currentDisplay === "choices") {
    currentDisplay = "weathers";
    userChoice.style.display = "none";
  } else {
    currentDisplay = "choices";
    choiceResult.style.display = "none";
  }
  main();
};
