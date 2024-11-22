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
    "Please use the provided scale to rate how you perceive the voice assistant VA-A2 on different aspects, such as trustworthiness, reliability, and respect.\nWhen the evaluation is complete, click “submit” to continue."
];
const step0 = document.getElementById("step-0");
const stepInstructions = document.getElementById("step-instructions");
const stepInstructionsPage = document.getElementById("step-instructions");
const toStep1Btn = document.getElementById("to-step-1"); // 'Next' button on instructions page
const testAudioButton = document.getElementById("play-test-sound-btn"); // 音频测试按钮
const playTestSoundBtn = document.getElementById("play-test-sound-btn");
console.log(playTestSoundBtn);
const nextToStep2Btn = document.getElementById("next-to-step2-btn");
const testAudio = new Audio("assets/audio/模拟缩短.MP3"); // 替换为用户提供的文件路径
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
const initialsInput = document.getElementById("initials");
const randomNumberInput = document.getElementById("random-number");
const generateIdBtn = document.getElementById("generate-id-btn");
const generatedIdText = document.getElementById("generated-id");
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
document.addEventListener("DOMContentLoaded", () => {
    const contactCheckbox = document.getElementById("contact-checkbox");
    const contactInfo = document.getElementById("contact-info");
    const contactEmail = document.getElementById("contact-email");
    const submitContactBtn = document.getElementById("submit-contact-btn");
    const thankYouMessage = document.getElementById("thank-you-message");
    const toggleInfoBtn = document.getElementById("toggle-info-btn");
    const detailedInfo = document.getElementById("detailed-info");
    const consentForm = document.getElementById("participant-consent-form");
    const exitPage = document.getElementById("step-5"); // Assuming step-5 is the exit page
    const agreeBtn = document.getElementById("agree-btn");
    const disagreeBtn = document.getElementById("disagree-btn");
    const initialsInput = document.getElementById("initials");
    const randomNumberInput = document.getElementById("random-number");
    const generateIdBtn = document.getElementById("generate-id-btn");
    const generatedIdText = document.getElementById("generated-id");
    const toStepInstructionsBtn = document.getElementById("to-step-instructions");
    const step0 = document.getElementById("step-0");
    const stepInstructions = document.getElementById("step-instructions");

 // Toggle contact info input visibility when checkbox is checked
    contactCheckbox.addEventListener("change", () => {
        if (contactCheckbox.checked) {
            contactInfo.style.display = "block"; // 展示输入框和按钮
        } else {
            contactInfo.style.display = "none"; // 隐藏输入框和按钮
            contactEmail.value = ""; // 清空输入框内容
            submitContactBtn.disabled = true; // 禁用提交按钮
            thankYouMessage.style.display = "none"; // 隐藏感谢信息
        }
    });

    // Enable submit button if email input is filled
    contactEmail.addEventListener("input", () => {
        if (contactEmail.value.trim() !== "") {
            submitContactBtn.disabled = false;
            submitContactBtn.style.opacity = "1";
        } else {
            submitContactBtn.disabled = true;
            submitContactBtn.style.opacity = "0.5";
        }
    });

    // Handle submit button click
   submitContactBtn.addEventListener("click", () => {
        contactInfo.style.display = "none"; // 提交后隐藏输入框部分
        thankYouMessage.style.display = "block"; // 显示感谢消息
    });
// Toggle detailed information
    toggleInfoBtn.addEventListener("click", () => {
        if (detailedInfo.style.display === "none") {
            detailedInfo.style.display = "block";
            toggleInfoBtn.textContent = "Hide Details";
        } else {
            detailedInfo.style.display = "none";
            toggleInfoBtn.textContent = "Show Details";
        }
    });

 // Agree button logic: Transition to Step 0
    agreeBtn.addEventListener("click", () => {
        consentForm.classList.add("hidden"); // Hide the Consent Form
        step0.classList.remove("hidden"); // Show Step 0
        console.log("Navigated to Step 0."); // Debugging log
    });

 // Disagree button logic: Exit the study and navigate to Step 5
    disagreeBtn.addEventListener("click", () => {
        alert("You chose not to participate. Exiting the study.");
        consentForm.classList.add("hidden"); // Hide the Consent Form
        exitPage.classList.remove("hidden"); // Show Step 5 (Exit Page)
        console.log("Navigated to Exit Page (Step 5)."); // Debugging log
    });

    // Enable Generate ID button only when initials input is valid
    initialsInput.addEventListener("input", () => {
        const initials = initialsInput.value.trim();
        const isValid = initials.length === 2 && /^[A-Za-z]+$/.test(initials);
        generateIdBtn.disabled = !isValid; // Disable button if initials are not valid
    });

    // Generate ID logic
    generateIdBtn.addEventListener("click", () => {
        const initials = initialsInput.value.trim().toUpperCase();
        generatedIdText.textContent = `Your Participant ID: ${initials}`;
        generatedIdText.classList.remove("hidden"); // Show generated ID
        toStepInstructionsBtn.disabled = false; // Enable "Next" button
        toStepInstructionsBtn.style.opacity = "1"; // Visually activate the button
        console.log(`Generated ID: ${initials}`); // Debugging log
    });

    // Navigate to the Instructions page
    toStepInstructionsBtn.addEventListener("click", () => {
        step0.classList.add("hidden");
        stepInstructions.classList.remove("hidden"); // Show Instructions page
        console.log("Navigated to Instructions page."); // Debugging log
    });
});
// 初始状态禁用 Next 按钮
toStep1Btn.disabled = true;
toStep1Btn.style.opacity = "0.5";
// 初始化状态变量
let testAudioPlaying = false; // 是否正在播放音频
let testAudioPlayed = false; // 是否至少播放过一次音频

