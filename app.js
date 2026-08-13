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

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("WMATA HTTP " + response.status);
  }

  return await response.json();
}

function renderPredictions(elementId, data) {

  const element = document.getElementById(elementId);

  if (!element) return;

  if (!data.Predictions || data.Predictions.length === 0) {
    element.innerHTML = "No upcoming buses";
    return;
  }

  element.innerHTML = data.Predictions
    .slice(0, 3)
    .map(function(p) {

      return `
        <div class="prediction">
          <strong>${p.RouteID}</strong>
          <span>${p.Minutes === 0 ? "NOW" : p.Minutes + " min"}</span>
        </div>
      `;

    })
    .join("");
}

async function loadTransitData() {

  const status = document.getElementById("last-update");

  try {

    status.textContent = "Updating WMATA...";

    const results = await Promise.all([
      getPredictions(STOPS.morningD94),
      getPredictions(STOPS.morningC81),
      getPredictions(STOPS.eveningD94Dana),
      getPredictions(STOPS.eveningD94Arizona)
    ]);

    renderPredictions("morning-d94", results[0]);
    renderPredictions("morning-c81", results[1]);
    renderPredictions("evening-d94-dana", results[2]);
    renderPredictions("evening-d94-arizona", results[3]);

    status.textContent =
      "Live WMATA • Updated " +
      new Date().toLocaleTimeString();

  } catch (error) {

    console.error(error);

    status.textContent =
      "WMATA error: " + error.message;
  }
}

loadTransitData();

setInterval(loadTransitData, 30000);
