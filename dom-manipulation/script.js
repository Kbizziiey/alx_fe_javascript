const quotes = JSON.parse(localStorage.getItem("quotes")) || [
  {
    text: "The journey doesn’t begin when you're ready—it begins when you start.",
    category: "Motivation",
  },
  {
    text: "Growth starts the moment you choose discipline over comfort.",
    category: "Self-Improvement",
  },
  {
    text: "You don’t have to be loud to be heard—clarity carries further than noise.",
    category: "Wisdom",
  },
  {
    text: "True creativity lies in showing the world what only you can see.",
    category: "Creativity",
  },
  {
    text: "Perfection is the enemy of momentum—choose progress every time.",
    category: "Productivity",
  },
];

const showQuotesBtn = document.getElementById("newQuote");
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");

window.addEventListener("DOMContentLoaded", () => {
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const parsed = JSON.parse(lastQuote);
    quoteDisplay.innerHTML = `Quote: ${parsed.text} <br/>
     Category: ${parsed.category}`;
  }
}); // This loads the last viewed quote from sessionStorage if it exists

const showRandomQuote = () => {
  showQuotesBtn.addEventListener("click", () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

    quoteDisplay.innerHTML = `Quote: ${randomQuote.text} <br/>
     Category: ${randomQuote.category}`;

    sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
  });
}; // Displays the random qoute

showRandomQuote();

const createAddQuoteForm = () => {}; // Has to create form

const saveQuotes = () => {
  localStorage.setItem("quotes", JSON.stringify(quotes));
};

const addQuotes = () => {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    // localStorage.setItem("quotes", JSON.stringify(quotes));

    saveQuotes();

    quoteDisplay.innerText = `Quote: ${newQuote.text} \nCategory: ${newQuote.category}`;
    sessionStorage.setItem("lastQuote", JSON.stringify(newQuote));

    const exists = [...categoryFilter.options].some(
      (option) => option.value.toLowerCase() === category.toLowerCase()
    );

    if (!exists) {
      const newOption = document.createElement("option");
      newOption.value = category;
      newOption.textContent = category;
      categoryFilter.appendChild(newOption);
    }

    alert("Quote Added!");
    textInput.value = "";
    categoryInput.value = "";

    categoryFilter.value = category;
    localStorage.setItem("lastSelectedCategory", category);
    filterQuotes();
  } else {
    alert("Please enter both the quote and category");
  }

  filterQuotes();
}; // Adds a new qoute

const importFromJsonFile = (event) => {
  const fileReader = new FileReader();
  fileReader.onload = (event) => {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert(`Quotes imported successfully!`);
      } else {
        alert(`Invalid file format: JSON should be an array of quotes.`);
      }
    } catch (err) {
      alert(`Failed to parse JSON file. Please check the file format.`);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}; // Imports quotes to JSON file

const exportToJsonFile = () => {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "quotes_export.json";

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}; // Exports quotes to JSON file

document
  .getElementById("exportJSON")
  .addEventListener("click", exportToJsonFile);

const populateCategories = () => {
  const uniqueCategories = [...new Set(quotes.map((quote) => quote.category))];
  const savedCategory = localStorage.getItem("lastSelectedCategory");

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  uniqueCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  if (
    savedCategory &&
    document.querySelector(`#categoryFilter option[value="${savedCategory}"]`)
  ) {
    categoryFilter.value = savedCategory;
  } else {
    categoryFilter.value = "all";
  }
}; // This populates the select element with quote categories and sets the previously selected value

window.addEventListener("DOMContentLoaded", () => populateCategories());

const filterQuotes = () => {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastSelectedCategory", selectedCategory);

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  const filteredQuotes = selectedCategory
    ? quotes.filter((quote) => quote.category === selectedCategory)
    : quotes;

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerText = `No quotes found for this category.`;
    return;
  }

  filteredQuotes.forEach((quote) => {
    const quoteElement = document.createElement("p");
    quoteElement.innerText = `Quote: ${quote.text} \nCategory: ${quote.category}`;
    quoteDisplay.appendChild(quoteElement);
  });
}; // This updates the displayed quotes based on the selected category and stores the last selected category

filterQuotes();
