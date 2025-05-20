const inputMessage = document.getElementById('inputMessage');
const charCount = document.getElementById('charCount');
const saltKeyInput = document.getElementById('saltKey');
const encryptBtn = document.getElementById('encryptBtn');
const decryptBtn = document.getElementById('decryptBtn');
const encryptedMessage = document.getElementById('encryptedMessage');
const decryptedMessage = document.getElementById('decryptedMessage');
const copyEncryptedBtn = document.getElementById('copyEncryptedBtn');
const copyDecryptedBtn = document.getElementById('copyDecryptedBtn');

const secretKey = "ChuoiBiMatAesCoDinh123";

inputMessage.addEventListener('input', function() {
  const len = inputMessage.value.length;
  charCount.textContent = `${len}/3000 ký tự`;
  if (len >= 3000) {
    charCount.classList.add('text-warning');
  } else {
    charCount.classList.remove('text-warning');
  }
});

function getFinalKey() {
  const salt = saltKeyInput.value.trim();
  return CryptoJS.SHA256(secretKey + salt).toString();
}

encryptBtn.addEventListener('click', function() {
  const message = inputMessage.value;
  if (!message) {
    alert('Vui lòng nhập tin nhắn cần mã hóa.');
    return;
  }
  const finalKey = getFinalKey();
  const encrypted = CryptoJS.AES.encrypt(message, finalKey).toString();
  showOutput(encryptedMessage, encrypted);
  decryptedMessage.value = '';
});

decryptBtn.addEventListener('click', function() {
  const cipher = inputMessage.value;
  if (!cipher) {
    alert('Vui lòng nhập tin nhắn cần giải mã.');
    return;
  }
  const finalKey = getFinalKey();
  try {
    const bytes = CryptoJS.AES.decrypt(cipher, finalKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalText) throw new Error();
    showOutput(decryptedMessage, originalText);
  } catch (e) {
    alert('Không giải mã được tin nhắn (sai khóa phụ hoặc định dạng dữ liệu).');
  }
});

copyEncryptedBtn.addEventListener('click', function() {
  if (encryptedMessage.value) {
    navigator.clipboard.writeText(encryptedMessage.value);
    alert('Đã sao chép tin nhắn đã mã hóa!');
  }
});

copyDecryptedBtn.addEventListener('click', function() {
  if (decryptedMessage.value) {
    navigator.clipboard.writeText(decryptedMessage.value);
    alert('Đã sao chép tin nhắn đã giải mã!');
  }
});

function showOutput(element, text) {
  element.value = '';
  element.classList.remove('fade-in');
  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      element.value += text.charAt(i);
      i++;
    } else {
      clearInterval(interval);
      element.classList.add('fade-in');
    }
  }, 15);
}
