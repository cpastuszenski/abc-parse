/* Use the following as test cases in main()

  sample_notes
  sample_duration
  sample_broken_rhythm
  sample_beams
  sample_tuplets
  sample_ties_slurs
  sample_accidentals
  sample_chords
  sample_keys_modes
  sample_repeats_altends
  sample_mult_tunes
  sample_tricky
 */


var unit_note_length;

function main() {
    var tune = sample_beams;
    console.log(tune);
    return parse_abc(tune);
}


function parse_abc(abc_text) {
    var blocks, tunes = [];
    abc_text = remove_comments(abc_text);
    blocks = abc_text.split(/\n\n+/);

    for (var i = 0; i < blocks.length; i++) {
	if (new RegExp(/^X:/).test(blocks[i])) {
	    tunes.push(parse_tune(blocks[i]));
	} 
    }
    return tunes;
}

function parse_tune(tune_text) {
    unit_note_length = 8;
    var tune = {};
    tune.header = parse_header(tune_text);
    tune.staves = [];

    var tmp = split_preserve(tune_text, info_block);
    var body_blocks = tmp[0];
    var head_blocks = tmp[1];

    for (var i = 0; i < head_blocks.length; i++)
	tune.staves.push({head_text: head_blocks[i],
			  body_text:body_blocks[i+1]});

    for (var i = 0; i < tune.staves.length; i++)
	parse_stave(tune.staves[i]);

    return tune;
}

function parse_stave(stave) {
    parse_stave_header(stave);
    parse_stave_body(stave);
    return;
}

function parse_stave_body(stave) {
    stave.body_text = stave.body_text.replace(/\\\s*\n|\\\s*$/g, "");
    stave.body_text = stave.body_text.replace(/\n/g, "");
    var tmp = split_preserve(stave.body_text, barlines);
    measures_text = tmp[0];

    stave.measures = [];
    for (var i = 0; i < measures_text.length; i++) {
	if (measures_text[i] != "")
	    stave.measures.push(parse_measure(measures_text[i],
					     stave.measures.length));
    }
    delete stave.body_text;

    return;
}

function parse_measure(measure_text) {
    var measure = {};
    measure.chords = [];
    measure.beams = [];
    measure.ties = [];
    measure.slurs = [];

    measure_text = measure_text.replace(/-/g, "- ");
    measure_text = measure_text.replace(/^\s*|\s*$/g, "");
    var measure_segments = measure_text.split(/\s+/);

    var segment;
    for (var i = 0; i < measure_segments.length; i++) {
	segment = measure_segments[i];
	segment = segment.replace(/\(|\)/g, "");
	chord_strings = segment.match(beam_capture);
	if (chord_strings.length > 1)
		measure.beams.push([measure.chords.length,
				    measure.chords.length +
				    chord_strings.length - 1]);
	for (j = 0; j < chord_strings.length; j++)
	    measure.chords.push(parse_chord(chord_strings[j]));
	if (/-$/.test(segment))
	    measure.ties.push(measure.chords.length - 1);
    }
    return measure;
}


function parse_chord(chord_text) {
    chord = {};
    chord.duration = unit_note_length;
    if (actual_chord.test(chord_text)) {
	chord.notes = map(parse_note, chord_text.match(/^\[[^\]]*/)[0].slice(1).match(globalize(note_capture)));

	var duration_text = chord_text.match(/[^\]]*$/)[0];
	if (duration_text != "")
	    chord.duration = parse_duration(duration_text);
	chord.duration *= chord.notes[0].duration/unit_note_length;
	for (var i = 0; i < chord.notes.length; i++)
	    delete chord.notes[i].duration;
    } else {
	chord.notes = [parse_note(chord_text)];
	chord.duration = chord.notes[0].duration;
	delete chord.notes[0].duration;
    }

    chord.duration = phys_to_log(chord.duration);
    return chord;
}


/* parse_note takes the text of a note and returns a Note object
 */
