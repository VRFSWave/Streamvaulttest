async function loadMatches() {
  const apiUrl = "https://api.streamed.su/api/matches/live";
  const proxyUrl = "https://corsproxy.io/?" + encodeURIComponent(apiUrl);

  console.log("Fetching live matches from:", proxyUrl);

  try {
    const res = await fetch(proxyUrl);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();

    console.log("Raw match data received:", data);

    const matchList = document.getElementById("match-list");
    matchList.innerHTML = "";

    const footballMatches = data.filter(match => match.category === "Football");
    console.log(`Filtered football matches: ${footballMatches.length}`);

    if (footballMatches.length === 0) {
      matchList.innerHTML = "<p>No live football matches right now.</p>";
      return;
    }

    footballMatches.forEach(match => {
      const home = match.teams?.home?.name || "Team A";
      const away = match.teams?.away?.name || "Team B";
      const homeBadge = match.teams?.home?.badge || "";
      const awayBadge = match.teams?.away?.badge || "";
      const date = new Date(match.date).toLocaleTimeString();

      const firstSource = match.sources[0];
      if (!firstSource) {
        console.warn("No source found for match:", match);
        return;
      }

      const link = `viewer.html?id=${firstSource.id}&source=${firstSource.source}`;

      const card = document.createElement("div");
      card.className = "match";
      card.innerHTML = `
        <div><strong>${home} vs ${away}</strong></div>
        <div>${date}</div>
        <div>
          <img src="${homeBadge}" alt="${home}"> vs <img src="${awayBadge}" alt="${away}">
        </div>
        <a href="${link}"><button class="watch-btn">Watch Now</button></a>
      `;

      matchList.appendChild(card);
    });
  } catch (err) {
    console.error("Failed to load matches:", err);
    document.getElementById("match-list").innerHTML = `
      <p style="color: red;">⚠️ Failed to fetch live matches. Check console for details.</p>
    `;
  }
}

loadMatches();
