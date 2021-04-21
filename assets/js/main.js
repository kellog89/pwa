window.innerWidth = window.outerWidth;

// constants
let deferredPrompt; // Allows to show the install prompt
const installButton = document.getElementById("install_button");
const termsAndConditionsCheckbox = document.querySelector(
	"#termsAndConditionsCheckbox"
);
const notificationsPermissionCheckbox = document.querySelector(
	"#notificationsPermissionCheckbox"
);
const startChattingButton = document.querySelector("#startChattingButton");
const nameInput = document.querySelector("#nameInput");
const welcomeScreen = document.querySelector(".welcomeScreen");
const chatScreen = document.querySelector(".chatScreen");
const navLinks = document.querySelector("#links");
const logoutButton = document.querySelector("#logout");
const sendMessageButton = document.querySelector("#sendMessage");
const messageContent = document.querySelector("#messageContent");
const logsScreen = document.querySelector(".log");

// functions
const initiateLoggedIn = () => {
	welcomeScreen.style.display = "none";
	navLinks.style.display = "flex";
	chatScreen.style.display = "grid";
};

const initiateLoggedOut = () => {
	welcomeScreen.style.display = "block";
	navLinks.style.display = "none";
	chatScreen.style.display = "none";
};

const registerUser = async (evt) => {
	evt.preventDefault();

	if (!nameInput.value) {
		alert("You must enter a name");
		return;
	}

	if (!termsAndConditionsCheckbox.checked) {
		alert("You must accept the terms and conditions");
		return;
	}

	try {
		if (notificationsPermissionCheckbox.checked) {
			await Notification.requestPermission((permission) => {
				if (permission === "granted") {
					location.reload();
				} else {
					location.reload();
				}
			});
			localStorage.setItem(
				"hasApprovedNotifications",
				JSON.stringify(true)
			);
		} else {
			localStorage.setItem(
				"hasApprovedNotifications",
				JSON.stringify(false)
			);
		}

		const data = { isLoggedIn: true, name: nameInput.value };

		localStorage.setItem("user", JSON.stringify(data));
	} catch (error) {
		console.log(error);
	}
};

const logoutUser = () => {
	localStorage.removeItem("user");
	location.reload();
	initiateLoggedOut();
};

const loadSettings = () => {
// check network status 
	handleNetworkChange();

	populateMessages();

	if (JSON.parse(localStorage.getItem("user"))) {
		initiateLoggedIn();
		return;
	}

	initiateLoggedOut();
};

const createMessageTemplate = (message) => {
	console.log(message.author, JSON.parse(localStorage.getItem("user")).name);

	const isCurrentAuthor =
		message.author === JSON.parse(localStorage.getItem("user")).name;
	return `
	<div class="message" style="justify-content: ${
		isCurrentAuthor ? "flex-end" : "flex-start"
	}">
	<div class="messageContent">
	<div class="img" style="order: ${isCurrentAuthor ? "2" : "unset"}">
	${message.author.slice(0, 2)}
	</div>
	<div class="content">
	<div class="time" style="text-align: ${isCurrentAuthor ? "right" : "left"}">
	${message.timestamp}
	</div>
	<div class="text">
	${message.content} 
	</div>
	</div>
	</div>
	</div>
	`;
};

const populateMessages = () => {
	const messages = JSON.parse(localStorage.getItem("logs")) || [];

	if (JSON.parse(localStorage.getItem("user")))
		messages.reverse().forEach((message) => {
			logsScreen.innerHTML += createMessageTemplate(message);
		});
};

const sendMessage = () => {
	if (!messageContent.value) {
		alert("Cannot send empty message");
		return;
	}

	const loggedInUser = JSON.parse(localStorage.getItem("user"));
	const logs = JSON.parse(localStorage.getItem("logs")) || [];

	const message = {
		timestamp: new Date().toLocaleTimeString("fr-FR"),
		content: messageContent.value,
		author: loggedInUser.name,
	};

	const updatedLogs = [...logs, message];

	logsScreen.innerHTML =
		createMessageTemplate(message) + logsScreen.innerHTML;

	localStorage.setItem("logs", JSON.stringify(updatedLogs));

	const hasApprovedNotifications =
		JSON.parse(localStorage.getItem("hasApprovedNotifications")) || false;

	if (Notification.permission === "granted" && hasApprovedNotifications) {
		new Notification("New Message", {
			title: "Chatty",
			body: message.content,
			icon: "./assets/images/logo/logo-192.png",
			vibrate: [100, 50, 100],
			timestamp: message.timestamp,
		});
	}

	messageContent.value = "";
};

const installApp = () => {
	// Show the prompt
	deferredPrompt.prompt();
	installButton.disabled = true;

	// Wait for the user to respond to the prompt
	deferredPrompt.userChoice.then((choiceResult) => {
		if (choiceResult.outcome === "accepted") {
			console.log("PWA setup accepted");
			installButton.hidden = true;
		} else {
			console.log("PWA setup rejected");
		}
		installButton.disabled = false;
		deferredPrompt = null;
	});
};

const fireBeforePrompt = (evt) => {
	console.log("beforeinstallprompt fired");
	// Prevent Chrome 76 and earlier from automatically showing a prompt
	evt.preventDefault();
	// Stash the event so it can be triggered later.
	deferredPrompt = evt;
	// Show the install button
	installButton.hidden = false;
	installButton.addEventListener("click", installApp);
};
const handleNetworkChange = () => {
	if (navigator.onLine) {
		console.log('online')
		document.body.classList.remove("offline");
		document.getElementById('status').style.display = 'none';
	} else {
		console.log('offline')
		document.body.classList.add("offline");
		document.getElementById('status').style.display = 'block';
	}
}
// event listeners
window.addEventListener("online", handleNetworkChange);
window.addEventListener("offline", handleNetworkChange);
//
window.addEventListener("load", loadSettings);
logoutButton.addEventListener("click", logoutUser);
startChattingButton.addEventListener("click", registerUser);
sendMessageButton.addEventListener("click", sendMessage);
messageContent.addEventListener("keyup", (evt) => {
	if (evt.key === "Enter") sendMessage();
});
window.addEventListener("beforeinstallprompt", fireBeforePrompt);
window.addEventListener("appinstalled", (evt) => {
	console.log("appinstalled fired", evt);
});
