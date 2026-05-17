const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyB4Ti2rWL8FG-IIRJGFsJP8QH3CgzxTzbyKLUjHyjCtxGhg6Xy5Ci6C3ohpia9AqCopQ/exec";

const PARTS = ["Vn", "Va", "Vc", "Cb", "Fl", "Ob", "Cl", "Fg", "Hr", "Trp", "Trb", "Tuba", "Perc", "その他"];

const formInfo = {
  join: { title: "入団届", type: "入団届" },
  leave: { title: "休団届", type: "休団届" },
  return: { title: "復団届", type: "復団届" },
  quit: { title: "退団届", type: "退団届" }
};

const home = document.getElementById("home");
const formArea = document.getElementById("formArea");
const postForm = document.getElementById("postForm");

home.addEventListener("click", (e) => {
  const button = e.target.closest("[data-form]");
  if (!button) return;
  showForm(button.dataset.form);
});

function partOptions() {
  return `<option value="" selected disabled>選択してください</option>` +
    PARTS.map(p => `<option value="${p}">${p}</option>`).join("");
}

function today() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function showForm(kind) {
  const commonHeader = `
    <div class="form-header">
      <div><h2>${formInfo[kind].title}</h2><p>必要事項を入力のうえ、送信ボタンを押してください。</p></div>
      <button type="button" class="back-button" onclick="goHome()">← 選択画面に戻る</button>
    </div>`;

  let body = "";
  if (kind === "join") body = joinFields();
  if (kind === "leave") body = leaveFields();
  if (kind === "return") body = returnFields();
  if (kind === "quit") body = quitFields();

  formArea.innerHTML = `${commonHeader}<form id="memberForm">${body}<input type="hidden" name="type" value="${formInfo[kind].type}"><div class="actions"><button class="submit-button" type="submit">送信</button><span id="status" class="status"></span></div></form>`;
  home.classList.add("hidden");
  formArea.classList.remove("hidden");
  document.getElementById("memberForm").addEventListener("submit", submitForm);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function joinFields() {
  return `
    <div class="notice">
      <strong>入団届について</strong>
      <ul>
        <li>入団希望の方の名前とメールアドレスを入力してください。</li>
        <li>入力したメールアドレスに、入団届出フォームのURLが記載されたメールが送信されます。</li>
      </ul>
    </div>

    <div class="form-grid">
      <div class="field full">
        <label>名前<span class="required">必須</span></label>
        <input name="name" required>
      </div>

      <div class="field full">
        <label>メールアドレス<span class="required">必須</span></label>
        <input type="email" name="email1" required>
      </div>
    </div>`;
}

function leaveFields() {
  return `
    <div class="notice"><strong>休団届の注意事項</strong><ul><li>休団は演奏会単位です。</li><li>休団による団費支払い免除は、「演奏会を含む月の翌月」から「その次の演奏会を含む月」までです。</li><li>休団中に復団する場合は、復団届を提出してください。</li>
    <li>休団期間終了時は自動的に復団となります。<br>次シーズンも続けて休団する場合は、改めて休団届を提出してください。</li></ul></div>
    ${simpleFields("leave")}
    <div class="form-grid">
  <div class="field full">
    <label>休団期間<span class="required">必須</span></label>
    <div class="leave-period-row">
  <input type="date" name="leaveStartDate" class="leave-start-date" required>
  <span>から次回演奏会まで</span>
</div>
  </div>
</div>`;
}

function returnFields() {
  return `
    <div class="notice"><strong>復団届の注意事項</strong><ul><li>休団中に復団届を提出すると、休団を取り消した扱いになります。<br>このため、団費の支払い免除も無効となり、前回演奏会の翌月からの団費が発生します。</li>
    <li>休団期間終了時は復団届の提出は不要です。</li></ul></div>
    ${simpleFields("return")}`;
}

function quitFields() {
  return simpleFields("quit");
}

function simpleFields(kind) {
  return `
    <div class="form-grid">
      <div class="field date-field"><label>届け出日<span class="required">必須</span></label><input type="date" name="submitDate" value="${today()}" required></div>
      <div class="field"><label>パート<span class="required">必須</span></label><select name="part" required>${partOptions()}</select></div>
      <div class="field full"><label>名前<span class="required">必須</span></label><input name="name" required></div>
      <div class="field full"><label>メールアドレス<span class="required">必須</span></label><input type="email" name="email1" required></div>
    </div>`;
}

function submitForm(e) {
  e.preventDefault();

  const form = e.target;
  const status = document.getElementById("status");

  if (status) {
    status.textContent = "";
    status.classList.remove("error");
  }

  const type = form.querySelector('input[name="type"]').value;

  window.currentForm = form;

  document.getElementById("confirmView").classList.remove("hidden");
  document.getElementById("loadingView").classList.add("hidden");
  document.getElementById("completeView").classList.add("hidden");

  document.getElementById("submitModal").classList.remove("hidden");
}

function goHome() {
  document.getElementById("submitModal").classList.add("hidden");

  formArea.classList.add("hidden");
  home.classList.remove("hidden");
  formArea.innerHTML = "";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function closeModal() {
  document.getElementById("submitModal").classList.add("hidden");
}

function confirmSubmit() {
  document.getElementById("confirmView").classList.add("hidden");
  document.getElementById("loadingView").classList.remove("hidden");
  document.getElementById("completeView").classList.add("hidden");

  const form = window.currentForm;
  const data = Object.fromEntries(new FormData(form).entries());
  data.sentAt = new Date().toLocaleString("ja-JP");

  if (data.leaveStartDate) {
  data.leavePeriod = `${data.leaveStartDate}から次回演奏会まで`;
}

  postForm.innerHTML = "";
  postForm.action = GAS_WEB_APP_URL;

  Object.entries(data).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    postForm.appendChild(input);
  });

  postForm.submit();

  setTimeout(() => {
    document.getElementById("loadingView").classList.add("hidden");
    document.getElementById("completeView").classList.remove("hidden");
    form.reset();
  }, 1500);
}
