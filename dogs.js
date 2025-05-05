fetch("https://dog.ceo/api/breeds/image/random/10")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("dogCarousel");
    data.message.forEach(url => {
      const img = document.createElement("img");
      img.src = url;
      img.style.height = "200px";
      img.style.margin = "0 10px";
      container.appendChild(img);
    });

    new Glider(container, {
      slidesToShow: 1,
      draggable: true,
      scrollLock: true
    });
  });

// Load breed buttons
fetch("https://api.thedogapi.com/v1/breeds")
  .then(res => res.json())
  .then(breeds => {
    const buttonContainer = document.getElementById("breedButtons");

    breeds.forEach(breed => {
      const btn = document.createElement("button");
      btn.textContent = breed.name;
      btn.className = "breed-btn";
      btn.onclick = () => showBreedInfo(breed);
      buttonContainer.appendChild(btn);
    });

    if (annyang) {
      const breedMap = {};
      breeds.forEach(b => breedMap[b.name.toLowerCase()] = b);

      const commands = {
        'load dog breed *breed': breedName => {
          const b = breedMap[breedName.toLowerCase()];
          if (b) showBreedInfo(b);
        },
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
  });

function showBreedInfo(breed) {
  document.getElementById("breedName").textContent = `Name: ${breed.name}`;
  document.getElementById("breedDesc").textContent = `Description: ${breed.temperament || "N/A"}`;
  document.getElementById("breedLife").textContent = `Min Life: ${breed.life_span.split(' - ')[0]}\nMax Life: ${breed.life_span.split(' - ')[1] || breed.life_span}`;
  document.getElementById("breedInfo").style.display = "block";
}
