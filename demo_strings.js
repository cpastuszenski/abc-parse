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


