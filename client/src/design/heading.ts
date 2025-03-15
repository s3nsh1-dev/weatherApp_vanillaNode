import "./heading.css";

const header = document.getElementById("header")!;
export default function headerDesign() {
  header.innerHTML = `<h1>Weather Forecast and <span style="color: red">LIVE</span> Updates</h1>
      <section>
        <button id="options">Options</button>
        <article id="weather-unit">
          <div>
            <input type='radio' id="celsius" checked/>
            <label for="celsius">Celsius</label>
          </div>
          <div>
            <input type='radio' id="fahrenheit"/>
            <label for="fahrenheit">Fahrenheit</label>
          </div>
        </article>
      </section>`;
  const chooseOptions = document.getElementById("options")!;
  const displayOptions = document.getElementById("weather-unit")!;
  displayOptions.style.display = "none";
  chooseOptions.addEventListener("click", () => {
    displayOptions.style.display =
      displayOptions.style.display === "none" ? "flex" : "none";
  });
}
