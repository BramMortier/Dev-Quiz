// ------------------------------------------- //
// module imports
import * as CONSTS from "./constants";
import * as GLOBALS from "./globals";
import { fetchQuiz } from "./fetchQuiz";
// ------------------------------------------- //

export let maxAmountOfQuestions = 20;
export let maxPossibleAnswers = 6;
let difficulty = "Easy";
let selectedTags = "";

// Quiz settings object
export const generateQuizSettings = () => {
    return {
        amountOfQuestions: Number(CONSTS.amountOfQuestions.children[1].innerText),
        possibleAnswers: Number(CONSTS.possibleAnswers.children[1].innerText),
        tipsOn: CONSTS.tipsAllowed.children[1].innerText === "off" ? false : true,
        timelimitOn: CONSTS.timelimitActivated.children[1].innerText === "off" ? false : true,
        difficulty: difficulty,
        tags: selectedTags,
    };
};

export const testQuizSettings = async () => {
    if ((await fetchQuiz()) == undefined) {
        resetQuizSettings();
        CONSTS.settingsError.style.display = "initial";
    } else {
        CONSTS.settingsError.style.display = "none";
    }
};

export const resetQuizSettings = () => {
    resetDifficulty();
    CONSTS.selectedTags.innerHTML = "";
    CONSTS.settingsError.style.display = "none";

    CONSTS.amountOfQuestions.children[1].innerText = 10;
    CONSTS.possibleAnswers.children[1].innerText = 4;
    CONSTS.tipsAllowed.children[1].innerText = "off";
    CONSTS.timelimitActivated.children[1].innerText = "off";
    difficulty = "Easy";
    selectedTags = "";

    GLOBALS.setQuizSettings(generateQuizSettings());
};

export const checkCounterValue = (currentValue, maxValue) => {
    if (currentValue == maxValue) return currentValue - 1;
    if (currentValue == 1) return currentValue + 1;
    return currentValue;
};

export const updateCounter = (event, counterMax) => {
    let settingValue = event.target.parentElement.children[1];
    let settingBtn = event.target;

    if (settingBtn.getAttribute("data-action") === "higher") {
        settingValue.innerText = checkCounterValue(Number(settingValue.innerText), counterMax) + 1;
    }

    if (settingBtn.getAttribute("data-action") === "lower") {
        settingValue.innerText = checkCounterValue(Number(settingValue.innerText), counterMax) - 1;
    }
};

export const updateToggle = (event) => {
    let toggleValue = event.target.parentElement.children[1];

    if (toggleValue.innerText === "off") {
        toggleValue.innerText = "on";
    } else {
        toggleValue.innerText = "off";
    }
};

export const updateDifficulty = (event) => {
    let targetBtn = event.target;
    difficulty = targetBtn.innerText;

    targetBtn.classList.remove("btn--secondary");
    targetBtn.classList.add("btn--primary");

    CONSTS.difficultyBtns.map((btn) => {
        if (btn.innerText !== targetBtn.innerText) {
            btn.classList.remove("btn--primary");
            btn.classList.add("btn--secondary");
        }
    });
};

export const resetDifficulty = () => {
    CONSTS.difficultyBtns.map((btn) => {
        btn.classList.remove("btn--primary");
        btn.classList.add("btn--secondary");

        if (btn.innerText === "Easy") {
            btn.classList.remove("btn--secondary");
            btn.classList.add("btn--primary");
        }
    });
};

export const updateTagResults = () => {
    let searchValue = CONSTS.tagSearchbar.value;
    let isResult = false;

    CONSTS.tagResults.innerHTML = "";

    CONSTS.tags.map((tag) => {
        if (tag.toLowerCase().includes(searchValue.toLowerCase()) && searchValue !== "") {
            let tagResultEl = document.createElement("div");
            tagResultEl.classList.add("settings__tag-result");
            tagResultEl.innerHTML = `${tag}`;

            tagResultEl.addEventListener("click", () => {
                addTag(tag);
            });

            CONSTS.tagResults.appendChild(tagResultEl);
            isResult = true;
        }
    });

    return isResult;
};

export const addTag = (tag) => {
    CONSTS.tagResults.style.display = "none";
    CONSTS.tagSearchbar.value = "";

    let selectedTagEl = document.createElement("div");
    selectedTagEl.classList.add("settings__selected-tag");
    selectedTagEl.innerHTML = `
        <p>${tag}</p>
        <img src="./src/images/icons/wrong.svg" alt="delete" />
    `;
    CONSTS.selectedTags.appendChild(selectedTagEl);

    updateSelectedTags();
};

export const updateSelectedTags = () => {
    let selectedTagsElArray = [...document.querySelectorAll(".settings__selected-tag")];

    selectedTags = selectedTagsElArray.map((tag) => {
        tag.children[1].addEventListener("click", () => {
            CONSTS.selectedTags.removeChild(tag);
            updateSelectedTags();
        });
        return tag.children[0].innerText;
    });

    if (selectedTags.length === 0) selectedTags = "";
};
