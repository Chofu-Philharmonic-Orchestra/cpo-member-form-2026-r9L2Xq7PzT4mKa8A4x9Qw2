// 1) GASをウェブアプリとして公開したあと、発行されたURLをここに貼り付けてください。
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
  return PARTS.map(p => `<option value="${p}">${p}</option>`).join("");
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
      <div><h2>${formInfo[kind].title}</h2>${kind === "join" ? "" : "<p>必要事項を入力のうえ、送信ボタンを押してください。</p>"}</div>
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
  <strong>入団にあたって</strong>
  <p>調布フィルハーモニー管弦楽団へようこそ！<br>
  入力前に、下記の内容をご確認ください。</p>

  <ul>
    <li>調フィルの練習は基本的に毎週土曜日の18:30〜21:00です。<br>
    遅刻、欠席等の連絡については、パートリーダーにご確認ください。</li>

    <li>練習予定や練習場所はメールでお知らせします。<br>
    「ML登録」にチェックをつけたメールアドレスに、all@cpo.jpn.orgからメールが届きます。<br>
    迷惑メール対策をされている場合は、ご注意下さい。</li>

    <li>お知らせ済みの練習予定、団の規定などはホームページ
    (<a href="http://cpo.jpn.org/" target="_blank" rel="noopener noreferrer">http://cpo.jpn.org/</a>)
    の団員ページに載っていますので、必ずお読み下さい。<br>
    （パスワードはパートリーダーから聞いて下さい）</li>

    <li>調フィルでは、団員全員に活動費のご負担をお願いしています。<br>
    入団金：2,000円<br>
    団費：毎月3,000円（学生は2,000円）<br>
    演奏会費：演奏会ごとに約20,000円（学生は半額）<br>
    <span class="note">※入団金と団費は、専用の団費袋に入れて会計係までお願いします。</span><br>
    <span class="note">※団費は、入団月翌月から退団月まで発生します。</span><br>
    <span class="note">（休団の制度もあります。詳しくはパートリーダーまで）</span><br>
    <span class="note">※演奏会費は、演奏会ごとに変わります。</span></li>

    <li>調フィルでは、団員全員になんらかの係の分担をお願いしています。<br>
    ご協力お願いします。</li>

    <li>以上ご了承いただけましたら、必要事項を入力いただき、送信ボタンを押してください。<br>
    なお、入力された内容は名簿（現在非公開）に掲載され、主に緊急時などの連絡に使用します。</li>
  </ul>

  <p><strong>入力にあたり下記ご注意ください</strong></p>

  <ul>
    <li>電話番号は連絡のつく番号を入力してください。固定電話も携帯電話も複数可。<br>
    複数入力する場合は、スペースで区切ってください。</li>

    <li>メールアドレスは連絡のつくアドレスを記入してください。<br>
    メーリングリストに登録するアドレスは「ML登録」にチェックしてください。</li>

    <li>入団年月はパートリーダーと相談して決めてください。</li>
  </ul>
</div>
    <div class="form-grid">
      <div class="field date-field"><label>届け出日<span class="required">必須</span></label><input type="date" name="submitDate" value="${today()}" required></div>
      <div class="field"><label>パート<span class="required">必須</span></label><select name="part" required>${partOptions()}</select></div>
      <div class="field"><label>氏名（漢字）<span class="required">必須</span></label><input name="name" required></div>
      <div class="field"><label>氏名（かな）<span class="required">必須</span></label><input name="kana" required></div>
      <div class="field"><label>区分<span class="required">必須</span></label><select name="memberClass" required><option value="社会人">社会人</option><option value="学生">学生</option></select></div>
      <div class="field"><label>電話番号<span class="required">必須</span></label><input name="phone" required></div>
      <div class="field full"><label>メールアドレス1<span class="required">必須</span></label><div class="email-row"><input type="email" name="email1" required><label class="check"><input type="checkbox" name="ml1" value="登録希望">ML登録</label></div></div>
      <div class="field full"><label>メールアドレス2</label><div class="email-row"><input type="email" name="email2"><label class="check"><input type="checkbox" name="ml2" value="登録希望">ML登録</label></div></div>
      <div class="field"><label>郵便番号<span class="required">必須</span></label><input name="zip" placeholder="182-0000" required></div>
      <div class="field full"><label>住所<span class="required">必須</span></label><input name="address" required></div>
      <div class="field"><label>入団年月<span class="required">必須</span></label><input type="month" name="joinMonth" required></div>
      <div class="field full"><label>備考</label><textarea name="notes"></textarea></div>
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
      <select name="leaveYear" required>
        ${yearOptions()}
      </select>
      <span>年</span>
      <select name="leaveSeason" required>
        <option value="">選択</option>
        <option value="春">春</option>
        <option value="冬">冬</option>
      </select>
      <span>演奏会まで</span>
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
    </div>`;
}

function submitForm(e) {
  e.preventDefault();
  window.currentForm = e.target;

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

  if (data.leaveYear && data.leaveSeason) {
  data.leavePeriod = `${data.leaveYear}年${data.leaveSeason}演奏会まで`;
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

function yearOptions() {
  const current = new Date().getFullYear();
  let options = '<option value="">選択</option>';
  for (let i = 0; i < 10; i++) {
    const y = current + i;
    options += `<option value="${y}">${y}</option>`;
  }
  return options;
}
