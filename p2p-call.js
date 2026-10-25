/**
 * NEXUS P2P AUDIO/VIDEO STREAMING ENGINE
 * Handles direct device-to-device communication without central servers.
 */
class NexusP2PCall {
    constructor() {
        this.peerConnection = null;
        this.localStream = null;
        this.remoteStream = null;
    }

    async initLocalStream(videoElement, audioOnly = false) {
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({
                video: !audioOnly,
                audio: true
            });
            if (videoElement) {
                videoElement.srcObject = this.localStream;
            }
            console.log("[P2P] Local media stream initialized successfully.");
        } catch (error) {
            console.error("[P2P Error] Media access denied or unavailable:", error);
        }
    }
}
const nexusCall = new NexusP2PCall();