// 模拟音频播放逻辑（无资源）
playTestSoundBtn.addEventListener("click", () => {
    console.log("Play Test Sound button clicked."); // 调试日志

    if (!testAudioPlaying) {
        // 播放音频
        testAudio.play()
            .then(() => {
                testAudioPlaying = true; // 更新播放状态
                playTestSoundBtn.textContent = "Pause Test Sound"; // 更新按钮文本
                console.log("Audio is playing...");
            })
            .catch((error) => {
                console.error("Error playing audio:", error); // 捕获播放错误
            });
    } else {
        // 暂停音频
        testAudio.pause();
        testAudioPlaying = false; // 更新播放状态
        playTestSoundBtn.textContent = "Play Test Sound"; // 更新按钮文本
        console.log("Audio is paused.");
    }
});
// 音频播放结束逻辑
testAudio.onended = () => {
    console.log("Audio playback ended."); // 日志
    testAudioPlaying = false; // 重置播放状态
    playTestSoundBtn.textContent = "Play Test Sound"; // 重置按钮文本
    testAudioPlayed = true; // 标记音频已播放过一次
    enableNextButton(); // 启用 Next 按钮
};

// 启用 Next 按钮逻辑
function enableNextButton() {
    console.log("Enabling Next button...");
    toStep1Btn.disabled = false; // 启用按钮
    toStep1Btn.style.opacity = "1"; // 更新样式
}

// 禁用 Next 按钮（初始状态）
toStep1Btn.disabled = true;
toStep1Btn.style.opacity = "0.5";

// Next 按钮跳转逻辑
toStep1Btn.addEventListener("click", () => {
    console.log("Navigating to Step 1...");
    document.getElementById("step-instructions").classList.add("hidden"); // 隐藏当前页面
    document.getElementById("step-1").classList.remove("hidden"); // 显示 Step 1 页面
});
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
let slidersMoved = new Set(); // To track which sliders have been interacted with

sliders.forEach((slider) => {
    slider.addEventListener("input", () => {
        const valueDisplay = document.getElementById(`${slider.id}-value`);
        valueDisplay.textContent = slider.value; // Update the centered value dynamically

        // Add this slider to the set of moved sliders
        slidersMoved.add(slider.id);

        validateSliders(); // Validate sliders each time a value changes
    });
});

// Function to validate sliders and enable the submit button
function validateSliders() {
    // Check if at least one slider has been moved
    const allMoved = slidersMoved.size === sliders.length;

    // Enable or disable the submit button based on the sliders' state
    submitBtn.disabled = !allMoved;
    submitBtn.style.opacity = allMoved ? "1" : "0.5";
}

// Reset sliders for the next interaction
function resetSlidersForNextInteraction() {
    slidersMoved.clear(); // Clear the set of moved sliders

    sliders.forEach((slider) => {
        slider.value = "4"; // Reset to default value "4"
        const valueDisplay = document.getElementById(`${slider.id}-value`);
        valueDisplay.textContent = slider.value; // Update displayed value to reset
    });


    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.5";
}

// Submit and interaction logic
submitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (interactionCount < maxInteractions) {
        interactionCount++;

        // Reset step 4 and navigate back to step 3
        step4.classList.add("hidden");
        step3.classList.remove("hidden");
        playAudioForInteraction(); // Replay the next interaction audio
    } else if (interactionCount === maxInteractions) {
        // On the final (4th) submission, navigate directly to step 5
        showThankYouPage();
    }
});

// Function to display the Thank You page (step 5)
function showThankYouPage() {
    // Hide all other steps
    step1.classList.add("hidden");
    step2.classList.add("hidden");
    step3.classList.add("hidden");
    step4.classList.add("hidden");

    // Display step 5
    const step5 = document.getElementById("step-5");
    step5.classList.remove("hidden");

    console.log("Thank you page displayed."); // Debugging log
}
