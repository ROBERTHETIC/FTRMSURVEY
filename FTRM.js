let interactionCount = 1; // Current interaction count
const maxInteractions = 4; // Maximum number of interactions
const audioSources = [
    "assets/audio/female_us.MP3",
    "assets/audio/female_uk.MP3",
    "assets/audio/male_uk.MP3",
    "assets/audio/male_us.MP3",
];

// Playback instructions for each interaction
const playbackInstructions = [
    "The voice assistant VA-A1 is responding to your question. Please listen to the response below carefully, the audio will only be played once.",
    "The voice assistant VA-E1 is responding to your question. Please listen to the response below carefully, the audio will only be played once.",
    "The voice assistant VA-E2 is responding to your question. Please listen to the response below carefully, the audio will only be played once.",
    "The voice assistant VA-A2 is responding to your question. Please listen to the response below carefully, the audio will only be played once."
];
const evaluationInstructions = [
    "Please use the provided scale to rate how you perceive the voice assistant VA-A1 on different aspects, such as trustworthiness, reliability, and respect.\nWhen the evaluation is complete, click “submit” to continue.",
    "Please use the provided scale to rate how you perceive the voice assistant VA-E1 on different aspects, such as trustworthiness, reliability, and respect.\nWhen the evaluation is complete, click “submit” to continue.",
    "Please use the provided scale to rate how you perceive the voice assistant VA-E2 on different aspects, such as trustworthiness, reliability, and respect.\nWhen the evaluation is complete, click “submit” to continue.",
    "Please use the provided scale to rate how you perceive the voice assistant VA-A2 on different aspects, such as trustworthiness, reliability, and respect.\nWhen the evaluation is complete, click “submit” to continue.\nWhen you have completed all four evaluations, please click “complete”."
];
const step1 = document.getElementById("step-1");
const step2 = document.getElementById("step-2");
const step3 = document.getElementById("step-3");
const step4 = document.getElementById("step-4");
const toStep2Btn = document.getElementById("to-step-2");
const recordBtn = document.getElementById("record-btn");
const waveContainerRecording = document.getElementById("wave-container-recording");
const toStep4Btn = document.getElementById("to-step-4");
const waveContainerPlayback = document.getElementById("wave-container-playback");
const sliders = document.querySelectorAll("#step-4 input[type='range']");
let audioElement = null; // Dynamically created for playback
let isRecording = false;
let mediaRecorder;
let audioChunks = [];
// Create the evaluation instruction element if not already created
let evaluationInstructionElement = step4.querySelector(".evaluation-instruction");
if (!evaluationInstructionElement) {
    evaluationInstructionElement = document.createElement("p");
    evaluationInstructionElement.className = "evaluation-instruction";
    evaluationInstructionElement.style.textAlign = "center";
    evaluationInstructionElement.style.marginBottom = "20px";
    evaluationInstructionElement.style.fontSize = "16px";
    step4.insertBefore(evaluationInstructionElement, step4.querySelector("form"));
}
// Function to update evaluation instruction text
function updateEvaluationInstruction() {
    if (interactionCount <= evaluationInstructions.length) {
        evaluationInstructionElement.textContent = evaluationInstructions[interactionCount - 1];
    }
}
// Ensure the instruction is updated when entering Step 4
toStep4Btn.addEventListener("click", () => {
    document.getElementById("step-3").classList.add("hidden");
    step4.classList.remove("hidden"); // Show Step 4
    updateEvaluationInstruction(); // Update instruction
    resetSlidersForNextInteraction(); // Reset sliders
});
// Disable Complete button initially
const completeBtn = document.getElementById("complete-btn");
completeBtn.disabled = true;
completeBtn.style.opacity = "0.5";
completeBtn.classList.add("hidden");

// Step 1: Questionnaire Logic
const questionInputs = document.querySelectorAll("#step-1 input[type='radio']");
const openEndedInputs = document.querySelectorAll("#step-1 input[type='text']");
const questionnaireForm = document.getElementById("questionnaire");

// Disable Next button initially
toStep2Btn.disabled = true;
toStep2Btn.style.opacity = "0.5";

// Validate if all questions are answered
function validateQuestions() {
    const allAnswered = Array.from(questionnaireForm.querySelectorAll("ul")).every((ul) => {
        const radios = Array.from(ul.querySelectorAll("input[type='radio']"));
        const selectedRadio = radios.find((radio) => radio.checked);

        if (selectedRadio && selectedRadio.value === "other") {
            const otherInput = ul.querySelector("input[type='text']");
            return otherInput && otherInput.value.trim() !== "";
        }

        return !!selectedRadio; // Ensure a radio option is selected
    });

    // Enable the "Next" button if all questions are answered
    toStep2Btn.disabled = !allAnswered;
    toStep2Btn.style.opacity = allAnswered ? "1" : "0.5";
}

// Handle "Other" inputs logic
function handleOtherInput(radioGroupName, textInputName) {
    const radios = document.querySelectorAll(`input[name='${radioGroupName}']`);
    const textInput = document.querySelector(`input[name='${textInputName}']`);

    radios.forEach((radio) => {
        radio.addEventListener("change", () => {
            if (radio.value === "other") {
                textInput.disabled = false; // Enable the input field
                textInput.focus();
            } else {
                textInput.disabled = true; // Disable the input field
                textInput.value = ""; // Clear the text input
            }
            validateQuestions(); // Re-validate on radio selection change
        });
    });

    if (textInput) {
        textInput.addEventListener("input", validateQuestions); // Validate when text is entered
    }
}

