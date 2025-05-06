document.addEventListener('DOMContentLoaded', () => {
    fetch("https://api.quotable.io/random")
      .then(res => res.json())
      .then(data => {
        const quoteBox = document.getElementById("quote-text");
        quoteBox.textContent = `"${data.content}" — ${data.author}`;
      })
      .catch(() => {
        document.getElementById("quote-text").textContent =
          "“Stay curious. Stay inspired.” — Anonymous";
      });
  });
  
  if (annyang) {
    const commands = {
      'hello': () => alert("Hello World!"),
  
      'change the color to *color': color => {
        const safeColor = color.trim().toLowerCase();
        document.body.style.backgroundColor = safeColor;
      },
  
      'navigate to *page': page => {
        const p = page.toLowerCase();
        if (p.includes("stock")) {
          window.location.href = "stocks.html";
        } else if (p.includes("dog")) {
          window.location.href = "dogs.html";
        } else if (p.includes("home")) {
          window.location.href = "index.html";
        } else {
          alert(`Page "${page}" not recognized. Try saying "home", "stocks", or "dogs".`);
        }
      }
    };
  
    annyang.addCommands(commands);
  }
  document.addEventListener("DOMContentLoaded", () => {
    fetch(`https://api.quotable.io/random?nocache=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        document.getElementById("quote-text").textContent = `"${data.content}" — ${data.author}`;
      })
      .catch(() => {
        document.getElementById("quote-text").textContent = "Failed to load quote.";
      });
  });
    