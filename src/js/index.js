import axios from "axios";

axios.defaults.headers.common["x-api-key"] =
    "live_XfdevO4DrLuyWxidCJhdmGyRd7snbpWZLgUB4EszmTKW8jMM06dCrI5OejvpBZVl";

// Функція для отримання порід котів з API
async function getCats() {
    const breedSelect = document.querySelector(".breed-select");
    const loader = document.querySelector(".loader");
    const error = document.querySelector(".error");
    const catInfo = document.querySelector(".cat-info");
    try {
        const response = await axios.get("https://api.thecatapi.com/v1/breeds");
        const cats = response.data;

        cats.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.id;
            option.text = cat.name;
            breedSelect.appendChild(option);
        });

        // Вибір породи
        breedSelect.addEventListener("change", async event => {
            const selectedBreedId = event.target.value;
            const selectedBreed = cats.find(cat => cat.id === selectedBreedId);

            loader.style.display = "block";
            error.style.display = "none";
            catInfo.style.display = "none";

            try {
                const breedResponse = await axios.get(
                    `https://api.thecatapi.com/v1/images/search?breed_ids=${selectedBreedId}`
                );
                const breedImage = breedResponse.data[0].url;

                // Вивід інформації
                loader.style.display = "none";
                catInfo.innerHTML = `
				<h2>${selectedBreed.name}</h2>
				<p>${selectedBreed.description}</p>
				<img src="${breedImage}" alt="${selectedBreed.name}">
				`;
                catInfo.style.display = "block";
            } catch (error) {
                // Помилка зображення
                console.error("Error fetching cat image:", error);
                loader.style.display = "none";
                error.style.display = "block";
            }
        });
    } catch (error) {
        // Помилка породи
        console.error("Error fetching cat breeds:", error);
        loader.style.display = "none";
        error.style.display = "block";
    }
}

// Call the function to retrieve the cat breeds
getCats();
