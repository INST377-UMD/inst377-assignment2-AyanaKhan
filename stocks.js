const apiKey = 'YL1pQmENAXCsZvEkaz70edygvxmuIHVg';
let chart;

function getStockData(ticker = null, days = null) {
  const symbol = ticker || document.getElementById('ticker').value.toUpperCase();
  const range = days || document.getElementById('range').value;
  const today = new Date();
  const past = new Date(today);
  past.setDate(today.getDate() - range);

  const from = past.toISOString().split('T')[0];
  const to = today.toISOString().split('T')[0];

  const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${from}/${to}?adjusted=true&sort=asc&apiKey=${apiKey}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (!data.results || !data.results.length) {
        throw new Error("No data returned");
      }

      const labels = data.results.map(d => new Date(d.t).toLocaleDateString());
      const values = data.results.map(d => d.c);

      const ctx = document.getElementById('stockChart').getContext('2d');
      if (chart) chart.destroy();

      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: `${symbol} Closing Prices`,
            data: values,
            borderColor: '#cc0000',
            fill: false,
            tension: 0.1
          }]
        }
      });
    })
    .catch(err => {
      alert("Stock not found or API issue.");
      console.error(err);
    });
}

// Reddit Stock Table + Mini Chart Rows
fetch('https://tradestie.com/api/v1/apps/reddit?date=2022-04-03')
  .then(res => res.json())
  .then(data => {
    const top5 = data
      .sort((a, b) => b.comment_count - a.comment_count)
      .slice(0, 5);

    const tableBody = document.querySelector('#redditStocks tbody');
    tableBody.innerHTML = '';

    const miniChartContainer = document.getElementById('redditChartRows');
    miniChartContainer.innerHTML = '';

    top5.forEach(stock => {
      const emoji = stock.sentiment === 'Bullish' ? '🐂' : '🐻';

      const row = document.createElement('tr');
      row.innerHTML = `
        <td><a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">${stock.ticker}</a></td>
        <td>${stock.comment_count}</td>
        <td style="font-size: 28px;">${emoji}</td>
      `;
      tableBody.appendChild(row);

      const miniRow = document.createElement('div');
      miniRow.className = 'reddit-row';
      miniRow.innerHTML = `
        <a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">${stock.ticker}</a>
        <span>${stock.comment_count} comments</span>
        <span class="emoji">${emoji}</span>
      `;
      miniChartContainer.appendChild(miniRow);
    });
  })
  .catch(err => console.error("Failed to load Reddit stock data:", err));

if (annyang) {
  const commands = {
    'hello': () => alert("Hello World"),
    'change the color to *color': color => {
      document.body.style.backgroundColor = color;
    },
    'navigate to *page': page => {
      const p = page.toLowerCase();
      if (p.includes("stock")) window.location.href = "stocks.html";
      else if (p.includes("dog")) window.location.href = "dogs.html";
      else if (p.includes("home")) window.location.href = "index.html";
    },
    'lookup *stock': stock => {
      document.getElementById('ticker').value = stock.toUpperCase();
      getStockData(stock.toUpperCase(), 30);
    }
  };

  annyang.addCommands(commands);
}
