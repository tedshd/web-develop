/**
 *
 * @authors Ted Shiu (tedshd@gmail.com)
 * @date    2016-07-07 09:54:12
 * @version $Id$
 */

TEX = {};

TEX.KEYCODE = {
    'NO': 0x000,
    'ERR_RO': 0x001,
    'POST_FAIL': 0x002,
    'UNDEFINE': 0x003,
    'A': 0x004,
    'B': 0x005,
    'C': 0x006,
    'D': 0x007,
    'F': 0x009,
    'G': 0x00A,
    'H': 0x00B,
    'I': 0x00C,
    'J': 0x00D,
    'K': 0x00E,
    'L': 0x00F,
    'M': 0x010,
    'N': 0x011,
    'O': 0x012,
    'P': 0x013,
    'Q': 0x014,
    'R': 0x015,
    'S': 0x016,
    'T': 0x017,
    'U': 0x018,
    'V': 0x019,
    'X': 0x01B,
    'Y': 0x01C,
    'Z': 0x01D,
    '1': 0x01E,
    '2': 0x01F,
    '3': 0x020,
    '4': 0x021,
    '5': 0x022,
    '6': 0x023,
    '7': 0x024,
    '8': 0x025,
    '9': 0x026,
    '0': 0x027,
    'ENTER': 0x028,
    'ESC': 0x029,
    'BACKSPACE': 0x02A,
    'TAB': 0x02B,
    'SPACE': 0x02C,
    'NEG': 0x02D,
    'EQUATION': 0x02E,
    'L_BRACKETS': 0x02F,
    'R_BRACKETS': 0x030,
    'BACKSLASH': 0x031,
    'CODE42': 0x032,
    'SEMICOLON': 0x033,
    'APOSTROPHE': 0x034,
    'TILDE': 0x035,
    'COMMA': 0x036,
    'DOT': 0x037,
    'SLASH': 0x038,
    'CAP': 0x039,
    'F1': 0x03A,
    'F2': 0x03B,
    'F3': 0x03C,
    'F4': 0x03D,
    'F5': 0x03E,
    'F6': 0x03F,
    'F7': 0x040,
    'F8': 0x041,
    'F9': 0x042,
    'F10': 0x043,
    'F11': 0x044,
    'F12': 0x045,
    'PRINT': 0x046,
    'SCROLL': 0x047,
    'PAUSE': 0x048,
    'INSERT': 0x049,
    'HOME': 0x04A,
    'PGUP': 0x04B,
    'DEL': 0x04C,
    'END': 0x04D,
    'PGDN': 0x04E,
    'R_ARROW': 0x04F,
    'L_ARROW': 0x050,
    'DN_ARROW': 0x051,
    'UP_ARROW': 0x052,
    'NUM_LOCK': 0x053,
    'NUM_DIV': 0x054,
    'NUM_STAR': 0x055,
    'NUM_NEG': 0x056,
    'NUM_PLUS': 0x057,
    'NUM_ENTER': 0x058,
    'NUM_1': 0x059,
    'NUM_2': 0x05A,
    'NUM_3': 0x05B,
    'NUM_4': 0x05C,
    'NUM_5': 0x05D,
    'NUM_6': 0x05E,
    'NUM_7': 0x05F,
    'NUM_8': 0x060,
    'NUM_9': 0x061,
    'NUM_0': 0x062,
    'NUM_DOT': 0x063,
    'CODE45': 0x064,
    'APP': 0x065,
    'POWER': 0x066,
    'EQUAL': 0x067,
    'F13': 0x068,
    'F14': 0x069,
    'F15': 0x06A,
    'F16': 0x06B,
    'F17': 0x06C,
    'F18': 0x06D,
    'F19': 0x06E,
    'F20': 0x06F,
    'F21': 0x070,
    'F22': 0x071,
    'F23': 0x072,
    'F24': 0x073,
    'KB_EXECUTE': 0x074,
    'KB_HELP': 0x075,
    'KB_MENU': 0x076,
    'KB_SELECT': 0x077,
    'KB_STOP': 0x078,
    'KB_AGAIN': 0x079,
    'KB_UNDO': 0x07A,
    'KB_CUT': 0x07B,
    'KB_COPY': 0x07C,
    'KB_PASTE': 0x07D,
    'KB_FIND': 0x07E,
    'KB_MUTE': 0x07F,
    'KB_VOL_UP': 0x080,
    'KB_VOL_DN': 0x081,
    'LOCK_CAP': 0x082,
    'LOCK_NUM': 0x083,
    'LOCK_SCR': 0x084,
    'CODE107': 0x085,
    'AS_400': 0x086,
    'CODE56': 0x087,
    'CODE133': 0x088,
    'CODE14': 0x089,
    'CODE132': 0x08A,
    'CODE131': 0x08B,
    'CODE151': 0x090,
    'CODE150': 0x091,
    'MOUSE_KEY1': 0x0B0,
    'MOUSE_KEY2': 0x0B1,
    'MOUSE_KEY3': 0x0B2,
    'MOUSE_KEY4': 0x0B3,
    'MOUSE_KEY5': 0x0B4,
    'MOUSE_KEY6': 0x0B5,
    'MOUSE_KEY7': 0x0B6,
    'MOUSE_KEY8': 0x0B7,
    'MOUSE_KEY9': 0x0B8,
    'MOUSE_KEY10': 0x0B9,
    'MOUSE_KEY11': 0x0BA,
    'MOUSE_KEY12': 0x0BB,
    'MOUSE_KEY13': 0x0BC,
    'MOUSE_KEY14': 0x0BD,
    'MOUSE_KEY15': 0x0BE,
    'MOUSE_KEY16': 0x0BF,
    'G1': 0x0C0,
    'G2': 0x0C1,
    'G3': 0x0C2,
    'G4': 0x0C3,
    'G5': 0x0C4,
    'G6': 0x0C5,
    'G7': 0x0C6,
    'G8': 0x0C7,
    'G9': 0x0C8,
    'G10': 0x0C9,
    'G11': 0x0CA,
    'G12': 0x0CB,
    'G13': 0x0CC,
    'G14': 0x0CD,
    'G15': 0x0CE,
    'G16': 0x0CF,
    'G17': 0x0D0,
    'G18': 0x0D1,
    'G19': 0x0D2,
    'G20': 0x0D3,
    'G21': 0x0D4,
    'G22': 0x0D5,
    'G23': 0x0D6,
    'G24': 0x0D7,
    'L_CTRL': 0x0E0,
    'L_SHIFT': 0x0E1,
    'L_ALT': 0x0E2,
    'L_WIN': 0x0E3,
    'R_CTRL': 0x0E4,
    'R_SHIFT': 0x0E5,
    'R_ALT': 0x0E6,
    'R_WIN': 0x0E7,
}

