let messageCount = 0;

const messages = [
  "I miss you - EX",
  "Take the chicken out of the freezer - MOM",
  "Come out for dinner - Friend",
  "Hop on Fortnite - Friend",
];

const quickReplies = [
  "Got it!",
  "On my way.",
  "Can't talk now, sorry.",
  "Talk later?",
];

function getRandomMessage() {
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

function handleQuickReply(reply, toastElement) {
  toastElement.querySelector(
    ".toast-body"
  ).textContent = `You replied: "${reply}"`;
  setTimeout(() => {
    toastElement.remove();
  }, 3000);
}

function showToast() {
  if (messageCount >= 3) {
    clearInterval(intervalId);
    return;
  }

  const message = getRandomMessage();
  const toastContainer = document.getElementById("toastContainer");
  const toastHtml = `
      <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-header">
              <strong>Text Message</strong>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body">
              ${message}
              <hr>
              <div class="quick-reply-menu">
                ${quickReplies
                  .map(
                    (reply) =>
                      `<button type="button" class="btn btn-sm btn-outline-primary quick-reply-btn">${reply}</button>`
                  )
                  .join("")}
              </div>
          </div>
      </div>
    `;

  toastContainer.insertAdjacentHTML("beforeend", toastHtml);

  const latestToastEl = toastContainer.lastElementChild;
  const toast = new bootstrap.Toast(latestToastEl, { autohide: false });

  latestToastEl.querySelectorAll(".quick-reply-btn").forEach((button) => {
    button.addEventListener("click", () =>
      handleQuickReply(button.textContent, latestToastEl)
    );
  });

  toast.show();
  messageCount++;
}

const intervalId = setInterval(showToast, 5000);

let isCallActive = false;

function handleCallAction(action, toastElement) {
  if (action === "Answer") {
    toastElement.querySelector(".call-toast-body").innerHTML = `
      <div>Call in progress...</div>
      <button type="button" class="btn btn-sm btn-danger call-action-btn">End Call</button>
    `;

    toastElement
      .querySelector(".call-action-btn")
      .addEventListener("click", () =>
        handleCallAction("End Call", toastElement)
      );
  } else if (action === "End Call") {
    toastElement.remove();
    isCallActive = false;
  }
}

function showCallToast() {
  if (isCallActive) {
    return;
  }

  isCallActive = true;

  const callContainer = document.getElementById("callContainer");
  const callHtml = `
    <div class="call-toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="call-toast-header">
            <strong>Incoming Call</strong>
        </div>
        <div class="call-toast-body">
            <button type="button" class="btn btn-sm btn-success call-action-btn">Answer</button>
            <button type="button" class="btn btn-sm btn-danger call-action-btn" style="display: none;">End Call</button>
        </div>
    </div>
  `;

  callContainer.insertAdjacentHTML("beforeend", callHtml);

  const latestCallEl = callContainer.lastElementChild;

  latestCallEl.querySelectorAll(".call-action-btn").forEach((button) => {
    button.addEventListener("click", () =>
      handleCallAction(button.textContent, latestCallEl)
    );
  });

  setTimeout(() => {
    if (latestCallEl && latestCallEl.parentNode) {
      latestCallEl.remove();
      isCallActive = false;
    }
  }, 10000);
}

setInterval(showCallToast, 10000);