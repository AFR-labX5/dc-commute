const WMATA_DEMO_KEY = "e13626d03d8e4c03ac07f95541b3091b";

const STOPS = {
  morningD94: "1001889",
  morningC81: "1003095",
  eveningD94Dana: "1001886",
  eveningD94Arizona: "1001971"
};

async function getPredictions(stopId) {
  const url =
    `https://api.wmata.com/NextBusService.svc/json/jPredictions` +
    `?StopID=${stopId}&api_key=${WMATA_DEMO_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`WMATA error: ${response.status}`);
  }

  return await response.json();
}

function formatMinutes(minutes) {
  if (minutes === 0) return "Now";
  if (minutes === 1) return "1 min";
  return `${minutes} min`;
}

function renderPredictions(elementId, data, direction) {
  const element = document.getElementById(elementId);

  if (!element) return;

  const predictions = data.Predictions
    .filter(p => p.DirectionText === direction)
    .slice(0, 3);

  if (predictions.length === 0) {
    element.innerHTML = "No upcoming buses";
    return;
  }

  element.innerHTML = predictions.map(p => `
    <div class="prediction">
      <strong>${p.RouteID}</strong>
      <span>${formatMinutes(p.Minutes)}</span>
    </div>
  `).join("");
}

async function loadTransitData() {
  try {

    const [
      morningD94,
      morningC81,
      eveningDana,
      eveningArizona
    ] = await Promise.all([
      getPredictions(STOPS.morningD94),
      getPredictions(STOPS.morningC81),
      getPredictions(STOPS.eveningD94Dana),
      getPredictions(STOPS.eveningD94Arizona)
    ]);

    renderPredictions(
      "morning-d94",
      morningD94,
      "East to Gallery Place"
    );

    renderPredictions(
      "morning-c81",
      morningC81,
      "East to Fort Totten"
    );

    renderPredictions(
      "evening-d94-dana",
      eveningDana,
      "West to Sibley Hospital"
    );

    renderPredictions(
      "evening-d94-arizona",
      eveningArizona,
      "West to Sibley Hospital"
    );

    document.getElementById("last-update").textContent =
      "Updated " + new Date().toLocaleTimeString();

  } catch (error) {

    console.error(error);

    document.getElementById("last-update").textContent =
      "Unable to load WMATA data";
  }
}

loadTransitData();

setInterval(loadTransitData, 30000);