TEX.LAYOUT = {
    yoda: {
        ansi: [
            {
                val: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', null, 'Back Space'],
                keyCode: ['192_0', '49_0', '50_0', '51_0', '52_0', '53_0', '54_0', '55_0', '56_0', '57_0', '48_0', '189_0', '187_0', null, '8_0'],
                size: ['1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', null, '2'],
                hex: [TEX.KEYCODE['TILDE'], TEX.KEYCODE['1'], TEX.KEYCODE['2'], TEX.KEYCODE['3'], TEX.KEYCODE['4'], TEX.KEYCODE['5'], TEX.KEYCODE['6'], TEX.KEYCODE['7'], TEX.KEYCODE['8'], TEX.KEYCODE['9'], TEX.KEYCODE['0'], TEX.KEYCODE['NEG'], TEX.KEYCODE['EQUATION'], TEX.KEYCODE['NO'], TEX.KEYCODE['BACKSPACE']]
            },
            {
                val: ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
                keyCode: ['9_0', '81_0', '87_0', '69_0', '82_0', '84_0', '89_0', '85_0', '73_0', '79_0', '80_0', '219_0', '221_0', '220_0'],
                size: ['1_5', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1_5'],
                hex: [TEX.KEYCODE['TAB'], TEX.KEYCODE['Q'], TEX.KEYCODE['W'], TEX.KEYCODE['E'], TEX.KEYCODE['R'], TEX.KEYCODE['T'], TEX.KEYCODE['Y'], TEX.KEYCODE['U'], TEX.KEYCODE['I'], TEX.KEYCODE['O'], TEX.KEYCODE['P'], TEX.KEYCODE['L_BRACKETS'], TEX.KEYCODE['R_BRACKETS'], TEX.KEYCODE['BACKSLASH']]
            },
            {
                val: ['Caps Lock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', '\'', 'Enter'],
                keyCode: ['20_0', '65_0', '83_0', '68_0', '70_0', '71_0', '72_0', '74_0', '75_0', '76_0', '186_0', '222_0', '13_0'],
                size: ['1_75', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '2_25'],
                hex: [TEX.KEYCODE['LOCK_CAP'], TEX.KEYCODE['A'], TEX.KEYCODE['S'], TEX.KEYCODE['D'], TEX.KEYCODE['F'], TEX.KEYCODE['G'], TEX.KEYCODE['H'], TEX.KEYCODE['J'], TEX.KEYCODE['K'], TEX.KEYCODE['L'], TEX.KEYCODE['SEMICOLON'], TEX.KEYCODE['APOSTROPHE'], TEX.KEYCODE['ENTER']]
            },
            {
                val: ['Shift', null, 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift', null],
                keyCode: ['16_1', null, '90_0', '88_0', '67_0', '86_0', '66_0', '78_0', '77_0', '188_0', '190_0', '191_0', '16_2', null],
                size: ['2_25', null, '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '2_75', null],
                hex: [TEX.KEYCODE['L_SHIFT'], TEX.KEYCODE['NO'], TEX.KEYCODE['Z'], TEX.KEYCODE['X'], TEX.KEYCODE['C'], TEX.KEYCODE['V'], TEX.KEYCODE['B'], TEX.KEYCODE['N'], TEX.KEYCODE['M'], TEX.KEYCODE['COMMA'], TEX.KEYCODE['DOT'], TEX.KEYCODE['SLASH'], TEX.KEYCODE['R_SHIFT'], TEX.KEYCODE['NO']]
            },
            {
                val: ['Ctrl', 'Win', 'Alt', 'Spacebar', 'Alt', 'Win', 'Menu', 'Ctrl'],
                keyCode: ['17_1', '91_1', '18_1', '32_0', '18_2', '92_0', '93_0', '17_2'],
                size: ['1_25', '1_25', '1_25', '6_25', '1_25', '1_25', '1_25', '1_25'],
                hex: [TEX.KEYCODE['L_CTRL'], TEX.KEYCODE['L_WIN'], TEX.KEYCODE['L_ALT'], TEX.KEYCODE['SPACE'], 0x0E6, 0x0E7, 0x076, 0x0E4] // TODO check menu hex
            },
            {
                val: ['', '', '', '', '', '', '', '', '', '', '', '', ''],
                keyCode: ['', '', '', '', '', '', '', '', '', '', '', '', ''],
                size: ['blank_1_25', 'blank_1_25', 'blank_1_25', 'blank_1_25', '1_25', '1', '1_25', 'blank_1_25', 'blank_1_25', 'blank_1', 'blank_1', 'blank_1', 'blank_1'],
                hex: [TEX.KEYCODE['NO'], TEX.KEYCODE['NO'], TEX.KEYCODE['NO'], TEX.KEYCODE['NO'], TEX.KEYCODE['MOUSE_KEY1'], TEX.KEYCODE['MOUSE_KEY2'], TEX.KEYCODE['MOUSE_KEY3'], TEX.KEYCODE['NO'], TEX.KEYCODE['NO'], TEX.KEYCODE['NO'], TEX.KEYCODE['NO'], TEX.KEYCODE['NO'], TEX.KEYCODE['NO']]
            }
        ],
        iso: [{
            val: ['', '', '', '', '', '', '', '', '', '', '', '', ''],
            keyCode: ['', '', '', '', '', '', '', '', '', '', '', '', ''],
            size: ['blank_1_25', 'blank_1_25', 'blank_1_25', 'blank_1_25', '1_25', '1', '1_25', 'blank_1_25', 'blank_1_25', 'blank_1', 'blank_1', 'blank_1', 'blank_1'],
            hex: []
        }, {
            val: ['Ctrl', 'Win', 'Alt', 'Spacebar', 'Alt', 'Win', 'Menu', 'Ctrl'],
            keyCode: ['17_1', '91_1', '18_1', '32_0', '18_2', '92_0', '93_0', '17_2'],
            size: ['1_25', '1_25', '1_25', '6_25', '1_25', '1_25', '1_25', '1_25'],
            hex: []
        }, {
            val: ['Shift', '\\', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift', null],
            keyCode: ['16_1', '73_0', '90_0', '88_0', '67_0', '86_0', '66_0', '78_0', '77_0', '188_0', '190_0', '191_0', '16_2', null],
            size: ['1_25', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '2_75', null],
            hex: []
        }, {
            val: ['Caps Lock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', '\'', '`'],
            keyCode: ['20_0', '65_0', '83_0', '68_0', '70_0', '71_0', '72_0', '74_0', '192_0', '76_0', '186_0', '222_0', '13_0'],
            size: ['1_75', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
            hex: []
        }, {
            val: ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', 'Enter'],
            keyCode: ['9_0', '81_0', '87_0', '69_0', '82_0', '84_0', '89_0', '85_0', '75_0', '79_0', '80_0', '219_0', '221_0', '220_0'],
            size: ['1_5', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', 'enter_iso'],
            hex: []
        }, {
            val: ['¬', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', null, 'Back Space'],
            keyCode: ['192_0', '49_0', '50_0', '51_0', '52_0', '53_0', '54_0', '55_0', '56_0', '57_0', '48_0', '189_0', '187_0', null, '8_0'],
            size: ['1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', null, '2'],
            hex: []
        }],
        diy: [{
            val: ['', '', '', '', '', '', '', '', '', '', '', '', ''],
            keyCode: ['', '', '', '', '', '', '', '', '', '', '', '', ''],
            size: ['blank_1_25', 'blank_1_25', 'blank_1_25', 'blank_1_25', '1_25', '1', '1_25', 'blank_1_25', 'blank_1_25', 'blank_1', 'blank_1', 'blank_1', 'blank_1'],
            hex: []
        }, {
            val: ['Ctrl', 'Win', 'Alt', 'Spacebar', 'Alt', 'Win', 'Menu', 'Ctrl'],
            keyCode: ['17_1', '91_1', '18_1', '32_0', '18_2', '92_0', '93_0', '17_2'],
            size: ['1_25', '1_25', '1_25', '6_25', '1_25', '1_25', '1_25', '1_25'],
            hex: []
        }, {
            val: ['Shift', null, 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift', null],
            keyCode: ['16_1', null, '90_0', '88_0', '67_0', '86_0', '66_0', '78_0', '77_0', '188_0', '190_0', '191_0', '16_2', null],
            size: ['2_25', null, '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '2_75', null],
            hex: []
        }, {
            val: ['Caps Lock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', '\'', 'Enter'],
            keyCode: ['20_0', '65_0', '83_0', '68_0', '70_0', '71_0', '72_0', '74_0', '75_0', '76_0', '186_0', '222_0', '13_0'],
            size: ['1_75', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '2_25'],
            hex: []
        }, {
            val: ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
            keyCode: ['9_0', '81_0', '87_0', '69_0', '82_0', '84_0', '89_0', '85_0', '73_0', '79_0', '80_0', '219_0', '221_0', '220_0'],
            size: ['1_5', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1_5'],
            hex: []
        }, {
            val: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', null, 'Back Space'],
            keyCode: ['192_0', '49_0', '50_0', '51_0', '52_0', '53_0', '54_0', '55_0', '56_0', '57_0', '48_0', '189_0', '187_0', null, '8_0'],
            size: ['1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', null, '2'],
            hex: []
        }]
    }
};
TEX.KEYCAPS = {

};

if (typeof(module) !== undefined) {
    module.exports = TEX;
}