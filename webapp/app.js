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
  tg?.close();
});

sendImageBtn.addEventListener("click", () => {
  const prompt = promptEl.value.trim();
  if (!prompt) {
    alert("Введите описание изображения");
    return;
  }
  sendData({ type: "imagine", prompt });
  tg?.close();
});

