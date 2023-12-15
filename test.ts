/**
 * tests go here; this will not be compiled when this package is used as an extension.
 */
// play
input.onButtonPressed(Button.A, function () {
    music.play(melody.melodyPlayable(0), music.PlaybackMode.UntilDone)
})
// declare
melody.declareMelody(0, function () {
    for (let index = 0; index < 2; index++) {
        melody.scale(262, BeatFraction.Whole)
        melody.scale(294, BeatFraction.Whole)
        melody.scale(330, BeatFraction.Whole)
        melody.rest(BeatFraction.Whole)
    }
    melody.scale(392, BeatFraction.Whole)
    melody.scale(330, BeatFraction.Whole)
    melody.scale(294, BeatFraction.Whole)
    melody.scale(262, BeatFraction.Whole)
    melody.scale(294, BeatFraction.Whole)
    melody.scale(330, BeatFraction.Whole)
    melody.scale(294, BeatFraction.Whole)
    melody.rest(BeatFraction.Whole)
})
// icon
basic.showIcon(IconNames.EighthNote)
