let privateMode = false;

function enablePrivateMode() {
privateMode = true;
}

function disablePrivateMode() {
privateMode = false;
}

function isPrivateModeEnabled() {
return privateMode;
}

module.exports = {
enablePrivateMode,
disablePrivateMode,
isPrivateModeEnabled
};
