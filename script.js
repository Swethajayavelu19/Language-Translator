 const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");

const sourceLang = document.getElementById("sourceLang");
const targetLang = document.getElementById("targetLang");

const translateBtn = document.getElementById("translateBtn");
const translateText = document.getElementById("translateText");

const loader = document.getElementById("loader");

const charCount = document.getElementById("charCount");

const swapBtn = document.getElementById("swapBtn");

const copyBtn = document.getElementById("copyBtn");

const speakBtn = document.getElementById("speakBtn");

const downloadBtn = document.getElementById("downloadBtn");

const voiceBtn = document.getElementById("voiceBtn");

const clearBtn = document.getElementById("clearBtn");

const historyList = document.getElementById("historyList");

const clearHistory = document.getElementById("clearHistory");

const themeToggle = document.getElementById("themeToggle");

const toast = document.getElementById("toast");



/* Character Counter */

inputText.addEventListener("input", () => {

    charCount.textContent =
        inputText.value.length + " Characters";

});


/* Toast Notification */

function showToast(message) {

    toast.innerText = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


/* Translate */

translateBtn.addEventListener("click", translateTextFunction);

async function translateTextFunction() {

    const text = inputText.value.trim();

    if(text === ""){

        showToast("Please enter text");
        return;
    }

    loader.classList.remove("hidden");
    translateText.innerText = "Translating...";

    try{

        const source = sourceLang.value;
        const target = targetLang.value;

        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`
        );

        const data = await response.json();

        let translated = data.responseData.translatedText;

        if(
            !translated ||
            translated.trim() === "" ||
            translated === text
        ){
            translated =
            "Translation not available for this sentence.";
        }

        outputText.value = translated;

        saveHistory(
            text,
            translated
        );

        showToast(
            "Translation Completed"
        );

    }
    catch(error){

        console.error(error);

        outputText.value =
        "Translation Failed";

        showToast(
            "Translation Failed"
        );
    }

    loader.classList.add("hidden");
    translateText.innerText =
    "Translate";
}


/* Swap Languages */

swapBtn.addEventListener("click", () => {

    let temp = sourceLang.value;

    sourceLang.value = targetLang.value;

    targetLang.value = temp;

});


/* Copy Translation */

copyBtn.addEventListener("click", () => {

    if(outputText.value==="") return;

    navigator.clipboard.writeText(
        outputText.value
    );

    showToast("Copied Successfully");

});


/* Speak Translation */

speakBtn.addEventListener("click", () => {

    if(outputText.value==="") return;

    let speech =
        new SpeechSynthesisUtterance(
            outputText.value
        );

    speech.lang = targetLang.value;

    window.speechSynthesis.speak(
        speech
    );

});


/* Voice Input */

voiceBtn.addEventListener("click", () => {

    if (!('webkitSpeechRecognition' in window)) {

        showToast("Voice Input Not Supported");

        return;
    }

    const recognition =
        new webkitSpeechRecognition();

    recognition.lang = "en-US";

    recognition.start();

    recognition.onresult = function(event) {

        inputText.value =
            event.results[0][0].transcript;

        charCount.textContent =
            inputText.value.length +
            " Characters";

        showToast("Voice Captured");

    };

});


/* Download TXT */

downloadBtn.addEventListener("click", () => {

    if(outputText.value==="") return;

    const blob =
        new Blob(
            [outputText.value],
            {type:"text/plain"}
        );

    const link =
        document.createElement("a");

    link.href =
        URL.createObjectURL(blob);

    link.download =
        "translation.txt";

    link.click();

    showToast("Download Started");

});


/* Clear Text */

clearBtn.addEventListener("click", () => {

    inputText.value = "";

    outputText.value = "";

    charCount.textContent =
        "0 Characters";

    showToast("Cleared");

});


/* History */

function saveHistory(input, output) {

    let history =
        JSON.parse(
            localStorage.getItem(
                "translations"
            )
        ) || [];

    history.unshift({

        input,
        output,
        time:new Date()
            .toLocaleString()

    });

    localStorage.setItem(
        "translations",
        JSON.stringify(history)
    );

    loadHistory();
}


function loadHistory() {

    historyList.innerHTML = "";

    let history =
        JSON.parse(
            localStorage.getItem(
                "translations"
            )
        ) || [];

    history.forEach(item => {

        const div =
            document.createElement("div");

        div.className =
            "history-item";

        div.innerHTML =

        `
        <p><strong>Input:</strong>
        ${item.input}</p>

        <p><strong>Output:</strong>
        ${item.output}</p>

        <p><small>
        ${item.time}
        </small></p>
        `;

        historyList.appendChild(div);

    });

}


clearHistory.addEventListener("click", () => {

    localStorage.removeItem(
        "translations"
    );

    loadHistory();

    showToast("History Cleared");

});


loadHistory();


/* Dark Mode */

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle(
        "dark-mode"
    );

    let icon =
        themeToggle.querySelector("i");

    if(document.body.classList
        .contains("dark-mode")) {

        icon.className =
            "fa-solid fa-sun";

    }

    else {

        icon.className =
            "fa-solid fa-moon";
    }

});


/* Enter Key Translate */

inputText.addEventListener(
"keydown",
function(e){

    if(e.ctrlKey &&
       e.key==="Enter") {

        translateTextFunction();
    }

});