/**
 * melody blocks
 */
//% weight=106 color=#c71585 icon="\uf001"
namespace melody {

    const MAGIC_DURATION_EIGHTH = 5     // BeatFraction.Eighth 1/8
    const MAGIC_DURATION_SIXTEENTH = 7  // BeatFraction.Sixteenth 1/16

    function customPlayTone(frequency: number, ms: number) {
        const beat = music.beat()
        const duration = ms / (beat >> 2)
        console.log(duration)
        switch (duration) {
            case MAGIC_DURATION_EIGHTH:
                // 1/8 beat
                ms = beat >> 3
                break;
            case MAGIC_DURATION_SIXTEENTH:
                // 1/16 beat
                ms = beat >> 4
                break;
            default:
                break;
        }
        pins.analogPitch(frequency, ms)
    }

    music.setPlayTone(customPlayTone)

    class FormedNote {
        formed: string
        constructor(public note: string, public duration: number) {
            this.formed = this.note + (this.duration > 0 ? ":" + this.duration : "")
        }
    }

    class Melody {
        constructor(public readonly id: number, public readonly cb: () => void) {
        }
    }

    const _melodies: Melody[] = []
    const _notes: string[] = []

    const NOTE_HZ = [
        Note.C3, Note.CSharp3, Note.D3, Note.Eb3, Note.E3, Note.F3, Note.FSharp3, Note.G3, Note.GSharp3, Note.A3, Note.Bb3, Note.B3,
        Note.C4, Note.CSharp4, Note.D4, Note.Eb4, Note.E4, Note.F4, Note.FSharp4, Note.G4, Note.GSharp4, Note.A4, Note.Bb4, Note.B4,
        Note.C5, Note.CSharp5, Note.D5, Note.Eb5, Note.E5, Note.F5, Note.FSharp5, Note.G5, Note.GSharp5, Note.A5, Note.Bb5, Note.B5,
    ]

    const NOTE_NAME = [
        "C3", "C#3", "D3", "Eb3", "E3", "F3", "F#3", "G3", "G#3", "A3", "Bb3", "B3",
        "C4", "C#4", "D4", "Eb4", "E4", "F4", "F#4", "G4", "G#4", "A4", "Bb4", "B4",
        "C5", "C#5", "D5", "Eb5", "E5", "F5", "F#5", "G5", "G#5", "A5", "Bb5", "B5",
    ]

    function _hzToNote(hz: number): string {
        let left = 0
        let right = NOTE_HZ.length - 1
        if (hz < NOTE_HZ[left]) {
            return NOTE_NAME[left]
        }
        if (hz > NOTE_HZ[right]) {
            return NOTE_NAME[right]
        }
        while (true) {
            const mid = Math.floor((left + right) / 2)
            if (hz < NOTE_HZ[mid]) {
                right = mid
            } else {
                left = mid
            }
            if (right - left > 1) {
                continue
            }
            if ((hz - NOTE_HZ[left]) < (NOTE_HZ[right] - hz)) {
                return NOTE_NAME[left]
            }
            return NOTE_NAME[right]
        }
    }

    function _fractionToDuration(fraction: BeatFraction): number {
        let duration = 4
        switch (fraction) {
            case BeatFraction.Whole:
                duration = 4
                break;
            case BeatFraction.Half:
                duration = 2
                break;
            case BeatFraction.Quarter:
                duration = 1
                break;
            case BeatFraction.Eighth:
                duration = MAGIC_DURATION_EIGHTH
                break;
            case BeatFraction.Sixteenth:
                duration = MAGIC_DURATION_SIXTEENTH
                break;
            case BeatFraction.Double:
                duration = 8
                break;
            case BeatFraction.Breve:
                duration = 16
                break;
            default:
                break;
        }
        return duration
    }

    function _csvToStrings(csv: string[]): string[] {
        const res: string[] = []
        for (const t of csv) {
            for (const s of t.split(",")) {
                const v = s.trim()
                if (v) {
                    res.push(v)
                }
            }
        }
        return res
    }

    //% blockId="melody_array_playable"
    //% block="melody $melody"
    //% toolboxParent=music_playable_play
    //% toolboxParentArgument=toPlay
    //% duplicateShadowOnDrag
    //% parts="headphone"
    //% weight=130
    export function arrayPlayable(melody: string[]): music.Playable {
        // https://makecode.microbit.org/reference/music/making-melodies
        return new music.StringArrayPlayable(_csvToStrings(melody), undefined)
    }

    //% blockId="melody_hex_playable"
    //% block="melody hex $hex"
    //% hex.defl="4f01540158015b0258015b03"
    //% toolboxParent=music_playable_play
    //% toolboxParentArgument=toPlay
    //% duplicateShadowOnDrag
    //% parts="headphone"
    //% weight=120
    export function hexPlayable(hex: string): music.Playable {
        // hex examples: https://github.com/microsoft/pxt-microbit/blob/master/libs/core/melodies.ts
        return new music.StringArrayPlayable(music._bufferToMelody(Buffer.fromHex(hex)), undefined)
    }

    //% blockId="melody_id_playable"
    //% block="melody id $id"
    //% toolboxParent=music_playable_play
    //% toolboxParentArgument=toPlay
    //% duplicateShadowOnDrag
    //% parts="headphone"
    //% weight=110
    export function melodyPlayable(id: number): music.Playable {
        const ret: string[] = []
        while (_notes.length > 0) {
            _notes.shift()
        }
        for (const s of _melodies) {
            if (s.id == id) {
                s.cb()
                while (_notes.length > 0) {
                    ret.push(_notes.shift())
                }
                break;
            }
        }
        return arrayPlayable(ret)
    }

    //% block="melody id $id"
    //% weight=100
    //% group="Declare"
    export function declareMelody(id: number, body: () => void) {
        const melody = new Melody(id, body)
        _melodies.push(melody)
    }

    //% block="scale %scale for %fraction|beat"
    //% scale.shadow="device_note"
    //% scale.defl=Note.C
    //% fraction.defl=BeatFraction.Whole
    //% weight=90
    //% group="Declare"
    export function scale(scale: number, fraction: BeatFraction) {
        const obj = new FormedNote(_hzToNote(scale), _fractionToDuration(fraction))
        _notes.push(obj.formed)
    }

    //% block="rest for %fraction|beat"
    //% fraction.defl=BeatFraction.Whole
    //% weight=80
    //% group="Declare"
    export function rest(fraction: BeatFraction) {
        const obj = new FormedNote("R", _fractionToDuration(fraction))
        _notes.push(obj.formed)
    }

    //% block="note $note : $duration"
    //% note.defl="C4"
    //% duration:defl="4"
    //% weight=70
    //% group="Declare"
    export function note(note: string, duration: number) {
        switch (duration) {
            case -1:    // 1 beat
                duration = 4
            case -2:    // 1/2 beat
                duration = 2
                break
            case -4:    // 1/4 beat
                duration = 1
                break
            case -8:    // 1/8 beat
                duration = MAGIC_DURATION_EIGHTH
                break
            case -16:   // 1/16 beat
                duration = MAGIC_DURATION_SIXTEENTH
                break
            default:
                if (0 > duration) {
                    duration = 4
                }
                break
        }
        const obj = new FormedNote(note, duration)
        _notes.push(obj.formed)
    }

}
