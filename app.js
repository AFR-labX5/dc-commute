const WMATA_API_KEY = "e13626d03d8e4c03ac07f95541b3091b";

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

  if (!element) {
    return;
  }

  if (!data.Predictions || data.Predictions.length === 0) {
    element.innerHTML = "No upcoming buses";
    return;
  }

  element.innerHTML = data.Predictions
    .slice(0, 2)
    .map(function (prediction) {
      const minutes = prediction.Minutes;

      return `
        <div class="prediction">
          <strong>${prediction.RouteID}</strong>
          <span>
            ${minutes === 0 ? "NOW" : minutes + " min"}
          </span>
        </div>
      `;
    })
    .join("");
}

async function loadMorning() {
  const status = document.getElementById("last-update");

  try {
    status.textContent = "Updating WMATA...";

    // D94
    const d94 = await getPredictions(STOPS.morningD94);

    renderPredictions("morning-d94", d94);

    // Wait 3 seconds before the second WMATA request
    await new Promise(function (resolve) {
      setTimeout(resolve, 3000);
    });

    // C81
    const c81 = await getPredictions(STOPS.morningC81);

    renderPredictions("morning-c81", c81);

    status.textContent =
      "Live WMATA • Updated " +
      new Date().toLocaleTimeString();

  } catch (error) {
    console.error("WMATA error:", error);

    status.textContent =
      "WMATA error: " + error.message;
  }
}

// Load immediately
loadMorning();

// Refresh every 2 minutes
setInterval(loadMorning, 120000);
