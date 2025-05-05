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
      const labels = data.results.map(d => new Date(d.t).toLocaleDateString());
      const values = data.results.map(d => d.c);

      const ctx = document.getElementById('stockChart').getContext('2d');

      if (chart) chart.destroy(); // Replace old chart

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
    .catch(err => alert("Stock not found or API issue."));
}

// Reddit Stock Table
fetch('https://tradestie.com/api/v1/apps/reddit?date=2022-04-03')
  .then(res => res.json())
  .then(data => {
    const top5 = data.slice(0, 5);
    const tableBody = document.querySelector('#redditStocks tbody');

    top5.forEach(stock => {
      const row = document.createElement('tr');
      const sentimentIcon = stock.sentiment === 'Bullish'
        ? '<img src="images/bull.png" width="50">'
        : '<img src="images/bear.png" width="50">';

      row.innerHTML = `
        <td><a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">${stock.ticker}</a></td>
        <td>${stock.no_of_comments}</td>
        <td>${sentimentIcon}</td>
      `;
      tableBody.appendChild(row);
    });
  });

// Annyang Voice Commands for Stocks
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
