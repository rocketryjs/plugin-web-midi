/*
	Module: Index - Plugin Web MIDI
	Description: Plugin that enables Web MIDI support
*/
import {registerMidiLayer} from "@rocketry/core";
import {MidiLayerAPI, MessageType} from "@rocketry/core/src/types"; // TODO

// TODO: bind functions

// TODO update @types/webmidi
// interface MIDIOptionsType {
// 	sysex:? boolean,
// 	software?: boolean,
// };
// interface MIDIAccessType {
// 	inputs: MIDIInputMapType,
// 	onstatechange: void | function,
// 	outputs: MIDIOutputMapType,
// 	sysexEnabled: false,
// }
/*
	TODO: PR https://github.com/DefinitelyTyped/DefinitelyTyped for WebMidi
	changes to `WebMidi.MIDIOptions`, make it more explict that it isn't for webmidi.js
*/


// Initialize, request permissions
export const init = async function (this: MidiLayerAPI, options: WebMidi.MIDIOptions = {sysex: true, software: false}) {
	if (typeof navigator === "undefined" || !navigator.requestMIDIAccess) {
		throw new Error("This environment doesn't support Web MIDI (in plugin-web-midi).");
	}

	try {
		this.midiAccess = await navigator.requestMIDIAccess(options);
		this.sysexEnabled = this.midiAccess.sysexEnabled;
	} catch (error) {
		switch (error.name) {
			case "SecurityError":
				throw new Error(`Permission was denied (in plugin-web-midi).\n\n${error}`);
			case "AbortError":
				throw new Error(`The page is being closed for a user navigation (in plugin-web-midi).\n\n${error}`);
			case "InvalidStateError":
				throw new Error(`An underlying system threw an error (in plugin-web-midi).\n\n${error}`);
			default:
				throw new Error(`Unknown error while requesting MIDI access (in plugin-web-midi).\n\n${error}`);
		}
	}
};

export const connect = function (this: MidiLayerAPI, device: DeviceType, options: WebMidi.MIDIOptions) {
};

const send = function (this: MidiLayerAPI, device: DeviceType, message: MessageType) {
	try {
		device.output.send(message);
	} catch (error) {
		switch (error.name) {
			case "InvalidAccessError":
				throw new Error(`SysEx messages are not allowed to be sent without initalizing Web MIDI with the sysex option enabled. (in plugin-web-midi).\n\n${error}`);
			default:
				throw new Error(`Unknown error while sending message (in plugin-web-midi).\n\n${error}`);
		}
	}
};


registerMidiLayer({init, connect, disconnect, emit, send, getDevices});
