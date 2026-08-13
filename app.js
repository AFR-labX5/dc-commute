const WMATA_DEMO_KEY = "c1465485fa734a95bcbd6fa6628ff51d";

const STOP_ID = "1003095";

async function getPredictions() {

  const url =
    "https://api.wmata.com/NextBusService.svc/json/jPredictions" +
    "?StopID=" + STOP_ID +
    "&api_key=" + WMATA_DEMO_KEY;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("HTTP " + response.status);
  }

  return await response.json();
}

async function load() {

  const element = document.getElementById("morning-c81");
  const status = document.getElementById("last-update");

  try {

    status.textContent = "Testing C81...";

    const data = await getPredictions();

    if (!data.Predictions || data.Predictions.length === 0) {
      element.textContent = "No C81 predictions";
    } else {

      element.innerHTML = data.Predictions
        .slice(0, 3)
        .map(p => `
          <div class="prediction">
            <strong>C81</strong>
            <span>${p.Minutes} min</span>
          </div>
        `)
        .join("");
    }

    status.textContent =
      "C81 connected • " +
      new Date().toLocaleTimeString();

  } catch (error) {

    console.error(error);

    status.textContent =
      "C81 ERROR: " + String(error);
  }
}

load();