// Attach "Other" logic handlers
handleOtherInput("assistant", "assistant-other");
handleOtherInput("accent", "accent-other");

// Attach listeners to question inputs
questionInputs.forEach((input) => {
    input.addEventListener("change", validateQuestions);
});

// Step 1: Handle Next Button Click
toStep2Btn.addEventListener("click", () => {
    if (!toStep2Btn.disabled) {
        step1.classList.add("hidden");
        step2.classList.remove("hidden");
        console.log("Step 2 displayed"); // 调试信息
    }
});

// Step 2: Recording Logic
recordBtn.addEventListener("click", async () => {
    if (!isRecording) {
        isRecording = true;
        recordBtn.textContent = "Finish";
        waveContainerRecording.classList.remove("hidden");

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.start();
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    } else {
        isRecording = false;
        recordBtn.textContent = "Start";
        waveContainerRecording.classList.add("hidden");

        if (mediaRecorder) {
            mediaRecorder.stop();
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
                const audioUrl = URL.createObjectURL(audioBlob);
                console.log("Recorded audio URL:", audioUrl);
            };
        }

        step2.classList.add("hidden");
        step3.classList.remove("hidden");
        playAudioForInteraction();
    }
});

// Step 3: Add dynamic playback instruction
const playbackInstructionElement = document.createElement("p");
playbackInstructionElement.className = "playback-instruction";
playbackInstructionElement.style.textAlign = "center";
playbackInstructionElement.style.marginBottom = "20px";
playbackInstructionElement.style.fontSize = "16px";
step3.insertBefore(playbackInstructionElement, waveContainerPlayback);

// Update the instruction text based on the current interaction count
function updatePlaybackInstruction() {
    if (interactionCount <= playbackInstructions.length) {
        playbackInstructionElement.textContent = playbackInstructions[interactionCount - 1];
    }
}

// Step 3: Audio Playback and Navigation
toStep4Btn.disabled = true;

toStep4Btn.addEventListener("click", () => {
    document.getElementById("step-3").classList.add("hidden");
    step4.classList.remove("hidden"); // 显示第四步
    resetSlidersForNextInteraction(); // 初始化滑块
});

// Play audio for interaction
function playAudioForInteraction() {
    updatePlaybackInstruction(); // Update the instruction before playing audio

    const audioSource = audioSources[interactionCount - 1]; // Get the correct audio source

    if (!audioSource) return;

    // Create or reset the audio element
    if (audioElement) {
        audioElement.pause();
        audioElement.remove();
    }

    audioElement = new Audio(audioSource);
    audioElement.volume = 1.0; // Ensure volume is at 100%
    audioElement.play();

    waveContainerPlayback.classList.remove("hidden");
    toStep4Btn.disabled = true;
    toStep4Btn.style.opacity = "0.5";

    audioElement.onended = () => {
        waveContainerPlayback.classList.add("hidden");
        toStep4Btn.disabled = false;
        toStep4Btn.style.opacity = "1";
    };

    audioElement.onerror = (e) => {
        console.error("Audio playback error:", e);
        waveContainerPlayback.classList.add("hidden");
        toStep4Btn.disabled = false;
        toStep4Btn.style.opacity = "1";
    };
}

// Step 4: Slider Validation Logic
const submitBtn = document.querySelector(".submit-btn");
submitBtn.disabled = true;
submitBtn.style.opacity = "0.5";

// Real-time slider value update and validation
sliders.forEach((slider) => {
    const valueDisplay = document.getElementById(`${slider.id}-value`);
    slider.addEventListener("input", () => {
        valueDisplay.textContent = slider.value;
        validateSliders();
    });
});

// Validate sliders
function validateSliders() {
    const allMoved = Array.from(sliders).every((slider) => slider.value !== slider.defaultValue);

    submitBtn.disabled = !allMoved;
    submitBtn.style.opacity = allMoved ? "1" : "0.5";
}

// Reset sliders for the next interaction
function resetSlidersForNextInteraction() {
    sliders.forEach((slider) => {
        slider.value = 4; // 默认值4
        document.getElementById(`${slider.id}-value`).textContent = slider.value;
    });

    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.5";
}

// Submit and interaction logic
submitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (interactionCount < maxInteractions) {
        interactionCount++;

        step4.classList.add("hidden");
        step3.classList.remove("hidden");
        playAudioForInteraction();
    } else if (interactionCount === maxInteractions) {
        submitBtn.classList.add("hidden");
        completeBtn.disabled = false;
        completeBtn.style.opacity = "1";
        completeBtn.classList.remove("hidden");
    }
});

// Complete button logic
completeBtn.addEventListener("click", () => {
    showThankYouPage();
});

// 获取第五页元素
const step5 = document.getElementById("step-5");

// 完成按钮逻辑，跳转到第五页
completeBtn.addEventListener("click", () => {
    // 隐藏所有页面
    step1.classList.add("hidden");
    step2.classList.add("hidden");
    step3.classList.add("hidden");
    step4.classList.add("hidden");

    // 显示第五页
    step5.classList.remove("hidden");
});

// 确保第五页的显示函数无重复
function showThankYouPage() {
    // 隐藏其他页面
    step1.classList.add("hidden");
    step2.classList.add("hidden");
    step3.classList.add("hidden");
    step4.classList.add("hidden");

    // 显示第五页
    step5.classList.remove("hidden");
}

// 替换多余的逻辑
completeBtn.addEventListener("click", showThankYouPage);
