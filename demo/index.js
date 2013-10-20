/* =============================================================================

File: index.js

Authors: Steve Beal
         Matt McNierney
         Andrew Roberts

Project: PROJECT_NAME_GOES_HERE

Organization: Dartmouth College: CS 98 - Culminating Experience

Description: Renders a tune parsed from an ABC music file using VexFlow, and
             shows current pitch as captured by the microphone

============================================================================= */



////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONSTANTS ////////////////////////////////
////////////////////////////////////////////////////////////////////////////

// lookup table for notes and how far down (from top of y = 0) to draw them
// based on measure height of 200 (goes above actual staff lines)
var PITCH_Y_VALS = {
    'B5' : 20,
    'A5' : 25,
    'G5' : 30,
    'F5' : 35,
    'E5' : 40,
    'D5' : 45,
    'C5' : 50,
    'B4' : 55,
    'A4' : 60,
    'G4' : 65,
    'F4' : 70,
    'E4' : 75,
    'D4' : 80,
    'C4' : 85,
    'B3' : 90,
    'A3' : 95,
    'G3' : 100,
    'F3' : 105,
    'E3' : 110,
    'D3' : 115,
    'C3' : 120
};

// some default values, in case they're not provided
var DEFAULT_METER = "4/4";
var DEFAULT_KEY = "C";
var DEFAULT_DURATION = "1/4";
var DEFAULT_CLEF = "treble";

// coordinates for drawing the measures
var START_MEASURE_X = 10;
var START_MEASURE_Y = 0;
var MEASURE_HEIGHT = 200;
var DEFAULT_MEASURE_WIDTH = 500;

// the HTML canvas
var HTML_STAFF_ELEMENT = "#staff";

// height of a note
var HIGHLIGHT_BAR_HEIGHT = 10;





////////////////////////////////////////////////////////////////////////////
///////////////////////////// HELPER FUNCTIONS /////////////////////////////
////////////////////////////////////////////////////////////////////////////

// -------------------------------------------------------------------------
// createVoiceWithNotes function
// returns a VexFlow voice with notes added to it
// this is needed for drawing
var createVoiceWithNotes = function(meter, vexNotes) {

    // use default meter of "4/4" if given "C"
    var m = meter ? meter : DEFAULT_METER;
    if (m == "C") {
        m = DEFAULT_METER;
    }

    // create new voice from the given meter
    var v = new Vex.Flow.Voice({
                num_beats: m.split('/')[0],
                beat_value: m.split('/')[1],
                resolution: Vex.Flow.RESOLUTION
            });

    // add notes to voice
    v.addTickables(vexNotes);

    return v;
};


// -------------------------------------------------------------------------
// addClef function
// add a clef to the measure
var addClef = function(vexStave, clef) {
    var c = clef ? clef : DEFAULT_CLEF;
    vexStave.addClef(c);
}


// -------------------------------------------------------------------------
// pushNote function
// pushes the notes in a chord (currently just one) into the note list
var pushNote = function(vexNoteList, chord) {

    // use a default duration of a quarter note if none was parsed
    var d = chord.notes[0].duration ? chord.notes[0].duration : DEFAULT_DURATION

    // Not supporting chords yet, so add info for the first note in each chord
    vexNoteList.push(new Vex.Flow.StaveNote({
        keys: [chord.notes[0].pitch[0] + "/" + chord.notes[0].pitch[1]],
        duration: d
    }));
};


// -------------------------------------------------------------------------
// renderTune function
// takes a tune as a JSON object from the parser and renders the song
var renderTune = function(tune, ctx) {

    var measure_x = START_MEASURE_X;
    var measure_y = START_MEASURE_Y;
    var measure_width = DEFAULT_MEASURE_WIDTH;

    // go through each staff...in most songs there will only be one
    _.each(tune.staves, function(staff) {

        // go through each measure and create new Vex.Flow.Stave for each
        for (i=0; i < staff.measures.length; i++) {
            var measure = staff.measures[i];

            // 75px seems to be a good width to give each note
            measure_width = measure.chords.length * 75;

            // we only want 2 measures per line, for now
            if (i > 0 && i % 2 == 0) {
                // bump y coordinate down
                // reset x to left side
                measure_y = measure_y + MEASURE_HEIGHT;
                measure_x = START_MEASURE_X;
            }

            // create a new vexStave to be a measure, update next measure coordinates
            var vexStave = new Vex.Flow.Stave(measure_x, measure_y, measure_width);
            measure_x += measure_width;

            // add clef to the first measure
            if (i == 0) {
                addClef(vexStave, staff.clef);
            }

            // draw measure
            vexStave.setContext(ctx).draw();

            // notes for this measure
            var vexNotes = [];
            _.each(measure.chords, function(chord) {
                pushNote(vexNotes, chord);
            });

            // voice holds the nodes
            var voice = createVoiceWithNotes(staff.meter, vexNotes);
          
            // format the voice, and justify to the width of the measure
            var formatter = (new Vex.Flow.Formatter());
            formatter.joinVoices([voice]);
            formatter.format([voice], measure_width);
          
            // draw the measure
            voice.draw(ctx, vexStave);
        }
    });

    // needed for getting the width to highlight a note...will be changed
    return measure_width + 1;
};




////////////////////////////////////////////////////////////////////////////
///////////////////////////// BEGIN PROCESSING /////////////////////////////
////////////////////////////////////////////////////////////////////////////

$(document).ready(function() {

    // parse the string from the parser into a JSON object
    $(document).ready(function() {
      $.get('notes.abc', function(data) {
        window.tune = parse_abc(data)[0];
        
        // get HTML canvas to draw on, VexFlow's renderer, and canvas context
        // then clear the canvas
        var canvas = $(HTML_STAFF_ELEMENT)[0];
        var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);
        var ctx = renderer.getContext();

        // render the tune (returns width of the measure for highlighting -- this will change later) and highlights the note
        var width = renderTune(tune, ctx);
        
      });
    });
    
});



