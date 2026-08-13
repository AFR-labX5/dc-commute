const WMATA_DEMO_KEY = "e13626d03d8e4c03ac07f95541b3091b";

const STOPS = {
  morningD94: "1001889",
  morningC81: "1003095",
  eveningD94Dana: "1001886",
  eveningD94Arizona: "1001971"
};

async function getPredictions(stopId) {
  const url =
    "https://api.wmata.com/NextBusService.svc/json/jPredictions" +
    "?StopID=" + stopId +
    "&api_key=" + WMATA_DEMO_KEY;

  console.log("Calling WMATA:", stopId);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("WMATA HTTP error: " + response.status);
  }

  return await response.json();
}

function showResult(id, data) {
  const element = document.getElementById(id);

  if (!element) {
    return;
  }

  if (!data.Predictions || data.Predictions.length === 0) {
    element.innerHTML = "No buses currently predicted";
    return;
  }

  element.innerHTML = data.Predictions
    .slice(0, 3)
    .map(function(p) {
      return `
        <div class="prediction">
          <strong>${p.RouteID}</strong>
          <span>${p.Minutes} min</span>
        </div>
      `;
    })
    .join("");
}

async function loadTransitData() {

  const status = document.getElementById("last-update");

  try {

    status.textContent = "Connecting to WMATA...";

    const d94Morning = await getPredictions(STOPS.morningD94);

    showResult("morning-d94", d94Morning);

    status.textContent =
      "WMATA connected • " +
      new Date().toLocaleTimeString();

  } catch (error) {

    console.error(error);

    status.textContent =
      "WMATA ERROR: " + error.message;
  }
}

loadTransitData();
