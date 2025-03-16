export default function displayForecast() {
  const displayElem = document.querySelector<HTMLDivElement>("#choice-result")!;
  displayElem.innerHTML = `
        <nav id="switch-panel">
          <div class="divButtons" id="switch-to-weather">Weather</div>
          <div class="divButtons" id="switch-to-forecast">Forecast</div>
        </nav>
        <article id="weather-forecast">
        <div>
            <button id="reset> <== back</button>
            <h1 id="panel-heading">Weather</h1>
        </div>
          <div id="card-container">
            <div class="api-cards"></div>
          </div>
        </article>`;
  console.log("displayForecast");
}
