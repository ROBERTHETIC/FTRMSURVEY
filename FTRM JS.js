let interactionCount = 1; // 当前交互次数
const maxInteractions = 4; // 最大交互次数
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

let isRecording = false;
let mediaRecorder;
let audioChunks = [];

// 禁用 Complete 按钮并隐藏
const completeBtn = document.getElementById("complete-btn");
completeBtn.disabled = true;
completeBtn.style.opacity = "0.5";
completeBtn.classList.add("hidden");

// 第一步逻辑：验证问卷
const questionInputs = document.querySelectorAll("#step-1 input[type='radio']");
const questionnaireForm = document.getElementById("step-1");

// 禁用 Next 按钮初始状态
toStep2Btn.disabled = true;
toStep2Btn.style.opacity = "0.5";

// 检查是否所有问题都有选项被选中
function validateQuestions() {
    const questions = Array.from(questionnaireForm.querySelectorAll("ul"));
    const allAnswered = questions.every((ul) => {
        return Array.from(ul.querySelectorAll("input[type='radio']")).some((radio) => radio.checked);
    });

    toStep2Btn.disabled = !allAnswered;
    toStep2Btn.style.opacity = allAnswered ? "1" : "0.5";
}

// 为每个问题选项添加事件监听器
questionInputs.forEach((input) => {
    input.addEventListener("change", validateQuestions);
});

// 跳转到 Step 2
toStep2Btn.addEventListener("click", () => {
    step1.classList.add("hidden");
    step2.classList.remove("hidden");
});

// 第二页录音逻辑：Start/Stop Recording
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

// 第三页逻辑：音频播放与导航
toStep4Btn.disabled = true;

toStep4Btn.addEventListener("click", () => {
    step3.classList.add("hidden");
    step4.classList.remove("hidden");

    resetSlidersForNextInteraction();
});

// 播放音频
function playAudioForInteraction() {
    waveContainerPlayback.classList.remove("hidden");

    toStep4Btn.disabled = true;
    toStep4Btn.style.opacity = "0.5";

    setTimeout(() => {
        waveContainerPlayback.classList.add("hidden");

        toStep4Btn.disabled = false;
        toStep4Btn.style.opacity = "1";
    }, 3000);
}

// 第四页逻辑：滑块验证
const submitBtn = document.querySelector(".submit-btn");

// 初始化 Submit 按钮为禁用状态
submitBtn.disabled = true;
submitBtn.style.opacity = "0.5";

// 检查所有滑块是否已移动
function validateSliders() {
    const allMoved = Array.from(sliders).every((slider) => slider.value !== slider.defaultValue);

    submitBtn.disabled = !allMoved;
    submitBtn.style.opacity = allMoved ? "1" : "0.5";
}

// 为每个滑块添加事件监听器
sliders.forEach((slider) => {
    slider.addEventListener("input", validateSliders);
});

// 重置滑块和 Submit 按钮
function resetSlidersForNextInteraction() {
    sliders.forEach((slider) => {
        slider.value = slider.defaultValue;
    });

    // 禁用 Submit 按钮
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.5";
}

// 提交和交互逻辑
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

// 完成按钮点击事件
completeBtn.addEventListener("click", () => {
    step4.classList.add("hidden");
    showThankYouPage();
});

// 显示感谢页面
function showThankYouPage() {
    const thankYouPage = document.createElement("div");
    thankYouPage.className = "container";
    thankYouPage.innerHTML = `
        <h1>Thank you for your participation</h1>
    `;
    document.body.innerHTML = "";
    document.body.appendChild(thankYouPage);
}

