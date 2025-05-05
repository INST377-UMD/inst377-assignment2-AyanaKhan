// Fetch Quote of the Day
fetch("https://api.quotable.io/random")
  .then(res => res.json())
  .then(data => {
    document.getElementById("quote-text").textContent = `"${data.content}" — ${data.author}`;
  })
  .catch(() => {
    document.getElementById("quote-text").textContent = "Failed to load quote.";
  });

// Annyang Voice Commands for Home
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
    }
  };
  annyang.addCommands(commands);
}
