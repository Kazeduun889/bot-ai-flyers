const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
  tg.MainButton.setParams({ text: "Отправить", is_visible: false });
}

const el = (id) => document.getElementById(id);
const modeSel = el("mode");
const textEl = el("text");
const promptEl = el("prompt");
const sendChatBtn = el("sendChat");
const sendImageBtn = el("sendImage");

function sendData(payload) {
  try {
    const json = JSON.stringify(payload);
    tg?.sendData(json);
  } catch (e) {
    console.error("sendData error", e);
    alert("Ошибка отправки данных в бот");
  }
}

sendChatBtn.addEventListener("click", () => {
  const text = textEl.value.trim();
  const mode = modeSel.value;
  if (!text) {
    alert("Введите сообщение");
    return;
  }
  sendData({ type: "chat", text, mode });
  tg?.HapticFeedback?.impactOccurred("light");
  if (tg) tg.MainButton.show();
  tg?.MainButton.setParams({ text: "Отправлено" });
  setTimeout(() => tg?.MainButton.hide(), 1500);
});

sendImageBtn.addEventListener("click", async () => {
  const prompt = promptEl.value.trim();
  if (!prompt) {
    alert("Введите описание изображения");
    return;
  }
  const status = document.getElementById("imgStatus");
  const img = document.getElementById("imgPreview");
  status.textContent = "Генерация...";
  img.style.display = "none";
  try {
    const q = encodeURIComponent(prompt);
    const url = `https://image.pollinations.ai/prompt/${q}?n=1&size=1024`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Bad response");
    const blob = await res.blob();
    const objUrl = URL.createObjectURL(blob);
    img.src = objUrl;
    img.style.display = "block";
    status.textContent = "Готово ✅";
    sendData({ type: "imagine", prompt });
    tg?.HapticFeedback?.impactOccurred("heavy");
  } catch (e) {
    console.error(e);
    status.textContent = "Не удалось сгенерировать";
  }
});