function parse_note(note_string) {
    var note = {};
    var letter_string;
    var octave_number = 5;
    var beginning = note_string, remaining;

    match_array = note_string.match(note_capture);
    if (match_array[0] != note_string)
	throw "unrecognized note"

    switch(match_array[1]) {
    case "^^":
	note.accidental = "##";
	break;
    case "__":
	note.accidental = "bb";
	break;
    case "^":
	note.accidental = "#";
	break;
    case "_":
	note.accidental = "b";
	break;
    case "=":
	note.accidental = "n";
	break;
    }

    if (/[zxZX]/.test(match_array[2]))
	note.pitch = "z";
    else
	note.pitch = match_array[2].toLowerCase();
    if (/[CDEFGAB]/.test(match_array[2]))
	octave_number--;

    if (match_array[3] != undefined) {
	for (var i = 0; i < match_array[3].length; i++) {
	    if (match_array[3][i] == ",")
		octave_number--;
	    else
		octave_number++;
	}
    }
    note.pitch += octave_number;

    if (match_array[4] != undefined)
	note.duration = parse_duration(match_array[4]);
    else note.duration = unit_note_length;
    
    return note;
}


function parse_duration(duration_string) {
    var duration = unit_note_length;
    if (/^\d+\/\d+$/.test(duration_string)) {
	    duration *= Number(duration_string.match(/^\d+/)[0]);
	    duration /= Number(duration_string.match(/\d+$/)[0]);
	} else if (/^\/\d+$/.test(duration_string)) {
	    duration /= Number(duration_string.match(/\d+$/)[0]);
	} else if (/^\/+$/.test(duration_string)) {
	    for (var i = 0; i < duration_string.length; i++)
		duration /= 2;
	} else if (/^\d+\/?$/.test(duration_string)) {
	    duration *= Number(duration_string.match(/^\d+/)[0]);
	}
    return duration;
}


function parse_stave_header(stave) {
    var header_string = stave.head_text.replace(/(?:^\s*)|(?:\s*$)/g, "");
    var header_lines = header_string.split(/\n/);
    
    for(var i = 0; i < header_lines.length; i++) {
	switch(header_lines[i][0]) {
	case "K":
	    stave.key   = header_lines[i].slice(2);
	    break;
	case "L":
	    stave.unit_length = log_to_phys(header_lines[i].slice(4));
	    unit_note_length = log_to_phys(header_lines[i].slice(4));
	    break;
	case "M":
	    stave.meter = header_lines[i].slice(2);
	    break;
	case "Q":
	    stave.tempo = header_lines[i].slice(2);
	    break;
	}
    }
    delete stave.head_text;
    return;
}


function isolate_staves(tune_text) {
    var staves = [], current;

    var tmp = split_preserve(tune_text, info_block);
    var body_blocks = tmp[0];
    var head_blocks = tmp[1];

    for (var i = 0; i < head_blocks.length; i++) {
	current = {};
	current.head_text = head_blocks[i];
	current.body_text = body_blocks[i+1];
	staves.push(current);
    }

    return staves;
}

function parse_header(tune_text) {
    var header = {};

    var header_string = tune_text.match(tune_header)[0];
    header_string = header_string.replace(/(?:^\s*)|(?:\s*$)/g, "");
    var header_lines = header_string.split(/\n/);
    
    for(var i = 0; i < header_lines.length; i++) {
	switch(header_lines[i][0]) {
	case "C":
	    header.composer = header_lines[i].slice(2);
	    break;
	case "H":
	    header.history = header_lines[i].slice(2);
	    break;
	case "L":
	    header.unit_note = header_lines[i].slice(2);
	case "N":
	    header.notes = header_lines[i].slice(2);
	    break;
	case "O":
	    header.origin = header_lines[i].slice(2);
	    break;
	case "R":
	    header.rhythm = header_lines[i].slice(2);
	    break;
	case "T":
	    header.title = header_lines[i].slice(2);
	    break;
	case "X":
	    header.refno = Number(header_lines[i].slice(2));
	    break;
	case "Z":
	    header.transcription = header_lines[i].slice(2);
	    break;
	}
    }

    return header
}

function split_preserve(string, regex) {
    var tmp = [];
    tmp.push(string.split(regex));
    tmp.push(string.match(globalize(regex)));
    // if tmp[1] starts with "" then a regex was matched at the beginning
    // if tmp[1] ends with "" then a regex was matched at the end
    return tmp;
}

