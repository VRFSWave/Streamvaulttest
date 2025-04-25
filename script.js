async function loadMatches() {
  const res = await fetch("https://api.streamed.su/api/matches/live");
  const data = await res.json();

  const matchList = document.getElementById("match-list");
  matchList.innerHTML = "";

  const footballMatches = data.filter(match => match.category === "Football");

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

    // Pick the first stream source
    const firstSource = match.sources[0];
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
}

loadMatches();
