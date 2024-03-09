const options = {
  appid: 'b4fae3a0b936437a9a439f4909ff19e4',
  uid: null,
  channel: 'test',
  token: null,
};

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp9" });

let localTracks = [];
let remoteUsers = [];

let joinAndDisplayLocalStream = async () => {
  client.on("user-published", handleUserJoined);
  client.on("user-unpublished", handleUserLeft);

  console.log("Joining"); 
  let UID = await client.join(options.appid, options.channel, options.token, options.uid);
  console.log("Joined", UID);
  localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();
  let player = `<div class="video-container self" id="user-container-${UID}">
    <div class="video-player self" id="user-${UID}"></div>
  </div>`;
 
  document.getElementById("videoContainer").insertAdjacentHTML("beforeend", player);
  localTracks[1].play(`user-${UID}`);
  await client.publish([localTracks[0], localTracks[1]]);

  console.log("Publish success");
}

let joinStream = async () => {
  await joinAndDisplayLocalStream();
}

let handleUserJoined = async (user, mediaType) => {
  remoteUsers[user.uid] = user;
  await client.subscribe(user, mediaType);
  console.log("subscribe success");
  if (mediaType === 'video') {
    let player = document.getElementById(`user-container-${user.uid}`);
    if (player != null) {
      player.remove();
    }
  }
  let player = `<div class="video-container appear" id="user-container-${user.uid}">
    <div class="video-player" id="user-${user.uid}"></div>
  </div>`;
  document.getElementById("videoContainer").insertAdjacentHTML("beforeend", player);
  user.videoTrack.play(`user-${user.uid}`);
  if (mediaType === 'audio') {
    user.audioTrack.play();
  }
}

let handleUserLeft = async (user) => {
  delete remoteUsers[user.uid];
  let container = document.getElementById(`user-container-${user.uid}`);
  container.classList.add('disappear');
  container.addEventListener('transitionend', () => {
    container.remove();
  });
}

let leaveAndRemoveLocalStream = async () => {
  for (let i = 0; localTracks.length > i; i++) {
    localTracks[i].stop();
    localTracks[i].close();
  }
  await client.leave();
  console.log("client leaves channel");
  document.getElementById("videoContainer").innerHTML = "";
}

let toggleMic = async (e) => {
  if (localTracks[0].muted) {
    await localTracks[0].setMuted(false);
    e.target.style.background = '#7b2695';
  } else {
    await localTracks[0].setMuted(true);
    e.target.style.background = 'white';
  }
}

let toggleCamera = async (e) => {
  if (localTracks[1].muted) {
    await localTracks[1].setMuted(false);
    e.target.style.background = '#7b2695';
  } else {
    await localTracks[1].setMuted(true);
    e.target.style.background = 'white';
  }
}

document.getElementById('mic-btn').addEventListener('click', toggleMic);
document.getElementById('camera-btn').addEventListener('click', toggleCamera);

export default {joinStream, leaveAndRemoveLocalStream};