function globalize(regex) {
    return new RegExp(regex.source, "g");
}


// removes comments from strings of abc text
function remove_comments(abc_text) {
    // eliminate comment lines from the middle
    abc_text = abc_text.replace(/\n%[^\n]*/g,"");
    // possibly eliminate comment line from the start
    abc_text = abc_text.replace(/^%[^\n]*\n/,"");
    // eliminate comment half-lines from the middle
    abc_text = abc_text.replace(/%[^\n]*/g,"");
    return abc_text;
}


/* regular expressions */
var info_field_line = new RegExp(/(?:[A-Z]|[a-z]):[^\n]*\n/);
var info_block = new RegExp("(?:" + info_field_line.source + ")+");

var tune_header = new RegExp("^" + info_block.source);

var simple_barline = new RegExp(/(?:\s*:*\|+:*\s*)/);
var big_barline = new RegExp(/(?:\[\|+:*|:*\|+\])/);
var barlines = new RegExp(big_barline.source + "|" +
			  simple_barline.source);

var note_capture =
    new RegExp(/(?:(\^\^|__|\^|_|=)?([A-Ga-gxzXZ])([,\']+)?(\d*\/\d+|\d+|\/+)?)/);

var actual_chord =
    new RegExp(/(?:\[(?:(\^\^|__|\^|_|=)?([A-Ga-gxzXZ])([,\']+)?(\d*\/\d+|\d+|\/+)?)+\](\d*\/\d+|\d+|\/+)?)/);

var effective_chord =
    new RegExp(/(?:\[(?:(?:\^\^|__|\^|_|=)?(?:[A-Ga-gxzXZ])(?:[,\']+)?(?:\d*\/\d+|\d+|\/+)?)+\](?:\d*\/\d+|\d+|\/+)?)|(?:(?:\^\^|__|\^|_|=)?(?:[A-Ga-gxzXZ])(?:[,\']+)?(?:\d*\/\d+|\d+|\/+)?)/);

var beam_capture =
    new RegExp(/(\[(?:(?:\^\^|__|\^|_|=)?(?:[A-Ga-gxzXZ])(?:[,\']+)?(?:\d*\/\d+|\d+|\/+)?)+\](?:\d*\/\d+|\d+|\/+)?)|(?:(?:\^\^|__|\^|_|=)?(?:[A-Ga-gxzXZ])(?:[,\']+)?(?:\d*\/\d+|\d+|\/+)?)/g);


/* samples */

var sample_notes =
    "X:1\n" +
    "T:Notes\n" +
    "M:C\n" +
    "L:1/4\n" +
    "K:C\n" +
    "C, D, E, F,|G, A, B, C|D E F G|A B c d|e f g a|b c' d' e'|f' g' a' b'|]\n"

var sample_duration =
    "X:1\n" +
    "T:Note lengths and default note length\n" +
    "M:C\n" +
    "K:C\n" +
    "L:1/16\n" +
    "        A/2 A/ A A2 A3 A4 A6 A7 A8 A12 A15 A16|]\n" +
    "L:1/8\n" +
    "    A/4 A/2 A/ A A2 A3 A4 A6 A7 A8 A12 A15|]\n" +
    "L:1/4\n" +
    "A/8 A/4 A/2 A/ A A2 A3 A4 A6 A7|]\n"

var sample_broken_rhythm =
    "X:1\n" +
    "T:Broken rhythm markers\n" +
    "M:C\n" +
    "K:C\n" +
    "A>A A2>A2 A>>A A2>>>A2|]\n"

var sample_beams =
    "X:1\n" +
    "T:Beams\n" +
    "M:C\n" +
    "K:C\n" +
    "A B c d AB cd|ABcd ABc2|]\n"

var sample_tuplets =
    "X:1\n" +
    "T:Tuplets\n" +
    "M:C\n" +
    "K:C\n" +
    "(2AB (3ABA (4ABAB (5ABABA (6ABABAB (7ABABABA|]\n"

var sample_ties_slurs =
    "X:1\n" +
    "T:Ties and Slurs\n" +
    "M:C\n" +
    "K:C\n" +
    "(AA) (A(A)A) ((AA)A) (A|A) A-A A-A-A A2-|A4|]\n"

var sample_accidentals =
    "X:1\n" +
    "T:Accidentals\n" +
    "M:C\n" +
    "K:C\n" +
    "__A _A =A ^A ^^A|]\n"

var sample_chords =
    "X:1\n" +
    "T:Chords\n" +
    "M:2/4\n" +
    "K:C\n" +
    "[CEGc] [C2G2] [CE][DF]|[D2F2][EG][FA] [A4d4]|]\n"

var sample_keys_modes =
    "X:1\n" +
    "T:Keys and modes\n" +
    "M:4/4\n" +
    "K:C\n" +
    "DEFG ABcd|\\\n" +
    "DEFG ABcd|\\\n" +
    "DEFG ABcd|]\n" +
    "K:Cm\n" +
    "M:2/2\n" +
    "DEFG ABcd|\\\n" +
    "DEFG ABcd|\\\n" +
    "DEFG ABcd|]\n"

var sample_keys_modes_original =
    "X:1\n" +
    "T:Keys and modes\n" +
    "M:4/4\n" +
    "K:C\n" +
    "T:C/CMAJOR/Cmajor\n" +
    "DEFG ABcd|\\\n" +
    "K:CMAJOR\n" +
    "DEFG ABcd|\\\n" +
    "K:Cmajor\n" +
    "DEFG ABcd|]\n" +
    "T:C maj/ C major/C Major\n" +
    "K:C maj\n" +
    "DEFG ABcd|\\\n" +
    "K: C major\n" +
    "DEFG ABcd|\\\n" +
    "K:C Major\n" +
    "DEFG ABcd|]\n" +
    "T:C Lydian/C Ionian/C Mixolydian\n" +
    "K:C Lydian\n" +
    "DEFG ABcd|\\\n" +
    "K:C Ionian\n" +
    "DEFG ABcd|\\\n" +
    "K:C Mixolydian\n" +
    "DEFG ABcd|]\n" +
    "T:C Dorian/C Minor/Cm\n" +
    "K:C Dorian\n" +
    "DEFG ABcd|\\\n" +
    "K:C Minor\n" +
    "DEFG ABcd|\\\n" +
    "K:Cm\n" +
    "DEFG ABcd|]\n" +
    "T:C Aeolian/C Phrygian/C Locrian\n" +
    "K:C Aeolian\n" +
    "DEFG ABcd|\\\n" +
    "K:C Phrygian\n" +
    "DEFG ABcd|\\\n" +
    "K:C Locrian\n" +
    "DEFG ABcd|]\n"

var sample_repeats_altends =
    "M:6/8\n" +
    "O:I\n" +
    "R:J\n" +
    "\n" +
    "X:1\n" +
    "T:Paddy O'Rafferty\n" +
    "C:Trad.\n" +
    "K:D\n" +
    "dff cee|def gfe|dff cee|dfe dBA|dff cee|def gfe|faf gfe|1 dfe dBA:|2 dfe dcB|]\n" +
    "~A3 B3|gfe fdB|AFA B2c|dfe dcB|~A3 ~B3|efe efg|faf gfe|1 dfe dcB:|2 dfe dBA|]\n" +
    "fAA eAA|def gfe|fAA eAA|dfe dBA|fAA eAA|def gfe|faf gfe|dfe dBA:|\n"

var sample_mult_tunes =
    "M:4/4\n" +
    "O:I\n" +
    "R:R\n" +
    "\n" +
    "X:1\n" +
    "T:Untitled Reel\n" +
    "C:Trad.\n" +
    "K:D\n" +
    "eg|a2ab ageg|agbg agef|g2g2 fgag|f2d2 d2:|\\\n" +
    "ed|cecA B2ed|cAcA E2ed|cecA B2ed|c2A2 A2:|\n" +
    "K:G\n" +
    "AB|cdec BcdB|ABAF GFE2|cdec BcdB|c2A2 A2:|\n" +
    "\n" +
    "X:2\n" +
    "T:Kitchen Girl\n" +
    "C:Trad.\n" +
    "E:8\n" +
    "K:D\n" +
    "[c4a4] [B4g4]|efed c2cd|e2f2 gaba|g2e2 e2fg|a4 g4|efed cdef|g2d2 efed|c2A2 A4:|\n" +
    "K:G\n" +
    "ABcA BAGB|ABAG EDEG|A2AB c2d2|e3f edcB|ABcA BAGB|ABAG EGAB|cBAc BAG2|A4 A4:|\n"

var sample_tricky =
    "H:This file contains some example\n" +
    "  English tunes for abc2mtex\n" +
    "\n" +
    "O:E                   % mark all tunes with an E (English) for the index\n" +
    "\n" +
    "X:1                   % tune no 1\n" +
    "T:Dusty Miller, The   % title\n" +
    "T:Binny's Jig         % an alternative title\n" +
    "C:Trad.               % traditional\n" +
    "R:DH                  % double hornpipe\n" +
    "M:3/4                 % meter\n" +
    "E:8                   % note spacing\n" +
    "I:speed 300           % speed for playabc\n" +
    "K:G                   % key\n" +
    "B>cd BAG|FA Ac BA|B>cd BAG|DG GB AG:|\\\n" +
    "Bdd gfg|aA Ac BA|Bdd gfa|gG GB AG:|\n" +
    "BG G/2G/2G BG|FA Ac BA|BG G/2G/2G BG|DG GB AG:|\n" +
    "W:Hey, the dusty miller, and his dusty coat;\n" +
    "W:He will win a shilling, or he spend a groat.\n" +
    "W:Dusty was the coat, dusty was the colour;\n" +
    "W:Dusty was the kiss, that I got frae the miller.\n" +
    "\n" +
    "\\bigskip              % a bit of space\n" +
    "\n" +
    "M:6/8                 % default meter for the following tunes\n" +
    "R:J                   % mark following tunes with a J (jig) for the index\n" +
    "\n" +
    "X:2\n" +
    "T:Old Sir Simon the King\n" +
    "C:Trad.\n" +
    "S:Offord MSS          % from Offord manuscript\n" +
    "N:see also Playford   % notes\n" +
    "M:9/8\n" +
    "R:SJ                  % slip jig\n" +
    "Q:C3=120              % tempo\n" +
    "Z:originally in C     % transcription notes\n" +
    "K:G\n" +
    "D|GFG GAG G2D|GFG GAG F2D|EFE EFE EFG|A2G F2E D2:|\n" +
    "D|GAG GAB d2D|GAG GAB c2D|[1 EFE EFE EFG|A2G F2E D2:|\\\n" +
    "M:12/8                % change meter for a bar\n" +
    "[2 E2E EFE E2E EFG|\\\n" +
    "M:9/8                 % change back again\n" +
    "A2G F2E D2|]\n"




/*----------- From Eloquent Javascript -----------*/

function forEach(array, action) {
  for (var i = 0; i < array.length; i++)
    action(array[i]);
}

function map(func, array) {
  var result = [];
  forEach(array, function (element) {
    result.push(func(element));
  });
  return result;
}

function reduce(combine, base, array) {
  forEach(array, function (element) {
    base = combine(base, element);
  });
  return base;
}


/*---------------------  end ---------------------*/


function log_to_phys(log_duration) {
    var val = Number(log_duration.match(/^\d+/)[0]);
    val = Math.log(val)/Math.log(2);
    val = 6 - val;
    val = Math.pow(2, val);
    var n = val/2;
    if (/d+$/.test(log_duration)) {
	var dots = log_duration.match(/d+$/)[0];
	for (var i = 0; i < dots.length; i++) {
	    val += n;
	    n /= 2;
	}
    }
    return val;
}

function phys_to_log(phys_duration) {
    var n = 1;
    while (n <= phys_duration)
	n *= 2;
    n /= 2;
    var dots = "";
    var tmp = n;
    var i = 2;
    while (tmp != phys_duration) {
	dots += "d";
	tmp += (n/i);
	i *= 2;
    }
    n = Math.log(n)/Math.log(2);
    n = 6 - n;
    n = Math.pow(2, n);
    return (String(n) + dots);
}


function begins_with(regex) {
    return new RegExp("^" + regex.source);
}

function ends_with(regex) {
    return new RegExp(regex.source + "$");
}

function nothing_but(regex) {
    return new RegExp("^" + regex.source + "$");
}
