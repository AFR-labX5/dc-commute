const WMATA_DEMO_KEY = "c1465485fa734a95bcbd6fa6628ff51d";
const STOPS = {
  morningD94: "1001889",
  morningC81: "1003095"
};

async function getPredictions(stopId) {
  const url =
    "https://api.wmata.com/NextBusService.svc/json/jPredictions" +
    "?StopID=" + stopId +
    "&api_key=" + WMATA_API_KEY;

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
    .map(p => `
      <div class="prediction">
        <strong>${p.RouteID}</strong>
        <span>${p.Minutes === 0 ? "NOW" : p.Minutes + " min"}</span>
      </div>
    `)
    .join("");
}

async function loadMorning() {
  const status = document.getElementById("last-update");

  try {
    status.textContent = "Updating WMATA...";

    const d94 = await getPredictions(STOPS.morningD94);

    // Small delay to avoid hammering the API
    await new Promise(resolve => setTimeout(resolve, 1000));

    const c81 = await getPredictions(STOPS.morningC81);

    renderPredictions("morning-d94", d94);
    renderPredictions("morning-c81", c81);

    status.textContent =
      "Live WMATA • Updated " +
      new Date().toLocaleTimeString();

  } catch (error) {
    console.error(error);

    status.textContent =
      "WMATA error: " + error.message;
  }
}

loadMorning();

setInterval(loadMorning, 60000);
