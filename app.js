const WMATA_DEMO_KEY = "e13626d03d8e4c03ac07f95541b3091b";

const STOPS = {
  morningD94: "1001889",
  eveningD94Dana: "1001886",
  eveningD94Arizona: "1001971",
  morningC81: "1003095"
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

async function testWMATA() {
  try {
    const d94 = await getPredictions(STOPS.morningD94);
    const c81 = await getPredictions(STOPS.morningC81);

    console.log("D94:", d94);
    console.log("C81:", c81);

  } catch (error) {
    console.error("WMATA error:", error);
  }
}

testWMATA();
