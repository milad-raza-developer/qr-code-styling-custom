(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["QRCodeStyling"] = factory();
	else
		root["QRCodeStyling"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/qrcode-generator/qrcode.js":
/*!*************************************************!*\
  !*** ./node_modules/qrcode-generator/qrcode.js ***!
  \*************************************************/
/***/ ((module, exports) => {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//---------------------------------------------------------------------
//
// QR Code Generator for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//
// The word 'QR Code' is registered trademark of
// DENSO WAVE INCORPORATED
//  http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------

var qrcode = function() {

  //---------------------------------------------------------------------
  // qrcode
  //---------------------------------------------------------------------

  /**
   * qrcode
   * @param typeNumber 1 to 40
   * @param errorCorrectionLevel 'L','M','Q','H'
   */
  var qrcode = function(typeNumber, errorCorrectionLevel) {

    var PAD0 = 0xEC;
    var PAD1 = 0x11;

    var _typeNumber = typeNumber;
    var _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
    var _modules = null;
    var _moduleCount = 0;
    var _dataCache = null;
    var _dataList = [];

    var _this = {};

    var makeImpl = function(test, maskPattern) {

      _moduleCount = _typeNumber * 4 + 17;
      _modules = function(moduleCount) {
        var modules = new Array(moduleCount);
        for (var row = 0; row < moduleCount; row += 1) {
          modules[row] = new Array(moduleCount);
          for (var col = 0; col < moduleCount; col += 1) {
            modules[row][col] = null;
          }
        }
        return modules;
      }(_moduleCount);

      setupPositionProbePattern(0, 0);
      setupPositionProbePattern(_moduleCount - 7, 0);
      setupPositionProbePattern(0, _moduleCount - 7);
      setupPositionAdjustPattern();
      setupTimingPattern();
      setupTypeInfo(test, maskPattern);

      if (_typeNumber >= 7) {
        setupTypeNumber(test);
      }

      if (_dataCache == null) {
        _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
      }

      mapData(_dataCache, maskPattern);
    };

    var setupPositionProbePattern = function(row, col) {

      for (var r = -1; r <= 7; r += 1) {

        if (row + r <= -1 || _moduleCount <= row + r) continue;

        for (var c = -1; c <= 7; c += 1) {

          if (col + c <= -1 || _moduleCount <= col + c) continue;

          if ( (0 <= r && r <= 6 && (c == 0 || c == 6) )
              || (0 <= c && c <= 6 && (r == 0 || r == 6) )
              || (2 <= r && r <= 4 && 2 <= c && c <= 4) ) {
            _modules[row + r][col + c] = true;
          } else {
            _modules[row + r][col + c] = false;
          }
        }
      }
    };

    var getBestMaskPattern = function() {

      var minLostPoint = 0;
      var pattern = 0;

      for (var i = 0; i < 8; i += 1) {

        makeImpl(true, i);

        var lostPoint = QRUtil.getLostPoint(_this);

        if (i == 0 || minLostPoint > lostPoint) {
          minLostPoint = lostPoint;
          pattern = i;
        }
      }

      return pattern;
    };

    var setupTimingPattern = function() {

      for (var r = 8; r < _moduleCount - 8; r += 1) {
        if (_modules[r][6] != null) {
          continue;
        }
        _modules[r][6] = (r % 2 == 0);
      }

      for (var c = 8; c < _moduleCount - 8; c += 1) {
        if (_modules[6][c] != null) {
          continue;
        }
        _modules[6][c] = (c % 2 == 0);
      }
    };

    var setupPositionAdjustPattern = function() {

      var pos = QRUtil.getPatternPosition(_typeNumber);

      for (var i = 0; i < pos.length; i += 1) {

        for (var j = 0; j < pos.length; j += 1) {

          var row = pos[i];
          var col = pos[j];

          if (_modules[row][col] != null) {
            continue;
          }

          for (var r = -2; r <= 2; r += 1) {

            for (var c = -2; c <= 2; c += 1) {

              if (r == -2 || r == 2 || c == -2 || c == 2
                  || (r == 0 && c == 0) ) {
                _modules[row + r][col + c] = true;
              } else {
                _modules[row + r][col + c] = false;
              }
            }
          }
        }
      }
    };

    var setupTypeNumber = function(test) {

      var bits = QRUtil.getBCHTypeNumber(_typeNumber);

      for (var i = 0; i < 18; i += 1) {
        var mod = (!test && ( (bits >> i) & 1) == 1);
        _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
      }

      for (var i = 0; i < 18; i += 1) {
        var mod = (!test && ( (bits >> i) & 1) == 1);
        _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
      }
    };

    var setupTypeInfo = function(test, maskPattern) {

      var data = (_errorCorrectionLevel << 3) | maskPattern;
      var bits = QRUtil.getBCHTypeInfo(data);

      // vertical
      for (var i = 0; i < 15; i += 1) {

        var mod = (!test && ( (bits >> i) & 1) == 1);

        if (i < 6) {
          _modules[i][8] = mod;
        } else if (i < 8) {
          _modules[i + 1][8] = mod;
        } else {
          _modules[_moduleCount - 15 + i][8] = mod;
        }
      }

      // horizontal
      for (var i = 0; i < 15; i += 1) {

        var mod = (!test && ( (bits >> i) & 1) == 1);

        if (i < 8) {
          _modules[8][_moduleCount - i - 1] = mod;
        } else if (i < 9) {
          _modules[8][15 - i - 1 + 1] = mod;
        } else {
          _modules[8][15 - i - 1] = mod;
        }
      }

      // fixed module
      _modules[_moduleCount - 8][8] = (!test);
    };

    var mapData = function(data, maskPattern) {

      var inc = -1;
      var row = _moduleCount - 1;
      var bitIndex = 7;
      var byteIndex = 0;
      var maskFunc = QRUtil.getMaskFunction(maskPattern);

      for (var col = _moduleCount - 1; col > 0; col -= 2) {

        if (col == 6) col -= 1;

        while (true) {

          for (var c = 0; c < 2; c += 1) {

            if (_modules[row][col - c] == null) {

              var dark = false;

              if (byteIndex < data.length) {
                dark = ( ( (data[byteIndex] >>> bitIndex) & 1) == 1);
              }

              var mask = maskFunc(row, col - c);

              if (mask) {
                dark = !dark;
              }

              _modules[row][col - c] = dark;
              bitIndex -= 1;

              if (bitIndex == -1) {
                byteIndex += 1;
                bitIndex = 7;
              }
            }
          }

          row += inc;

          if (row < 0 || _moduleCount <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    };

    var createBytes = function(buffer, rsBlocks) {

      var offset = 0;

      var maxDcCount = 0;
      var maxEcCount = 0;

      var dcdata = new Array(rsBlocks.length);
      var ecdata = new Array(rsBlocks.length);

      for (var r = 0; r < rsBlocks.length; r += 1) {

        var dcCount = rsBlocks[r].dataCount;
        var ecCount = rsBlocks[r].totalCount - dcCount;

        maxDcCount = Math.max(maxDcCount, dcCount);
        maxEcCount = Math.max(maxEcCount, ecCount);

        dcdata[r] = new Array(dcCount);

        for (var i = 0; i < dcdata[r].length; i += 1) {
          dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset];
        }
        offset += dcCount;

        var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
        var rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);

        var modPoly = rawPoly.mod(rsPoly);
        ecdata[r] = new Array(rsPoly.getLength() - 1);
        for (var i = 0; i < ecdata[r].length; i += 1) {
          var modIndex = i + modPoly.getLength() - ecdata[r].length;
          ecdata[r][i] = (modIndex >= 0)? modPoly.getAt(modIndex) : 0;
        }
      }

      var totalCodeCount = 0;
      for (var i = 0; i < rsBlocks.length; i += 1) {
        totalCodeCount += rsBlocks[i].totalCount;
      }

      var data = new Array(totalCodeCount);
      var index = 0;

      for (var i = 0; i < maxDcCount; i += 1) {
        for (var r = 0; r < rsBlocks.length; r += 1) {
          if (i < dcdata[r].length) {
            data[index] = dcdata[r][i];
            index += 1;
          }
        }
      }

      for (var i = 0; i < maxEcCount; i += 1) {
        for (var r = 0; r < rsBlocks.length; r += 1) {
          if (i < ecdata[r].length) {
            data[index] = ecdata[r][i];
            index += 1;
          }
        }
      }

      return data;
    };

    var createData = function(typeNumber, errorCorrectionLevel, dataList) {

      var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectionLevel);

      var buffer = qrBitBuffer();

      for (var i = 0; i < dataList.length; i += 1) {
        var data = dataList[i];
        buffer.put(data.getMode(), 4);
        buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
        data.write(buffer);
      }

      // calc num max data.
      var totalDataCount = 0;
      for (var i = 0; i < rsBlocks.length; i += 1) {
        totalDataCount += rsBlocks[i].dataCount;
      }

      if (buffer.getLengthInBits() > totalDataCount * 8) {
        throw 'code length overflow. ('
          + buffer.getLengthInBits()
          + '>'
          + totalDataCount * 8
          + ')';
      }

      // end code
      if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
        buffer.put(0, 4);
      }

      // padding
      while (buffer.getLengthInBits() % 8 != 0) {
        buffer.putBit(false);
      }

      // padding
      while (true) {

        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(PAD0, 8);

        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(PAD1, 8);
      }

      return createBytes(buffer, rsBlocks);
    };

    _this.addData = function(data, mode) {

      mode = mode || 'Byte';

      var newData = null;

      switch(mode) {
      case 'Numeric' :
        newData = qrNumber(data);
        break;
      case 'Alphanumeric' :
        newData = qrAlphaNum(data);
        break;
      case 'Byte' :
        newData = qr8BitByte(data);
        break;
      case 'Kanji' :
        newData = qrKanji(data);
        break;
      default :
        throw 'mode:' + mode;
      }

      _dataList.push(newData);
      _dataCache = null;
    };

    _this.isDark = function(row, col) {
      if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
        throw row + ',' + col;
      }
      return _modules[row][col];
    };

    _this.getModuleCount = function() {
      return _moduleCount;
    };

    _this.make = function() {
      if (_typeNumber < 1) {
        var typeNumber = 1;

        for (; typeNumber < 40; typeNumber++) {
          var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, _errorCorrectionLevel);
          var buffer = qrBitBuffer();

          for (var i = 0; i < _dataList.length; i++) {
            var data = _dataList[i];
            buffer.put(data.getMode(), 4);
            buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
            data.write(buffer);
          }

          var totalDataCount = 0;
          for (var i = 0; i < rsBlocks.length; i++) {
            totalDataCount += rsBlocks[i].dataCount;
          }

          if (buffer.getLengthInBits() <= totalDataCount * 8) {
            break;
          }
        }

        _typeNumber = typeNumber;
      }

      makeImpl(false, getBestMaskPattern() );
    };

    _this.createTableTag = function(cellSize, margin) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var qrHtml = '';

      qrHtml += '<table style="';
      qrHtml += ' border-width: 0px; border-style: none;';
      qrHtml += ' border-collapse: collapse;';
      qrHtml += ' padding: 0px; margin: ' + margin + 'px;';
      qrHtml += '">';
      qrHtml += '<tbody>';

      for (var r = 0; r < _this.getModuleCount(); r += 1) {

        qrHtml += '<tr>';

        for (var c = 0; c < _this.getModuleCount(); c += 1) {
          qrHtml += '<td style="';
          qrHtml += ' border-width: 0px; border-style: none;';
          qrHtml += ' border-collapse: collapse;';
          qrHtml += ' padding: 0px; margin: 0px;';
          qrHtml += ' width: ' + cellSize + 'px;';
          qrHtml += ' height: ' + cellSize + 'px;';
          qrHtml += ' background-color: ';
          qrHtml += _this.isDark(r, c)? '#000000' : '#ffffff';
          qrHtml += ';';
          qrHtml += '"/>';
        }

        qrHtml += '</tr>';
      }

      qrHtml += '</tbody>';
      qrHtml += '</table>';

      return qrHtml;
    };

    _this.createSvgTag = function(cellSize, margin, alt, title) {

      var opts = {};
      if (typeof arguments[0] == 'object') {
        // Called by options.
        opts = arguments[0];
        // overwrite cellSize and margin.
        cellSize = opts.cellSize;
        margin = opts.margin;
        alt = opts.alt;
        title = opts.title;
      }

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      // Compose alt property surrogate
      alt = (typeof alt === 'string') ? {text: alt} : alt || {};
      alt.text = alt.text || null;
      alt.id = (alt.text) ? alt.id || 'qrcode-description' : null;

      // Compose title property surrogate
      title = (typeof title === 'string') ? {text: title} : title || {};
      title.text = title.text || null;
      title.id = (title.text) ? title.id || 'qrcode-title' : null;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var c, mc, r, mr, qrSvg='', rect;

      rect = 'l' + cellSize + ',0 0,' + cellSize +
        ' -' + cellSize + ',0 0,-' + cellSize + 'z ';

      qrSvg += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"';
      qrSvg += !opts.scalable ? ' width="' + size + 'px" height="' + size + 'px"' : '';
      qrSvg += ' viewBox="0 0 ' + size + ' ' + size + '" ';
      qrSvg += ' preserveAspectRatio="xMinYMin meet"';
      qrSvg += (title.text || alt.text) ? ' role="img" aria-labelledby="' +
          escapeXml([title.id, alt.id].join(' ').trim() ) + '"' : '';
      qrSvg += '>';
      qrSvg += (title.text) ? '<title id="' + escapeXml(title.id) + '">' +
          escapeXml(title.text) + '</title>' : '';
      qrSvg += (alt.text) ? '<description id="' + escapeXml(alt.id) + '">' +
          escapeXml(alt.text) + '</description>' : '';
      qrSvg += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>';
      qrSvg += '<path d="';

      for (r = 0; r < _this.getModuleCount(); r += 1) {
        mr = r * cellSize + margin;
        for (c = 0; c < _this.getModuleCount(); c += 1) {
          if (_this.isDark(r, c) ) {
            mc = c*cellSize+margin;
            qrSvg += 'M' + mc + ',' + mr + rect;
          }
        }
      }

      qrSvg += '" stroke="transparent" fill="black"/>';
      qrSvg += '</svg>';

      return qrSvg;
    };

    _this.createDataURL = function(cellSize, margin) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      return createDataURL(size, size, function(x, y) {
        if (min <= x && x < max && min <= y && y < max) {
          var c = Math.floor( (x - min) / cellSize);
          var r = Math.floor( (y - min) / cellSize);
          return _this.isDark(r, c)? 0 : 1;
        } else {
          return 1;
        }
      } );
    };

    _this.createImgTag = function(cellSize, margin, alt) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;

      var img = '';
      img += '<img';
      img += '\u0020src="';
      img += _this.createDataURL(cellSize, margin);
      img += '"';
      img += '\u0020width="';
      img += size;
      img += '"';
      img += '\u0020height="';
      img += size;
      img += '"';
      if (alt) {
        img += '\u0020alt="';
        img += escapeXml(alt);
        img += '"';
      }
      img += '/>';

      return img;
    };

    var escapeXml = function(s) {
      var escaped = '';
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charAt(i);
        switch(c) {
        case '<': escaped += '&lt;'; break;
        case '>': escaped += '&gt;'; break;
        case '&': escaped += '&amp;'; break;
        case '"': escaped += '&quot;'; break;
        default : escaped += c; break;
        }
      }
      return escaped;
    };

    var _createHalfASCII = function(margin) {
      var cellSize = 1;
      margin = (typeof margin == 'undefined')? cellSize * 2 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      var y, x, r1, r2, p;

      var blocks = {
        '██': '█',
        '█ ': '▀',
        ' █': '▄',
        '  ': ' '
      };

      var blocksLastLineNoMargin = {
        '██': '▀',
        '█ ': '▀',
        ' █': ' ',
        '  ': ' '
      };

      var ascii = '';
      for (y = 0; y < size; y += 2) {
        r1 = Math.floor((y - min) / cellSize);
        r2 = Math.floor((y + 1 - min) / cellSize);
        for (x = 0; x < size; x += 1) {
          p = '█';

          if (min <= x && x < max && min <= y && y < max && _this.isDark(r1, Math.floor((x - min) / cellSize))) {
            p = ' ';
          }

          if (min <= x && x < max && min <= y+1 && y+1 < max && _this.isDark(r2, Math.floor((x - min) / cellSize))) {
            p += ' ';
          }
          else {
            p += '█';
          }

          // Output 2 characters per pixel, to create full square. 1 character per pixels gives only half width of square.
          ascii += (margin < 1 && y+1 >= max) ? blocksLastLineNoMargin[p] : blocks[p];
        }

        ascii += '\n';
      }

      if (size % 2 && margin > 0) {
        return ascii.substring(0, ascii.length - size - 1) + Array(size+1).join('▀');
      }

      return ascii.substring(0, ascii.length-1);
    };

    _this.createASCII = function(cellSize, margin) {
      cellSize = cellSize || 1;

      if (cellSize < 2) {
        return _createHalfASCII(margin);
      }

      cellSize -= 1;
      margin = (typeof margin == 'undefined')? cellSize * 2 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      var y, x, r, p;

      var white = Array(cellSize+1).join('██');
      var black = Array(cellSize+1).join('  ');

      var ascii = '';
      var line = '';
      for (y = 0; y < size; y += 1) {
        r = Math.floor( (y - min) / cellSize);
        line = '';
        for (x = 0; x < size; x += 1) {
          p = 1;

          if (min <= x && x < max && min <= y && y < max && _this.isDark(r, Math.floor((x - min) / cellSize))) {
            p = 0;
          }

          // Output 2 characters per pixel, to create full square. 1 character per pixels gives only half width of square.
          line += p ? white : black;
        }

        for (r = 0; r < cellSize; r += 1) {
          ascii += line + '\n';
        }
      }

      return ascii.substring(0, ascii.length-1);
    };

    _this.renderTo2dContext = function(context, cellSize) {
      cellSize = cellSize || 2;
      var length = _this.getModuleCount();
      for (var row = 0; row < length; row++) {
        for (var col = 0; col < length; col++) {
          context.fillStyle = _this.isDark(row, col) ? 'black' : 'white';
          context.fillRect(row * cellSize, col * cellSize, cellSize, cellSize);
        }
      }
    }

    return _this;
  };

  //---------------------------------------------------------------------
  // qrcode.stringToBytes
  //---------------------------------------------------------------------

  qrcode.stringToBytesFuncs = {
    'default' : function(s) {
      var bytes = [];
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charCodeAt(i);
        bytes.push(c & 0xff);
      }
      return bytes;
    }
  };

  qrcode.stringToBytes = qrcode.stringToBytesFuncs['default'];

  //---------------------------------------------------------------------
  // qrcode.createStringToBytes
  //---------------------------------------------------------------------

  /**
   * @param unicodeData base64 string of byte array.
   * [16bit Unicode],[16bit Bytes], ...
   * @param numChars
   */
  qrcode.createStringToBytes = function(unicodeData, numChars) {

    // create conversion map.

    var unicodeMap = function() {

      var bin = base64DecodeInputStream(unicodeData);
      var read = function() {
        var b = bin.read();
        if (b == -1) throw 'eof';
        return b;
      };

      var count = 0;
      var unicodeMap = {};
      while (true) {
        var b0 = bin.read();
        if (b0 == -1) break;
        var b1 = read();
        var b2 = read();
        var b3 = read();
        var k = String.fromCharCode( (b0 << 8) | b1);
        var v = (b2 << 8) | b3;
        unicodeMap[k] = v;
        count += 1;
      }
      if (count != numChars) {
        throw count + ' != ' + numChars;
      }

      return unicodeMap;
    }();

    var unknownChar = '?'.charCodeAt(0);

    return function(s) {
      var bytes = [];
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charCodeAt(i);
        if (c < 128) {
          bytes.push(c);
        } else {
          var b = unicodeMap[s.charAt(i)];
          if (typeof b == 'number') {
            if ( (b & 0xff) == b) {
              // 1byte
              bytes.push(b);
            } else {
              // 2bytes
              bytes.push(b >>> 8);
              bytes.push(b & 0xff);
            }
          } else {
            bytes.push(unknownChar);
          }
        }
      }
      return bytes;
    };
  };

  //---------------------------------------------------------------------
  // QRMode
  //---------------------------------------------------------------------

  var QRMode = {
    MODE_NUMBER :    1 << 0,
    MODE_ALPHA_NUM : 1 << 1,
    MODE_8BIT_BYTE : 1 << 2,
    MODE_KANJI :     1 << 3
  };

  //---------------------------------------------------------------------
  // QRErrorCorrectionLevel
  //---------------------------------------------------------------------

  var QRErrorCorrectionLevel = {
    L : 1,
    M : 0,
    Q : 3,
    H : 2
  };

  //---------------------------------------------------------------------
  // QRMaskPattern
  //---------------------------------------------------------------------

  var QRMaskPattern = {
    PATTERN000 : 0,
    PATTERN001 : 1,
    PATTERN010 : 2,
    PATTERN011 : 3,
    PATTERN100 : 4,
    PATTERN101 : 5,
    PATTERN110 : 6,
    PATTERN111 : 7
  };

  //---------------------------------------------------------------------
  // QRUtil
  //---------------------------------------------------------------------

  var QRUtil = function() {

    var PATTERN_POSITION_TABLE = [
      [],
      [6, 18],
      [6, 22],
      [6, 26],
      [6, 30],
      [6, 34],
      [6, 22, 38],
      [6, 24, 42],
      [6, 26, 46],
      [6, 28, 50],
      [6, 30, 54],
      [6, 32, 58],
      [6, 34, 62],
      [6, 26, 46, 66],
      [6, 26, 48, 70],
      [6, 26, 50, 74],
      [6, 30, 54, 78],
      [6, 30, 56, 82],
      [6, 30, 58, 86],
      [6, 34, 62, 90],
      [6, 28, 50, 72, 94],
      [6, 26, 50, 74, 98],
      [6, 30, 54, 78, 102],
      [6, 28, 54, 80, 106],
      [6, 32, 58, 84, 110],
      [6, 30, 58, 86, 114],
      [6, 34, 62, 90, 118],
      [6, 26, 50, 74, 98, 122],
      [6, 30, 54, 78, 102, 126],
      [6, 26, 52, 78, 104, 130],
      [6, 30, 56, 82, 108, 134],
      [6, 34, 60, 86, 112, 138],
      [6, 30, 58, 86, 114, 142],
      [6, 34, 62, 90, 118, 146],
      [6, 30, 54, 78, 102, 126, 150],
      [6, 24, 50, 76, 102, 128, 154],
      [6, 28, 54, 80, 106, 132, 158],
      [6, 32, 58, 84, 110, 136, 162],
      [6, 26, 54, 82, 110, 138, 166],
      [6, 30, 58, 86, 114, 142, 170]
    ];
    var G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
    var G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
    var G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);

    var _this = {};

    var getBCHDigit = function(data) {
      var digit = 0;
      while (data != 0) {
        digit += 1;
        data >>>= 1;
      }
      return digit;
    };

    _this.getBCHTypeInfo = function(data) {
      var d = data << 10;
      while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
        d ^= (G15 << (getBCHDigit(d) - getBCHDigit(G15) ) );
      }
      return ( (data << 10) | d) ^ G15_MASK;
    };

    _this.getBCHTypeNumber = function(data) {
      var d = data << 12;
      while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
        d ^= (G18 << (getBCHDigit(d) - getBCHDigit(G18) ) );
      }
      return (data << 12) | d;
    };

    _this.getPatternPosition = function(typeNumber) {
      return PATTERN_POSITION_TABLE[typeNumber - 1];
    };

    _this.getMaskFunction = function(maskPattern) {

      switch (maskPattern) {

      case QRMaskPattern.PATTERN000 :
        return function(i, j) { return (i + j) % 2 == 0; };
      case QRMaskPattern.PATTERN001 :
        return function(i, j) { return i % 2 == 0; };
      case QRMaskPattern.PATTERN010 :
        return function(i, j) { return j % 3 == 0; };
      case QRMaskPattern.PATTERN011 :
        return function(i, j) { return (i + j) % 3 == 0; };
      case QRMaskPattern.PATTERN100 :
        return function(i, j) { return (Math.floor(i / 2) + Math.floor(j / 3) ) % 2 == 0; };
      case QRMaskPattern.PATTERN101 :
        return function(i, j) { return (i * j) % 2 + (i * j) % 3 == 0; };
      case QRMaskPattern.PATTERN110 :
        return function(i, j) { return ( (i * j) % 2 + (i * j) % 3) % 2 == 0; };
      case QRMaskPattern.PATTERN111 :
        return function(i, j) { return ( (i * j) % 3 + (i + j) % 2) % 2 == 0; };

      default :
        throw 'bad maskPattern:' + maskPattern;
      }
    };

    _this.getErrorCorrectPolynomial = function(errorCorrectLength) {
      var a = qrPolynomial([1], 0);
      for (var i = 0; i < errorCorrectLength; i += 1) {
        a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0) );
      }
      return a;
    };

    _this.getLengthInBits = function(mode, type) {

      if (1 <= type && type < 10) {

        // 1 - 9

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 10;
        case QRMode.MODE_ALPHA_NUM : return 9;
        case QRMode.MODE_8BIT_BYTE : return 8;
        case QRMode.MODE_KANJI     : return 8;
        default :
          throw 'mode:' + mode;
        }

      } else if (type < 27) {

        // 10 - 26

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 12;
        case QRMode.MODE_ALPHA_NUM : return 11;
        case QRMode.MODE_8BIT_BYTE : return 16;
        case QRMode.MODE_KANJI     : return 10;
        default :
          throw 'mode:' + mode;
        }

      } else if (type < 41) {

        // 27 - 40

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 14;
        case QRMode.MODE_ALPHA_NUM : return 13;
        case QRMode.MODE_8BIT_BYTE : return 16;
        case QRMode.MODE_KANJI     : return 12;
        default :
          throw 'mode:' + mode;
        }

      } else {
        throw 'type:' + type;
      }
    };

    _this.getLostPoint = function(qrcode) {

      var moduleCount = qrcode.getModuleCount();

      var lostPoint = 0;

      // LEVEL1

      for (var row = 0; row < moduleCount; row += 1) {
        for (var col = 0; col < moduleCount; col += 1) {

          var sameCount = 0;
          var dark = qrcode.isDark(row, col);

          for (var r = -1; r <= 1; r += 1) {

            if (row + r < 0 || moduleCount <= row + r) {
              continue;
            }

            for (var c = -1; c <= 1; c += 1) {

              if (col + c < 0 || moduleCount <= col + c) {
                continue;
              }

              if (r == 0 && c == 0) {
                continue;
              }

              if (dark == qrcode.isDark(row + r, col + c) ) {
                sameCount += 1;
              }
            }
          }

          if (sameCount > 5) {
            lostPoint += (3 + sameCount - 5);
          }
        }
      };

      // LEVEL2

      for (var row = 0; row < moduleCount - 1; row += 1) {
        for (var col = 0; col < moduleCount - 1; col += 1) {
          var count = 0;
          if (qrcode.isDark(row, col) ) count += 1;
          if (qrcode.isDark(row + 1, col) ) count += 1;
          if (qrcode.isDark(row, col + 1) ) count += 1;
          if (qrcode.isDark(row + 1, col + 1) ) count += 1;
          if (count == 0 || count == 4) {
            lostPoint += 3;
          }
        }
      }

      // LEVEL3

      for (var row = 0; row < moduleCount; row += 1) {
        for (var col = 0; col < moduleCount - 6; col += 1) {
          if (qrcode.isDark(row, col)
              && !qrcode.isDark(row, col + 1)
              &&  qrcode.isDark(row, col + 2)
              &&  qrcode.isDark(row, col + 3)
              &&  qrcode.isDark(row, col + 4)
              && !qrcode.isDark(row, col + 5)
              &&  qrcode.isDark(row, col + 6) ) {
            lostPoint += 40;
          }
        }
      }

      for (var col = 0; col < moduleCount; col += 1) {
        for (var row = 0; row < moduleCount - 6; row += 1) {
          if (qrcode.isDark(row, col)
              && !qrcode.isDark(row + 1, col)
              &&  qrcode.isDark(row + 2, col)
              &&  qrcode.isDark(row + 3, col)
              &&  qrcode.isDark(row + 4, col)
              && !qrcode.isDark(row + 5, col)
              &&  qrcode.isDark(row + 6, col) ) {
            lostPoint += 40;
          }
        }
      }

      // LEVEL4

      var darkCount = 0;

      for (var col = 0; col < moduleCount; col += 1) {
        for (var row = 0; row < moduleCount; row += 1) {
          if (qrcode.isDark(row, col) ) {
            darkCount += 1;
          }
        }
      }

      var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
      lostPoint += ratio * 10;

      return lostPoint;
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // QRMath
  //---------------------------------------------------------------------

  var QRMath = function() {

    var EXP_TABLE = new Array(256);
    var LOG_TABLE = new Array(256);

    // initialize tables
    for (var i = 0; i < 8; i += 1) {
      EXP_TABLE[i] = 1 << i;
    }
    for (var i = 8; i < 256; i += 1) {
      EXP_TABLE[i] = EXP_TABLE[i - 4]
        ^ EXP_TABLE[i - 5]
        ^ EXP_TABLE[i - 6]
        ^ EXP_TABLE[i - 8];
    }
    for (var i = 0; i < 255; i += 1) {
      LOG_TABLE[EXP_TABLE[i] ] = i;
    }

    var _this = {};

    _this.glog = function(n) {

      if (n < 1) {
        throw 'glog(' + n + ')';
      }

      return LOG_TABLE[n];
    };

    _this.gexp = function(n) {

      while (n < 0) {
        n += 255;
      }

      while (n >= 256) {
        n -= 255;
      }

      return EXP_TABLE[n];
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // qrPolynomial
  //---------------------------------------------------------------------

  function qrPolynomial(num, shift) {

    if (typeof num.length == 'undefined') {
      throw num.length + '/' + shift;
    }

    var _num = function() {
      var offset = 0;
      while (offset < num.length && num[offset] == 0) {
        offset += 1;
      }
      var _num = new Array(num.length - offset + shift);
      for (var i = 0; i < num.length - offset; i += 1) {
        _num[i] = num[i + offset];
      }
      return _num;
    }();

    var _this = {};

    _this.getAt = function(index) {
      return _num[index];
    };

    _this.getLength = function() {
      return _num.length;
    };

    _this.multiply = function(e) {

      var num = new Array(_this.getLength() + e.getLength() - 1);

      for (var i = 0; i < _this.getLength(); i += 1) {
        for (var j = 0; j < e.getLength(); j += 1) {
          num[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i) ) + QRMath.glog(e.getAt(j) ) );
        }
      }

      return qrPolynomial(num, 0);
    };

    _this.mod = function(e) {

      if (_this.getLength() - e.getLength() < 0) {
        return _this;
      }

      var ratio = QRMath.glog(_this.getAt(0) ) - QRMath.glog(e.getAt(0) );

      var num = new Array(_this.getLength() );
      for (var i = 0; i < _this.getLength(); i += 1) {
        num[i] = _this.getAt(i);
      }

      for (var i = 0; i < e.getLength(); i += 1) {
        num[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i) ) + ratio);
      }

      // recursive call
      return qrPolynomial(num, 0).mod(e);
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // QRRSBlock
  //---------------------------------------------------------------------

  var QRRSBlock = function() {

    var RS_BLOCK_TABLE = [

      // L
      // M
      // Q
      // H

      // 1
      [1, 26, 19],
      [1, 26, 16],
      [1, 26, 13],
      [1, 26, 9],

      // 2
      [1, 44, 34],
      [1, 44, 28],
      [1, 44, 22],
      [1, 44, 16],

      // 3
      [1, 70, 55],
      [1, 70, 44],
      [2, 35, 17],
      [2, 35, 13],

      // 4
      [1, 100, 80],
      [2, 50, 32],
      [2, 50, 24],
      [4, 25, 9],

      // 5
      [1, 134, 108],
      [2, 67, 43],
      [2, 33, 15, 2, 34, 16],
      [2, 33, 11, 2, 34, 12],

      // 6
      [2, 86, 68],
      [4, 43, 27],
      [4, 43, 19],
      [4, 43, 15],

      // 7
      [2, 98, 78],
      [4, 49, 31],
      [2, 32, 14, 4, 33, 15],
      [4, 39, 13, 1, 40, 14],

      // 8
      [2, 121, 97],
      [2, 60, 38, 2, 61, 39],
      [4, 40, 18, 2, 41, 19],
      [4, 40, 14, 2, 41, 15],

      // 9
      [2, 146, 116],
      [3, 58, 36, 2, 59, 37],
      [4, 36, 16, 4, 37, 17],
      [4, 36, 12, 4, 37, 13],

      // 10
      [2, 86, 68, 2, 87, 69],
      [4, 69, 43, 1, 70, 44],
      [6, 43, 19, 2, 44, 20],
      [6, 43, 15, 2, 44, 16],

      // 11
      [4, 101, 81],
      [1, 80, 50, 4, 81, 51],
      [4, 50, 22, 4, 51, 23],
      [3, 36, 12, 8, 37, 13],

      // 12
      [2, 116, 92, 2, 117, 93],
      [6, 58, 36, 2, 59, 37],
      [4, 46, 20, 6, 47, 21],
      [7, 42, 14, 4, 43, 15],

      // 13
      [4, 133, 107],
      [8, 59, 37, 1, 60, 38],
      [8, 44, 20, 4, 45, 21],
      [12, 33, 11, 4, 34, 12],

      // 14
      [3, 145, 115, 1, 146, 116],
      [4, 64, 40, 5, 65, 41],
      [11, 36, 16, 5, 37, 17],
      [11, 36, 12, 5, 37, 13],

      // 15
      [5, 109, 87, 1, 110, 88],
      [5, 65, 41, 5, 66, 42],
      [5, 54, 24, 7, 55, 25],
      [11, 36, 12, 7, 37, 13],

      // 16
      [5, 122, 98, 1, 123, 99],
      [7, 73, 45, 3, 74, 46],
      [15, 43, 19, 2, 44, 20],
      [3, 45, 15, 13, 46, 16],

      // 17
      [1, 135, 107, 5, 136, 108],
      [10, 74, 46, 1, 75, 47],
      [1, 50, 22, 15, 51, 23],
      [2, 42, 14, 17, 43, 15],

      // 18
      [5, 150, 120, 1, 151, 121],
      [9, 69, 43, 4, 70, 44],
      [17, 50, 22, 1, 51, 23],
      [2, 42, 14, 19, 43, 15],

      // 19
      [3, 141, 113, 4, 142, 114],
      [3, 70, 44, 11, 71, 45],
      [17, 47, 21, 4, 48, 22],
      [9, 39, 13, 16, 40, 14],

      // 20
      [3, 135, 107, 5, 136, 108],
      [3, 67, 41, 13, 68, 42],
      [15, 54, 24, 5, 55, 25],
      [15, 43, 15, 10, 44, 16],

      // 21
      [4, 144, 116, 4, 145, 117],
      [17, 68, 42],
      [17, 50, 22, 6, 51, 23],
      [19, 46, 16, 6, 47, 17],

      // 22
      [2, 139, 111, 7, 140, 112],
      [17, 74, 46],
      [7, 54, 24, 16, 55, 25],
      [34, 37, 13],

      // 23
      [4, 151, 121, 5, 152, 122],
      [4, 75, 47, 14, 76, 48],
      [11, 54, 24, 14, 55, 25],
      [16, 45, 15, 14, 46, 16],

      // 24
      [6, 147, 117, 4, 148, 118],
      [6, 73, 45, 14, 74, 46],
      [11, 54, 24, 16, 55, 25],
      [30, 46, 16, 2, 47, 17],

      // 25
      [8, 132, 106, 4, 133, 107],
      [8, 75, 47, 13, 76, 48],
      [7, 54, 24, 22, 55, 25],
      [22, 45, 15, 13, 46, 16],

      // 26
      [10, 142, 114, 2, 143, 115],
      [19, 74, 46, 4, 75, 47],
      [28, 50, 22, 6, 51, 23],
      [33, 46, 16, 4, 47, 17],

      // 27
      [8, 152, 122, 4, 153, 123],
      [22, 73, 45, 3, 74, 46],
      [8, 53, 23, 26, 54, 24],
      [12, 45, 15, 28, 46, 16],

      // 28
      [3, 147, 117, 10, 148, 118],
      [3, 73, 45, 23, 74, 46],
      [4, 54, 24, 31, 55, 25],
      [11, 45, 15, 31, 46, 16],

      // 29
      [7, 146, 116, 7, 147, 117],
      [21, 73, 45, 7, 74, 46],
      [1, 53, 23, 37, 54, 24],
      [19, 45, 15, 26, 46, 16],

      // 30
      [5, 145, 115, 10, 146, 116],
      [19, 75, 47, 10, 76, 48],
      [15, 54, 24, 25, 55, 25],
      [23, 45, 15, 25, 46, 16],

      // 31
      [13, 145, 115, 3, 146, 116],
      [2, 74, 46, 29, 75, 47],
      [42, 54, 24, 1, 55, 25],
      [23, 45, 15, 28, 46, 16],

      // 32
      [17, 145, 115],
      [10, 74, 46, 23, 75, 47],
      [10, 54, 24, 35, 55, 25],
      [19, 45, 15, 35, 46, 16],

      // 33
      [17, 145, 115, 1, 146, 116],
      [14, 74, 46, 21, 75, 47],
      [29, 54, 24, 19, 55, 25],
      [11, 45, 15, 46, 46, 16],

      // 34
      [13, 145, 115, 6, 146, 116],
      [14, 74, 46, 23, 75, 47],
      [44, 54, 24, 7, 55, 25],
      [59, 46, 16, 1, 47, 17],

      // 35
      [12, 151, 121, 7, 152, 122],
      [12, 75, 47, 26, 76, 48],
      [39, 54, 24, 14, 55, 25],
      [22, 45, 15, 41, 46, 16],

      // 36
      [6, 151, 121, 14, 152, 122],
      [6, 75, 47, 34, 76, 48],
      [46, 54, 24, 10, 55, 25],
      [2, 45, 15, 64, 46, 16],

      // 37
      [17, 152, 122, 4, 153, 123],
      [29, 74, 46, 14, 75, 47],
      [49, 54, 24, 10, 55, 25],
      [24, 45, 15, 46, 46, 16],

      // 38
      [4, 152, 122, 18, 153, 123],
      [13, 74, 46, 32, 75, 47],
      [48, 54, 24, 14, 55, 25],
      [42, 45, 15, 32, 46, 16],

      // 39
      [20, 147, 117, 4, 148, 118],
      [40, 75, 47, 7, 76, 48],
      [43, 54, 24, 22, 55, 25],
      [10, 45, 15, 67, 46, 16],

      // 40
      [19, 148, 118, 6, 149, 119],
      [18, 75, 47, 31, 76, 48],
      [34, 54, 24, 34, 55, 25],
      [20, 45, 15, 61, 46, 16]
    ];

    var qrRSBlock = function(totalCount, dataCount) {
      var _this = {};
      _this.totalCount = totalCount;
      _this.dataCount = dataCount;
      return _this;
    };

    var _this = {};

    var getRsBlockTable = function(typeNumber, errorCorrectionLevel) {

      switch(errorCorrectionLevel) {
      case QRErrorCorrectionLevel.L :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
      case QRErrorCorrectionLevel.M :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
      case QRErrorCorrectionLevel.Q :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
      case QRErrorCorrectionLevel.H :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
      default :
        return undefined;
      }
    };

    _this.getRSBlocks = function(typeNumber, errorCorrectionLevel) {

      var rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);

      if (typeof rsBlock == 'undefined') {
        throw 'bad rs block @ typeNumber:' + typeNumber +
            '/errorCorrectionLevel:' + errorCorrectionLevel;
      }

      var length = rsBlock.length / 3;

      var list = [];

      for (var i = 0; i < length; i += 1) {

        var count = rsBlock[i * 3 + 0];
        var totalCount = rsBlock[i * 3 + 1];
        var dataCount = rsBlock[i * 3 + 2];

        for (var j = 0; j < count; j += 1) {
          list.push(qrRSBlock(totalCount, dataCount) );
        }
      }

      return list;
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // qrBitBuffer
  //---------------------------------------------------------------------

  var qrBitBuffer = function() {

    var _buffer = [];
    var _length = 0;

    var _this = {};

    _this.getBuffer = function() {
      return _buffer;
    };

    _this.getAt = function(index) {
      var bufIndex = Math.floor(index / 8);
      return ( (_buffer[bufIndex] >>> (7 - index % 8) ) & 1) == 1;
    };

    _this.put = function(num, length) {
      for (var i = 0; i < length; i += 1) {
        _this.putBit( ( (num >>> (length - i - 1) ) & 1) == 1);
      }
    };

    _this.getLengthInBits = function() {
      return _length;
    };

    _this.putBit = function(bit) {

      var bufIndex = Math.floor(_length / 8);
      if (_buffer.length <= bufIndex) {
        _buffer.push(0);
      }

      if (bit) {
        _buffer[bufIndex] |= (0x80 >>> (_length % 8) );
      }

      _length += 1;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrNumber
  //---------------------------------------------------------------------

  var qrNumber = function(data) {

    var _mode = QRMode.MODE_NUMBER;
    var _data = data;

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _data.length;
    };

    _this.write = function(buffer) {

      var data = _data;

      var i = 0;

      while (i + 2 < data.length) {
        buffer.put(strToNum(data.substring(i, i + 3) ), 10);
        i += 3;
      }

      if (i < data.length) {
        if (data.length - i == 1) {
          buffer.put(strToNum(data.substring(i, i + 1) ), 4);
        } else if (data.length - i == 2) {
          buffer.put(strToNum(data.substring(i, i + 2) ), 7);
        }
      }
    };

    var strToNum = function(s) {
      var num = 0;
      for (var i = 0; i < s.length; i += 1) {
        num = num * 10 + chatToNum(s.charAt(i) );
      }
      return num;
    };

    var chatToNum = function(c) {
      if ('0' <= c && c <= '9') {
        return c.charCodeAt(0) - '0'.charCodeAt(0);
      }
      throw 'illegal char :' + c;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrAlphaNum
  //---------------------------------------------------------------------

  var qrAlphaNum = function(data) {

    var _mode = QRMode.MODE_ALPHA_NUM;
    var _data = data;

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _data.length;
    };

    _this.write = function(buffer) {

      var s = _data;

      var i = 0;

      while (i + 1 < s.length) {
        buffer.put(
          getCode(s.charAt(i) ) * 45 +
          getCode(s.charAt(i + 1) ), 11);
        i += 2;
      }

      if (i < s.length) {
        buffer.put(getCode(s.charAt(i) ), 6);
      }
    };

    var getCode = function(c) {

      if ('0' <= c && c <= '9') {
        return c.charCodeAt(0) - '0'.charCodeAt(0);
      } else if ('A' <= c && c <= 'Z') {
        return c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
      } else {
        switch (c) {
        case ' ' : return 36;
        case '$' : return 37;
        case '%' : return 38;
        case '*' : return 39;
        case '+' : return 40;
        case '-' : return 41;
        case '.' : return 42;
        case '/' : return 43;
        case ':' : return 44;
        default :
          throw 'illegal char :' + c;
        }
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qr8BitByte
  //---------------------------------------------------------------------

  var qr8BitByte = function(data) {

    var _mode = QRMode.MODE_8BIT_BYTE;
    var _data = data;
    var _bytes = qrcode.stringToBytes(data);

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _bytes.length;
    };

    _this.write = function(buffer) {
      for (var i = 0; i < _bytes.length; i += 1) {
        buffer.put(_bytes[i], 8);
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrKanji
  //---------------------------------------------------------------------

  var qrKanji = function(data) {

    var _mode = QRMode.MODE_KANJI;
    var _data = data;

    var stringToBytes = qrcode.stringToBytesFuncs['SJIS'];
    if (!stringToBytes) {
      throw 'sjis not supported.';
    }
    !function(c, code) {
      // self test for sjis support.
      var test = stringToBytes(c);
      if (test.length != 2 || ( (test[0] << 8) | test[1]) != code) {
        throw 'sjis not supported.';
      }
    }('\u53cb', 0x9746);

    var _bytes = stringToBytes(data);

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return ~~(_bytes.length / 2);
    };

    _this.write = function(buffer) {

      var data = _bytes;

      var i = 0;

      while (i + 1 < data.length) {

        var c = ( (0xff & data[i]) << 8) | (0xff & data[i + 1]);

        if (0x8140 <= c && c <= 0x9FFC) {
          c -= 0x8140;
        } else if (0xE040 <= c && c <= 0xEBBF) {
          c -= 0xC140;
        } else {
          throw 'illegal char at ' + (i + 1) + '/' + c;
        }

        c = ( (c >>> 8) & 0xff) * 0xC0 + (c & 0xff);

        buffer.put(c, 13);

        i += 2;
      }

      if (i < data.length) {
        throw 'illegal char at ' + (i + 1);
      }
    };

    return _this;
  };

  //=====================================================================
  // GIF Support etc.
  //

  //---------------------------------------------------------------------
  // byteArrayOutputStream
  //---------------------------------------------------------------------

  var byteArrayOutputStream = function() {

    var _bytes = [];

    var _this = {};

    _this.writeByte = function(b) {
      _bytes.push(b & 0xff);
    };

    _this.writeShort = function(i) {
      _this.writeByte(i);
      _this.writeByte(i >>> 8);
    };

    _this.writeBytes = function(b, off, len) {
      off = off || 0;
      len = len || b.length;
      for (var i = 0; i < len; i += 1) {
        _this.writeByte(b[i + off]);
      }
    };

    _this.writeString = function(s) {
      for (var i = 0; i < s.length; i += 1) {
        _this.writeByte(s.charCodeAt(i) );
      }
    };

    _this.toByteArray = function() {
      return _bytes;
    };

    _this.toString = function() {
      var s = '';
      s += '[';
      for (var i = 0; i < _bytes.length; i += 1) {
        if (i > 0) {
          s += ',';
        }
        s += _bytes[i];
      }
      s += ']';
      return s;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // base64EncodeOutputStream
  //---------------------------------------------------------------------

  var base64EncodeOutputStream = function() {

    var _buffer = 0;
    var _buflen = 0;
    var _length = 0;
    var _base64 = '';

    var _this = {};

    var writeEncoded = function(b) {
      _base64 += String.fromCharCode(encode(b & 0x3f) );
    };

    var encode = function(n) {
      if (n < 0) {
        // error.
      } else if (n < 26) {
        return 0x41 + n;
      } else if (n < 52) {
        return 0x61 + (n - 26);
      } else if (n < 62) {
        return 0x30 + (n - 52);
      } else if (n == 62) {
        return 0x2b;
      } else if (n == 63) {
        return 0x2f;
      }
      throw 'n:' + n;
    };

    _this.writeByte = function(n) {

      _buffer = (_buffer << 8) | (n & 0xff);
      _buflen += 8;
      _length += 1;

      while (_buflen >= 6) {
        writeEncoded(_buffer >>> (_buflen - 6) );
        _buflen -= 6;
      }
    };

    _this.flush = function() {

      if (_buflen > 0) {
        writeEncoded(_buffer << (6 - _buflen) );
        _buffer = 0;
        _buflen = 0;
      }

      if (_length % 3 != 0) {
        // padding
        var padlen = 3 - _length % 3;
        for (var i = 0; i < padlen; i += 1) {
          _base64 += '=';
        }
      }
    };

    _this.toString = function() {
      return _base64;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // base64DecodeInputStream
  //---------------------------------------------------------------------

  var base64DecodeInputStream = function(str) {

    var _str = str;
    var _pos = 0;
    var _buffer = 0;
    var _buflen = 0;

    var _this = {};

    _this.read = function() {

      while (_buflen < 8) {

        if (_pos >= _str.length) {
          if (_buflen == 0) {
            return -1;
          }
          throw 'unexpected end of file./' + _buflen;
        }

        var c = _str.charAt(_pos);
        _pos += 1;

        if (c == '=') {
          _buflen = 0;
          return -1;
        } else if (c.match(/^\s$/) ) {
          // ignore if whitespace.
          continue;
        }

        _buffer = (_buffer << 6) | decode(c.charCodeAt(0) );
        _buflen += 6;
      }

      var n = (_buffer >>> (_buflen - 8) ) & 0xff;
      _buflen -= 8;
      return n;
    };

    var decode = function(c) {
      if (0x41 <= c && c <= 0x5a) {
        return c - 0x41;
      } else if (0x61 <= c && c <= 0x7a) {
        return c - 0x61 + 26;
      } else if (0x30 <= c && c <= 0x39) {
        return c - 0x30 + 52;
      } else if (c == 0x2b) {
        return 62;
      } else if (c == 0x2f) {
        return 63;
      } else {
        throw 'c:' + c;
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // gifImage (B/W)
  //---------------------------------------------------------------------

  var gifImage = function(width, height) {

    var _width = width;
    var _height = height;
    var _data = new Array(width * height);

    var _this = {};

    _this.setPixel = function(x, y, pixel) {
      _data[y * _width + x] = pixel;
    };

    _this.write = function(out) {

      //---------------------------------
      // GIF Signature

      out.writeString('GIF87a');

      //---------------------------------
      // Screen Descriptor

      out.writeShort(_width);
      out.writeShort(_height);

      out.writeByte(0x80); // 2bit
      out.writeByte(0);
      out.writeByte(0);

      //---------------------------------
      // Global Color Map

      // black
      out.writeByte(0x00);
      out.writeByte(0x00);
      out.writeByte(0x00);

      // white
      out.writeByte(0xff);
      out.writeByte(0xff);
      out.writeByte(0xff);

      //---------------------------------
      // Image Descriptor

      out.writeString(',');
      out.writeShort(0);
      out.writeShort(0);
      out.writeShort(_width);
      out.writeShort(_height);
      out.writeByte(0);

      //---------------------------------
      // Local Color Map

      //---------------------------------
      // Raster Data

      var lzwMinCodeSize = 2;
      var raster = getLZWRaster(lzwMinCodeSize);

      out.writeByte(lzwMinCodeSize);

      var offset = 0;

      while (raster.length - offset > 255) {
        out.writeByte(255);
        out.writeBytes(raster, offset, 255);
        offset += 255;
      }

      out.writeByte(raster.length - offset);
      out.writeBytes(raster, offset, raster.length - offset);
      out.writeByte(0x00);

      //---------------------------------
      // GIF Terminator
      out.writeString(';');
    };

    var bitOutputStream = function(out) {

      var _out = out;
      var _bitLength = 0;
      var _bitBuffer = 0;

      var _this = {};

      _this.write = function(data, length) {

        if ( (data >>> length) != 0) {
          throw 'length over';
        }

        while (_bitLength + length >= 8) {
          _out.writeByte(0xff & ( (data << _bitLength) | _bitBuffer) );
          length -= (8 - _bitLength);
          data >>>= (8 - _bitLength);
          _bitBuffer = 0;
          _bitLength = 0;
        }

        _bitBuffer = (data << _bitLength) | _bitBuffer;
        _bitLength = _bitLength + length;
      };

      _this.flush = function() {
        if (_bitLength > 0) {
          _out.writeByte(_bitBuffer);
        }
      };

      return _this;
    };

    var getLZWRaster = function(lzwMinCodeSize) {

      var clearCode = 1 << lzwMinCodeSize;
      var endCode = (1 << lzwMinCodeSize) + 1;
      var bitLength = lzwMinCodeSize + 1;

      // Setup LZWTable
      var table = lzwTable();

      for (var i = 0; i < clearCode; i += 1) {
        table.add(String.fromCharCode(i) );
      }
      table.add(String.fromCharCode(clearCode) );
      table.add(String.fromCharCode(endCode) );

      var byteOut = byteArrayOutputStream();
      var bitOut = bitOutputStream(byteOut);

      // clear code
      bitOut.write(clearCode, bitLength);

      var dataIndex = 0;

      var s = String.fromCharCode(_data[dataIndex]);
      dataIndex += 1;

      while (dataIndex < _data.length) {

        var c = String.fromCharCode(_data[dataIndex]);
        dataIndex += 1;

        if (table.contains(s + c) ) {

          s = s + c;

        } else {

          bitOut.write(table.indexOf(s), bitLength);

          if (table.size() < 0xfff) {

            if (table.size() == (1 << bitLength) ) {
              bitLength += 1;
            }

            table.add(s + c);
          }

          s = c;
        }
      }

      bitOut.write(table.indexOf(s), bitLength);

      // end code
      bitOut.write(endCode, bitLength);

      bitOut.flush();

      return byteOut.toByteArray();
    };

    var lzwTable = function() {

      var _map = {};
      var _size = 0;

      var _this = {};

      _this.add = function(key) {
        if (_this.contains(key) ) {
          throw 'dup key:' + key;
        }
        _map[key] = _size;
        _size += 1;
      };

      _this.size = function() {
        return _size;
      };

      _this.indexOf = function(key) {
        return _map[key];
      };

      _this.contains = function(key) {
        return typeof _map[key] != 'undefined';
      };

      return _this;
    };

    return _this;
  };

  var createDataURL = function(width, height, getPixel) {
    var gif = gifImage(width, height);
    for (var y = 0; y < height; y += 1) {
      for (var x = 0; x < width; x += 1) {
        gif.setPixel(x, y, getPixel(x, y) );
      }
    }

    var b = byteArrayOutputStream();
    gif.write(b);

    var base64 = base64EncodeOutputStream();
    var bytes = b.toByteArray();
    for (var i = 0; i < bytes.length; i += 1) {
      base64.writeByte(bytes[i]);
    }
    base64.flush();

    return 'data:image/gif;base64,' + base64;
  };

  //---------------------------------------------------------------------
  // returns qrcode function.

  return qrcode;
}();

// multibyte support
!function() {

  qrcode.stringToBytesFuncs['UTF-8'] = function(s) {
    // http://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
    function toUTF8Array(str) {
      var utf8 = [];
      for (var i=0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
          utf8.push(0xc0 | (charcode >> 6),
              0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
          utf8.push(0xe0 | (charcode >> 12),
              0x80 | ((charcode>>6) & 0x3f),
              0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
          i++;
          // UTF-16 encodes 0x10000-0x10FFFF by
          // subtracting 0x10000 and splitting the
          // 20 bits of 0x0-0xFFFFF into two halves
          charcode = 0x10000 + (((charcode & 0x3ff)<<10)
            | (str.charCodeAt(i) & 0x3ff));
          utf8.push(0xf0 | (charcode >>18),
              0x80 | ((charcode>>12) & 0x3f),
              0x80 | ((charcode>>6) & 0x3f),
              0x80 | (charcode & 0x3f));
        }
      }
      return utf8;
    }
    return toUTF8Array(s);
  };

}();

(function (factory) {
  if (true) {
      !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(function () {
    return qrcode;
}));


/***/ }),

/***/ "./src/constants/cornerDotTypes.ts":
/*!*****************************************!*\
  !*** ./src/constants/cornerDotTypes.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    dot: "dot",
    square: "square",
    star: "star",
    plus: "plus",
    squareRounded: "square-rounded",
    rightBottomSquare: "square-right-bottom",
    leaf: "leaf",
    leftTopCircle: "circle-left-top",
    rightBottomCircle: "circle-right-bottom",
    diamond: "diamond",
    cross: "cross",
    rhombus: "rhombus"
});


/***/ }),

/***/ "./src/constants/cornerSquareTypes.ts":
/*!********************************************!*\
  !*** ./src/constants/cornerSquareTypes.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    dot: "dot",
    square: "square",
    dottedSquare: "dotted-square",
    extraRounded: "extra-rounded",
    rightBottomSquare: "right-bottom-square",
    leftTopSquare: "left-top-square",
    leftTopCircle: "circle-left-top",
    rightBottomCircle: "circle-right-bottom",
    circleInSquare: "circle-in-square",
    peanut: "peanut",
    // paragonal: "paragonal",
});


/***/ }),

/***/ "./src/constants/dotTypes.ts":
/*!***********************************!*\
  !*** ./src/constants/dotTypes.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    dots: "dots",
    rounded: "rounded",
    classy: "classy",
    classyRounded: "classy-rounded",
    square: "square",
    extraRounded: "extra-rounded",
    star: "star",
});


/***/ }),

/***/ "./src/constants/drawTypes.ts":
/*!************************************!*\
  !*** ./src/constants/drawTypes.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    canvas: "canvas",
    svg: "svg"
});


/***/ }),

/***/ "./src/constants/errorCorrectionLevels.ts":
/*!************************************************!*\
  !*** ./src/constants/errorCorrectionLevels.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    L: "L",
    M: "M",
    Q: "Q",
    H: "H"
});


/***/ }),

/***/ "./src/constants/errorCorrectionPercents.ts":
/*!**************************************************!*\
  !*** ./src/constants/errorCorrectionPercents.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    L: 0.07,
    M: 0.15,
    Q: 0.25,
    H: 0.3
});


/***/ }),

/***/ "./src/constants/gradientTypes.ts":
/*!****************************************!*\
  !*** ./src/constants/gradientTypes.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    radial: "radial",
    linear: "linear"
});


/***/ }),

/***/ "./src/constants/modes.ts":
/*!********************************!*\
  !*** ./src/constants/modes.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    numeric: "Numeric",
    alphanumeric: "Alphanumeric",
    byte: "Byte",
    kanji: "Kanji"
});


/***/ }),

/***/ "./src/constants/qrTypes.ts":
/*!**********************************!*\
  !*** ./src/constants/qrTypes.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var qrTypes = {};
for (var type = 0; type <= 40; type++) {
    qrTypes[type] = type;
}
// 0 types is autodetect
// types = {
//     0: 0,
//     1: 1,
//     ...
//     40: 40
// }
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (qrTypes);


/***/ }),

/***/ "./src/core/QRCanvas.ts":
/*!******************************!*\
  !*** ./src/core/QRCanvas.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tools_calculateImageSize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../tools/calculateImageSize */ "./src/tools/calculateImageSize.ts");
/* harmony import */ var _constants_errorCorrectionPercents__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants/errorCorrectionPercents */ "./src/constants/errorCorrectionPercents.ts");
/* harmony import */ var _figures_dot_canvas_QRDot__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../figures/dot/canvas/QRDot */ "./src/figures/dot/canvas/QRDot.ts");
/* harmony import */ var _figures_cornerSquare_canvas_QRCornerSquare__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../figures/cornerSquare/canvas/QRCornerSquare */ "./src/figures/cornerSquare/canvas/QRCornerSquare.ts");
/* harmony import */ var _figures_cornerDot_canvas_QRCornerDot__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../figures/cornerDot/canvas/QRCornerDot */ "./src/figures/cornerDot/canvas/QRCornerDot.ts");
/* harmony import */ var _constants_gradientTypes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../constants/gradientTypes */ "./src/constants/gradientTypes.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};






var squareMask = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1]
];
var dotMask = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
];
var QRCanvas = /** @class */ (function () {
    //TODO don't pass all options to this class
    function QRCanvas(options) {
        this._canvas = document.createElement("canvas");
        this._canvas.width = options.width;
        this._canvas.height = options.height;
        this._options = options;
    }
    Object.defineProperty(QRCanvas.prototype, "context", {
        get: function () {
            return this._canvas.getContext("2d");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(QRCanvas.prototype, "width", {
        get: function () {
            return this._canvas.width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(QRCanvas.prototype, "height", {
        get: function () {
            return this._canvas.height;
        },
        enumerable: false,
        configurable: true
    });
    QRCanvas.prototype.getCanvas = function () {
        return this._canvas;
    };
    QRCanvas.prototype.clear = function () {
        var canvasContext = this.context;
        if (canvasContext) {
            canvasContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
        }
    };
    QRCanvas.prototype.drawQR = function (qr) {
        return __awaiter(this, void 0, void 0, function () {
            var count, minSize, dotSize, drawImageSize, _a, imageOptions, qrOptions, coverLevel, maxHiddenDots;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        count = qr.getModuleCount();
                        minSize = Math.min(this._options.width, this._options.height) - this._options.margin * 2;
                        dotSize = Math.floor(minSize / count);
                        drawImageSize = {
                            hideXDots: 0,
                            hideYDots: 0,
                            width: 0,
                            height: 0
                        };
                        this._qr = qr;
                        if (!this._options.image) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.loadImage()];
                    case 1:
                        _b.sent();
                        if (!this._image)
                            return [2 /*return*/];
                        _a = this._options, imageOptions = _a.imageOptions, qrOptions = _a.qrOptions;
                        coverLevel = imageOptions.imageSize * _constants_errorCorrectionPercents__WEBPACK_IMPORTED_MODULE_1__["default"][qrOptions.errorCorrectionLevel];
                        maxHiddenDots = Math.floor(coverLevel * count * count);
                        drawImageSize = (0,_tools_calculateImageSize__WEBPACK_IMPORTED_MODULE_0__["default"])({
                            originalWidth: this._image.width,
                            originalHeight: this._image.height,
                            maxHiddenDots: maxHiddenDots,
                            maxHiddenAxisDots: count - 14,
                            dotSize: dotSize
                        });
                        _b.label = 2;
                    case 2:
                        this.clear();
                        this.drawBackground();
                        this.drawDots(function (i, j) {
                            var _a, _b, _c, _d, _e, _f;
                            if (_this._options.imageOptions.hideBackgroundDots) {
                                if (i >= (count - drawImageSize.hideXDots) / 2 &&
                                    i < (count + drawImageSize.hideXDots) / 2 &&
                                    j >= (count - drawImageSize.hideYDots) / 2 &&
                                    j < (count + drawImageSize.hideYDots) / 2) {
                                    return false;
                                }
                            }
                            if (((_a = squareMask[i]) === null || _a === void 0 ? void 0 : _a[j]) || ((_b = squareMask[i - count + 7]) === null || _b === void 0 ? void 0 : _b[j]) || ((_c = squareMask[i]) === null || _c === void 0 ? void 0 : _c[j - count + 7])) {
                                return false;
                            }
                            if (((_d = dotMask[i]) === null || _d === void 0 ? void 0 : _d[j]) || ((_e = dotMask[i - count + 7]) === null || _e === void 0 ? void 0 : _e[j]) || ((_f = dotMask[i]) === null || _f === void 0 ? void 0 : _f[j - count + 7])) {
                                return false;
                            }
                            return true;
                        });
                        this.drawCorners();
                        if (this._options.image) {
                            this.drawImage({ width: drawImageSize.width, height: drawImageSize.height, count: count, dotSize: dotSize });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    QRCanvas.prototype.drawBackground = function () {
        var canvasContext = this.context;
        var options = this._options;
        if (canvasContext) {
            if (options.backgroundOptions.gradient) {
                var gradientOptions = options.backgroundOptions.gradient;
                var gradient_1 = this._createGradient({
                    context: canvasContext,
                    options: gradientOptions,
                    additionalRotation: 0,
                    x: 0,
                    y: 0,
                    size: this._canvas.width > this._canvas.height ? this._canvas.width : this._canvas.height
                });
                gradientOptions.colorStops.forEach(function (_a) {
                    var offset = _a.offset, color = _a.color;
                    gradient_1.addColorStop(offset, color);
                });
                canvasContext.fillStyle = gradient_1;
            }
            else if (options.backgroundOptions.color) {
                canvasContext.fillStyle = options.backgroundOptions.color;
            }
            canvasContext.fillRect(0, 0, this._canvas.width, this._canvas.height);
        }
    };
    QRCanvas.prototype.drawDots = function (filter) {
        var _this = this;
        if (!this._qr) {
            throw "QR code is not defined";
        }
        var canvasContext = this.context;
        if (!canvasContext) {
            throw "QR code is not defined";
        }
        var options = this._options;
        var count = this._qr.getModuleCount();
        if (count > options.width || count > options.height) {
            throw "The canvas is too small.";
        }
        var minSize = Math.min(options.width, options.height) - options.margin * 2;
        var dotSize = Math.floor(minSize / count);
        var xBeginning = Math.floor((options.width - count * dotSize) / 2);
        var yBeginning = Math.floor((options.height - count * dotSize) / 2);
        var dot = new _figures_dot_canvas_QRDot__WEBPACK_IMPORTED_MODULE_2__["default"]({ context: canvasContext, type: options.dotsOptions.type });
        canvasContext.beginPath();
        var _loop_1 = function (i) {
            var _loop_2 = function (j) {
                if (filter && !filter(i, j)) {
                    return "continue";
                }
                if (!this_1._qr.isDark(i, j)) {
                    return "continue";
                }
                dot.draw(xBeginning + i * dotSize, yBeginning + j * dotSize, dotSize, function (xOffset, yOffset) {
                    if (i + xOffset < 0 || j + yOffset < 0 || i + xOffset >= count || j + yOffset >= count)
                        return false;
                    if (filter && !filter(i + xOffset, j + yOffset))
                        return false;
                    return !!_this._qr && _this._qr.isDark(i + xOffset, j + yOffset);
                });
            };
            for (var j = 0; j < count; j++) {
                _loop_2(j);
            }
        };
        var this_1 = this;
        for (var i = 0; i < count; i++) {
            _loop_1(i);
        }
        if (options.dotsOptions.gradient) {
            var gradientOptions = options.dotsOptions.gradient;
            var gradient_2 = this._createGradient({
                context: canvasContext,
                options: gradientOptions,
                additionalRotation: 0,
                x: xBeginning,
                y: yBeginning,
                size: count * dotSize
            });
            gradientOptions.colorStops.forEach(function (_a) {
                var offset = _a.offset, color = _a.color;
                gradient_2.addColorStop(offset, color);
            });
            canvasContext.fillStyle = canvasContext.strokeStyle = gradient_2;
        }
        else if (options.dotsOptions.color) {
            canvasContext.fillStyle = canvasContext.strokeStyle = options.dotsOptions.color;
        }
        canvasContext.fill("evenodd");
    };
    QRCanvas.prototype.drawCorners = function (filter) {
        var _this = this;
        if (!this._qr) {
            throw "QR code is not defined";
        }
        var canvasContext = this.context;
        if (!canvasContext) {
            throw "QR code is not defined";
        }
        var options = this._options;
        var count = this._qr.getModuleCount();
        var minSize = Math.min(options.width, options.height) - options.margin * 2;
        var dotSize = Math.floor(minSize / count);
        var cornersSquareSize = dotSize * 7;
        var cornersDotSize = dotSize * 3;
        var xBeginning = Math.floor((options.width - count * dotSize) / 2);
        var yBeginning = Math.floor((options.height - count * dotSize) / 2);
        [
            [0, 0, 0],
            [1, 0, Math.PI / 2],
            [0, 1, -Math.PI / 2]
        ].forEach(function (_a) {
            var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            var column = _a[0], row = _a[1], rotation = _a[2];
            if (filter && !filter(column, row)) {
                return;
            }
            var x = xBeginning + column * dotSize * (count - 7);
            var y = yBeginning + row * dotSize * (count - 7);
            if ((_b = options.cornersSquareOptions) === null || _b === void 0 ? void 0 : _b.type) {
                var cornersSquare = new _figures_cornerSquare_canvas_QRCornerSquare__WEBPACK_IMPORTED_MODULE_3__["default"]({ context: canvasContext, type: (_c = options.cornersSquareOptions) === null || _c === void 0 ? void 0 : _c.type });
                canvasContext.beginPath();
                cornersSquare.draw(x, y, cornersSquareSize, rotation);
            }
            else {
                var dot = new _figures_dot_canvas_QRDot__WEBPACK_IMPORTED_MODULE_2__["default"]({ context: canvasContext, type: options.dotsOptions.type });
                canvasContext.beginPath();
                var _loop_3 = function (i) {
                    var _loop_5 = function (j) {
                        if (!((_d = squareMask[i]) === null || _d === void 0 ? void 0 : _d[j])) {
                            return "continue";
                        }
                        dot.draw(x + i * dotSize, y + j * dotSize, dotSize, function (xOffset, yOffset) { var _a; return !!((_a = squareMask[i + xOffset]) === null || _a === void 0 ? void 0 : _a[j + yOffset]); });
                    };
                    for (var j = 0; j < squareMask[i].length; j++) {
                        _loop_5(j);
                    }
                };
                for (var i = 0; i < squareMask.length; i++) {
                    _loop_3(i);
                }
            }
            if ((_e = options.cornersSquareOptions) === null || _e === void 0 ? void 0 : _e.gradient) {
                var gradientOptions = options.cornersSquareOptions.gradient;
                var gradient_3 = _this._createGradient({
                    context: canvasContext,
                    options: gradientOptions,
                    additionalRotation: rotation,
                    x: x,
                    y: y,
                    size: cornersSquareSize
                });
                gradientOptions.colorStops.forEach(function (_a) {
                    var offset = _a.offset, color = _a.color;
                    gradient_3.addColorStop(offset, color);
                });
                canvasContext.fillStyle = canvasContext.strokeStyle = gradient_3;
            }
            else if ((_f = options.cornersSquareOptions) === null || _f === void 0 ? void 0 : _f.color) {
                canvasContext.fillStyle = canvasContext.strokeStyle = options.cornersSquareOptions.color;
            }
            canvasContext.fill("evenodd");
            if ((_g = options.cornersDotOptions) === null || _g === void 0 ? void 0 : _g.type) {
                var cornersDot = new _figures_cornerDot_canvas_QRCornerDot__WEBPACK_IMPORTED_MODULE_4__["default"]({ context: canvasContext, type: (_h = options.cornersDotOptions) === null || _h === void 0 ? void 0 : _h.type });
                canvasContext.beginPath();
                cornersDot.draw(x + dotSize * 2, y + dotSize * 2, cornersDotSize, rotation);
            }
            else {
                var dot = new _figures_dot_canvas_QRDot__WEBPACK_IMPORTED_MODULE_2__["default"]({ context: canvasContext, type: options.dotsOptions.type });
                canvasContext.beginPath();
                var _loop_4 = function (i) {
                    var _loop_6 = function (j) {
                        if (!((_j = dotMask[i]) === null || _j === void 0 ? void 0 : _j[j])) {
                            return "continue";
                        }
                        dot.draw(x + i * dotSize, y + j * dotSize, dotSize, function (xOffset, yOffset) { var _a; return !!((_a = dotMask[i + xOffset]) === null || _a === void 0 ? void 0 : _a[j + yOffset]); });
                    };
                    for (var j = 0; j < dotMask[i].length; j++) {
                        _loop_6(j);
                    }
                };
                for (var i = 0; i < dotMask.length; i++) {
                    _loop_4(i);
                }
            }
            if ((_k = options.cornersDotOptions) === null || _k === void 0 ? void 0 : _k.gradient) {
                var gradientOptions = options.cornersDotOptions.gradient;
                var gradient_4 = _this._createGradient({
                    context: canvasContext,
                    options: gradientOptions,
                    additionalRotation: rotation,
                    x: x + dotSize * 2,
                    y: y + dotSize * 2,
                    size: cornersDotSize
                });
                gradientOptions.colorStops.forEach(function (_a) {
                    var offset = _a.offset, color = _a.color;
                    gradient_4.addColorStop(offset, color);
                });
                canvasContext.fillStyle = canvasContext.strokeStyle = gradient_4;
            }
            else if ((_l = options.cornersDotOptions) === null || _l === void 0 ? void 0 : _l.color) {
                canvasContext.fillStyle = canvasContext.strokeStyle = options.cornersDotOptions.color;
            }
            canvasContext.fill("evenodd");
        });
    };
    QRCanvas.prototype.loadImage = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var options = _this._options;
            var image = new Image();
            if (!options.image) {
                return reject("Image is not defined");
            }
            if (typeof options.imageOptions.crossOrigin === "string") {
                image.crossOrigin = options.imageOptions.crossOrigin;
            }
            _this._image = image;
            image.onload = function () {
                resolve();
            };
            image.src = options.image;
        });
    };
    QRCanvas.prototype.drawImage = function (_a) {
        var width = _a.width, height = _a.height, count = _a.count, dotSize = _a.dotSize;
        var canvasContext = this.context;
        if (!canvasContext) {
            throw "canvasContext is not defined";
        }
        if (!this._image) {
            throw "image is not defined";
        }
        var options = this._options;
        var xBeginning = Math.floor((options.width - count * dotSize) / 2);
        var yBeginning = Math.floor((options.height - count * dotSize) / 2);
        var dx = xBeginning + options.imageOptions.margin + (count * dotSize - width) / 2;
        var dy = yBeginning + options.imageOptions.margin + (count * dotSize - height) / 2;
        var dw = width - options.imageOptions.margin * 2;
        var dh = height - options.imageOptions.margin * 2;
        canvasContext.drawImage(this._image, dx, dy, dw < 0 ? 0 : dw, dh < 0 ? 0 : dh);
    };
    QRCanvas.prototype._createGradient = function (_a) {
        var context = _a.context, options = _a.options, additionalRotation = _a.additionalRotation, x = _a.x, y = _a.y, size = _a.size;
        var gradient;
        if (options.type === _constants_gradientTypes__WEBPACK_IMPORTED_MODULE_5__["default"].radial) {
            gradient = context.createRadialGradient(x + size / 2, y + size / 2, 0, x + size / 2, y + size / 2, size / 2);
        }
        else {
            var rotation = ((options.rotation || 0) + additionalRotation) % (2 * Math.PI);
            var positiveRotation = (rotation + 2 * Math.PI) % (2 * Math.PI);
            var x0 = x + size / 2;
            var y0 = y + size / 2;
            var x1 = x + size / 2;
            var y1 = y + size / 2;
            if ((positiveRotation >= 0 && positiveRotation <= 0.25 * Math.PI) ||
                (positiveRotation > 1.75 * Math.PI && positiveRotation <= 2 * Math.PI)) {
                x0 = x0 - size / 2;
                y0 = y0 - (size / 2) * Math.tan(rotation);
                x1 = x1 + size / 2;
                y1 = y1 + (size / 2) * Math.tan(rotation);
            }
            else if (positiveRotation > 0.25 * Math.PI && positiveRotation <= 0.75 * Math.PI) {
                y0 = y0 - size / 2;
                x0 = x0 - size / 2 / Math.tan(rotation);
                y1 = y1 + size / 2;
                x1 = x1 + size / 2 / Math.tan(rotation);
            }
            else if (positiveRotation > 0.75 * Math.PI && positiveRotation <= 1.25 * Math.PI) {
                x0 = x0 + size / 2;
                y0 = y0 + (size / 2) * Math.tan(rotation);
                x1 = x1 - size / 2;
                y1 = y1 - (size / 2) * Math.tan(rotation);
            }
            else if (positiveRotation > 1.25 * Math.PI && positiveRotation <= 1.75 * Math.PI) {
                y0 = y0 + size / 2;
                x0 = x0 + size / 2 / Math.tan(rotation);
                y1 = y1 - size / 2;
                x1 = x1 - size / 2 / Math.tan(rotation);
            }
            gradient = context.createLinearGradient(Math.round(x0), Math.round(y0), Math.round(x1), Math.round(y1));
        }
        return gradient;
    };
    return QRCanvas;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (QRCanvas);


/***/ }),

/***/ "./src/core/QRCodeStyling.ts":
/*!***********************************!*\
  !*** ./src/core/QRCodeStyling.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tools_getMode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../tools/getMode */ "./src/tools/getMode.ts");
/* harmony import */ var _tools_merge__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tools/merge */ "./src/tools/merge.ts");
/* harmony import */ var _tools_downloadURI__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../tools/downloadURI */ "./src/tools/downloadURI.ts");
/* harmony import */ var _QRCanvas__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./QRCanvas */ "./src/core/QRCanvas.ts");
/* harmony import */ var _QRSVG__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./QRSVG */ "./src/core/QRSVG.ts");
/* harmony import */ var _constants_drawTypes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../constants/drawTypes */ "./src/constants/drawTypes.ts");
/* harmony import */ var _QROptions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./QROptions */ "./src/core/QROptions.ts");
/* harmony import */ var _tools_sanitizeOptions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../tools/sanitizeOptions */ "./src/tools/sanitizeOptions.ts");
/* harmony import */ var qrcode_generator__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! qrcode-generator */ "./node_modules/qrcode-generator/qrcode.js");
/* harmony import */ var qrcode_generator__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(qrcode_generator__WEBPACK_IMPORTED_MODULE_8__);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};









var QRCodeStyling = /** @class */ (function () {
    function QRCodeStyling(options) {
        this._options = options ? (0,_tools_sanitizeOptions__WEBPACK_IMPORTED_MODULE_7__["default"])((0,_tools_merge__WEBPACK_IMPORTED_MODULE_1__["default"])(_QROptions__WEBPACK_IMPORTED_MODULE_6__["default"], options)) : _QROptions__WEBPACK_IMPORTED_MODULE_6__["default"];
        this.update();
    }
    QRCodeStyling._clearContainer = function (container) {
        if (container) {
            container.innerHTML = "";
        }
    };
    QRCodeStyling.prototype._getQRStylingElement = function (extension) {
        if (extension === void 0) { extension = "png"; }
        return __awaiter(this, void 0, void 0, function () {
            var promise, svg, promise, canvas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._qr)
                            throw "QR code is empty";
                        if (!(extension.toLowerCase() === "svg")) return [3 /*break*/, 2];
                        promise = void 0, svg = void 0;
                        if (this._svg && this._svgDrawingPromise) {
                            svg = this._svg;
                            promise = this._svgDrawingPromise;
                        }
                        else {
                            svg = new _QRSVG__WEBPACK_IMPORTED_MODULE_4__["default"](this._options);
                            promise = svg.drawQR(this._qr);
                        }
                        return [4 /*yield*/, promise];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, svg];
                    case 2:
                        promise = void 0, canvas = void 0;
                        if (this._canvas && this._canvasDrawingPromise) {
                            canvas = this._canvas;
                            promise = this._canvasDrawingPromise;
                        }
                        else {
                            canvas = new _QRCanvas__WEBPACK_IMPORTED_MODULE_3__["default"](this._options);
                            promise = canvas.drawQR(this._qr);
                        }
                        return [4 /*yield*/, promise];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, canvas];
                }
            });
        });
    };
    QRCodeStyling.prototype.update = function (options) {
        QRCodeStyling._clearContainer(this._container);
        this._options = options ? (0,_tools_sanitizeOptions__WEBPACK_IMPORTED_MODULE_7__["default"])((0,_tools_merge__WEBPACK_IMPORTED_MODULE_1__["default"])(this._options, options)) : this._options;
        if (!this._options.data) {
            return;
        }
        this._qr = qrcode_generator__WEBPACK_IMPORTED_MODULE_8___default()(this._options.qrOptions.typeNumber, this._options.qrOptions.errorCorrectionLevel);
        this._qr.addData(this._options.data, this._options.qrOptions.mode || (0,_tools_getMode__WEBPACK_IMPORTED_MODULE_0__["default"])(this._options.data));
        this._qr.make();
        if (this._options.type === _constants_drawTypes__WEBPACK_IMPORTED_MODULE_5__["default"].canvas) {
            this._canvas = new _QRCanvas__WEBPACK_IMPORTED_MODULE_3__["default"](this._options);
            this._canvasDrawingPromise = this._canvas.drawQR(this._qr);
            this._svgDrawingPromise = undefined;
            this._svg = undefined;
        }
        else {
            this._svg = new _QRSVG__WEBPACK_IMPORTED_MODULE_4__["default"](this._options);
            this._svgDrawingPromise = this._svg.drawQR(this._qr);
            this._canvasDrawingPromise = undefined;
            this._canvas = undefined;
        }
        this.append(this._container);
    };
    QRCodeStyling.prototype.append = function (container) {
        if (!container) {
            return;
        }
        if (typeof container.appendChild !== "function") {
            throw "Container should be a single DOM node";
        }
        if (this._options.type === _constants_drawTypes__WEBPACK_IMPORTED_MODULE_5__["default"].canvas) {
            if (this._canvas) {
                container.appendChild(this._canvas.getCanvas());
            }
        }
        else {
            if (this._svg) {
                container.appendChild(this._svg.getElement());
            }
        }
        this._container = container;
    };
    QRCodeStyling.prototype.getRawData = function (extension) {
        if (extension === void 0) { extension = "png"; }
        return __awaiter(this, void 0, void 0, function () {
            var element, serializer, source;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._qr)
                            throw "QR code is empty";
                        return [4 /*yield*/, this._getQRStylingElement(extension)];
                    case 1:
                        element = _a.sent();
                        if (extension.toLowerCase() === "svg") {
                            serializer = new XMLSerializer();
                            source = serializer.serializeToString(element.getElement());
                            return [2 /*return*/, new Blob(['<?xml version="1.0" standalone="no"?>\r\n' + source], { type: "image/svg+xml" })];
                        }
                        else {
                            return [2 /*return*/, new Promise(function (resolve) {
                                    return element.getCanvas().toBlob(resolve, "image/".concat(extension), 1);
                                })];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    QRCodeStyling.prototype.download = function (downloadOptions) {
        return __awaiter(this, void 0, void 0, function () {
            var extension, name, element, serializer, source, url, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._qr)
                            throw "QR code is empty";
                        extension = "png";
                        name = "qr";
                        //TODO remove deprecated code in the v2
                        if (typeof downloadOptions === "string") {
                            extension = downloadOptions;
                            console.warn("Extension is deprecated as argument for 'download' method, please pass object { name: '...', extension: '...' } as argument");
                        }
                        else if (typeof downloadOptions === "object" && downloadOptions !== null) {
                            if (downloadOptions.name) {
                                name = downloadOptions.name;
                            }
                            if (downloadOptions.extension) {
                                extension = downloadOptions.extension;
                            }
                        }
                        return [4 /*yield*/, this._getQRStylingElement(extension)];
                    case 1:
                        element = _a.sent();
                        if (extension.toLowerCase() === "svg") {
                            serializer = new XMLSerializer();
                            source = serializer.serializeToString(element.getElement());
                            source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
                            url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
                            (0,_tools_downloadURI__WEBPACK_IMPORTED_MODULE_2__["default"])(url, "".concat(name, ".svg"));
                        }
                        else {
                            url = element.getCanvas().toDataURL("image/".concat(extension));
                            (0,_tools_downloadURI__WEBPACK_IMPORTED_MODULE_2__["default"])(url, "".concat(name, ".").concat(extension));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return QRCodeStyling;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (QRCodeStyling);


/***/ }),

/***/ "./src/core/QROptions.ts":
/*!*******************************!*\
  !*** ./src/core/QROptions.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants_qrTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/qrTypes */ "./src/constants/qrTypes.ts");
/* harmony import */ var _constants_drawTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants/drawTypes */ "./src/constants/drawTypes.ts");
/* harmony import */ var _constants_errorCorrectionLevels__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants/errorCorrectionLevels */ "./src/constants/errorCorrectionLevels.ts");



var defaultOptions = {
    type: _constants_drawTypes__WEBPACK_IMPORTED_MODULE_1__["default"].canvas,
    width: 300,
    height: 300,
    data: "",
    margin: 0,
    qrOptions: {
        typeNumber: _constants_qrTypes__WEBPACK_IMPORTED_MODULE_0__["default"][0],
        mode: undefined,
        errorCorrectionLevel: _constants_errorCorrectionLevels__WEBPACK_IMPORTED_MODULE_2__["default"].Q
    },
    imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        crossOrigin: undefined,
        margin: 0
    },
    dotsOptions: {
        type: "square",
        color: "#000"
    },
    backgroundOptions: {
        color: "#fff"
    }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (defaultOptions);


/***/ }),

/***/ "./src/core/QRSVG.ts":
/*!***************************!*\
  !*** ./src/core/QRSVG.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _tools_calculateImageSize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../tools/calculateImageSize */ "./src/tools/calculateImageSize.ts");
/* harmony import */ var _constants_errorCorrectionPercents__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants/errorCorrectionPercents */ "./src/constants/errorCorrectionPercents.ts");
/* harmony import */ var _figures_dot_svg_QRDot__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../figures/dot/svg/QRDot */ "./src/figures/dot/svg/QRDot.ts");
/* harmony import */ var _figures_cornerSquare_svg_QRCornerSquare__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../figures/cornerSquare/svg/QRCornerSquare */ "./src/figures/cornerSquare/svg/QRCornerSquare.ts");
/* harmony import */ var _figures_cornerDot_svg_QRCornerDot__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../figures/cornerDot/svg/QRCornerDot */ "./src/figures/cornerDot/svg/QRCornerDot.ts");
/* harmony import */ var _constants_gradientTypes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../constants/gradientTypes */ "./src/constants/gradientTypes.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};






var squareMask = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1]
];
var dotMask = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
];
var QRSVG = /** @class */ (function () {
    //TODO don't pass all options to this class
    function QRSVG(options) {
        this._element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this._element.setAttribute("width", String(options.width));
        this._element.setAttribute("height", String(options.height));
        this._defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        this._element.appendChild(this._defs);
        this._options = options;
    }
    Object.defineProperty(QRSVG.prototype, "width", {
        get: function () {
            return this._options.width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(QRSVG.prototype, "height", {
        get: function () {
            return this._options.height;
        },
        enumerable: false,
        configurable: true
    });
    QRSVG.prototype.getElement = function () {
        return this._element;
    };
    QRSVG.prototype.clear = function () {
        var _a;
        var oldElement = this._element;
        this._element = oldElement.cloneNode(false);
        (_a = oldElement === null || oldElement === void 0 ? void 0 : oldElement.parentNode) === null || _a === void 0 ? void 0 : _a.replaceChild(this._element, oldElement);
        this._defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        this._element.appendChild(this._defs);
    };
    QRSVG.prototype.drawQR = function (qr) {
        return __awaiter(this, void 0, void 0, function () {
            var count, minSize, dotSize, drawImageSize, _a, imageOptions, qrOptions, coverLevel, maxHiddenDots;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        count = qr.getModuleCount();
                        minSize = Math.min(this._options.width, this._options.height) - this._options.margin * 2;
                        dotSize = Math.floor(minSize / count);
                        drawImageSize = {
                            hideXDots: 0,
                            hideYDots: 0,
                            width: 0,
                            height: 0
                        };
                        this._qr = qr;
                        if (!this._options.image) return [3 /*break*/, 2];
                        //We need it to get image size
                        return [4 /*yield*/, this.loadImage()];
                    case 1:
                        //We need it to get image size
                        _b.sent();
                        if (!this._image)
                            return [2 /*return*/];
                        _a = this._options, imageOptions = _a.imageOptions, qrOptions = _a.qrOptions;
                        coverLevel = imageOptions.imageSize * _constants_errorCorrectionPercents__WEBPACK_IMPORTED_MODULE_1__["default"][qrOptions.errorCorrectionLevel];
                        maxHiddenDots = Math.floor(coverLevel * count * count);
                        drawImageSize = (0,_tools_calculateImageSize__WEBPACK_IMPORTED_MODULE_0__["default"])({
                            originalWidth: this._image.width,
                            originalHeight: this._image.height,
                            maxHiddenDots: maxHiddenDots,
                            maxHiddenAxisDots: count - 14,
                            dotSize: dotSize
                        });
                        _b.label = 2;
                    case 2:
                        this.clear();
                        this.drawBackground();
                        this.drawDots(function (i, j) {
                            var _a, _b, _c, _d, _e, _f;
                            if (_this._options.imageOptions.hideBackgroundDots) {
                                if (i >= (count - drawImageSize.hideXDots) / 2 &&
                                    i < (count + drawImageSize.hideXDots) / 2 &&
                                    j >= (count - drawImageSize.hideYDots) / 2 &&
                                    j < (count + drawImageSize.hideYDots) / 2) {
                                    return false;
                                }
                            }
                            if (((_a = squareMask[i]) === null || _a === void 0 ? void 0 : _a[j]) || ((_b = squareMask[i - count + 7]) === null || _b === void 0 ? void 0 : _b[j]) || ((_c = squareMask[i]) === null || _c === void 0 ? void 0 : _c[j - count + 7])) {
                                return false;
                            }
                            if (((_d = dotMask[i]) === null || _d === void 0 ? void 0 : _d[j]) || ((_e = dotMask[i - count + 7]) === null || _e === void 0 ? void 0 : _e[j]) || ((_f = dotMask[i]) === null || _f === void 0 ? void 0 : _f[j - count + 7])) {
                                return false;
                            }
                            return true;
                        });
                        this.drawCorners();
                        if (this._options.image) {
                            this.drawImage({ width: drawImageSize.width, height: drawImageSize.height, count: count, dotSize: dotSize });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    QRSVG.prototype.drawBackground = function () {
        var _a, _b;
        var element = this._element;
        var options = this._options;
        if (element) {
            var gradientOptions = (_a = options.backgroundOptions) === null || _a === void 0 ? void 0 : _a.gradient;
            var color = (_b = options.backgroundOptions) === null || _b === void 0 ? void 0 : _b.color;
            if (gradientOptions || color) {
                this._createColor({
                    options: gradientOptions,
                    color: color,
                    additionalRotation: 0,
                    x: 0,
                    y: 0,
                    height: options.height,
                    width: options.width,
                    name: "background-color"
                });
            }
        }
    };
    QRSVG.prototype.drawDots = function (filter) {
        var _this = this;
        var _a, _b;
        if (!this._qr) {
            throw "QR code is not defined";
        }
        var options = this._options;
        var count = this._qr.getModuleCount();
        if (count > options.width || count > options.height) {
            throw "The canvas is too small.";
        }
        var minSize = Math.min(options.width, options.height) - options.margin * 2;
        var dotSize = Math.floor(minSize / count);
        var xBeginning = Math.floor((options.width - count * dotSize) / 2);
        var yBeginning = Math.floor((options.height - count * dotSize) / 2);
        var dot = new _figures_dot_svg_QRDot__WEBPACK_IMPORTED_MODULE_2__["default"]({ svg: this._element, type: options.dotsOptions.type });
        this._dotsClipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
        this._dotsClipPath.setAttribute("id", "clip-path-dot-color");
        this._defs.appendChild(this._dotsClipPath);
        this._createColor({
            options: (_a = options.dotsOptions) === null || _a === void 0 ? void 0 : _a.gradient,
            color: options.dotsOptions.color,
            additionalRotation: 0,
            x: xBeginning,
            y: yBeginning,
            height: count * dotSize,
            width: count * dotSize,
            name: "dot-color"
        });
        var _loop_1 = function (i) {
            var _loop_2 = function (j) {
                if (filter && !filter(i, j)) {
                    return "continue";
                }
                if (!((_b = this_1._qr) === null || _b === void 0 ? void 0 : _b.isDark(i, j))) {
                    return "continue";
                }
                dot.draw(xBeginning + i * dotSize, yBeginning + j * dotSize, dotSize, function (xOffset, yOffset) {
                    if (i + xOffset < 0 || j + yOffset < 0 || i + xOffset >= count || j + yOffset >= count)
                        return false;
                    if (filter && !filter(i + xOffset, j + yOffset))
                        return false;
                    return !!_this._qr && _this._qr.isDark(i + xOffset, j + yOffset);
                });
                if (dot._element && this_1._dotsClipPath) {
                    this_1._dotsClipPath.appendChild(dot._element);
                }
            };
            for (var j = 0; j < count; j++) {
                _loop_2(j);
            }
        };
        var this_1 = this;
        for (var i = 0; i < count; i++) {
            _loop_1(i);
        }
    };
    QRSVG.prototype.drawCorners = function () {
        var _this = this;
        if (!this._qr) {
            throw "QR code is not defined";
        }
        var element = this._element;
        var options = this._options;
        if (!element) {
            throw "Element code is not defined";
        }
        var count = this._qr.getModuleCount();
        var minSize = Math.min(options.width, options.height) - options.margin * 2;
        var dotSize = Math.floor(minSize / count);
        var cornersSquareSize = dotSize * 7;
        var cornersDotSize = dotSize * 3;
        var xBeginning = Math.floor((options.width - count * dotSize) / 2);
        var yBeginning = Math.floor((options.height - count * dotSize) / 2);
        [
            [0, 0, 0],
            [1, 0, Math.PI / 2],
            [0, 1, -Math.PI / 2]
        ].forEach(function (_a) {
            var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            var column = _a[0], row = _a[1], rotation = _a[2];
            var x = xBeginning + column * dotSize * (count - 7);
            var y = yBeginning + row * dotSize * (count - 7);
            var cornersSquareClipPath = _this._dotsClipPath;
            var cornersDotClipPath = _this._dotsClipPath;
            if (((_b = options.cornersSquareOptions) === null || _b === void 0 ? void 0 : _b.gradient) || ((_c = options.cornersSquareOptions) === null || _c === void 0 ? void 0 : _c.color)) {
                cornersSquareClipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
                cornersSquareClipPath.setAttribute("id", "clip-path-corners-square-color-".concat(column, "-").concat(row));
                _this._defs.appendChild(cornersSquareClipPath);
                _this._cornersSquareClipPath = _this._cornersDotClipPath = cornersDotClipPath = cornersSquareClipPath;
                _this._createColor({
                    options: (_d = options.cornersSquareOptions) === null || _d === void 0 ? void 0 : _d.gradient,
                    color: (_e = options.cornersSquareOptions) === null || _e === void 0 ? void 0 : _e.color,
                    additionalRotation: rotation,
                    x: x,
                    y: y,
                    height: cornersSquareSize,
                    width: cornersSquareSize,
                    name: "corners-square-color-".concat(column, "-").concat(row)
                });
            }
            if ((_f = options.cornersSquareOptions) === null || _f === void 0 ? void 0 : _f.type) {
                var cornersSquare = new _figures_cornerSquare_svg_QRCornerSquare__WEBPACK_IMPORTED_MODULE_3__["default"]({ svg: _this._element, type: options.cornersSquareOptions.type });
                cornersSquare.draw(x, y, cornersSquareSize, rotation);
                if (cornersSquare._element && cornersSquareClipPath) {
                    cornersSquareClipPath.appendChild(cornersSquare._element);
                }
            }
            else {
                var dot = new _figures_dot_svg_QRDot__WEBPACK_IMPORTED_MODULE_2__["default"]({ svg: _this._element, type: options.dotsOptions.type });
                var _loop_3 = function (i) {
                    var _loop_5 = function (j) {
                        if (!((_g = squareMask[i]) === null || _g === void 0 ? void 0 : _g[j])) {
                            return "continue";
                        }
                        dot.draw(x + i * dotSize, y + j * dotSize, dotSize, function (xOffset, yOffset) { var _a; return !!((_a = squareMask[i + xOffset]) === null || _a === void 0 ? void 0 : _a[j + yOffset]); });
                        if (dot._element && cornersSquareClipPath) {
                            cornersSquareClipPath.appendChild(dot._element);
                        }
                    };
                    for (var j = 0; j < squareMask[i].length; j++) {
                        _loop_5(j);
                    }
                };
                for (var i = 0; i < squareMask.length; i++) {
                    _loop_3(i);
                }
            }
            if (((_h = options.cornersDotOptions) === null || _h === void 0 ? void 0 : _h.gradient) || ((_j = options.cornersDotOptions) === null || _j === void 0 ? void 0 : _j.color)) {
                cornersDotClipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
                cornersDotClipPath.setAttribute("id", "clip-path-corners-dot-color-".concat(column, "-").concat(row));
                _this._defs.appendChild(cornersDotClipPath);
                _this._cornersDotClipPath = cornersDotClipPath;
                _this._createColor({
                    options: (_k = options.cornersDotOptions) === null || _k === void 0 ? void 0 : _k.gradient,
                    color: (_l = options.cornersDotOptions) === null || _l === void 0 ? void 0 : _l.color,
                    additionalRotation: rotation,
                    x: x + dotSize * 2,
                    y: y + dotSize * 2,
                    height: cornersDotSize,
                    width: cornersDotSize,
                    name: "corners-dot-color-".concat(column, "-").concat(row)
                });
            }
            if ((_m = options.cornersDotOptions) === null || _m === void 0 ? void 0 : _m.type) {
                var cornersDot = new _figures_cornerDot_svg_QRCornerDot__WEBPACK_IMPORTED_MODULE_4__["default"]({ svg: _this._element, type: options.cornersDotOptions.type });
                cornersDot.draw(x + dotSize * 2, y + dotSize * 2, cornersDotSize, rotation);
                if (cornersDot._element && cornersDotClipPath) {
                    cornersDotClipPath.appendChild(cornersDot._element);
                }
            }
            else {
                var dot = new _figures_dot_svg_QRDot__WEBPACK_IMPORTED_MODULE_2__["default"]({ svg: _this._element, type: options.dotsOptions.type });
                var _loop_4 = function (i) {
                    var _loop_6 = function (j) {
                        if (!((_o = dotMask[i]) === null || _o === void 0 ? void 0 : _o[j])) {
                            return "continue";
                        }
                        dot.draw(x + i * dotSize, y + j * dotSize, dotSize, function (xOffset, yOffset) { var _a; return !!((_a = dotMask[i + xOffset]) === null || _a === void 0 ? void 0 : _a[j + yOffset]); });
                        if (dot._element && cornersDotClipPath) {
                            cornersDotClipPath.appendChild(dot._element);
                        }
                    };
                    for (var j = 0; j < dotMask[i].length; j++) {
                        _loop_6(j);
                    }
                };
                for (var i = 0; i < dotMask.length; i++) {
                    _loop_4(i);
                }
            }
        });
    };
    QRSVG.prototype.loadImage = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var options = _this._options;
            var image = new Image();
            if (!options.image) {
                return reject("Image is not defined");
            }
            if (typeof options.imageOptions.crossOrigin === "string") {
                image.crossOrigin = options.imageOptions.crossOrigin;
            }
            _this._image = image;
            image.onload = function () {
                resolve();
            };
            image.src = options.image;
        });
    };
    QRSVG.prototype.drawImage = function (_a) {
        var width = _a.width, height = _a.height, count = _a.count, dotSize = _a.dotSize;
        var options = this._options;
        var xBeginning = Math.floor((options.width - count * dotSize) / 2);
        var yBeginning = Math.floor((options.height - count * dotSize) / 2);
        var dx = xBeginning + options.imageOptions.margin + (count * dotSize - width) / 2;
        var dy = yBeginning + options.imageOptions.margin + (count * dotSize - height) / 2;
        var dw = width - options.imageOptions.margin * 2;
        var dh = height - options.imageOptions.margin * 2;
        var image = document.createElementNS("http://www.w3.org/2000/svg", "image");
        image.setAttribute("href", options.image || "");
        image.setAttribute("x", String(dx));
        image.setAttribute("y", String(dy));
        image.setAttribute("width", "".concat(dw, "px"));
        image.setAttribute("height", "".concat(dh, "px"));
        this._element.appendChild(image);
    };
    QRSVG.prototype._createColor = function (_a) {
        var options = _a.options, color = _a.color, additionalRotation = _a.additionalRotation, x = _a.x, y = _a.y, height = _a.height, width = _a.width, name = _a.name;
        var size = width > height ? width : height;
        var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", String(x));
        rect.setAttribute("y", String(y));
        rect.setAttribute("height", String(height));
        rect.setAttribute("width", String(width));
        rect.setAttribute("clip-path", "url('#clip-path-".concat(name, "')"));
        if (options) {
            var gradient_1;
            if (options.type === _constants_gradientTypes__WEBPACK_IMPORTED_MODULE_5__["default"].radial) {
                gradient_1 = document.createElementNS("http://www.w3.org/2000/svg", "radialGradient");
                gradient_1.setAttribute("id", name);
                gradient_1.setAttribute("gradientUnits", "userSpaceOnUse");
                gradient_1.setAttribute("fx", String(x + width / 2));
                gradient_1.setAttribute("fy", String(y + height / 2));
                gradient_1.setAttribute("cx", String(x + width / 2));
                gradient_1.setAttribute("cy", String(y + height / 2));
                gradient_1.setAttribute("r", String(size / 2));
            }
            else {
                var rotation = ((options.rotation || 0) + additionalRotation) % (2 * Math.PI);
                var positiveRotation = (rotation + 2 * Math.PI) % (2 * Math.PI);
                var x0 = x + width / 2;
                var y0 = y + height / 2;
                var x1 = x + width / 2;
                var y1 = y + height / 2;
                if ((positiveRotation >= 0 && positiveRotation <= 0.25 * Math.PI) ||
                    (positiveRotation > 1.75 * Math.PI && positiveRotation <= 2 * Math.PI)) {
                    x0 = x0 - width / 2;
                    y0 = y0 - (height / 2) * Math.tan(rotation);
                    x1 = x1 + width / 2;
                    y1 = y1 + (height / 2) * Math.tan(rotation);
                }
                else if (positiveRotation > 0.25 * Math.PI && positiveRotation <= 0.75 * Math.PI) {
                    y0 = y0 - height / 2;
                    x0 = x0 - width / 2 / Math.tan(rotation);
                    y1 = y1 + height / 2;
                    x1 = x1 + width / 2 / Math.tan(rotation);
                }
                else if (positiveRotation > 0.75 * Math.PI && positiveRotation <= 1.25 * Math.PI) {
                    x0 = x0 + width / 2;
                    y0 = y0 + (height / 2) * Math.tan(rotation);
                    x1 = x1 - width / 2;
                    y1 = y1 - (height / 2) * Math.tan(rotation);
                }
                else if (positiveRotation > 1.25 * Math.PI && positiveRotation <= 1.75 * Math.PI) {
                    y0 = y0 + height / 2;
                    x0 = x0 + width / 2 / Math.tan(rotation);
                    y1 = y1 - height / 2;
                    x1 = x1 - width / 2 / Math.tan(rotation);
                }
                gradient_1 = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
                gradient_1.setAttribute("id", name);
                gradient_1.setAttribute("gradientUnits", "userSpaceOnUse");
                gradient_1.setAttribute("x1", String(Math.round(x0)));
                gradient_1.setAttribute("y1", String(Math.round(y0)));
                gradient_1.setAttribute("x2", String(Math.round(x1)));
                gradient_1.setAttribute("y2", String(Math.round(y1)));
            }
            options.colorStops.forEach(function (_a) {
                var offset = _a.offset, color = _a.color;
                var stop = document.createElementNS("http://www.w3.org/2000/svg", "stop");
                stop.setAttribute("offset", "".concat(100 * offset, "%"));
                stop.setAttribute("stop-color", color);
                gradient_1.appendChild(stop);
            });
            rect.setAttribute("fill", "url('#".concat(name, "')"));
            this._defs.appendChild(gradient_1);
        }
        else if (color) {
            rect.setAttribute("fill", color);
        }
        this._element.appendChild(rect);
    };
    return QRSVG;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (QRSVG);


/***/ }),

/***/ "./src/figures/cornerDot/canvas/QRCornerDot.ts":
/*!*****************************************************!*\
  !*** ./src/figures/cornerDot/canvas/QRCornerDot.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants_cornerDotTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../constants/cornerDotTypes */ "./src/constants/cornerDotTypes.ts");
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var QRCornerDot = /** @class */ (function () {
    function QRCornerDot(_a) {
        var context = _a.context, type = _a.type;
        this._context = context;
        this._type = type;
    }
    QRCornerDot.prototype.draw = function (x, y, size, rotation) {
        var context = this._context;
        var type = this._type;
        var drawFunction;
        switch (type) {
            case _constants_cornerDotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].square:
                drawFunction = this._drawSquare;
                break;
            case _constants_cornerDotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].squareRounded:
                drawFunction = this._drawSquareRounded;
                break;
            case _constants_cornerDotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].rightBottomSquare:
                drawFunction = this._drawSquareRoundedRightBottomEdge;
                break;
            case _constants_cornerDotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].star:
                drawFunction = this._drawStar;
                break;
            case _constants_cornerDotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].plus:
                drawFunction = this._drawPlus;
                break;
            case _constants_cornerDotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].cross:
                drawFunction = this._drawCross;
                break;
            case _constants_cornerDotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].diamond:
                drawFunction = this._drawDiamond;
                break;
            case _constants_cornerDotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].leaf:
                drawFunction = this._drawLeaf;
                break;
            case _constants_cornerDotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].leftTopCircle:
                drawFunction = this._drawCircleLeftTopEdge;
                break;
            case _constants_cornerDotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].rightBottomCircle:
                drawFunction = this._drawCircleRightBottomEdge;
                break;
            case _constants_cornerDotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].dot:
            default:
                drawFunction = this._drawDot;
        }
        drawFunction.call(this, { x: x, y: y, size: size, context: context, rotation: rotation });
    };
    QRCornerDot.prototype._rotateFigure = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, context = _a.context, _b = _a.rotation, rotation = _b === void 0 ? 0 : _b, draw = _a.draw;
        var cx = x + size / 2;
        var cy = y + size / 2;
        context.translate(cx, cy);
        rotation && context.rotate(rotation);
        draw();
        context.closePath();
        rotation && context.rotate(-rotation);
        context.translate(-cx, -cy);
    };
    QRCornerDot.prototype._basicDot = function (args) {
        var size = args.size, context = args.context;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                context.arc(0, 0, size / 2, 0, Math.PI * 2);
            } }));
    };
    QRCornerDot.prototype._basicSquare = function (args) {
        var size = args.size, context = args.context;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                context.rect(-size / 2, -size / 2, size, size);
            } }));
    };
    QRCornerDot.prototype._basicRoundedSquare = function (args) {
        var size = args.size, context = args.context;
        var radius = size / 5; // Adjust the radius as needed
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                var halfSize = size / 2;
                context.beginPath();
                context.moveTo(-halfSize + radius, -halfSize);
                context.lineTo(halfSize - radius, -halfSize);
                context.arcTo(halfSize, -halfSize, halfSize, -halfSize + radius, radius);
                context.lineTo(halfSize, halfSize - radius);
                context.arcTo(halfSize, halfSize, halfSize - radius, halfSize, radius);
                context.lineTo(-halfSize + radius, halfSize);
                context.arcTo(-halfSize, halfSize, -halfSize, halfSize - radius, radius);
                context.lineTo(-halfSize, -halfSize + radius);
                context.arcTo(-halfSize, -halfSize, -halfSize + radius, -halfSize, radius);
                context.closePath();
            } }));
    };
    QRCornerDot.prototype._basicRoundedSquareRightBottomEdge = function (args) {
        var size = args.size, context = args.context;
        var radius = size / 5; // Adjust the radius as needed
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                var halfSize = size / 2;
                context.beginPath();
                context.moveTo(-halfSize + radius, -halfSize);
                context.lineTo(halfSize - radius, -halfSize);
                context.arcTo(halfSize, -halfSize, halfSize, -halfSize + radius, radius);
                context.lineTo(halfSize, -halfSize + radius);
                context.lineTo(halfSize, halfSize);
                context.lineTo(halfSize - radius, halfSize);
                context.arcTo(halfSize - radius, halfSize, halfSize - radius, halfSize - radius, radius);
                context.lineTo(-halfSize + radius, halfSize);
                context.arcTo(-halfSize, halfSize, -halfSize, halfSize - radius, radius);
                context.lineTo(-halfSize, -halfSize + radius);
                context.arcTo(-halfSize, -halfSize, -halfSize + radius, -halfSize, radius);
                context.closePath();
            } }));
    };
    QRCornerDot.prototype._basicLeaf = function (args) {
        var size = args.size, context = args.context;
        var extension = size / 4; // Adjust the extension as needed
        var cornerRadius = size / 10; // Adjust the corner radius as needed
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                context.beginPath();
                context.moveTo(-size / 2.2 - extension, -size / 2.2 - extension); // Start at the top left corner
                context.lineTo(size / 2.2, -size / 2.2); // Draw top edge
                context.lineTo(size / 2.2, size / 2.2); // Draw right edge
                context.lineTo(-size / 2.2, size / 2.2); // Draw bottom edge
                // Draw rounded left top corner
                context.arc(-size / 2.2 - extension + cornerRadius, -size / 2.2 + cornerRadius - extension, cornerRadius, Math.PI, Math.PI * 1.5);
                context.closePath();
                context.fill();
            } }));
    };
    QRCornerDot.prototype._basicCircleLeftTopEdge = function (args) {
        var size = args.size, context = args.context;
        var radius = size / 2; // Radius of the rounded corners
        var cornerSize = radius / 32; // Size of the flat top-left corner
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                var halfSize = size / 2;
                // Draw the full rounded square
                context.beginPath();
                // Move to the starting point of the top-right corner
                context.moveTo(-halfSize + cornerSize, -halfSize);
                // Draw the top-right corner
                context.lineTo(halfSize - radius, -halfSize);
                context.arcTo(halfSize, -halfSize, halfSize, -halfSize + radius, radius);
                // Draw the right side
                context.lineTo(halfSize, halfSize - radius);
                context.arcTo(halfSize, halfSize, halfSize - radius, halfSize, radius);
                // Draw the bottom side
                context.lineTo(-halfSize + radius, halfSize);
                context.arcTo(-halfSize, halfSize, -halfSize, halfSize - radius, radius);
                // Draw the left side
                context.lineTo(-halfSize, -halfSize + cornerSize);
                // Draw the flat top-left corner
                context.lineTo(-halfSize + cornerSize, -halfSize);
                context.closePath();
                // context.fillStyle = '#000'; // Set color for the rounded square
                context.fill();
            } }));
    };
    QRCornerDot.prototype._basicCircleRightBottomEdge = function (args) {
        var size = args.size, context = args.context;
        var radius = size / 2; // Radius of the rounded corners
        var cornerSize = radius / 32; // Size of the flat right-bottom corner
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                var halfSize = size / 2;
                // Draw the full rounded square
                context.beginPath();
                // Move to the starting point of the top-left corner
                context.moveTo(-halfSize, -halfSize + cornerSize);
                // Draw the top-left corner
                context.lineTo(-halfSize + radius, -halfSize);
                context.arcTo(-halfSize, -halfSize, -halfSize, -halfSize + radius, radius);
                // Draw the top side
                context.lineTo(halfSize - radius, -halfSize);
                context.arcTo(halfSize, -halfSize, halfSize, -halfSize + radius, radius);
                // Draw the right side
                context.lineTo(halfSize, halfSize - cornerSize);
                // Draw the flat right-bottom corner
                context.lineTo(halfSize, halfSize);
                context.lineTo(halfSize - cornerSize, halfSize);
                // Draw the bottom side
                context.lineTo(-halfSize + radius, halfSize);
                context.arcTo(-halfSize, halfSize, -halfSize, halfSize - radius, radius);
                context.closePath();
                // context.fillStyle = '#000'; // Set color for the rounded square
                context.fill();
            } }));
    };
    QRCornerDot.prototype._basicDiamond = function (args) {
        var size = args.size, context = args.context;
        var halfSize = size / 2; // Half the size of the diamond
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                context.beginPath();
                // Move to the top point of the diamond
                context.moveTo(0, -halfSize);
                // Draw the right point
                context.lineTo(halfSize, 0);
                // Draw the bottom point
                context.lineTo(0, halfSize);
                // Draw the left point
                context.lineTo(-halfSize, 0);
                // Close the path to the top point
                context.closePath();
                // context.fillStyle = "#000"; // Set color for the diamond
                context.fill();
            } }));
    };
    QRCornerDot.prototype._basicStar = function (args) {
        var size = args.size, context = args.context;
        var numPoints = 5;
        var outerRadius = size / 2;
        var innerRadius = outerRadius / 2.5;
        var step = Math.PI / numPoints;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                context.beginPath();
                for (var i = 0; i < 2 * numPoints; i++) {
                    var radius = i % 2 === 0 ? outerRadius : innerRadius;
                    var angle = i * step;
                    context.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
                }
                context.closePath();
            } }));
    };
    QRCornerDot.prototype._basicPlus = function (args) {
        var size = args.size, context = args.context;
        var thickness = size / 5;
        var halfThickness = thickness / 2;
        var halfSize = size / 2;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                context.beginPath();
                context.rect(-halfThickness, -halfSize, thickness, size); // vertical rectangle
                context.rect(-halfSize, -halfThickness, size, thickness); // horizontal rectangle
                context.closePath();
            } }));
    };
    QRCornerDot.prototype._basicCross = function (args) {
        var size = args.size, context = args.context;
        var lineWidth = size / 4; // Width of the cross lines
        var halfSize = size / 2; // Half the size of the cross
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                context.save(); // Save the current state
                context.translate(0, 0); // Move to the center
                context.rotate(Math.PI / 4); // Rotate 45 degrees (pi/4 radians)
                context.beginPath();
                // Draw the horizontal line of the cross
                context.rect(-halfSize, -lineWidth / 2, size, lineWidth);
                // Draw the vertical line of the cross
                context.rect(-lineWidth / 2, -halfSize, lineWidth, size);
                context.fillStyle = '#000'; // Set c//olor for the cross
                context.fill();
                context.restore(); // Restore the state
            } }));
    };
    QRCornerDot.prototype._drawDot = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, context = _a.context, rotation = _a.rotation;
        this._basicDot({ x: x, y: y, size: size, context: context, rotation: rotation });
    };
    QRCornerDot.prototype._drawSquare = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, context = _a.context, rotation = _a.rotation;
        this._basicSquare({ x: x, y: y, size: size, context: context, rotation: rotation });
    };
    QRCornerDot.prototype._drawStar = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, context = _a.context, rotation = _a.rotation;
        this._basicStar({ x: x, y: y, size: size, context: context, rotation: rotation });
    };
    QRCornerDot.prototype._drawPlus = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, context = _a.context, rotation = _a.rotation;
        this._basicPlus({ x: x, y: y, size: size, context: context, rotation: rotation });
    };
    QRCornerDot.prototype._drawCross = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, context = _a.context, rotation = _a.rotation;
        this._basicCross({ x: x, y: y, size: size, context: context, rotation: rotation });
    };
    QRCornerDot.prototype._drawDiamond = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, context = _a.context, rotation = _a.rotation;
        this._basicDiamond({ x: x, y: y, size: size, context: context, rotation: rotation });
    };
    QRCornerDot.prototype._drawSquareRounded = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, context = _a.context, rotation = _a.rotation;
        this._basicRoundedSquare({ x: x, y: y, size: size, context: context, rotation: rotation });
    };
    QRCornerDot.prototype._drawSquareRoundedRightBottomEdge = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, context = _a.context, rotation = _a.rotation;
        this._basicRoundedSquareRightBottomEdge({ x: x, y: y, size: size, context: context, rotation: rotation });
    };
    QRCornerDot.prototype._drawLeaf = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, context = _a.context, rotation = _a.rotation;
        this._basicLeaf({ x: x, y: y, size: size, context: context, rotation: rotation });
    };
    QRCornerDot.prototype._drawCircleLeftTopEdge = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, context = _a.context, rotation = _a.rotation;
        this._basicCircleLeftTopEdge({ x: x, y: y, size: size, context: context, rotation: rotation });
    };
    QRCornerDot.prototype._drawCircleRightBottomEdge = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, context = _a.context, rotation = _a.rotation;
        this._basicCircleRightBottomEdge({ x: x, y: y, size: size, context: context, rotation: rotation });
    };
    return QRCornerDot;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (QRCornerDot);


/***/ }),

/***/ "./src/figures/cornerDot/svg/QRCornerDot.ts":
/*!**************************************************!*\
  !*** ./src/figures/cornerDot/svg/QRCornerDot.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants_cornerDotTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../constants/cornerDotTypes */ "./src/constants/cornerDotTypes.ts");
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var QRCornerDot = /** @class */ (function () {
    function QRCornerDot(_a) {
        var svg = _a.svg, type = _a.type;
        this._svg = svg;
        this._type = type;
        this._element = null;
    }
    QRCornerDot.prototype.draw = function (x, y, size, rotation) {
        var type = this._type;
        var drawFunction;
        switch (type) {
            case _constants_cornerDotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].square:
                drawFunction = this._drawSquare;
                break;
            case _constants_cornerDotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].star:
                drawFunction = this._drawStar;
                break;
            case _constants_cornerDotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].squareRounded:
                drawFunction = this._drawSquareRounded;
                break;
            case _constants_cornerDotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].rightBottomSquare:
                drawFunction = this._drawSquareRoundedRightBottomEdge;
                break;
            case _constants_cornerDotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].plus:
                drawFunction = this._drawPlus;
                break;
            case _constants_cornerDotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].cross:
                drawFunction = this._drawCross;
                break;
            case _constants_cornerDotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].rhombus:
                drawFunction = this._drawRhombus;
                break;
            case _constants_cornerDotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].leaf:
                drawFunction = this._drawLead;
                break;
            case _constants_cornerDotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].leftTopCircle:
                drawFunction = this._drawCircleLeftTopEdge;
                break;
            case _constants_cornerDotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].rightBottomCircle:
                drawFunction = this._drawCircleRightBottomEdge;
                break;
            case _constants_cornerDotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].diamond:
                drawFunction = this._drawDiamond;
                break;
            case _constants_cornerDotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].dot:
            default:
                drawFunction = this._drawDot;
        }
        drawFunction.call(this, { x: x, y: y, size: size, rotation: rotation });
    };
    QRCornerDot.prototype._rotateFigure = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, _b = _a.rotation, rotation = _b === void 0 ? 0 : _b, draw = _a.draw;
        var cx = x + size / 2;
        var cy = y + size / 2;
        draw();
        var lastChild = this._svg.lastChild;
        if (lastChild) {
            lastChild.setAttribute("transform", "rotate(".concat((180 * rotation) / Math.PI, ",").concat(cx, ",").concat(cy, ")"));
        }
    };
    QRCornerDot.prototype._basicDot = function (args) {
        var _this = this;
        var size = args.size, x = args.x, y = args.y;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("cx", String(x + size / 2));
                circle.setAttribute("cy", String(y + size / 2));
                circle.setAttribute("r", String(size / 2));
                _this._svg.appendChild(circle);
            } }));
    };
    QRCornerDot.prototype._basicSquare = function (args) {
        var _this = this;
        var size = args.size, x = args.x, y = args.y;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                rect.setAttribute("x", String(x));
                rect.setAttribute("y", String(y));
                rect.setAttribute("width", String(size));
                rect.setAttribute("height", String(size));
                _this._svg.appendChild(rect);
            } }));
    };
    QRCornerDot.prototype._basicRoundedSquare = function (args) {
        var _this = this;
        var size = args.size, x = args.x, y = args.y;
        var radius = size / 5; // Adjust the radius as needed
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                rect.setAttribute("x", String(x));
                rect.setAttribute("y", String(y));
                rect.setAttribute("width", String(size));
                rect.setAttribute("height", String(size));
                rect.setAttribute("rx", String(radius));
                rect.setAttribute("ry", String(radius));
                _this._svg.appendChild(rect);
            } }));
    };
    QRCornerDot.prototype._basicRoundedSquareRightBottomEdge = function (args) {
        var _this = this;
        var size = args.size, x = args.x, y = args.y;
        var radius = size / 5; // Adjust the radius as needed
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                rect.setAttribute("x", String(x));
                rect.setAttribute("y", String(y));
                rect.setAttribute("width", String(size));
                rect.setAttribute("height", String(size));
                rect.setAttribute("rx", String(radius));
                rect.setAttribute("ry", String(radius));
                // Create a small rectangle to cover the bottom right corner
                var flatCornerRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                flatCornerRect.setAttribute("x", String(x + size - radius));
                flatCornerRect.setAttribute("y", String(y + size - radius));
                flatCornerRect.setAttribute("width", String(radius));
                flatCornerRect.setAttribute("height", String(radius));
                _this._svg.appendChild(rect);
                _this._svg.appendChild(flatCornerRect);
            } }));
    };
    QRCornerDot.prototype._basicLeaf = function (args) {
        var _this = this;
        var size = args.size, x = args.x, y = args.y;
        var extension = size / 4; // Adjust the extension as needed
        var cornerRadius = size / 10; // Adjust the corner radius as needed
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                var d = "\n        M ".concat(x - size / 2.2 - extension, ",").concat(y - size / 2.2 - extension, "  // Move to the top left corner\n        L ").concat(x + size / 2.2, ",").concat(y - size / 2.2, "  // Draw top edge\n        L ").concat(x + size / 2.2, ",").concat(y + size / 2.2, "  // Draw right edge\n        L ").concat(x - size / 2.2, ",").concat(y + size / 2.2, "  // Draw bottom edge\n        A ").concat(cornerRadius, ",").concat(cornerRadius, " 0 0 1 ").concat(x - size / 2.2 - extension + cornerRadius, ",").concat(y - size / 2.2 + cornerRadius, "  // Draw rounded left top corner\n        Z  // Close the path\n      ")
                    .replace(/\/\/.*$/gm, "")
                    .trim(); // Remove comments and trim whitespace
                path.setAttribute("d", d);
                _this._svg.appendChild(path);
            } }));
    };
    // _basicCircleLeftTopEdge(args: BasicFigureDrawArgs): void {
    //   const { size, x, y } = args;
    //   const radius = size / 2;
    //   this._rotateFigure({
    //     ...args,
    //     draw: () => {
    //       const circle = document.createElementNS(
    //         "http://www.w3.org/2000/svg",
    //         "circle"
    //       );
    //       // Adjust the attributes to position the circle with a flat top left corner
    //       circle.setAttribute("cx", String(x + radius)); // Adjusted to radius for left edge
    //       circle.setAttribute("cy", String(y + radius)); // Adjusted to radius for top edge
    //       circle.setAttribute("r", String(radius)); // Use radius as the size
    //       this._svg.appendChild(circle);
    //     },
    //   });
    // }
    QRCornerDot.prototype._basicCircleLeftTopEdge = function (args) {
        var _this = this;
        var size = args.size, x = args.x, y = args.y;
        var radius = size / 2;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                // Create a circle for the curved part
                var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("cx", String(x + radius));
                circle.setAttribute("cy", String(y + radius));
                circle.setAttribute("r", String(radius));
                // Create a rectangle for the flat corner
                var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                rect.setAttribute("x", String(x));
                rect.setAttribute("y", String(y));
                rect.setAttribute("width", String(radius));
                rect.setAttribute("height", String(radius));
                // Add both shapes to the SVG
                _this._svg.appendChild(circle);
                _this._svg.appendChild(rect);
            } }));
    };
    QRCornerDot.prototype._basicCircleRightBottomEdge = function (args) {
        var _this = this;
        var size = args.size, x = args.x, y = args.y;
        var radius = size / 2;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                // Create a circle for the curved part
                var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("cx", String(x + radius));
                circle.setAttribute("cy", String(y + radius));
                circle.setAttribute("r", String(radius));
                // Create a rectangle for the flat bottom-right corner
                var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                rect.setAttribute("x", String(x + radius));
                rect.setAttribute("y", String(y + radius));
                rect.setAttribute("width", String(radius));
                rect.setAttribute("height", String(radius));
                // Add both shapes to the SVG
                _this._svg.appendChild(circle);
                _this._svg.appendChild(rect);
            } }));
    };
    // _basicExtendedSquare(args: BasicFigureDrawArgs): void {
    //   const { size, x, y } = args;
    //   const extension = size / 6;  // Adjust the extension as needed
    //   this._rotateFigure({
    //     ...args,
    //     draw: () => {
    //       const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    //       rect.setAttribute("x", String(x - extension));
    //       rect.setAttribute("y", String(y - extension));
    //       rect.setAttribute("width", String(size + extension));
    //       rect.setAttribute("height", String(size + extension));
    //       this._svg.appendChild(rect);
    //     }
    //   });
    // }
    QRCornerDot.prototype._basicDiamond = function (args) {
        var _this = this;
        var size = args.size, x = args.x, y = args.y;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                polygon.setAttribute("points", "\n          ".concat(x + size / 2, ", ").concat(y, "\n          ").concat(x + size, ", ").concat(y + size / 2, "\n          ").concat(x + size / 2, ", ").concat(y + size, "\n          ").concat(x, ", ").concat(y + size / 2, "\n        "));
                _this._svg.appendChild(polygon);
            } }));
    };
    QRCornerDot.prototype._basicStar = function (args) {
        var _this = this;
        var size = args.size, x = args.x, y = args.y;
        var numPoints = 5;
        var outerRadius = size / 2;
        var innerRadius = outerRadius / 2.5;
        var step = Math.PI / numPoints;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                var points = [];
                for (var i = 0; i < 2 * numPoints; i++) {
                    var radius = i % 2 === 0 ? outerRadius : innerRadius;
                    var angle = i * step;
                    var px = x + size / 2 + radius * Math.cos(angle);
                    var py = y + size / 2 + radius * Math.sin(angle);
                    points.push("".concat(px, ",").concat(py));
                }
                var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                polygon.setAttribute("points", points.join(" "));
                _this._svg.appendChild(polygon);
            } }));
    };
    QRCornerDot.prototype._basicPlus = function (args) {
        var _this = this;
        var size = args.size, x = args.x, y = args.y;
        var thickness = size / 5;
        var halfThickness = thickness / 2;
        var halfSize = size / 2;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
                var verticalRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                verticalRect.setAttribute("x", String(x + halfSize - halfThickness));
                verticalRect.setAttribute("y", String(y));
                verticalRect.setAttribute("width", String(thickness));
                verticalRect.setAttribute("height", String(size));
                group.appendChild(verticalRect);
                var horizontalRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                horizontalRect.setAttribute("x", String(x));
                horizontalRect.setAttribute("y", String(y + halfSize - halfThickness));
                horizontalRect.setAttribute("width", String(size));
                horizontalRect.setAttribute("height", String(thickness));
                group.appendChild(horizontalRect);
                _this._svg.appendChild(group);
            } }));
    };
    QRCornerDot.prototype._basicCross = function (args) {
        var _this = this;
        var size = args.size, x = args.x, y = args.y;
        var thickness = size / 2.5;
        var halfThickness = thickness / 2;
        var halfSize = size / 2;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
                var verticalRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                verticalRect.setAttribute("x", String(x + halfSize - halfThickness));
                verticalRect.setAttribute("y", String(y));
                verticalRect.setAttribute("width", String(thickness));
                verticalRect.setAttribute("height", String(size));
                verticalRect.setAttribute("transform", "rotate(45 ".concat(x + halfSize, " ").concat(y + halfSize, ")"));
                verticalRect.setAttribute("rx", String(thickness / 2)); // add this line
                group.appendChild(verticalRect);
                var horizontalRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                horizontalRect.setAttribute("x", String(x));
                horizontalRect.setAttribute("y", String(y + halfSize - halfThickness));
                horizontalRect.setAttribute("width", String(size));
                horizontalRect.setAttribute("height", String(thickness));
                horizontalRect.setAttribute("transform", "rotate(45 ".concat(x + halfSize, " ").concat(y + halfSize, ")"));
                horizontalRect.setAttribute("rx", String(thickness / 2)); // add this line
                group.appendChild(horizontalRect);
                _this._svg.appendChild(group);
            } }));
    };
    QRCornerDot.prototype._basicRhombus = function (args) {
        var _this = this;
        var size = args.size, x = args.x, y = args.y;
        var thickness = size / 1.8;
        var halfThickness = thickness / 2;
        var halfSize = size / 2;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
                // group.setAttribute("transform", `rotate(45 ${x + halfSize} ${y + halfSize})`);
                var verticalRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                verticalRect.setAttribute("x", String(x + halfSize - halfThickness));
                verticalRect.setAttribute("y", String(y));
                verticalRect.setAttribute("width", String(thickness));
                verticalRect.setAttribute("height", String(size));
                var verticalTopTriangle = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                verticalTopTriangle.setAttribute("points", "\n          ".concat(x + halfSize - halfThickness, ",").concat(y, "\n          ").concat(x + halfSize, ",").concat(y - halfThickness, "\n          ").concat(x + halfSize + halfThickness, ",").concat(y, "\n        "));
                var verticalBottomTriangle = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                verticalBottomTriangle.setAttribute("points", "\n          ".concat(x + halfSize - halfThickness, ",").concat(y + size, "\n          ").concat(x + halfSize + halfThickness, ",").concat(y + size, "\n          ").concat(x + halfSize, ",").concat(y + size + halfThickness, "\n        "));
                group.appendChild(verticalRect);
                group.appendChild(verticalTopTriangle);
                group.appendChild(verticalBottomTriangle);
                var horizontalRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                horizontalRect.setAttribute("x", String(x));
                horizontalRect.setAttribute("y", String(y + halfSize - halfThickness));
                horizontalRect.setAttribute("width", String(size));
                horizontalRect.setAttribute("height", String(thickness));
                var horizontalLeftTriangle = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                horizontalLeftTriangle.setAttribute("points", "\n          ".concat(x, ",").concat(y + halfSize - halfThickness, "\n          ").concat(x - halfThickness, ",").concat(y + halfSize, "\n          ").concat(x, ",").concat(y + halfSize + halfThickness, "\n        "));
                var horizontalRightTriangle = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                horizontalRightTriangle.setAttribute("points", "\n          ".concat(x + size, ",").concat(y + halfSize - halfThickness, "\n          ").concat(x + size + halfThickness, ",").concat(y + halfSize, "\n          ").concat(x + size, ",").concat(y + halfSize + halfThickness, "\n        "));
                group.appendChild(horizontalRect);
                group.appendChild(horizontalLeftTriangle);
                group.appendChild(horizontalRightTriangle);
                _this._svg.appendChild(group);
            } }));
    };
    QRCornerDot.prototype._drawDot = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, rotation = _a.rotation;
        this._basicDot({ x: x, y: y, size: size, rotation: rotation });
    };
    QRCornerDot.prototype._drawSquare = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, rotation = _a.rotation;
        this._basicSquare({ x: x, y: y, size: size, rotation: rotation });
    };
    QRCornerDot.prototype._drawStar = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, rotation = _a.rotation;
        this._basicStar({ x: x, y: y, size: size, rotation: rotation });
    };
    QRCornerDot.prototype._drawPlus = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, rotation = _a.rotation;
        this._basicPlus({ x: x, y: y, size: size, rotation: rotation });
    };
    QRCornerDot.prototype._drawSquareRounded = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, rotation = _a.rotation;
        this._basicRoundedSquare({ x: x, y: y, size: size, rotation: rotation });
    };
    QRCornerDot.prototype._drawSquareRoundedRightBottomEdge = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, rotation = _a.rotation;
        this._basicRoundedSquareRightBottomEdge({ x: x, y: y, size: size, rotation: rotation });
    };
    QRCornerDot.prototype._drawLead = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, rotation = _a.rotation;
        this._basicLeaf({ x: x, y: y, size: size, rotation: rotation });
    };
    QRCornerDot.prototype._drawCircleLeftTopEdge = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, rotation = _a.rotation;
        this._basicCircleLeftTopEdge({ x: x, y: y, size: size, rotation: rotation });
    };
    QRCornerDot.prototype._drawCircleRightBottomEdge = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, rotation = _a.rotation;
        this._basicCircleRightBottomEdge({ x: x, y: y, size: size, rotation: rotation });
    };
    QRCornerDot.prototype._drawDiamond = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, rotation = _a.rotation;
        this._basicDiamond({ x: x, y: y, size: size, rotation: rotation });
    };
    QRCornerDot.prototype._drawCross = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, rotation = _a.rotation;
        this._basicCross({ x: x, y: y, size: size, rotation: rotation });
    };
    QRCornerDot.prototype._drawRhombus = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, rotation = _a.rotation;
        this._basicRhombus({ x: x, y: y, size: size, rotation: rotation });
    };
    return QRCornerDot;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (QRCornerDot);


/***/ }),

/***/ "./src/figures/cornerSquare/canvas/QRCornerSquare.ts":
/*!***********************************************************!*\
  !*** ./src/figures/cornerSquare/canvas/QRCornerSquare.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants_cornerSquareTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../constants/cornerSquareTypes */ "./src/constants/cornerSquareTypes.ts");
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var QRCornerSquare = /** @class */ (function () {
    function QRCornerSquare(_a) {
        var context = _a.context, type = _a.type;
        this._context = context;
        this._type = type;
    }
    QRCornerSquare.prototype.draw = function (x, y, size, rotation) {
        var context = this._context;
        var type = this._type;
        var drawFunction;
        switch (type) {
            case _constants_cornerSquareTypes__WEBPACK_IMPORTED_MODULE_0__["default"].square:
                drawFunction = this._drawSquare;
                break;
            case _constants_cornerSquareTypes__WEBPACK_IMPORTED_MODULE_0__["default"].extraRounded:
                drawFunction = this._drawExtraRounded;
                break;
            case _constants_cornerSquareTypes__WEBPACK_IMPORTED_MODULE_0__["default"].dot:
            default:
                drawFunction = this._drawDot;
        }
        drawFunction.call(this, { x: x, y: y, size: size, context: context, rotation: rotation });
    };
    QRCornerSquare.prototype._rotateFigure = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, context = _a.context, _b = _a.rotation, rotation = _b === void 0 ? 0 : _b, draw = _a.draw;
        var cx = x + size / 2;
        var cy = y + size / 2;
        context.translate(cx, cy);
        rotation && context.rotate(rotation);
        draw();
        context.closePath();
        rotation && context.rotate(-rotation);
        context.translate(-cx, -cy);
    };
    QRCornerSquare.prototype._basicDot = function (args) {
        var size = args.size, context = args.context;
        var dotSize = size / 7;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                context.arc(0, 0, size / 2, 0, Math.PI * 2);
                context.arc(0, 0, size / 2 - dotSize, 0, Math.PI * 2);
            } }));
    };
    QRCornerSquare.prototype._basicSquare = function (args) {
        var size = args.size, context = args.context;
        var dotSize = size / 7;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                context.rect(-size / 2, -size / 2, size, size);
                context.rect(-size / 2 + dotSize, -size / 2 + dotSize, size - 2 * dotSize, size - 2 * dotSize);
            } }));
    };
    QRCornerSquare.prototype._basicExtraRounded = function (args) {
        var size = args.size, context = args.context;
        var dotSize = size / 7;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                context.arc(-dotSize, -dotSize, 2.5 * dotSize, Math.PI, -Math.PI / 2);
                context.lineTo(dotSize, -3.5 * dotSize);
                context.arc(dotSize, -dotSize, 2.5 * dotSize, -Math.PI / 2, 0);
                context.lineTo(3.5 * dotSize, -dotSize);
                context.arc(dotSize, dotSize, 2.5 * dotSize, 0, Math.PI / 2);
                context.lineTo(-dotSize, 3.5 * dotSize);
                context.arc(-dotSize, dotSize, 2.5 * dotSize, Math.PI / 2, Math.PI);
                context.lineTo(-3.5 * dotSize, -dotSize);
                context.arc(-dotSize, -dotSize, 1.5 * dotSize, Math.PI, -Math.PI / 2);
                context.lineTo(dotSize, -2.5 * dotSize);
                context.arc(dotSize, -dotSize, 1.5 * dotSize, -Math.PI / 2, 0);
                context.lineTo(2.5 * dotSize, -dotSize);
                context.arc(dotSize, dotSize, 1.5 * dotSize, 0, Math.PI / 2);
                context.lineTo(-dotSize, 2.5 * dotSize);
                context.arc(-dotSize, dotSize, 1.5 * dotSize, Math.PI / 2, Math.PI);
                context.lineTo(-2.5 * dotSize, -dotSize);
            } }));
    };
    QRCornerSquare.prototype._drawDot = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, context = _a.context, rotation = _a.rotation;
        this._basicDot({ x: x, y: y, size: size, context: context, rotation: rotation });
    };
    QRCornerSquare.prototype._drawSquare = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, context = _a.context, rotation = _a.rotation;
        this._basicSquare({ x: x, y: y, size: size, context: context, rotation: rotation });
    };
    QRCornerSquare.prototype._drawExtraRounded = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, context = _a.context, rotation = _a.rotation;
        this._basicExtraRounded({ x: x, y: y, size: size, context: context, rotation: rotation });
    };
    return QRCornerSquare;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (QRCornerSquare);


/***/ }),

/***/ "./src/figures/cornerSquare/svg/QRCornerSquare.ts":
/*!********************************************************!*\
  !*** ./src/figures/cornerSquare/svg/QRCornerSquare.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants_cornerSquareTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../constants/cornerSquareTypes */ "./src/constants/cornerSquareTypes.ts");
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var QRCornerSquare = /** @class */ (function () {
    function QRCornerSquare(_a) {
        var svg = _a.svg, type = _a.type;
        this._svg = svg;
        this._type = type;
    }
    QRCornerSquare.prototype.draw = function (x, y, size, rotation) {
        var type = this._type;
        var drawFunction;
        switch (type) {
            case _constants_cornerSquareTypes__WEBPACK_IMPORTED_MODULE_0__["default"].square:
                drawFunction = this._drawSquare;
                break;
            case _constants_cornerSquareTypes__WEBPACK_IMPORTED_MODULE_0__["default"].extraRounded:
                drawFunction = this._drawExtraRounded;
                break;
            case _constants_cornerSquareTypes__WEBPACK_IMPORTED_MODULE_0__["default"].dottedSquare:
                drawFunction = this._drawDottedSquare;
                break;
            case _constants_cornerSquareTypes__WEBPACK_IMPORTED_MODULE_0__["default"].rightBottomSquare:
                drawFunction = this._drawRoundedSquareRightBottomEdge;
                break;
            case _constants_cornerSquareTypes__WEBPACK_IMPORTED_MODULE_0__["default"].leftTopSquare:
                drawFunction = this._drawRoundedSquareLeftTopEdge;
                break;
            case _constants_cornerSquareTypes__WEBPACK_IMPORTED_MODULE_0__["default"].leftTopCircle:
                drawFunction = this._drawCircleLeftTopFlat;
                break;
            case _constants_cornerSquareTypes__WEBPACK_IMPORTED_MODULE_0__["default"].rightBottomCircle:
                drawFunction = this._drawCircleRightBottomFlat;
                break;
            case _constants_cornerSquareTypes__WEBPACK_IMPORTED_MODULE_0__["default"].peanut:
                drawFunction = this._drawPeanutShape;
                break;
            case _constants_cornerSquareTypes__WEBPACK_IMPORTED_MODULE_0__["default"].circleInSquare:
                drawFunction = this._drawCircleInSquare;
                break;
            // case cornerSquareTypes.paragonal:
            //   drawFunction = this._drawParagonalShape;
            //   break;
            case _constants_cornerSquareTypes__WEBPACK_IMPORTED_MODULE_0__["default"].dot:
            default:
                drawFunction = this._drawDot;
        }
        drawFunction.call(this, { x: x, y: y, size: size, rotation: rotation });
    };
    QRCornerSquare.prototype._rotateFigure = function (_a) {
        var _b;
        var x = _a.x, y = _a.y, size = _a.size, _c = _a.rotation, rotation = _c === void 0 ? 0 : _c, draw = _a.draw;
        var cx = x + size / 2;
        var cy = y + size / 2;
        draw();
        (_b = this._element) === null || _b === void 0 ? void 0 : _b.setAttribute("transform", "rotate(".concat((180 * rotation) / Math.PI, ",").concat(cx, ",").concat(cy, ")"));
    };
    QRCornerSquare.prototype._basicDot = function (args) {
        var _this = this;
        var size = args.size, x = args.x, y = args.y;
        var dotSize = size / 7;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                _this._element = document.createElementNS("http://www.w3.org/2000/svg", "path");
                _this._element.setAttribute("clip-rule", "evenodd");
                _this._element.setAttribute("d", "M ".concat(x + size / 2, " ").concat(y) + // M cx, y //  Move to top of ring
                    "a ".concat(size / 2, " ").concat(size / 2, " 0 1 0 0.1 0") + // a outerRadius, outerRadius, 0, 1, 0, 1, 0 // Draw outer arc, but don't close it
                    "z" + // Z // Close the outer shape
                    "m 0 ".concat(dotSize) + // m -1 outerRadius-innerRadius // Move to top point of inner radius
                    "a ".concat(size / 2 - dotSize, " ").concat(size / 2 - dotSize, " 0 1 1 -0.1 0") + // a innerRadius, innerRadius, 0, 1, 1, -1, 0 // Draw inner arc, but don't close it
                    "Z" // Z // Close the inner ring. Actually will still work without, but inner ring will have one unit missing in stroke
                );
            } }));
    };
    QRCornerSquare.prototype._basicSquare = function (args) {
        var _this = this;
        var size = args.size, x = args.x, y = args.y;
        var dotSize = size / 7;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                _this._element = document.createElementNS("http://www.w3.org/2000/svg", "path");
                _this._element.setAttribute("clip-rule", "evenodd");
                _this._element.setAttribute("d", "M ".concat(x, " ").concat(y) +
                    "v ".concat(size) +
                    "h ".concat(size) +
                    "v ".concat(-size) +
                    "z" +
                    "M ".concat(x + dotSize, " ").concat(y + dotSize) +
                    "h ".concat(size - 2 * dotSize) +
                    "v ".concat(size - 2 * dotSize) +
                    "h ".concat(-size + 2 * dotSize) +
                    "z");
            } }));
    };
    QRCornerSquare.prototype._basicExtraRounded = function (args) {
        var _this = this;
        var size = args.size, x = args.x, y = args.y;
        var dotSize = size / 7;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                _this._element = document.createElementNS("http://www.w3.org/2000/svg", "path");
                _this._element.setAttribute("clip-rule", "evenodd");
                _this._element.setAttribute("d", "M ".concat(x, " ").concat(y + 2.5 * dotSize) +
                    "v ".concat(2 * dotSize) +
                    "a ".concat(2.5 * dotSize, " ").concat(2.5 * dotSize, ", 0, 0, 0, ").concat(dotSize * 2.5, " ").concat(dotSize * 2.5) +
                    "h ".concat(2 * dotSize) +
                    "a ".concat(2.5 * dotSize, " ").concat(2.5 * dotSize, ", 0, 0, 0, ").concat(dotSize * 2.5, " ").concat(-dotSize * 2.5) +
                    "v ".concat(-2 * dotSize) +
                    "a ".concat(2.5 * dotSize, " ").concat(2.5 * dotSize, ", 0, 0, 0, ").concat(-dotSize * 2.5, " ").concat(-dotSize * 2.5) +
                    "h ".concat(-2 * dotSize) +
                    "a ".concat(2.5 * dotSize, " ").concat(2.5 * dotSize, ", 0, 0, 0, ").concat(-dotSize * 2.5, " ").concat(dotSize * 2.5) +
                    "M ".concat(x + 2.5 * dotSize, " ").concat(y + dotSize) +
                    "h ".concat(2 * dotSize) +
                    "a ".concat(1.5 * dotSize, " ").concat(1.5 * dotSize, ", 0, 0, 1, ").concat(dotSize * 1.5, " ").concat(dotSize * 1.5) +
                    "v ".concat(2 * dotSize) +
                    "a ".concat(1.5 * dotSize, " ").concat(1.5 * dotSize, ", 0, 0, 1, ").concat(-dotSize * 1.5, " ").concat(dotSize * 1.5) +
                    "h ".concat(-2 * dotSize) +
                    "a ".concat(1.5 * dotSize, " ").concat(1.5 * dotSize, ", 0, 0, 1, ").concat(-dotSize * 1.5, " ").concat(-dotSize * 1.5) +
                    "v ".concat(-2 * dotSize) +
                    "a ".concat(1.5 * dotSize, " ").concat(1.5 * dotSize, ", 0, 0, 1, ").concat(dotSize * 1.5, " ").concat(-dotSize * 1.5));
            } }));
    };
    QRCornerSquare.prototype._basicDottedSquare = function (args) {
        var _this = this;
        var size = args.size, x = args.x, y = args.y;
        var squareSize = size / 7;
        var gap = squareSize * 1.2;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                _this._element = document.createElementNS("http://www.w3.org/2000/svg", "path");
                _this._element.setAttribute("clip-rule", "evenodd");
                _this._element.setAttribute("fill", "#000"); // Add this line to fill the squares
                var pathData = "";
                // Top edge
                for (var i = 0; i <= size - squareSize; i += gap) {
                    pathData += "M ".concat(x + i, " ").concat(y, " h ").concat(squareSize, " v ").concat(squareSize, " h -").concat(squareSize, " z ");
                }
                // Right edge
                for (var i = 0; i <= size - squareSize; i += gap) {
                    pathData += "M ".concat(x + size - squareSize, " ").concat(y + i, " h ").concat(squareSize, " v ").concat(squareSize, " h -").concat(squareSize, " z ");
                }
                // Bottom edge
                for (var i = 0; i <= size - squareSize; i += gap) {
                    pathData += "M ".concat(x + size - i - squareSize, " ").concat(y + size - squareSize, " h ").concat(squareSize, " v ").concat(squareSize, " h -").concat(squareSize, " z ");
                }
                // Left edge
                for (var i = 0; i <= size - squareSize; i += gap) {
                    pathData += "M ".concat(x, " ").concat(y + size - i - squareSize, " h ").concat(squareSize, " v ").concat(squareSize, " h -").concat(squareSize, " z ");
                }
                // Top-left corner
                pathData += "M ".concat(x, " ").concat(y, " h ").concat(squareSize, " v ").concat(squareSize, " h -").concat(squareSize, " z ");
                // Top-right corner
                pathData += "M ".concat(x + size - squareSize, " ").concat(y, " h ").concat(squareSize, " v ").concat(squareSize, " h -").concat(squareSize, " z ");
                // Bottom-right corner
                pathData += "M ".concat(x + size - squareSize, " ").concat(y + size - squareSize, " h ").concat(squareSize, " v ").concat(squareSize, " h -").concat(squareSize, " z ");
                // Bottom-left corner
                pathData += "M ".concat(x, " ").concat(y + size - squareSize, " h ").concat(squareSize, " v ").concat(squareSize, " h -").concat(squareSize, " z ");
                _this._element.setAttribute("d", pathData);
            } }));
    };
    QRCornerSquare.prototype._basicRoundedSquareRightBottomEdge = function (args) {
        var _this = this;
        var size = args.size, x = args.x, y = args.y;
        var radius = size / 4; // Adjust this value to control the rounding radius
        var innerSquareSize = size / 1.4; // Size of the inner square
        var innerSquareRadius = innerSquareSize / 4; // Radius for the inner square
        var innerX = x + (size - innerSquareSize) / 2; // X position for the inner square
        var innerY = y + (size - innerSquareSize) / 2; // Y position for the inner square
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                // Create the main shape path
                var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("clip-rule", "evenodd");
                path.setAttribute("d", "M ".concat(x + radius, " ").concat(y) + // Start at the top-left rounded corner
                    "H ".concat(x + size - radius) + // Draw a horizontal line to the right
                    "a ".concat(radius, " ").concat(radius, " 0 0 1 ").concat(radius, " ").concat(radius) + // Draw the top-right arc
                    "V ".concat(y + size - radius) + // Draw a vertical line down to the bottom-right flat edge
                    "H ".concat(x + size) + // Move to the bottom-right flat edge
                    "V ".concat(y + size) + // Draw a vertical line down to the bottom
                    "H ".concat(x + radius) + // Draw a horizontal line to the left
                    "a ".concat(radius, " ").concat(radius, " 0 0 1 -").concat(radius, " -").concat(radius) + // Draw the bottom-left arc
                    "V ".concat(y + radius) + // Draw a vertical line up to the starting point
                    "a ".concat(radius, " ").concat(radius, " 0 0 1 ").concat(radius, " -").concat(radius) + // Draw the top-left arc
                    "Z" // Close the path
                );
                path.setAttribute("fill", "white"); // Set fill to white
                path.setAttribute("stroke", "black"); // Set the stroke color
                path.setAttribute("stroke-width", "1"); // Set the stroke width
                _this._element = path;
                // Create the inner square path
                var innerPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
                innerPath.setAttribute("clip-rule", "evenodd");
                innerPath.setAttribute("d", "M ".concat(innerX + innerSquareRadius, " ").concat(innerY) + // Start at the top-left rounded corner
                    "H ".concat(innerX + innerSquareSize - innerSquareRadius) + // Draw a horizontal line to the right
                    "a ".concat(innerSquareRadius, " ").concat(innerSquareRadius, " 0 0 1 ").concat(innerSquareRadius, " ").concat(innerSquareRadius) + // Draw the top-right arc
                    "V ".concat(innerY + innerSquareSize - innerSquareRadius) + // Draw a vertical line down to the bottom-right flat edge
                    "H ".concat(innerX + innerSquareSize) + // Move to the bottom-right flat edge
                    "V ".concat(innerY + innerSquareSize) + // Draw a vertical line down to the bottom
                    "H ".concat(innerX + innerSquareRadius) + // Draw a horizontal line to the left
                    "a ".concat(innerSquareRadius, " ").concat(innerSquareRadius, " 0 0 1 -").concat(innerSquareRadius, " -").concat(innerSquareRadius) + // Draw the bottom-left arc
                    "V ".concat(innerY + innerSquareRadius) + // Draw a vertical line up to the starting point
                    "a ".concat(innerSquareRadius, " ").concat(innerSquareRadius, " 0 0 1 ").concat(innerSquareRadius, " -").concat(innerSquareRadius) + // Draw the top-left arc
                    "Z" // Close the path
                );
                innerPath.setAttribute("fill", "white"); // Set fill to white for the inner square
                innerPath.setAttribute("stroke", "black"); // Set the stroke color
                innerPath.setAttribute("stroke-width", "1"); // Set the stroke width
                // Append the elements to the SVG container
                var svgContainer = document.querySelector("svg"); // Adjust this selector to match your SVG container
                if (svgContainer) {
                    svgContainer.appendChild(_this._element);
                    svgContainer.appendChild(innerPath);
                }
            } }));
    };
    QRCornerSquare.prototype._basicRoundedSquareLeftTopEdge = function (args) {
        var _this = this;
        var size = args.size, x = args.x, y = args.y;
        var radius = size / 4; // Adjust this value to control the rounding radius
        var innerSquareSize = size / 1.4; // Size of the inner square
        var innerSquareRadius = innerSquareSize / 4; // Radius for the inner square
        var innerX = x + (size - innerSquareSize) / 2; // X position for the inner square
        var innerY = y + (size - innerSquareSize) / 2; // Y position for the inner square
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                // Create the main shape path
                var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("clip-rule", "evenodd");
                path.setAttribute("d", "M ".concat(x + radius, " ").concat(y) + // Start at the top-left flat edge
                    "H ".concat(x + size - radius) + // Draw a horizontal line to the right
                    "a ".concat(radius, " ").concat(radius, " 0 0 1 ").concat(radius, " ").concat(radius) + // Draw the top-right arc
                    "V ".concat(y + size - radius) + // Draw a vertical line down to the bottom-right
                    "a ".concat(radius, " ").concat(radius, " 0 0 1 -").concat(radius, " ").concat(radius) + // Draw the bottom-right arc
                    "H ".concat(x + radius) + // Draw a horizontal line to the left
                    "a ".concat(radius, " ").concat(radius, " 0 0 1 -").concat(radius, " -").concat(radius) + // Draw the bottom-left arc
                    "V ".concat(y + radius) + // Draw a vertical line up to the starting point
                    "H ".concat(x) + // Draw a horizontal line to the left to the starting point
                    "V ".concat(y) + // Move up to the top to ensure the flat corner is complete
                    "Z" // Close the path
                );
                path.setAttribute("fill", "white"); // Set fill to white
                path.setAttribute("stroke", "black"); // Set the stroke color
                path.setAttribute("stroke-width", "1"); // Set the stroke width
                _this._element = path;
                // Create the inner square path
                var innerPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
                innerPath.setAttribute("clip-rule", "evenodd");
                innerPath.setAttribute("d", "M ".concat(innerX + innerSquareRadius, " ").concat(innerY) + // Start at the top-left flat edge
                    "H ".concat(innerX + innerSquareSize - innerSquareRadius) + // Draw a horizontal line to the right
                    "a ".concat(innerSquareRadius, " ").concat(innerSquareRadius, " 0 0 1 ").concat(innerSquareRadius, " ").concat(innerSquareRadius) + // Draw the top-right arc
                    "V ".concat(innerY + innerSquareSize - innerSquareRadius) + // Draw a vertical line down to the bottom-right
                    "a ".concat(innerSquareRadius, " ").concat(innerSquareRadius, " 0 0 1 -").concat(innerSquareRadius, " ").concat(innerSquareRadius) + // Draw the bottom-right arc
                    "H ".concat(innerX + innerSquareRadius) + // Draw a horizontal line to the left
                    "a ".concat(innerSquareRadius, " ").concat(innerSquareRadius, " 0 0 1 -").concat(innerSquareRadius, " -").concat(innerSquareRadius) + // Draw the bottom-left arc
                    "V ".concat(innerY + innerSquareRadius) + // Draw a vertical line up to the starting point
                    "H ".concat(innerX) + // Draw a horizontal line to the left to the starting point
                    "V ".concat(innerY) + // Move up to the top to ensure the flat corner is complete
                    "Z" // Close the path
                );
                innerPath.setAttribute("fill", "white"); // Set fill to white for the inner square
                innerPath.setAttribute("stroke", "black"); // Set the stroke color
                innerPath.setAttribute("stroke-width", "1"); // Set the stroke width
                // Append the elements to the SVG container
                var svgContainer = document.querySelector("svg"); // Adjust this selector to match your SVG container
                if (svgContainer) {
                    svgContainer.appendChild(_this._element);
                    svgContainer.appendChild(innerPath);
                }
            } }));
    };
    QRCornerSquare.prototype._basicCircleInSquare = function (args) {
        var _this = this;
        var size = args.size, x = args.x, y = args.y;
        var borderWidth = size / 7; // Adjust the border width as needed
        var circleRadius = size / 2 - borderWidth / 2;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                _this._element = document.createElementNS("http://www.w3.org/2000/svg", "path");
                _this._element.setAttribute("fill", "none");
                _this._element.setAttribute("d", "M ".concat(x, " ").concat(y) +
                    "h ".concat(size) +
                    "v ".concat(size) +
                    "h ".concat(-size) +
                    "z" + // Outer square border
                    "M ".concat(x + size / 2, ", ").concat(y + size / 2) +
                    "m -".concat(circleRadius, ", 0") +
                    "a ".concat(circleRadius, ",").concat(circleRadius, " 0 1,0 ").concat(2 * circleRadius, ",0") +
                    "a ".concat(circleRadius, ",").concat(circleRadius, " 0 1,0 -").concat(2 * circleRadius, ",0") // Circle in the center
                );
            } }));
    };
    QRCornerSquare.prototype._basicLeftTopCircle = function (args) {
        var _this = this;
        var size = args.size, x = args.x, y = args.y;
        var radius = size / 2;
        var flatEdgeLength = size / 16; // Adjust this value as needed to control the length of the flat edge
        var smallDotRadius = radius / 1.4; // Adjust this value to control the size of the small dot
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                // Create the main shape path
                var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("clip-rule", "evenodd");
                path.setAttribute("d", "M ".concat(x + flatEdgeLength, " ").concat(y) + // Start at the top-left flat edge
                    "H ".concat(x + size - radius) + // Draw a horizontal line to the right
                    "a ".concat(radius, " ").concat(radius, " 0 0 1 ").concat(radius, " ").concat(radius) + // Draw the top-right arc
                    "V ".concat(y + size - radius) + // Draw a vertical line down to the bottom-right
                    "a ".concat(radius, " ").concat(radius, " 0 0 1 -").concat(radius, " ").concat(radius) + // Draw the bottom-right arc
                    "H ".concat(x + radius) + // Draw a horizontal line to the left
                    "a ".concat(radius, " ").concat(radius, " 0 0 1 -").concat(radius, " -").concat(radius) + // Draw the bottom-left arc
                    "V ".concat(y + flatEdgeLength) + // Draw a vertical line up to the starting point to close the path
                    "a ".concat(radius, " ").concat(radius, " 0 0 1 ").concat(radius, " -").concat(radius) + // Draw the top-left arc
                    "Z" // Close the path
                );
                path.setAttribute("fill", "none"); // No fill
                path.setAttribute("stroke", "black"); // Set the stroke color
                path.setAttribute("stroke-width", "1"); // Set the stroke width
                _this._element = path;
                // Create the white rounded dot with flat corner
                var smallDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                smallDot.setAttribute("cx", "".concat(x + radius)); // Center x
                smallDot.setAttribute("cy", "".concat(y + radius)); // Center y
                smallDot.setAttribute("r", "".concat(smallDotRadius)); // Radius of the white circle
                smallDot.setAttribute("fill", "white"); // White fill
                smallDot.setAttribute("stroke", "none"); // No stroke
                // Append both elements to the SVG container
                var svgContainer = document.querySelector("svg"); // Adjust this selector to match your SVG container
                if (svgContainer) {
                    svgContainer.appendChild(_this._element);
                    svgContainer.appendChild(smallDot);
                }
            } }));
    };
    QRCornerSquare.prototype._basicRightBottomCircle = function (args) {
        var _this = this;
        var size = args.size, x = args.x, y = args.y;
        var radius = size / 2;
        var flatEdgeLength = size / 16; // Adjust this value as needed to control the length of the flat edge
        var smallDotRadius = radius / 1.4; // Adjust this value to control the size of the small dot
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                // Create the main shape path
                var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("clip-rule", "evenodd");
                path.setAttribute("d", "M ".concat(x, " ").concat(y + radius) + // Start at the top-left arc
                    "a ".concat(radius, " ").concat(radius, " 0 0 1 ").concat(radius, " -").concat(radius) + // Draw the top-left arc
                    "H ".concat(x + size - radius) + // Draw a horizontal line to the right
                    "a ".concat(radius, " ").concat(radius, " 0 0 1 ").concat(radius, " ").concat(radius) + // Draw the top-right arc
                    "V ".concat(y + size - radius) + // Draw a vertical line down to the bottom-right flat edge
                    "H ".concat(x + size - flatEdgeLength) + // Draw a horizontal line to the left to the flat edge
                    "V ".concat(y + size) + // Draw a vertical line down to the bottom
                    "H ".concat(x + radius) + // Draw a horizontal line to the left
                    "a ".concat(radius, " ").concat(radius, " 0 0 1 -").concat(radius, " -").concat(radius) + // Draw the bottom-left arc
                    "Z" // Close the path
                );
                path.setAttribute("fill", "none"); // No fill
                path.setAttribute("stroke", "black"); // Set the stroke color
                path.setAttribute("stroke-width", "1"); // Set the stroke width
                _this._element = path;
                // Create the white rounded dot with flat corner
                var smallDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                smallDot.setAttribute("cx", "".concat(x + radius)); // Center x
                smallDot.setAttribute("cy", "".concat(y + radius)); // Center y
                smallDot.setAttribute("r", "".concat(smallDotRadius)); // Radius of the white circle
                smallDot.setAttribute("fill", "white"); // White fill
                smallDot.setAttribute("stroke", "none"); // No stroke
                // Append both elements to the SVG container
                var svgContainer = document.querySelector("svg"); // Adjust this selector to match your SVG container
                if (svgContainer) {
                    svgContainer.appendChild(_this._element);
                    svgContainer.appendChild(smallDot);
                }
            } }));
    };
    QRCornerSquare.prototype._basicPeanutShape = function (args) {
        var _this = this;
        var size = args.size, x = args.x, y = args.y;
        var radius = size / 3.7; // Adjust this value to control the rounding radius
        var innerSquareSize = size / 1.4; // Size of the inner square
        var innerSquareRadius = innerSquareSize / 3.7; // Radius for the inner square
        var innerX = x + (size - innerSquareSize) / 2; // X position for the inner square
        var innerY = y + (size - innerSquareSize) / 2; // Y position for the inner square
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                // Create the main shape path
                var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("clip-rule", "evenodd");
                path.setAttribute("d", "M ".concat(x + radius, " ").concat(y) + // Start at the top-left flat edge
                    "H ".concat(x + size - radius) + // Draw a horizontal line to the right
                    "a ".concat(radius, " ").concat(radius, " 0 0 1 ").concat(radius, " ").concat(radius) + // Draw the top-right arc
                    "V ".concat(y + size - radius) + // Draw a vertical line down to the bottom-right flat edge
                    "H ".concat(x + size) + // Move to the bottom-right flat edge
                    "V ".concat(y + size) + // Draw a vertical line down to the bottom
                    "H ".concat(x + radius) + // Draw a horizontal line to the left
                    "a ".concat(radius, " ").concat(radius, " 0 0 1 -").concat(radius, " -").concat(radius) + // Draw the bottom-left arc
                    "V ".concat(y + radius) + // Draw a vertical line up to the starting point
                    "H ".concat(x) + // Move to the top-left flat edge
                    "V ".concat(y) + // Draw a vertical line up to the top
                    "Z" // Close the path
                );
                path.setAttribute("fill", "white"); // Set fill to white
                path.setAttribute("stroke", "black"); // Set the stroke color
                path.setAttribute("stroke-width", "1"); // Set the stroke width
                _this._element = path;
                // Create the inner square path
                var innerPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
                innerPath.setAttribute("clip-rule", "evenodd");
                innerPath.setAttribute("d", "M ".concat(innerX + innerSquareRadius, " ").concat(innerY) + // Start at the top-left flat edge
                    "H ".concat(innerX + innerSquareSize - innerSquareRadius) + // Draw a horizontal line to the right
                    "a ".concat(innerSquareRadius, " ").concat(innerSquareRadius, " 0 0 1 ").concat(innerSquareRadius, " ").concat(innerSquareRadius) + // Draw the top-right arc
                    "V ".concat(innerY + innerSquareSize - innerSquareRadius) + // Draw a vertical line down to the bottom-right flat edge
                    "H ".concat(innerX + innerSquareSize) + // Move to the bottom-right flat edge
                    "V ".concat(innerY + innerSquareSize) + // Draw a vertical line down to the bottom
                    "H ".concat(innerX + innerSquareRadius) + // Draw a horizontal line to the left
                    "a ".concat(innerSquareRadius, " ").concat(innerSquareRadius, " 0 0 1 -").concat(innerSquareRadius, " -").concat(innerSquareRadius) + // Draw the bottom-left arc
                    "V ".concat(innerY + innerSquareRadius) + // Draw a vertical line up to the starting point
                    "H ".concat(innerX) + // Move to the top-left flat edge
                    "V ".concat(innerY) + // Draw a vertical line up to the top
                    "Z" // Close the path
                );
                innerPath.setAttribute("fill", "white"); // Set fill to white for the inner square
                innerPath.setAttribute("stroke", "black"); // Set the stroke color
                innerPath.setAttribute("stroke-width", "1"); // Set the stroke width
                // Append the elements to the SVG container
                var svgContainer = document.querySelector("svg"); // Adjust this selector to match your SVG container
                if (svgContainer) {
                    svgContainer.appendChild(_this._element);
                    svgContainer.appendChild(innerPath);
                }
            } }));
    };
    // _basicParagonalShape(args: BasicFigureDrawArgs): void {
    //   const { size, x, y } = args;
    //   this._rotateFigure({
    //     ...args,
    //     draw: () => {
    //       const element = document.createElementNS("http://www.w3.org/2000/svg", "path");
    //       element.setAttribute("clip-rule", "evenodd");
    //       element.setAttribute(
    //         "d",
    //         `M ${x + size * 0.2} ${y}` + // Move to the top-left corner
    //         `L ${x + size * 0.8} ${y}` + // Draw line to top-right corner
    //         `L ${x + size * 0.9} ${y + size * 0.3}` + // Draw line to right-middle corner
    //         `L ${x + size * 0.7} ${y + size}` + // Draw line to bottom-right corner
    //         `L ${x + size * 0.3} ${y + size}` + // Draw line to bottom-left corner
    //         `L ${x + size * 0.1} ${y + size * 0.7}` + // Draw line to left-middle corner
    //         `Z` // Close the shape
    //       );
    //       element.setAttribute("fill", "black"); // Set fill color to black
    //       // Append the shape to the parent element
    //       args.parent.appendChild(element);
    //     },
    //   });
    // }
    QRCornerSquare.prototype._drawDot = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, rotation = _a.rotation;
        this._basicDot({ x: x, y: y, size: size, rotation: rotation });
    };
    QRCornerSquare.prototype._drawSquare = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, rotation = _a.rotation;
        this._basicSquare({ x: x, y: y, size: size, rotation: rotation });
    };
    QRCornerSquare.prototype._drawExtraRounded = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, rotation = _a.rotation;
        this._basicExtraRounded({ x: x, y: y, size: size, rotation: rotation });
    };
    QRCornerSquare.prototype._drawDottedSquare = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, rotation = _a.rotation;
        this._basicDottedSquare({ x: x, y: y, size: size, rotation: rotation });
    };
    QRCornerSquare.prototype._drawRoundedSquareRightBottomEdge = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, rotation = _a.rotation;
        this._basicRoundedSquareRightBottomEdge({ x: x, y: y, size: size, rotation: rotation });
    };
    QRCornerSquare.prototype._drawRoundedSquareLeftTopEdge = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, rotation = _a.rotation;
        this._basicRoundedSquareLeftTopEdge({ x: x, y: y, size: size, rotation: rotation });
    };
    QRCornerSquare.prototype._drawCircleInSquare = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, rotation = _a.rotation;
        this._basicCircleInSquare({ x: x, y: y, size: size, rotation: rotation });
    };
    QRCornerSquare.prototype._drawCircleLeftTopFlat = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, rotation = _a.rotation;
        this._basicLeftTopCircle({ x: x, y: y, size: size, rotation: rotation });
    };
    QRCornerSquare.prototype._drawCircleRightBottomFlat = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, rotation = _a.rotation;
        this._basicRightBottomCircle({ x: x, y: y, size: size, rotation: rotation });
    };
    QRCornerSquare.prototype._drawPeanutShape = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, rotation = _a.rotation;
        this._basicPeanutShape({ x: x, y: y, size: size, rotation: rotation });
    };
    return QRCornerSquare;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (QRCornerSquare);


/***/ }),

/***/ "./src/figures/dot/canvas/QRDot.ts":
/*!*****************************************!*\
  !*** ./src/figures/dot/canvas/QRDot.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants_dotTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../constants/dotTypes */ "./src/constants/dotTypes.ts");
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var QRDot = /** @class */ (function () {
    function QRDot(_a) {
        var context = _a.context, type = _a.type;
        this._context = context;
        this._type = type;
    }
    QRDot.prototype.draw = function (x, y, size, getNeighbor) {
        var context = this._context;
        var type = this._type;
        var drawFunction;
        switch (type) {
            case _constants_dotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].dots:
                drawFunction = this._drawDot;
                break;
            case _constants_dotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].classy:
                drawFunction = this._drawClassy;
                break;
            case _constants_dotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].classyRounded:
                drawFunction = this._drawClassyRounded;
                break;
            case _constants_dotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].rounded:
                drawFunction = this._drawRounded;
                break;
            case _constants_dotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].extraRounded:
                drawFunction = this._drawExtraRounded;
                break;
            case _constants_dotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].square:
            default:
                drawFunction = this._drawSquare;
        }
        drawFunction.call(this, { x: x, y: y, size: size, context: context, getNeighbor: getNeighbor });
    };
    QRDot.prototype._rotateFigure = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, context = _a.context, _b = _a.rotation, rotation = _b === void 0 ? 0 : _b, draw = _a.draw;
        var cx = x + size / 2;
        var cy = y + size / 2;
        context.translate(cx, cy);
        rotation && context.rotate(rotation);
        draw();
        context.closePath();
        rotation && context.rotate(-rotation);
        context.translate(-cx, -cy);
    };
    QRDot.prototype._basicDot = function (args) {
        var size = args.size, context = args.context;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                context.arc(0, 0, size / 2, 0, Math.PI * 2);
            } }));
    };
    QRDot.prototype._basicSquare = function (args) {
        var size = args.size, context = args.context;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                context.rect(-size / 2, -size / 2, size, size);
            } }));
    };
    //if rotation === 0 - right side is rounded
    QRDot.prototype._basicSideRounded = function (args) {
        var size = args.size, context = args.context;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                context.arc(0, 0, size / 2, -Math.PI / 2, Math.PI / 2);
                context.lineTo(-size / 2, size / 2);
                context.lineTo(-size / 2, -size / 2);
                context.lineTo(0, -size / 2);
            } }));
    };
    //if rotation === 0 - top right corner is rounded
    QRDot.prototype._basicCornerRounded = function (args) {
        var size = args.size, context = args.context;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                context.arc(0, 0, size / 2, -Math.PI / 2, 0);
                context.lineTo(size / 2, size / 2);
                context.lineTo(-size / 2, size / 2);
                context.lineTo(-size / 2, -size / 2);
                context.lineTo(0, -size / 2);
            } }));
    };
    //if rotation === 0 - top right corner is rounded
    QRDot.prototype._basicCornerExtraRounded = function (args) {
        var size = args.size, context = args.context;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                context.arc(-size / 2, size / 2, size, -Math.PI / 2, 0);
                context.lineTo(-size / 2, size / 2);
                context.lineTo(-size / 2, -size / 2);
            } }));
    };
    QRDot.prototype._basicCornersRounded = function (args) {
        var size = args.size, context = args.context;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                context.arc(0, 0, size / 2, -Math.PI / 2, 0);
                context.lineTo(size / 2, size / 2);
                context.lineTo(0, size / 2);
                context.arc(0, 0, size / 2, Math.PI / 2, Math.PI);
                context.lineTo(-size / 2, -size / 2);
                context.lineTo(0, -size / 2);
            } }));
    };
    QRDot.prototype._basicCornersExtraRounded = function (args) {
        var size = args.size, context = args.context;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                context.arc(-size / 2, size / 2, size, -Math.PI / 2, 0);
                context.arc(size / 2, -size / 2, size, Math.PI / 2, Math.PI);
            } }));
    };
    QRDot.prototype._drawDot = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, context = _a.context;
        this._basicDot({ x: x, y: y, size: size, context: context, rotation: 0 });
    };
    QRDot.prototype._drawSquare = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, context = _a.context;
        this._basicSquare({ x: x, y: y, size: size, context: context, rotation: 0 });
    };
    QRDot.prototype._drawRounded = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, context = _a.context, getNeighbor = _a.getNeighbor;
        var leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
        var rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
        var topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
        var bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;
        var neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;
        if (neighborsCount === 0) {
            this._basicDot({ x: x, y: y, size: size, context: context, rotation: 0 });
            return;
        }
        if (neighborsCount > 2 || (leftNeighbor && rightNeighbor) || (topNeighbor && bottomNeighbor)) {
            this._basicSquare({ x: x, y: y, size: size, context: context, rotation: 0 });
            return;
        }
        if (neighborsCount === 2) {
            var rotation = 0;
            if (leftNeighbor && topNeighbor) {
                rotation = Math.PI / 2;
            }
            else if (topNeighbor && rightNeighbor) {
                rotation = Math.PI;
            }
            else if (rightNeighbor && bottomNeighbor) {
                rotation = -Math.PI / 2;
            }
            this._basicCornerRounded({ x: x, y: y, size: size, context: context, rotation: rotation });
            return;
        }
        if (neighborsCount === 1) {
            var rotation = 0;
            if (topNeighbor) {
                rotation = Math.PI / 2;
            }
            else if (rightNeighbor) {
                rotation = Math.PI;
            }
            else if (bottomNeighbor) {
                rotation = -Math.PI / 2;
            }
            this._basicSideRounded({ x: x, y: y, size: size, context: context, rotation: rotation });
            return;
        }
    };
    QRDot.prototype._drawExtraRounded = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, context = _a.context, getNeighbor = _a.getNeighbor;
        var leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
        var rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
        var topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
        var bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;
        var neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;
        if (neighborsCount === 0) {
            this._basicDot({ x: x, y: y, size: size, context: context, rotation: 0 });
            return;
        }
        if (neighborsCount > 2 || (leftNeighbor && rightNeighbor) || (topNeighbor && bottomNeighbor)) {
            this._basicSquare({ x: x, y: y, size: size, context: context, rotation: 0 });
            return;
        }
        if (neighborsCount === 2) {
            var rotation = 0;
            if (leftNeighbor && topNeighbor) {
                rotation = Math.PI / 2;
            }
            else if (topNeighbor && rightNeighbor) {
                rotation = Math.PI;
            }
            else if (rightNeighbor && bottomNeighbor) {
                rotation = -Math.PI / 2;
            }
            this._basicCornerExtraRounded({ x: x, y: y, size: size, context: context, rotation: rotation });
            return;
        }
        if (neighborsCount === 1) {
            var rotation = 0;
            if (topNeighbor) {
                rotation = Math.PI / 2;
            }
            else if (rightNeighbor) {
                rotation = Math.PI;
            }
            else if (bottomNeighbor) {
                rotation = -Math.PI / 2;
            }
            this._basicSideRounded({ x: x, y: y, size: size, context: context, rotation: rotation });
            return;
        }
    };
    QRDot.prototype._drawClassy = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, context = _a.context, getNeighbor = _a.getNeighbor;
        var leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
        var rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
        var topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
        var bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;
        var neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;
        if (neighborsCount === 0) {
            this._basicCornersRounded({ x: x, y: y, size: size, context: context, rotation: Math.PI / 2 });
            return;
        }
        if (!leftNeighbor && !topNeighbor) {
            this._basicCornerRounded({ x: x, y: y, size: size, context: context, rotation: -Math.PI / 2 });
            return;
        }
        if (!rightNeighbor && !bottomNeighbor) {
            this._basicCornerRounded({ x: x, y: y, size: size, context: context, rotation: Math.PI / 2 });
            return;
        }
        this._basicSquare({ x: x, y: y, size: size, context: context, rotation: 0 });
    };
    QRDot.prototype._drawClassyRounded = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, context = _a.context, getNeighbor = _a.getNeighbor;
        var leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
        var rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
        var topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
        var bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;
        var neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;
        if (neighborsCount === 0) {
            this._basicCornersRounded({ x: x, y: y, size: size, context: context, rotation: Math.PI / 2 });
            return;
        }
        if (!leftNeighbor && !topNeighbor) {
            this._basicCornerExtraRounded({ x: x, y: y, size: size, context: context, rotation: -Math.PI / 2 });
            return;
        }
        if (!rightNeighbor && !bottomNeighbor) {
            this._basicCornerExtraRounded({ x: x, y: y, size: size, context: context, rotation: Math.PI / 2 });
            return;
        }
        this._basicSquare({ x: x, y: y, size: size, context: context, rotation: 0 });
    };
    return QRDot;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (QRDot);


/***/ }),

/***/ "./src/figures/dot/svg/QRDot.ts":
/*!**************************************!*\
  !*** ./src/figures/dot/svg/QRDot.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _constants_dotTypes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../constants/dotTypes */ "./src/constants/dotTypes.ts");
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var QRDot = /** @class */ (function () {
    function QRDot(_a) {
        var svg = _a.svg, type = _a.type;
        this._svg = svg;
        this._type = type;
    }
    QRDot.prototype.draw = function (x, y, size, getNeighbor) {
        var type = this._type;
        var drawFunction;
        switch (type) {
            case _constants_dotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].dots:
                drawFunction = this._drawDot;
                break;
            case _constants_dotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].classy:
                drawFunction = this._drawClassy;
                break;
            case _constants_dotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].classyRounded:
                drawFunction = this._drawClassyRounded;
                break;
            case _constants_dotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].rounded:
                drawFunction = this._drawRounded;
                break;
            case _constants_dotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].extraRounded:
                drawFunction = this._drawExtraRounded;
                break;
            case _constants_dotTypes__WEBPACK_IMPORTED_MODULE_0__["default"].square:
            default:
                drawFunction = this._drawSquare;
        }
        drawFunction.call(this, { x: x, y: y, size: size, getNeighbor: getNeighbor });
    };
    QRDot.prototype._rotateFigure = function (_a) {
        var _b;
        var x = _a.x, y = _a.y, size = _a.size, _c = _a.rotation, rotation = _c === void 0 ? 0 : _c, draw = _a.draw;
        var cx = x + size / 2;
        var cy = y + size / 2;
        draw();
        (_b = this._element) === null || _b === void 0 ? void 0 : _b.setAttribute("transform", "rotate(".concat((180 * rotation) / Math.PI, ",").concat(cx, ",").concat(cy, ")"));
    };
    QRDot.prototype._basicDot = function (args) {
        var _this = this;
        var size = args.size, x = args.x, y = args.y;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                _this._element = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                _this._element.setAttribute("cx", String(x + size / 2));
                _this._element.setAttribute("cy", String(y + size / 2));
                _this._element.setAttribute("r", String(size / 2));
            } }));
    };
    QRDot.prototype._basicSquare = function (args) {
        var _this = this;
        var size = args.size, x = args.x, y = args.y;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                _this._element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                _this._element.setAttribute("x", String(x));
                _this._element.setAttribute("y", String(y));
                _this._element.setAttribute("width", String(size));
                _this._element.setAttribute("height", String(size));
            } }));
    };
    //if rotation === 0 - right side is rounded
    QRDot.prototype._basicSideRounded = function (args) {
        var _this = this;
        var size = args.size, x = args.x, y = args.y;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                _this._element = document.createElementNS("http://www.w3.org/2000/svg", "path");
                _this._element.setAttribute("d", "M ".concat(x, " ").concat(y) + //go to top left position
                    "v ".concat(size) + //draw line to left bottom corner
                    "h ".concat(size / 2) + //draw line to left bottom corner + half of size right
                    "a ".concat(size / 2, " ").concat(size / 2, ", 0, 0, 0, 0 ").concat(-size) // draw rounded corner
                );
            } }));
    };
    //if rotation === 0 - top right corner is rounded
    QRDot.prototype._basicCornerRounded = function (args) {
        var _this = this;
        var size = args.size, x = args.x, y = args.y;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                _this._element = document.createElementNS("http://www.w3.org/2000/svg", "path");
                _this._element.setAttribute("d", "M ".concat(x, " ").concat(y) + //go to top left position
                    "v ".concat(size) + //draw line to left bottom corner
                    "h ".concat(size) + //draw line to right bottom corner
                    "v ".concat(-size / 2) + //draw line to right bottom corner + half of size top
                    "a ".concat(size / 2, " ").concat(size / 2, ", 0, 0, 0, ").concat(-size / 2, " ").concat(-size / 2) // draw rounded corner
                );
            } }));
    };
    //if rotation === 0 - top right corner is rounded
    QRDot.prototype._basicCornerExtraRounded = function (args) {
        var _this = this;
        var size = args.size, x = args.x, y = args.y;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                _this._element = document.createElementNS("http://www.w3.org/2000/svg", "path");
                _this._element.setAttribute("d", "M ".concat(x, " ").concat(y) + //go to top left position
                    "v ".concat(size) + //draw line to left bottom corner
                    "h ".concat(size) + //draw line to right bottom corner
                    "a ".concat(size, " ").concat(size, ", 0, 0, 0, ").concat(-size, " ").concat(-size) // draw rounded top right corner
                );
            } }));
    };
    //if rotation === 0 - left bottom and right top corners are rounded
    QRDot.prototype._basicCornersRounded = function (args) {
        var _this = this;
        var size = args.size, x = args.x, y = args.y;
        this._rotateFigure(__assign(__assign({}, args), { draw: function () {
                _this._element = document.createElementNS("http://www.w3.org/2000/svg", "path");
                _this._element.setAttribute("d", "M ".concat(x, " ").concat(y) + //go to left top position
                    "v ".concat(size / 2) + //draw line to left top corner + half of size bottom
                    "a ".concat(size / 2, " ").concat(size / 2, ", 0, 0, 0, ").concat(size / 2, " ").concat(size / 2) + // draw rounded left bottom corner
                    "h ".concat(size / 2) + //draw line to right bottom corner
                    "v ".concat(-size / 2) + //draw line to right bottom corner + half of size top
                    "a ".concat(size / 2, " ").concat(size / 2, ", 0, 0, 0, ").concat(-size / 2, " ").concat(-size / 2) // draw rounded right top corner
                );
            } }));
    };
    QRDot.prototype._drawDot = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size;
        this._basicDot({ x: x, y: y, size: size, rotation: 0 });
    };
    QRDot.prototype._drawSquare = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size;
        this._basicSquare({ x: x, y: y, size: size, rotation: 0 });
    };
    QRDot.prototype._drawRounded = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, getNeighbor = _a.getNeighbor;
        var leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
        var rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
        var topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
        var bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;
        var neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;
        if (neighborsCount === 0) {
            this._basicDot({ x: x, y: y, size: size, rotation: 0 });
            return;
        }
        if (neighborsCount > 2 || (leftNeighbor && rightNeighbor) || (topNeighbor && bottomNeighbor)) {
            this._basicSquare({ x: x, y: y, size: size, rotation: 0 });
            return;
        }
        if (neighborsCount === 2) {
            var rotation = 0;
            if (leftNeighbor && topNeighbor) {
                rotation = Math.PI / 2;
            }
            else if (topNeighbor && rightNeighbor) {
                rotation = Math.PI;
            }
            else if (rightNeighbor && bottomNeighbor) {
                rotation = -Math.PI / 2;
            }
            this._basicCornerRounded({ x: x, y: y, size: size, rotation: rotation });
            return;
        }
        if (neighborsCount === 1) {
            var rotation = 0;
            if (topNeighbor) {
                rotation = Math.PI / 2;
            }
            else if (rightNeighbor) {
                rotation = Math.PI;
            }
            else if (bottomNeighbor) {
                rotation = -Math.PI / 2;
            }
            this._basicSideRounded({ x: x, y: y, size: size, rotation: rotation });
            return;
        }
    };
    QRDot.prototype._drawExtraRounded = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, getNeighbor = _a.getNeighbor;
        var leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
        var rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
        var topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
        var bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;
        var neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;
        if (neighborsCount === 0) {
            this._basicDot({ x: x, y: y, size: size, rotation: 0 });
            return;
        }
        if (neighborsCount > 2 || (leftNeighbor && rightNeighbor) || (topNeighbor && bottomNeighbor)) {
            this._basicSquare({ x: x, y: y, size: size, rotation: 0 });
            return;
        }
        if (neighborsCount === 2) {
            var rotation = 0;
            if (leftNeighbor && topNeighbor) {
                rotation = Math.PI / 2;
            }
            else if (topNeighbor && rightNeighbor) {
                rotation = Math.PI;
            }
            else if (rightNeighbor && bottomNeighbor) {
                rotation = -Math.PI / 2;
            }
            this._basicCornerExtraRounded({ x: x, y: y, size: size, rotation: rotation });
            return;
        }
        if (neighborsCount === 1) {
            var rotation = 0;
            if (topNeighbor) {
                rotation = Math.PI / 2;
            }
            else if (rightNeighbor) {
                rotation = Math.PI;
            }
            else if (bottomNeighbor) {
                rotation = -Math.PI / 2;
            }
            this._basicSideRounded({ x: x, y: y, size: size, rotation: rotation });
            return;
        }
    };
    QRDot.prototype._drawClassy = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, getNeighbor = _a.getNeighbor;
        var leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
        var rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
        var topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
        var bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;
        var neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;
        if (neighborsCount === 0) {
            this._basicCornersRounded({ x: x, y: y, size: size, rotation: Math.PI / 2 });
            return;
        }
        if (!leftNeighbor && !topNeighbor) {
            this._basicCornerRounded({ x: x, y: y, size: size, rotation: -Math.PI / 2 });
            return;
        }
        if (!rightNeighbor && !bottomNeighbor) {
            this._basicCornerRounded({ x: x, y: y, size: size, rotation: Math.PI / 2 });
            return;
        }
        this._basicSquare({ x: x, y: y, size: size, rotation: 0 });
    };
    QRDot.prototype._drawClassyRounded = function (_a) {
        var x = _a.x, y = _a.y, size = _a.size, getNeighbor = _a.getNeighbor;
        var leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
        var rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
        var topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
        var bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;
        var neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;
        if (neighborsCount === 0) {
            this._basicCornersRounded({ x: x, y: y, size: size, rotation: Math.PI / 2 });
            return;
        }
        if (!leftNeighbor && !topNeighbor) {
            this._basicCornerExtraRounded({ x: x, y: y, size: size, rotation: -Math.PI / 2 });
            return;
        }
        if (!rightNeighbor && !bottomNeighbor) {
            this._basicCornerExtraRounded({ x: x, y: y, size: size, rotation: Math.PI / 2 });
            return;
        }
        this._basicSquare({ x: x, y: y, size: size, rotation: 0 });
    };
    return QRDot;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (QRDot);


/***/ }),

/***/ "./src/tools/calculateImageSize.ts":
/*!*****************************************!*\
  !*** ./src/tools/calculateImageSize.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ calculateImageSize)
/* harmony export */ });
function calculateImageSize(_a) {
    var originalHeight = _a.originalHeight, originalWidth = _a.originalWidth, maxHiddenDots = _a.maxHiddenDots, maxHiddenAxisDots = _a.maxHiddenAxisDots, dotSize = _a.dotSize;
    var hideDots = { x: 0, y: 0 };
    var imageSize = { x: 0, y: 0 };
    if (originalHeight <= 0 || originalWidth <= 0 || maxHiddenDots <= 0 || dotSize <= 0) {
        return {
            height: 0,
            width: 0,
            hideYDots: 0,
            hideXDots: 0
        };
    }
    var k = originalHeight / originalWidth;
    //Getting the maximum possible axis hidden dots
    hideDots.x = Math.floor(Math.sqrt(maxHiddenDots / k));
    //The count of hidden dot's can't be less than 1
    if (hideDots.x <= 0)
        hideDots.x = 1;
    //Check the limit of the maximum allowed axis hidden dots
    if (maxHiddenAxisDots && maxHiddenAxisDots < hideDots.x)
        hideDots.x = maxHiddenAxisDots;
    //The count of dots should be odd
    if (hideDots.x % 2 === 0)
        hideDots.x--;
    imageSize.x = hideDots.x * dotSize;
    //Calculate opposite axis hidden dots based on axis value.
    //The value will be odd.
    //We use ceil to prevent dots covering by the image.
    hideDots.y = 1 + 2 * Math.ceil((hideDots.x * k - 1) / 2);
    imageSize.y = Math.round(imageSize.x * k);
    //If the result dots count is bigger than max - then decrease size and calculate again
    if (hideDots.y * hideDots.x > maxHiddenDots || (maxHiddenAxisDots && maxHiddenAxisDots < hideDots.y)) {
        if (maxHiddenAxisDots && maxHiddenAxisDots < hideDots.y) {
            hideDots.y = maxHiddenAxisDots;
            if (hideDots.y % 2 === 0)
                hideDots.x--;
        }
        else {
            hideDots.y -= 2;
        }
        imageSize.y = hideDots.y * dotSize;
        hideDots.x = 1 + 2 * Math.ceil((hideDots.y / k - 1) / 2);
        imageSize.x = Math.round(imageSize.y / k);
    }
    return {
        height: imageSize.y,
        width: imageSize.x,
        hideYDots: hideDots.y,
        hideXDots: hideDots.x
    };
}


/***/ }),

/***/ "./src/tools/downloadURI.ts":
/*!**********************************!*\
  !*** ./src/tools/downloadURI.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ downloadURI)
/* harmony export */ });
function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


/***/ }),

/***/ "./src/tools/getMode.ts":
/*!******************************!*\
  !*** ./src/tools/getMode.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getMode)
/* harmony export */ });
/* harmony import */ var _constants_modes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/modes */ "./src/constants/modes.ts");

function getMode(data) {
    switch (true) {
        case /^[0-9]*$/.test(data):
            return _constants_modes__WEBPACK_IMPORTED_MODULE_0__["default"].numeric;
        case /^[0-9A-Z $%*+\-./:]*$/.test(data):
            return _constants_modes__WEBPACK_IMPORTED_MODULE_0__["default"].alphanumeric;
        default:
            return _constants_modes__WEBPACK_IMPORTED_MODULE_0__["default"].byte;
    }
}


/***/ }),

/***/ "./src/tools/merge.ts":
/*!****************************!*\
  !*** ./src/tools/merge.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mergeDeep)
/* harmony export */ });
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var isObject = function (obj) { return !!obj && typeof obj === "object" && !Array.isArray(obj); };
function mergeDeep(target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    if (!sources.length)
        return target;
    var source = sources.shift();
    if (source === undefined || !isObject(target) || !isObject(source))
        return target;
    target = __assign({}, target);
    Object.keys(source).forEach(function (key) {
        var targetValue = target[key];
        var sourceValue = source[key];
        if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
            target[key] = sourceValue;
        }
        else if (isObject(targetValue) && isObject(sourceValue)) {
            target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue);
        }
        else {
            target[key] = sourceValue;
        }
    });
    return mergeDeep.apply(void 0, __spreadArray([target], sources, false));
}


/***/ }),

/***/ "./src/tools/sanitizeOptions.ts":
/*!**************************************!*\
  !*** ./src/tools/sanitizeOptions.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ sanitizeOptions)
/* harmony export */ });
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
function sanitizeGradient(gradient) {
    var newGradient = __assign({}, gradient);
    if (!newGradient.colorStops || !newGradient.colorStops.length) {
        throw "Field 'colorStops' is required in gradient";
    }
    if (newGradient.rotation) {
        newGradient.rotation = Number(newGradient.rotation);
    }
    else {
        newGradient.rotation = 0;
    }
    newGradient.colorStops = newGradient.colorStops.map(function (colorStop) { return (__assign(__assign({}, colorStop), { offset: Number(colorStop.offset) })); });
    return newGradient;
}
function sanitizeOptions(options) {
    var newOptions = __assign({}, options);
    newOptions.width = Number(newOptions.width);
    newOptions.height = Number(newOptions.height);
    newOptions.margin = Number(newOptions.margin);
    newOptions.imageOptions = __assign(__assign({}, newOptions.imageOptions), { hideBackgroundDots: Boolean(newOptions.imageOptions.hideBackgroundDots), imageSize: Number(newOptions.imageOptions.imageSize), margin: Number(newOptions.imageOptions.margin) });
    if (newOptions.margin > Math.min(newOptions.width, newOptions.height)) {
        newOptions.margin = Math.min(newOptions.width, newOptions.height);
    }
    newOptions.dotsOptions = __assign({}, newOptions.dotsOptions);
    if (newOptions.dotsOptions.gradient) {
        newOptions.dotsOptions.gradient = sanitizeGradient(newOptions.dotsOptions.gradient);
    }
    if (newOptions.cornersSquareOptions) {
        newOptions.cornersSquareOptions = __assign({}, newOptions.cornersSquareOptions);
        if (newOptions.cornersSquareOptions.gradient) {
            newOptions.cornersSquareOptions.gradient = sanitizeGradient(newOptions.cornersSquareOptions.gradient);
        }
    }
    if (newOptions.cornersDotOptions) {
        newOptions.cornersDotOptions = __assign({}, newOptions.cornersDotOptions);
        if (newOptions.cornersDotOptions.gradient) {
            newOptions.cornersDotOptions.gradient = sanitizeGradient(newOptions.cornersDotOptions.gradient);
        }
    }
    if (newOptions.backgroundOptions) {
        newOptions.backgroundOptions = __assign({}, newOptions.backgroundOptions);
        if (newOptions.backgroundOptions.gradient) {
            newOptions.backgroundOptions.gradient = sanitizeGradient(newOptions.backgroundOptions.gradient);
        }
    }
    return newOptions;
}


/***/ }),

/***/ "./src/types/index.ts":
/*!****************************!*\
  !*** ./src/types/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cornerDotTypes: () => (/* reexport safe */ _constants_cornerDotTypes__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   cornerSquareTypes: () => (/* reexport safe */ _constants_cornerSquareTypes__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   dotTypes: () => (/* reexport safe */ _constants_dotTypes__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   drawTypes: () => (/* reexport safe */ _constants_drawTypes__WEBPACK_IMPORTED_MODULE_8__["default"]),
/* harmony export */   errorCorrectionLevels: () => (/* reexport safe */ _constants_errorCorrectionLevels__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   errorCorrectionPercents: () => (/* reexport safe */ _constants_errorCorrectionPercents__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   modes: () => (/* reexport safe */ _constants_modes__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   qrTypes: () => (/* reexport safe */ _constants_qrTypes__WEBPACK_IMPORTED_MODULE_7__["default"])
/* harmony export */ });
/* harmony import */ var _core_QRCodeStyling__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/QRCodeStyling */ "./src/core/QRCodeStyling.ts");
/* harmony import */ var _constants_dotTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants/dotTypes */ "./src/constants/dotTypes.ts");
/* harmony import */ var _constants_cornerDotTypes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants/cornerDotTypes */ "./src/constants/cornerDotTypes.ts");
/* harmony import */ var _constants_cornerSquareTypes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants/cornerSquareTypes */ "./src/constants/cornerSquareTypes.ts");
/* harmony import */ var _constants_errorCorrectionLevels__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./constants/errorCorrectionLevels */ "./src/constants/errorCorrectionLevels.ts");
/* harmony import */ var _constants_errorCorrectionPercents__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./constants/errorCorrectionPercents */ "./src/constants/errorCorrectionPercents.ts");
/* harmony import */ var _constants_modes__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./constants/modes */ "./src/constants/modes.ts");
/* harmony import */ var _constants_qrTypes__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./constants/qrTypes */ "./src/constants/qrTypes.ts");
/* harmony import */ var _constants_drawTypes__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./constants/drawTypes */ "./src/constants/drawTypes.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./types */ "./src/types/index.ts");











/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_core_QRCodeStyling__WEBPACK_IMPORTED_MODULE_0__["default"]);

})();

__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBLGdDQUFnQztBQUNoQztBQUNBLGdDQUFnQztBQUNoQztBQUNBLGdDQUFnQztBQUNoQztBQUNBLGdDQUFnQztBQUNoQztBQUNBLGdDQUFnQztBQUNoQztBQUNBLGdDQUFnQztBQUNoQztBQUNBLGdDQUFnQztBQUNoQztBQUNBLGdDQUFnQzs7QUFFaEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNCQUFzQix3QkFBd0I7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxRQUFROztBQUVSOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsUUFBUTs7QUFFUjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUEsd0JBQXdCLG1CQUFtQjtBQUMzQywwQkFBMEIsbUJBQW1COztBQUU3QztBQUNBOztBQUVBLDJCQUEyQixRQUFROztBQUVuQztBQUNBO0FBQ0E7O0FBRUEsNkJBQTZCLFFBQVE7O0FBRXJDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLHdCQUF3Qix1QkFBdUI7QUFDL0MsMEJBQTBCLHVCQUF1QjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSx3QkFBd0IsbUJBQW1CO0FBQzNDLDBCQUEwQix1QkFBdUI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx3QkFBd0IsbUJBQW1CO0FBQzNDLDBCQUEwQix1QkFBdUI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSx3QkFBd0IsbUJBQW1CO0FBQzNDLDBCQUEwQixtQkFBbUI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CLE9BQU87QUFDM0I7QUFDQTtBQUNBLG9CQUFvQixTQUFTO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsU0FBUztBQUM3QjtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IseUJBQXlCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSxzQkFBc0IsdUJBQXVCO0FBQzdDLHdCQUF3QixtQkFBbUI7QUFDM0M7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0Esc0JBQXNCLHVCQUF1QjtBQUM3QztBQUNBOztBQUVBLHNCQUFzQixtQkFBbUI7QUFDekM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSxzQkFBc0IsWUFBWTs7QUFFbEM7QUFDQTtBQUNBOztBQUVBLHdCQUF3QixXQUFXO0FBQ25DO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxzQkFBc0IsWUFBWTtBQUNsQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNCQUFzQixjQUFjO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0JBQXNCLG1CQUFtQjtBQUN6QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixTQUFTO0FBQy9CO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNCQUFzQixjQUFjO0FBQ3BDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLG1CQUFtQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsWUFBWTtBQUNwQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLDJCQUEyQjtBQUMzQjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdCQUF3QjtBQUN4Qjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsc0JBQXNCLGVBQWU7QUFDckM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSxVQUFVOztBQUVWOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFv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QVUsR0FBRztJQUNqQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNyQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNyQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNyQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNyQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNyQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNyQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztDQUN0QixDQUFDO0FBRUYsSUFBTSxPQUFPLEdBQUc7SUFDZCxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNyQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNyQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNyQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxD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QUFDLEVBQUUsQ0FBQyxLQUFFLENBQUMsS0FBRSxJQUFJLFFBQUUsT0FBTyxXQUFFLFFBQVEsWUFBRSxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVELGlDQUFXLEdBQVgsVUFBWSxFQUFpRDtZQUEvQyxDQUFDLFNBQUUsQ0FBQyxTQUFFLElBQUksWUFBRSxPQUFPLGVBQUUsUUFBUTtRQUN6QyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxLQUFFLENBQUMsS0FBRSxJQUFJLFFBQUUsT0FBTyxXQUFFLFFBQVEsWUFBRSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVELCtCQUFTLEdBQVQsVUFBVSxFQUFpRDtZQUEvQyxDQUFDLFNBQUUsQ0FBQyxTQUFFLElBQUksWUFBRSxPQUFPLGVBQUUsUUFBUTtRQUN2QyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxLQUFFLENBQUMsS0FBRSxJQUFJLFFBQUUsT0FBTyxXQUFFLFFBQVEsWUFBRSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELCtCQUFTLEdBQVQsVUFBVSxFQUFpRDtZQUEvQyxDQUFDLFNBQUUsQ0FBQyxTQUFFLElBQUksWUFBRSxPQUFPLGVBQUUsUUFBUTtRQUN2QyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxLQUFFLENBQUMsS0FBRSxJQUFJLFFBQUUsT0FBTyxXQUFFLFFBQVEsWUFBRSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELGdDQUFVLEdBQVYsVUFBVyxFQUFpRDtZQUEvQyxDQUFDLFNBQUUsQ0FBQyxTQUFFLElBQUksWUFBRSxPQUFPLGVBQUUsUUFBUTtRQUN4QyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxLQUFFLENBQUMsS0FBRSxJQUFJLFFBQUUsT0FBTyxXQUFFLFFBQVEsWUFBRSxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVELGtDQUFZLEdBQVosVUFBYSxFQUFpRDtZQUEvQyxDQUFDLFNBQUUsQ0FBQyxTQUFFLElBQUksWUFBRSxPQUFPLGVBQUUsUUFBUTtRQUMxQyxJQUFJLENBQUMsYUFBYSxD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QUFVLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDakc7S0FDRjtJQUVELE9BQU8sVUFBVSxDQUFDO0FBQ3BCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1VFNUVEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOaUQ7QUFDTDtBQUNZO0FBQ007QUFDUTtBQUNJO0FBQ3BDO0FBQ0k7QUFDSTtBQUV0QjtBQVd0QjtBQUVGLGlFQUFlLDJEQUFhLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9RUkNvZGVTdHlsaW5nL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9RUkNvZGVTdHlsaW5nLy4vbm9kZV9tb2R1bGVzL3FyY29kZS1nZW5lcmF0b3IvcXJjb2RlLmpzIiwid2VicGFjazovL1FSQ29kZVN0eWxpbmcvLi9zcmMvY29uc3RhbnRzL2Nvcm5lckRvdFR5cGVzLnRzIiwid2VicGFjazovL1FSQ29kZVN0eWxpbmcvLi9zcmMvY29uc3RhbnRzL2Nvcm5lclNxdWFyZVR5cGVzLnRzIiwid2VicGFjazovL1FSQ29kZVN0eWxpbmcvLi9zcmMvY29uc3RhbnRzL2RvdFR5cGVzLnRzIiwid2VicGFjazovL1FSQ29kZVN0eWxpbmcvLi9zcmMvY29uc3RhbnRzL2RyYXdUeXBlcy50cyIsIndlYnBhY2s6Ly9RUkNvZGVTdHlsaW5nLy4vc3JjL2NvbnN0YW50cy9lcnJvckNvcnJlY3Rpb25MZXZlbHMudHMiLCJ3ZWJwYWNrOi8vUVJDb2RlU3R5bGluZy8uL3NyYy9jb25zdGFudHMvZXJyb3JDb3JyZWN0aW9uUGVyY2VudHMudHMiLCJ3ZWJwYWNrOi8vUVJDb2RlU3R5bGluZy8uL3NyYy9jb25zdGFudHMvZ3JhZGllbnRUeXBlcy50cyIsIndlYnBhY2s6Ly9RUkNvZGVTdHlsaW5nLy4vc3JjL2NvbnN0YW50cy9tb2Rlcy50cyIsIndlYnBhY2s6Ly9RUkNvZGVTdHlsaW5nLy4vc3JjL2NvbnN0YW50cy9xclR5cGVzLnRzIiwid2VicGFjazovL1FSQ29kZVN0eWxpbmcvLi9zcmMvY29yZS9RUkNhbnZhcy50cyIsIndlYnBhY2s6Ly9RUkNvZGVTdHlsaW5nLy4vc3JjL2NvcmUvUVJDb2RlU3R5bGluZy50cyIsIndlYnBhY2s6Ly9RUkNvZGVTdHlsaW5nLy4vc3JjL2NvcmUvUVJPcHRpb25zLnRzIiwid2VicGFjazovL1FSQ29kZVN0eWxpbmcvLi9zcmMvY29yZS9RUlNWRy50cyIsIndlYnBhY2s6Ly9RUkNvZGVTdHlsaW5nLy4vc3JjL2ZpZ3VyZXMvY29ybmVyRG90L2NhbnZhcy9RUkNvcm5lckRvdC50cyIsIndlYnBhY2s6Ly9RUkNvZGVTdHlsaW5nLy4vc3JjL2ZpZ3VyZXMvY29ybmVyRG90L3N2Zy9RUkNvcm5lckRvdC50cyIsIndlYnBhY2s6Ly9RUkNvZGVTdHlsaW5nLy4vc3JjL2ZpZ3VyZXMvY29ybmVyU3F1YXJlL2NhbnZhcy9RUkNvcm5lclNxdWFyZS50cyIsIndlYnBhY2s6Ly9RUkNvZGVTdHlsaW5nLy4vc3JjL2ZpZ3VyZXMvY29ybmVyU3F1YXJlL3N2Zy9RUkNvcm5lclNxdWFyZS50cyIsIndlYnBhY2s6Ly9RUkNvZGVTdHlsaW5nLy4vc3JjL2ZpZ3VyZXMvZG90L2NhbnZhcy9RUkRvdC50cyIsIndlYnBhY2s6Ly9RUkNvZGVTdHlsaW5nLy4vc3JjL2ZpZ3VyZXMvZG90L3N2Zy9RUkRvdC50cyIsIndlYnBhY2s6Ly9RUkNvZGVTdHlsaW5nLy4vc3JjL3Rvb2xzL2NhbGN1bGF0ZUltYWdlU2l6ZS50cyIsIndlYnBhY2s6Ly9RUkNvZGVTdHlsaW5nLy4vc3JjL3Rvb2xzL2Rvd25sb2FkVVJJLnRzIiwid2VicGFjazovL1FSQ29kZVN0eWxpbmcvLi9zcmMvdG9vbHMvZ2V0TW9kZS50cyIsIndlYnBhY2s6Ly9RUkNvZGVTdHlsaW5nLy4vc3JjL3Rvb2xzL21lcmdlLnRzIiwid2VicGFjazovL1FSQ29kZVN0eWxpbmcvLi9zcmMvdG9vbHMvc2FuaXRpemVPcHRpb25zLnRzIiwid2VicGFjazovL1FSQ29kZVN0eWxpbmcvLi9zcmMvdHlwZXMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vUVJDb2RlU3R5bGluZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9RUkNvZGVTdHlsaW5nL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL1FSQ29kZVN0eWxpbmcvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL1FSQ29kZVN0eWxpbmcvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9RUkNvZGVTdHlsaW5nL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vUVJDb2RlU3R5bGluZy8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJRUkNvZGVTdHlsaW5nXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIlFSQ29kZVN0eWxpbmdcIl0gPSBmYWN0b3J5KCk7XG59KShzZWxmLCAoKSA9PiB7XG5yZXR1cm4gIiwiLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vXG4vLyBRUiBDb2RlIEdlbmVyYXRvciBmb3IgSmF2YVNjcmlwdFxuLy9cbi8vIENvcHlyaWdodCAoYykgMjAwOSBLYXp1aGlrbyBBcmFzZVxuLy9cbi8vIFVSTDogaHR0cDovL3d3dy5kLXByb2plY3QuY29tL1xuLy9cbi8vIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZTpcbi8vICBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuLy9cbi8vIFRoZSB3b3JkICdRUiBDb2RlJyBpcyByZWdpc3RlcmVkIHRyYWRlbWFyayBvZlxuLy8gREVOU08gV0FWRSBJTkNPUlBPUkFURURcbi8vICBodHRwOi8vd3d3LmRlbnNvLXdhdmUuY29tL3FyY29kZS9mYXFwYXRlbnQtZS5odG1sXG4vL1xuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIHFyY29kZSA9IGZ1bmN0aW9uKCkge1xuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIHFyY29kZVxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBxcmNvZGVcbiAgICogQHBhcmFtIHR5cGVOdW1iZXIgMSB0byA0MFxuICAgKiBAcGFyYW0gZXJyb3JDb3JyZWN0aW9uTGV2ZWwgJ0wnLCdNJywnUScsJ0gnXG4gICAqL1xuICB2YXIgcXJjb2RlID0gZnVuY3Rpb24odHlwZU51bWJlciwgZXJyb3JDb3JyZWN0aW9uTGV2ZWwpIHtcblxuICAgIHZhciBQQUQwID0gMHhFQztcbiAgICB2YXIgUEFEMSA9IDB4MTE7XG5cbiAgICB2YXIgX3R5cGVOdW1iZXIgPSB0eXBlTnVtYmVyO1xuICAgIHZhciBfZXJyb3JDb3JyZWN0aW9uTGV2ZWwgPSBRUkVycm9yQ29ycmVjdGlvbkxldmVsW2Vycm9yQ29ycmVjdGlvbkxldmVsXTtcbiAgICB2YXIgX21vZHVsZXMgPSBudWxsO1xuICAgIHZhciBfbW9kdWxlQ291bnQgPSAwO1xuICAgIHZhciBfZGF0YUNhY2hlID0gbnVsbDtcbiAgICB2YXIgX2RhdGFMaXN0ID0gW107XG5cbiAgICB2YXIgX3RoaXMgPSB7fTtcblxuICAgIHZhciBtYWtlSW1wbCA9IGZ1bmN0aW9uKHRlc3QsIG1hc2tQYXR0ZXJuKSB7XG5cbiAgICAgIF9tb2R1bGVDb3VudCA9IF90eXBlTnVtYmVyICogNCArIDE3O1xuICAgICAgX21vZHVsZXMgPSBmdW5jdGlvbihtb2R1bGVDb3VudCkge1xuICAgICAgICB2YXIgbW9kdWxlcyA9IG5ldyBBcnJheShtb2R1bGVDb3VudCk7XG4gICAgICAgIGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IG1vZHVsZUNvdW50OyByb3cgKz0gMSkge1xuICAgICAgICAgIG1vZHVsZXNbcm93XSA9IG5ldyBBcnJheShtb2R1bGVDb3VudCk7XG4gICAgICAgICAgZm9yICh2YXIgY29sID0gMDsgY29sIDwgbW9kdWxlQ291bnQ7IGNvbCArPSAxKSB7XG4gICAgICAgICAgICBtb2R1bGVzW3Jvd11bY29sXSA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtb2R1bGVzO1xuICAgICAgfShfbW9kdWxlQ291bnQpO1xuXG4gICAgICBzZXR1cFBvc2l0aW9uUHJvYmVQYXR0ZXJuKDAsIDApO1xuICAgICAgc2V0dXBQb3NpdGlvblByb2JlUGF0dGVybihfbW9kdWxlQ291bnQgLSA3LCAwKTtcbiAgICAgIHNldHVwUG9zaXRpb25Qcm9iZVBhdHRlcm4oMCwgX21vZHVsZUNvdW50IC0gNyk7XG4gICAgICBzZXR1cFBvc2l0aW9uQWRqdXN0UGF0dGVybigpO1xuICAgICAgc2V0dXBUaW1pbmdQYXR0ZXJuKCk7XG4gICAgICBzZXR1cFR5cGVJbmZvKHRlc3QsIG1hc2tQYXR0ZXJuKTtcblxuICAgICAgaWYgKF90eXBlTnVtYmVyID49IDcpIHtcbiAgICAgICAgc2V0dXBUeXBlTnVtYmVyKHRlc3QpO1xuICAgICAgfVxuXG4gICAgICBpZiAoX2RhdGFDYWNoZSA9PSBudWxsKSB7XG4gICAgICAgIF9kYXRhQ2FjaGUgPSBjcmVhdGVEYXRhKF90eXBlTnVtYmVyLCBfZXJyb3JDb3JyZWN0aW9uTGV2ZWwsIF9kYXRhTGlzdCk7XG4gICAgICB9XG5cbiAgICAgIG1hcERhdGEoX2RhdGFDYWNoZSwgbWFza1BhdHRlcm4pO1xuICAgIH07XG5cbiAgICB2YXIgc2V0dXBQb3NpdGlvblByb2JlUGF0dGVybiA9IGZ1bmN0aW9uKHJvdywgY29sKSB7XG5cbiAgICAgIGZvciAodmFyIHIgPSAtMTsgciA8PSA3OyByICs9IDEpIHtcblxuICAgICAgICBpZiAocm93ICsgciA8PSAtMSB8fCBfbW9kdWxlQ291bnQgPD0gcm93ICsgcikgY29udGludWU7XG5cbiAgICAgICAgZm9yICh2YXIgYyA9IC0xOyBjIDw9IDc7IGMgKz0gMSkge1xuXG4gICAgICAgICAgaWYgKGNvbCArIGMgPD0gLTEgfHwgX21vZHVsZUNvdW50IDw9IGNvbCArIGMpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgaWYgKCAoMCA8PSByICYmIHIgPD0gNiAmJiAoYyA9PSAwIHx8IGMgPT0gNikgKVxuICAgICAgICAgICAgICB8fCAoMCA8PSBjICYmIGMgPD0gNiAmJiAociA9PSAwIHx8IHIgPT0gNikgKVxuICAgICAgICAgICAgICB8fCAoMiA8PSByICYmIHIgPD0gNCAmJiAyIDw9IGMgJiYgYyA8PSA0KSApIHtcbiAgICAgICAgICAgIF9tb2R1bGVzW3JvdyArIHJdW2NvbCArIGNdID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX21vZHVsZXNbcm93ICsgcl1bY29sICsgY10gPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGdldEJlc3RNYXNrUGF0dGVybiA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICB2YXIgbWluTG9zdFBvaW50ID0gMDtcbiAgICAgIHZhciBwYXR0ZXJuID0gMDtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA4OyBpICs9IDEpIHtcblxuICAgICAgICBtYWtlSW1wbCh0cnVlLCBpKTtcblxuICAgICAgICB2YXIgbG9zdFBvaW50ID0gUVJVdGlsLmdldExvc3RQb2ludChfdGhpcyk7XG5cbiAgICAgICAgaWYgKGkgPT0gMCB8fCBtaW5Mb3N0UG9pbnQgPiBsb3N0UG9pbnQpIHtcbiAgICAgICAgICBtaW5Mb3N0UG9pbnQgPSBsb3N0UG9pbnQ7XG4gICAgICAgICAgcGF0dGVybiA9IGk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBhdHRlcm47XG4gICAgfTtcblxuICAgIHZhciBzZXR1cFRpbWluZ1BhdHRlcm4gPSBmdW5jdGlvbigpIHtcblxuICAgICAgZm9yICh2YXIgciA9IDg7IHIgPCBfbW9kdWxlQ291bnQgLSA4OyByICs9IDEpIHtcbiAgICAgICAgaWYgKF9tb2R1bGVzW3JdWzZdICE9IG51bGwpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBfbW9kdWxlc1tyXVs2XSA9IChyICUgMiA9PSAwKTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgYyA9IDg7IGMgPCBfbW9kdWxlQ291bnQgLSA4OyBjICs9IDEpIHtcbiAgICAgICAgaWYgKF9tb2R1bGVzWzZdW2NdICE9IG51bGwpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBfbW9kdWxlc1s2XVtjXSA9IChjICUgMiA9PSAwKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIHNldHVwUG9zaXRpb25BZGp1c3RQYXR0ZXJuID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgIHZhciBwb3MgPSBRUlV0aWwuZ2V0UGF0dGVyblBvc2l0aW9uKF90eXBlTnVtYmVyKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwb3MubGVuZ3RoOyBpICs9IDEpIHtcblxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHBvcy5sZW5ndGg7IGogKz0gMSkge1xuXG4gICAgICAgICAgdmFyIHJvdyA9IHBvc1tpXTtcbiAgICAgICAgICB2YXIgY29sID0gcG9zW2pdO1xuXG4gICAgICAgICAgaWYgKF9tb2R1bGVzW3Jvd11bY29sXSAhPSBudWxsKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKHZhciByID0gLTI7IHIgPD0gMjsgciArPSAxKSB7XG5cbiAgICAgICAgICAgIGZvciAodmFyIGMgPSAtMjsgYyA8PSAyOyBjICs9IDEpIHtcblxuICAgICAgICAgICAgICBpZiAociA9PSAtMiB8fCByID09IDIgfHwgYyA9PSAtMiB8fCBjID09IDJcbiAgICAgICAgICAgICAgICAgIHx8IChyID09IDAgJiYgYyA9PSAwKSApIHtcbiAgICAgICAgICAgICAgICBfbW9kdWxlc1tyb3cgKyByXVtjb2wgKyBjXSA9IHRydWU7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX21vZHVsZXNbcm93ICsgcl1bY29sICsgY10gPSBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgc2V0dXBUeXBlTnVtYmVyID0gZnVuY3Rpb24odGVzdCkge1xuXG4gICAgICB2YXIgYml0cyA9IFFSVXRpbC5nZXRCQ0hUeXBlTnVtYmVyKF90eXBlTnVtYmVyKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxODsgaSArPSAxKSB7XG4gICAgICAgIHZhciBtb2QgPSAoIXRlc3QgJiYgKCAoYml0cyA+PiBpKSAmIDEpID09IDEpO1xuICAgICAgICBfbW9kdWxlc1tNYXRoLmZsb29yKGkgLyAzKV1baSAlIDMgKyBfbW9kdWxlQ291bnQgLSA4IC0gM10gPSBtb2Q7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTg7IGkgKz0gMSkge1xuICAgICAgICB2YXIgbW9kID0gKCF0ZXN0ICYmICggKGJpdHMgPj4gaSkgJiAxKSA9PSAxKTtcbiAgICAgICAgX21vZHVsZXNbaSAlIDMgKyBfbW9kdWxlQ291bnQgLSA4IC0gM11bTWF0aC5mbG9vcihpIC8gMyldID0gbW9kO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgc2V0dXBUeXBlSW5mbyA9IGZ1bmN0aW9uKHRlc3QsIG1hc2tQYXR0ZXJuKSB7XG5cbiAgICAgIHZhciBkYXRhID0gKF9lcnJvckNvcnJlY3Rpb25MZXZlbCA8PCAzKSB8IG1hc2tQYXR0ZXJuO1xuICAgICAgdmFyIGJpdHMgPSBRUlV0aWwuZ2V0QkNIVHlwZUluZm8oZGF0YSk7XG5cbiAgICAgIC8vIHZlcnRpY2FsXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDE1OyBpICs9IDEpIHtcblxuICAgICAgICB2YXIgbW9kID0gKCF0ZXN0ICYmICggKGJpdHMgPj4gaSkgJiAxKSA9PSAxKTtcblxuICAgICAgICBpZiAoaSA8IDYpIHtcbiAgICAgICAgICBfbW9kdWxlc1tpXVs4XSA9IG1vZDtcbiAgICAgICAgfSBlbHNlIGlmIChpIDwgOCkge1xuICAgICAgICAgIF9tb2R1bGVzW2kgKyAxXVs4XSA9IG1vZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfbW9kdWxlc1tfbW9kdWxlQ291bnQgLSAxNSArIGldWzhdID0gbW9kO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGhvcml6b250YWxcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTU7IGkgKz0gMSkge1xuXG4gICAgICAgIHZhciBtb2QgPSAoIXRlc3QgJiYgKCAoYml0cyA+PiBpKSAmIDEpID09IDEpO1xuXG4gICAgICAgIGlmIChpIDwgOCkge1xuICAgICAgICAgIF9tb2R1bGVzWzhdW19tb2R1bGVDb3VudCAtIGkgLSAxXSA9IG1vZDtcbiAgICAgICAgfSBlbHNlIGlmIChpIDwgOSkge1xuICAgICAgICAgIF9tb2R1bGVzWzhdWzE1IC0gaSAtIDEgKyAxXSA9IG1vZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfbW9kdWxlc1s4XVsxNSAtIGkgLSAxXSA9IG1vZDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBmaXhlZCBtb2R1bGVcbiAgICAgIF9tb2R1bGVzW19tb2R1bGVDb3VudCAtIDhdWzhdID0gKCF0ZXN0KTtcbiAgICB9O1xuXG4gICAgdmFyIG1hcERhdGEgPSBmdW5jdGlvbihkYXRhLCBtYXNrUGF0dGVybikge1xuXG4gICAgICB2YXIgaW5jID0gLTE7XG4gICAgICB2YXIgcm93ID0gX21vZHVsZUNvdW50IC0gMTtcbiAgICAgIHZhciBiaXRJbmRleCA9IDc7XG4gICAgICB2YXIgYnl0ZUluZGV4ID0gMDtcbiAgICAgIHZhciBtYXNrRnVuYyA9IFFSVXRpbC5nZXRNYXNrRnVuY3Rpb24obWFza1BhdHRlcm4pO1xuXG4gICAgICBmb3IgKHZhciBjb2wgPSBfbW9kdWxlQ291bnQgLSAxOyBjb2wgPiAwOyBjb2wgLT0gMikge1xuXG4gICAgICAgIGlmIChjb2wgPT0gNikgY29sIC09IDE7XG5cbiAgICAgICAgd2hpbGUgKHRydWUpIHtcblxuICAgICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgMjsgYyArPSAxKSB7XG5cbiAgICAgICAgICAgIGlmIChfbW9kdWxlc1tyb3ddW2NvbCAtIGNdID09IG51bGwpIHtcblxuICAgICAgICAgICAgICB2YXIgZGFyayA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgIGlmIChieXRlSW5kZXggPCBkYXRhLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGRhcmsgPSAoICggKGRhdGFbYnl0ZUluZGV4XSA+Pj4gYml0SW5kZXgpICYgMSkgPT0gMSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB2YXIgbWFzayA9IG1hc2tGdW5jKHJvdywgY29sIC0gYyk7XG5cbiAgICAgICAgICAgICAgaWYgKG1hc2spIHtcbiAgICAgICAgICAgICAgICBkYXJrID0gIWRhcms7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBfbW9kdWxlc1tyb3ddW2NvbCAtIGNdID0gZGFyaztcbiAgICAgICAgICAgICAgYml0SW5kZXggLT0gMTtcblxuICAgICAgICAgICAgICBpZiAoYml0SW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBieXRlSW5kZXggKz0gMTtcbiAgICAgICAgICAgICAgICBiaXRJbmRleCA9IDc7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByb3cgKz0gaW5jO1xuXG4gICAgICAgICAgaWYgKHJvdyA8IDAgfHwgX21vZHVsZUNvdW50IDw9IHJvdykge1xuICAgICAgICAgICAgcm93IC09IGluYztcbiAgICAgICAgICAgIGluYyA9IC1pbmM7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGNyZWF0ZUJ5dGVzID0gZnVuY3Rpb24oYnVmZmVyLCByc0Jsb2Nrcykge1xuXG4gICAgICB2YXIgb2Zmc2V0ID0gMDtcblxuICAgICAgdmFyIG1heERjQ291bnQgPSAwO1xuICAgICAgdmFyIG1heEVjQ291bnQgPSAwO1xuXG4gICAgICB2YXIgZGNkYXRhID0gbmV3IEFycmF5KHJzQmxvY2tzLmxlbmd0aCk7XG4gICAgICB2YXIgZWNkYXRhID0gbmV3IEFycmF5KHJzQmxvY2tzLmxlbmd0aCk7XG5cbiAgICAgIGZvciAodmFyIHIgPSAwOyByIDwgcnNCbG9ja3MubGVuZ3RoOyByICs9IDEpIHtcblxuICAgICAgICB2YXIgZGNDb3VudCA9IHJzQmxvY2tzW3JdLmRhdGFDb3VudDtcbiAgICAgICAgdmFyIGVjQ291bnQgPSByc0Jsb2Nrc1tyXS50b3RhbENvdW50IC0gZGNDb3VudDtcblxuICAgICAgICBtYXhEY0NvdW50ID0gTWF0aC5tYXgobWF4RGNDb3VudCwgZGNDb3VudCk7XG4gICAgICAgIG1heEVjQ291bnQgPSBNYXRoLm1heChtYXhFY0NvdW50LCBlY0NvdW50KTtcblxuICAgICAgICBkY2RhdGFbcl0gPSBuZXcgQXJyYXkoZGNDb3VudCk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkY2RhdGFbcl0ubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICBkY2RhdGFbcl1baV0gPSAweGZmICYgYnVmZmVyLmdldEJ1ZmZlcigpW2kgKyBvZmZzZXRdO1xuICAgICAgICB9XG4gICAgICAgIG9mZnNldCArPSBkY0NvdW50O1xuXG4gICAgICAgIHZhciByc1BvbHkgPSBRUlV0aWwuZ2V0RXJyb3JDb3JyZWN0UG9seW5vbWlhbChlY0NvdW50KTtcbiAgICAgICAgdmFyIHJhd1BvbHkgPSBxclBvbHlub21pYWwoZGNkYXRhW3JdLCByc1BvbHkuZ2V0TGVuZ3RoKCkgLSAxKTtcblxuICAgICAgICB2YXIgbW9kUG9seSA9IHJhd1BvbHkubW9kKHJzUG9seSk7XG4gICAgICAgIGVjZGF0YVtyXSA9IG5ldyBBcnJheShyc1BvbHkuZ2V0TGVuZ3RoKCkgLSAxKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlY2RhdGFbcl0ubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICB2YXIgbW9kSW5kZXggPSBpICsgbW9kUG9seS5nZXRMZW5ndGgoKSAtIGVjZGF0YVtyXS5sZW5ndGg7XG4gICAgICAgICAgZWNkYXRhW3JdW2ldID0gKG1vZEluZGV4ID49IDApPyBtb2RQb2x5LmdldEF0KG1vZEluZGV4KSA6IDA7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIHRvdGFsQ29kZUNvdW50ID0gMDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcnNCbG9ja3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgdG90YWxDb2RlQ291bnQgKz0gcnNCbG9ja3NbaV0udG90YWxDb3VudDtcbiAgICAgIH1cblxuICAgICAgdmFyIGRhdGEgPSBuZXcgQXJyYXkodG90YWxDb2RlQ291bnQpO1xuICAgICAgdmFyIGluZGV4ID0gMDtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXhEY0NvdW50OyBpICs9IDEpIHtcbiAgICAgICAgZm9yICh2YXIgciA9IDA7IHIgPCByc0Jsb2Nrcy5sZW5ndGg7IHIgKz0gMSkge1xuICAgICAgICAgIGlmIChpIDwgZGNkYXRhW3JdLmxlbmd0aCkge1xuICAgICAgICAgICAgZGF0YVtpbmRleF0gPSBkY2RhdGFbcl1baV07XG4gICAgICAgICAgICBpbmRleCArPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1heEVjQ291bnQ7IGkgKz0gMSkge1xuICAgICAgICBmb3IgKHZhciByID0gMDsgciA8IHJzQmxvY2tzLmxlbmd0aDsgciArPSAxKSB7XG4gICAgICAgICAgaWYgKGkgPCBlY2RhdGFbcl0ubGVuZ3RoKSB7XG4gICAgICAgICAgICBkYXRhW2luZGV4XSA9IGVjZGF0YVtyXVtpXTtcbiAgICAgICAgICAgIGluZGV4ICs9IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH07XG5cbiAgICB2YXIgY3JlYXRlRGF0YSA9IGZ1bmN0aW9uKHR5cGVOdW1iZXIsIGVycm9yQ29ycmVjdGlvbkxldmVsLCBkYXRhTGlzdCkge1xuXG4gICAgICB2YXIgcnNCbG9ja3MgPSBRUlJTQmxvY2suZ2V0UlNCbG9ja3ModHlwZU51bWJlciwgZXJyb3JDb3JyZWN0aW9uTGV2ZWwpO1xuXG4gICAgICB2YXIgYnVmZmVyID0gcXJCaXRCdWZmZXIoKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhTGlzdC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICB2YXIgZGF0YSA9IGRhdGFMaXN0W2ldO1xuICAgICAgICBidWZmZXIucHV0KGRhdGEuZ2V0TW9kZSgpLCA0KTtcbiAgICAgICAgYnVmZmVyLnB1dChkYXRhLmdldExlbmd0aCgpLCBRUlV0aWwuZ2V0TGVuZ3RoSW5CaXRzKGRhdGEuZ2V0TW9kZSgpLCB0eXBlTnVtYmVyKSApO1xuICAgICAgICBkYXRhLndyaXRlKGJ1ZmZlcik7XG4gICAgICB9XG5cbiAgICAgIC8vIGNhbGMgbnVtIG1heCBkYXRhLlxuICAgICAgdmFyIHRvdGFsRGF0YUNvdW50ID0gMDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcnNCbG9ja3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgdG90YWxEYXRhQ291bnQgKz0gcnNCbG9ja3NbaV0uZGF0YUNvdW50O1xuICAgICAgfVxuXG4gICAgICBpZiAoYnVmZmVyLmdldExlbmd0aEluQml0cygpID4gdG90YWxEYXRhQ291bnQgKiA4KSB7XG4gICAgICAgIHRocm93ICdjb2RlIGxlbmd0aCBvdmVyZmxvdy4gKCdcbiAgICAgICAgICArIGJ1ZmZlci5nZXRMZW5ndGhJbkJpdHMoKVxuICAgICAgICAgICsgJz4nXG4gICAgICAgICAgKyB0b3RhbERhdGFDb3VudCAqIDhcbiAgICAgICAgICArICcpJztcbiAgICAgIH1cblxuICAgICAgLy8gZW5kIGNvZGVcbiAgICAgIGlmIChidWZmZXIuZ2V0TGVuZ3RoSW5CaXRzKCkgKyA0IDw9IHRvdGFsRGF0YUNvdW50ICogOCkge1xuICAgICAgICBidWZmZXIucHV0KDAsIDQpO1xuICAgICAgfVxuXG4gICAgICAvLyBwYWRkaW5nXG4gICAgICB3aGlsZSAoYnVmZmVyLmdldExlbmd0aEluQml0cygpICUgOCAhPSAwKSB7XG4gICAgICAgIGJ1ZmZlci5wdXRCaXQoZmFsc2UpO1xuICAgICAgfVxuXG4gICAgICAvLyBwYWRkaW5nXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuXG4gICAgICAgIGlmIChidWZmZXIuZ2V0TGVuZ3RoSW5CaXRzKCkgPj0gdG90YWxEYXRhQ291bnQgKiA4KSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgYnVmZmVyLnB1dChQQUQwLCA4KTtcblxuICAgICAgICBpZiAoYnVmZmVyLmdldExlbmd0aEluQml0cygpID49IHRvdGFsRGF0YUNvdW50ICogOCkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGJ1ZmZlci5wdXQoUEFEMSwgOCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjcmVhdGVCeXRlcyhidWZmZXIsIHJzQmxvY2tzKTtcbiAgICB9O1xuXG4gICAgX3RoaXMuYWRkRGF0YSA9IGZ1bmN0aW9uKGRhdGEsIG1vZGUpIHtcblxuICAgICAgbW9kZSA9IG1vZGUgfHwgJ0J5dGUnO1xuXG4gICAgICB2YXIgbmV3RGF0YSA9IG51bGw7XG5cbiAgICAgIHN3aXRjaChtb2RlKSB7XG4gICAgICBjYXNlICdOdW1lcmljJyA6XG4gICAgICAgIG5ld0RhdGEgPSBxck51bWJlcihkYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdBbHBoYW51bWVyaWMnIDpcbiAgICAgICAgbmV3RGF0YSA9IHFyQWxwaGFOdW0oZGF0YSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnQnl0ZScgOlxuICAgICAgICBuZXdEYXRhID0gcXI4Qml0Qnl0ZShkYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdLYW5qaScgOlxuICAgICAgICBuZXdEYXRhID0gcXJLYW5qaShkYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0IDpcbiAgICAgICAgdGhyb3cgJ21vZGU6JyArIG1vZGU7XG4gICAgICB9XG5cbiAgICAgIF9kYXRhTGlzdC5wdXNoKG5ld0RhdGEpO1xuICAgICAgX2RhdGFDYWNoZSA9IG51bGw7XG4gICAgfTtcblxuICAgIF90aGlzLmlzRGFyayA9IGZ1bmN0aW9uKHJvdywgY29sKSB7XG4gICAgICBpZiAocm93IDwgMCB8fCBfbW9kdWxlQ291bnQgPD0gcm93IHx8IGNvbCA8IDAgfHwgX21vZHVsZUNvdW50IDw9IGNvbCkge1xuICAgICAgICB0aHJvdyByb3cgKyAnLCcgKyBjb2w7XG4gICAgICB9XG4gICAgICByZXR1cm4gX21vZHVsZXNbcm93XVtjb2xdO1xuICAgIH07XG5cbiAgICBfdGhpcy5nZXRNb2R1bGVDb3VudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF9tb2R1bGVDb3VudDtcbiAgICB9O1xuXG4gICAgX3RoaXMubWFrZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKF90eXBlTnVtYmVyIDwgMSkge1xuICAgICAgICB2YXIgdHlwZU51bWJlciA9IDE7XG5cbiAgICAgICAgZm9yICg7IHR5cGVOdW1iZXIgPCA0MDsgdHlwZU51bWJlcisrKSB7XG4gICAgICAgICAgdmFyIHJzQmxvY2tzID0gUVJSU0Jsb2NrLmdldFJTQmxvY2tzKHR5cGVOdW1iZXIsIF9lcnJvckNvcnJlY3Rpb25MZXZlbCk7XG4gICAgICAgICAgdmFyIGJ1ZmZlciA9IHFyQml0QnVmZmVyKCk7XG5cbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IF9kYXRhTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSBfZGF0YUxpc3RbaV07XG4gICAgICAgICAgICBidWZmZXIucHV0KGRhdGEuZ2V0TW9kZSgpLCA0KTtcbiAgICAgICAgICAgIGJ1ZmZlci5wdXQoZGF0YS5nZXRMZW5ndGgoKSwgUVJVdGlsLmdldExlbmd0aEluQml0cyhkYXRhLmdldE1vZGUoKSwgdHlwZU51bWJlcikgKTtcbiAgICAgICAgICAgIGRhdGEud3JpdGUoYnVmZmVyKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgdG90YWxEYXRhQ291bnQgPSAwO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcnNCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRvdGFsRGF0YUNvdW50ICs9IHJzQmxvY2tzW2ldLmRhdGFDb3VudDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoYnVmZmVyLmdldExlbmd0aEluQml0cygpIDw9IHRvdGFsRGF0YUNvdW50ICogOCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgX3R5cGVOdW1iZXIgPSB0eXBlTnVtYmVyO1xuICAgICAgfVxuXG4gICAgICBtYWtlSW1wbChmYWxzZSwgZ2V0QmVzdE1hc2tQYXR0ZXJuKCkgKTtcbiAgICB9O1xuXG4gICAgX3RoaXMuY3JlYXRlVGFibGVUYWcgPSBmdW5jdGlvbihjZWxsU2l6ZSwgbWFyZ2luKSB7XG5cbiAgICAgIGNlbGxTaXplID0gY2VsbFNpemUgfHwgMjtcbiAgICAgIG1hcmdpbiA9ICh0eXBlb2YgbWFyZ2luID09ICd1bmRlZmluZWQnKT8gY2VsbFNpemUgKiA0IDogbWFyZ2luO1xuXG4gICAgICB2YXIgcXJIdG1sID0gJyc7XG5cbiAgICAgIHFySHRtbCArPSAnPHRhYmxlIHN0eWxlPVwiJztcbiAgICAgIHFySHRtbCArPSAnIGJvcmRlci13aWR0aDogMHB4OyBib3JkZXItc3R5bGU6IG5vbmU7JztcbiAgICAgIHFySHRtbCArPSAnIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7JztcbiAgICAgIHFySHRtbCArPSAnIHBhZGRpbmc6IDBweDsgbWFyZ2luOiAnICsgbWFyZ2luICsgJ3B4Oyc7XG4gICAgICBxckh0bWwgKz0gJ1wiPic7XG4gICAgICBxckh0bWwgKz0gJzx0Ym9keT4nO1xuXG4gICAgICBmb3IgKHZhciByID0gMDsgciA8IF90aGlzLmdldE1vZHVsZUNvdW50KCk7IHIgKz0gMSkge1xuXG4gICAgICAgIHFySHRtbCArPSAnPHRyPic7XG5cbiAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCBfdGhpcy5nZXRNb2R1bGVDb3VudCgpOyBjICs9IDEpIHtcbiAgICAgICAgICBxckh0bWwgKz0gJzx0ZCBzdHlsZT1cIic7XG4gICAgICAgICAgcXJIdG1sICs9ICcgYm9yZGVyLXdpZHRoOiAwcHg7IGJvcmRlci1zdHlsZTogbm9uZTsnO1xuICAgICAgICAgIHFySHRtbCArPSAnIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7JztcbiAgICAgICAgICBxckh0bWwgKz0gJyBwYWRkaW5nOiAwcHg7IG1hcmdpbjogMHB4Oyc7XG4gICAgICAgICAgcXJIdG1sICs9ICcgd2lkdGg6ICcgKyBjZWxsU2l6ZSArICdweDsnO1xuICAgICAgICAgIHFySHRtbCArPSAnIGhlaWdodDogJyArIGNlbGxTaXplICsgJ3B4Oyc7XG4gICAgICAgICAgcXJIdG1sICs9ICcgYmFja2dyb3VuZC1jb2xvcjogJztcbiAgICAgICAgICBxckh0bWwgKz0gX3RoaXMuaXNEYXJrKHIsIGMpPyAnIzAwMDAwMCcgOiAnI2ZmZmZmZic7XG4gICAgICAgICAgcXJIdG1sICs9ICc7JztcbiAgICAgICAgICBxckh0bWwgKz0gJ1wiLz4nO1xuICAgICAgICB9XG5cbiAgICAgICAgcXJIdG1sICs9ICc8L3RyPic7XG4gICAgICB9XG5cbiAgICAgIHFySHRtbCArPSAnPC90Ym9keT4nO1xuICAgICAgcXJIdG1sICs9ICc8L3RhYmxlPic7XG5cbiAgICAgIHJldHVybiBxckh0bWw7XG4gICAgfTtcblxuICAgIF90aGlzLmNyZWF0ZVN2Z1RhZyA9IGZ1bmN0aW9uKGNlbGxTaXplLCBtYXJnaW4sIGFsdCwgdGl0bGUpIHtcblxuICAgICAgdmFyIG9wdHMgPSB7fTtcbiAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzWzBdID09ICdvYmplY3QnKSB7XG4gICAgICAgIC8vIENhbGxlZCBieSBvcHRpb25zLlxuICAgICAgICBvcHRzID0gYXJndW1lbnRzWzBdO1xuICAgICAgICAvLyBvdmVyd3JpdGUgY2VsbFNpemUgYW5kIG1hcmdpbi5cbiAgICAgICAgY2VsbFNpemUgPSBvcHRzLmNlbGxTaXplO1xuICAgICAgICBtYXJnaW4gPSBvcHRzLm1hcmdpbjtcbiAgICAgICAgYWx0ID0gb3B0cy5hbHQ7XG4gICAgICAgIHRpdGxlID0gb3B0cy50aXRsZTtcbiAgICAgIH1cblxuICAgICAgY2VsbFNpemUgPSBjZWxsU2l6ZSB8fCAyO1xuICAgICAgbWFyZ2luID0gKHR5cGVvZiBtYXJnaW4gPT0gJ3VuZGVmaW5lZCcpPyBjZWxsU2l6ZSAqIDQgOiBtYXJnaW47XG5cbiAgICAgIC8vIENvbXBvc2UgYWx0IHByb3BlcnR5IHN1cnJvZ2F0ZVxuICAgICAgYWx0ID0gKHR5cGVvZiBhbHQgPT09ICdzdHJpbmcnKSA/IHt0ZXh0OiBhbHR9IDogYWx0IHx8IHt9O1xuICAgICAgYWx0LnRleHQgPSBhbHQudGV4dCB8fCBudWxsO1xuICAgICAgYWx0LmlkID0gKGFsdC50ZXh0KSA/IGFsdC5pZCB8fCAncXJjb2RlLWRlc2NyaXB0aW9uJyA6IG51bGw7XG5cbiAgICAgIC8vIENvbXBvc2UgdGl0bGUgcHJvcGVydHkgc3Vycm9nYXRlXG4gICAgICB0aXRsZSA9ICh0eXBlb2YgdGl0bGUgPT09ICdzdHJpbmcnKSA/IHt0ZXh0OiB0aXRsZX0gOiB0aXRsZSB8fCB7fTtcbiAgICAgIHRpdGxlLnRleHQgPSB0aXRsZS50ZXh0IHx8IG51bGw7XG4gICAgICB0aXRsZS5pZCA9ICh0aXRsZS50ZXh0KSA/IHRpdGxlLmlkIHx8ICdxcmNvZGUtdGl0bGUnIDogbnVsbDtcblxuICAgICAgdmFyIHNpemUgPSBfdGhpcy5nZXRNb2R1bGVDb3VudCgpICogY2VsbFNpemUgKyBtYXJnaW4gKiAyO1xuICAgICAgdmFyIGMsIG1jLCByLCBtciwgcXJTdmc9JycsIHJlY3Q7XG5cbiAgICAgIHJlY3QgPSAnbCcgKyBjZWxsU2l6ZSArICcsMCAwLCcgKyBjZWxsU2l6ZSArXG4gICAgICAgICcgLScgKyBjZWxsU2l6ZSArICcsMCAwLC0nICsgY2VsbFNpemUgKyAneiAnO1xuXG4gICAgICBxclN2ZyArPSAnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiJztcbiAgICAgIHFyU3ZnICs9ICFvcHRzLnNjYWxhYmxlID8gJyB3aWR0aD1cIicgKyBzaXplICsgJ3B4XCIgaGVpZ2h0PVwiJyArIHNpemUgKyAncHhcIicgOiAnJztcbiAgICAgIHFyU3ZnICs9ICcgdmlld0JveD1cIjAgMCAnICsgc2l6ZSArICcgJyArIHNpemUgKyAnXCIgJztcbiAgICAgIHFyU3ZnICs9ICcgcHJlc2VydmVBc3BlY3RSYXRpbz1cInhNaW5ZTWluIG1lZXRcIic7XG4gICAgICBxclN2ZyArPSAodGl0bGUudGV4dCB8fCBhbHQudGV4dCkgPyAnIHJvbGU9XCJpbWdcIiBhcmlhLWxhYmVsbGVkYnk9XCInICtcbiAgICAgICAgICBlc2NhcGVYbWwoW3RpdGxlLmlkLCBhbHQuaWRdLmpvaW4oJyAnKS50cmltKCkgKSArICdcIicgOiAnJztcbiAgICAgIHFyU3ZnICs9ICc+JztcbiAgICAgIHFyU3ZnICs9ICh0aXRsZS50ZXh0KSA/ICc8dGl0bGUgaWQ9XCInICsgZXNjYXBlWG1sKHRpdGxlLmlkKSArICdcIj4nICtcbiAgICAgICAgICBlc2NhcGVYbWwodGl0bGUudGV4dCkgKyAnPC90aXRsZT4nIDogJyc7XG4gICAgICBxclN2ZyArPSAoYWx0LnRleHQpID8gJzxkZXNjcmlwdGlvbiBpZD1cIicgKyBlc2NhcGVYbWwoYWx0LmlkKSArICdcIj4nICtcbiAgICAgICAgICBlc2NhcGVYbWwoYWx0LnRleHQpICsgJzwvZGVzY3JpcHRpb24+JyA6ICcnO1xuICAgICAgcXJTdmcgKz0gJzxyZWN0IHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiBmaWxsPVwid2hpdGVcIiBjeD1cIjBcIiBjeT1cIjBcIi8+JztcbiAgICAgIHFyU3ZnICs9ICc8cGF0aCBkPVwiJztcblxuICAgICAgZm9yIChyID0gMDsgciA8IF90aGlzLmdldE1vZHVsZUNvdW50KCk7IHIgKz0gMSkge1xuICAgICAgICBtciA9IHIgKiBjZWxsU2l6ZSArIG1hcmdpbjtcbiAgICAgICAgZm9yIChjID0gMDsgYyA8IF90aGlzLmdldE1vZHVsZUNvdW50KCk7IGMgKz0gMSkge1xuICAgICAgICAgIGlmIChfdGhpcy5pc0RhcmsociwgYykgKSB7XG4gICAgICAgICAgICBtYyA9IGMqY2VsbFNpemUrbWFyZ2luO1xuICAgICAgICAgICAgcXJTdmcgKz0gJ00nICsgbWMgKyAnLCcgKyBtciArIHJlY3Q7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHFyU3ZnICs9ICdcIiBzdHJva2U9XCJ0cmFuc3BhcmVudFwiIGZpbGw9XCJibGFja1wiLz4nO1xuICAgICAgcXJTdmcgKz0gJzwvc3ZnPic7XG5cbiAgICAgIHJldHVybiBxclN2ZztcbiAgICB9O1xuXG4gICAgX3RoaXMuY3JlYXRlRGF0YVVSTCA9IGZ1bmN0aW9uKGNlbGxTaXplLCBtYXJnaW4pIHtcblxuICAgICAgY2VsbFNpemUgPSBjZWxsU2l6ZSB8fCAyO1xuICAgICAgbWFyZ2luID0gKHR5cGVvZiBtYXJnaW4gPT0gJ3VuZGVmaW5lZCcpPyBjZWxsU2l6ZSAqIDQgOiBtYXJnaW47XG5cbiAgICAgIHZhciBzaXplID0gX3RoaXMuZ2V0TW9kdWxlQ291bnQoKSAqIGNlbGxTaXplICsgbWFyZ2luICogMjtcbiAgICAgIHZhciBtaW4gPSBtYXJnaW47XG4gICAgICB2YXIgbWF4ID0gc2l6ZSAtIG1hcmdpbjtcblxuICAgICAgcmV0dXJuIGNyZWF0ZURhdGFVUkwoc2l6ZSwgc2l6ZSwgZnVuY3Rpb24oeCwgeSkge1xuICAgICAgICBpZiAobWluIDw9IHggJiYgeCA8IG1heCAmJiBtaW4gPD0geSAmJiB5IDwgbWF4KSB7XG4gICAgICAgICAgdmFyIGMgPSBNYXRoLmZsb29yKCAoeCAtIG1pbikgLyBjZWxsU2l6ZSk7XG4gICAgICAgICAgdmFyIHIgPSBNYXRoLmZsb29yKCAoeSAtIG1pbikgLyBjZWxsU2l6ZSk7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLmlzRGFyayhyLCBjKT8gMCA6IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgIH0gKTtcbiAgICB9O1xuXG4gICAgX3RoaXMuY3JlYXRlSW1nVGFnID0gZnVuY3Rpb24oY2VsbFNpemUsIG1hcmdpbiwgYWx0KSB7XG5cbiAgICAgIGNlbGxTaXplID0gY2VsbFNpemUgfHwgMjtcbiAgICAgIG1hcmdpbiA9ICh0eXBlb2YgbWFyZ2luID09ICd1bmRlZmluZWQnKT8gY2VsbFNpemUgKiA0IDogbWFyZ2luO1xuXG4gICAgICB2YXIgc2l6ZSA9IF90aGlzLmdldE1vZHVsZUNvdW50KCkgKiBjZWxsU2l6ZSArIG1hcmdpbiAqIDI7XG5cbiAgICAgIHZhciBpbWcgPSAnJztcbiAgICAgIGltZyArPSAnPGltZyc7XG4gICAgICBpbWcgKz0gJ1xcdTAwMjBzcmM9XCInO1xuICAgICAgaW1nICs9IF90aGlzLmNyZWF0ZURhdGFVUkwoY2VsbFNpemUsIG1hcmdpbik7XG4gICAgICBpbWcgKz0gJ1wiJztcbiAgICAgIGltZyArPSAnXFx1MDAyMHdpZHRoPVwiJztcbiAgICAgIGltZyArPSBzaXplO1xuICAgICAgaW1nICs9ICdcIic7XG4gICAgICBpbWcgKz0gJ1xcdTAwMjBoZWlnaHQ9XCInO1xuICAgICAgaW1nICs9IHNpemU7XG4gICAgICBpbWcgKz0gJ1wiJztcbiAgICAgIGlmIChhbHQpIHtcbiAgICAgICAgaW1nICs9ICdcXHUwMDIwYWx0PVwiJztcbiAgICAgICAgaW1nICs9IGVzY2FwZVhtbChhbHQpO1xuICAgICAgICBpbWcgKz0gJ1wiJztcbiAgICAgIH1cbiAgICAgIGltZyArPSAnLz4nO1xuXG4gICAgICByZXR1cm4gaW1nO1xuICAgIH07XG5cbiAgICB2YXIgZXNjYXBlWG1sID0gZnVuY3Rpb24ocykge1xuICAgICAgdmFyIGVzY2FwZWQgPSAnJztcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICB2YXIgYyA9IHMuY2hhckF0KGkpO1xuICAgICAgICBzd2l0Y2goYykge1xuICAgICAgICBjYXNlICc8JzogZXNjYXBlZCArPSAnJmx0Oyc7IGJyZWFrO1xuICAgICAgICBjYXNlICc+JzogZXNjYXBlZCArPSAnJmd0Oyc7IGJyZWFrO1xuICAgICAgICBjYXNlICcmJzogZXNjYXBlZCArPSAnJmFtcDsnOyBicmVhaztcbiAgICAgICAgY2FzZSAnXCInOiBlc2NhcGVkICs9ICcmcXVvdDsnOyBicmVhaztcbiAgICAgICAgZGVmYXVsdCA6IGVzY2FwZWQgKz0gYzsgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBlc2NhcGVkO1xuICAgIH07XG5cbiAgICB2YXIgX2NyZWF0ZUhhbGZBU0NJSSA9IGZ1bmN0aW9uKG1hcmdpbikge1xuICAgICAgdmFyIGNlbGxTaXplID0gMTtcbiAgICAgIG1hcmdpbiA9ICh0eXBlb2YgbWFyZ2luID09ICd1bmRlZmluZWQnKT8gY2VsbFNpemUgKiAyIDogbWFyZ2luO1xuXG4gICAgICB2YXIgc2l6ZSA9IF90aGlzLmdldE1vZHVsZUNvdW50KCkgKiBjZWxsU2l6ZSArIG1hcmdpbiAqIDI7XG4gICAgICB2YXIgbWluID0gbWFyZ2luO1xuICAgICAgdmFyIG1heCA9IHNpemUgLSBtYXJnaW47XG5cbiAgICAgIHZhciB5LCB4LCByMSwgcjIsIHA7XG5cbiAgICAgIHZhciBibG9ja3MgPSB7XG4gICAgICAgICfilojilognOiAn4paIJyxcbiAgICAgICAgJ+KWiCAnOiAn4paAJyxcbiAgICAgICAgJyDilognOiAn4paEJyxcbiAgICAgICAgJyAgJzogJyAnXG4gICAgICB9O1xuXG4gICAgICB2YXIgYmxvY2tzTGFzdExpbmVOb01hcmdpbiA9IHtcbiAgICAgICAgJ+KWiOKWiCc6ICfiloAnLFxuICAgICAgICAn4paIICc6ICfiloAnLFxuICAgICAgICAnIOKWiCc6ICcgJyxcbiAgICAgICAgJyAgJzogJyAnXG4gICAgICB9O1xuXG4gICAgICB2YXIgYXNjaWkgPSAnJztcbiAgICAgIGZvciAoeSA9IDA7IHkgPCBzaXplOyB5ICs9IDIpIHtcbiAgICAgICAgcjEgPSBNYXRoLmZsb29yKCh5IC0gbWluKSAvIGNlbGxTaXplKTtcbiAgICAgICAgcjIgPSBNYXRoLmZsb29yKCh5ICsgMSAtIG1pbikgLyBjZWxsU2l6ZSk7XG4gICAgICAgIGZvciAoeCA9IDA7IHggPCBzaXplOyB4ICs9IDEpIHtcbiAgICAgICAgICBwID0gJ+KWiCc7XG5cbiAgICAgICAgICBpZiAobWluIDw9IHggJiYgeCA8IG1heCAmJiBtaW4gPD0geSAmJiB5IDwgbWF4ICYmIF90aGlzLmlzRGFyayhyMSwgTWF0aC5mbG9vcigoeCAtIG1pbikgLyBjZWxsU2l6ZSkpKSB7XG4gICAgICAgICAgICBwID0gJyAnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChtaW4gPD0geCAmJiB4IDwgbWF4ICYmIG1pbiA8PSB5KzEgJiYgeSsxIDwgbWF4ICYmIF90aGlzLmlzRGFyayhyMiwgTWF0aC5mbG9vcigoeCAtIG1pbikgLyBjZWxsU2l6ZSkpKSB7XG4gICAgICAgICAgICBwICs9ICcgJztcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBwICs9ICfilognO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIE91dHB1dCAyIGNoYXJhY3RlcnMgcGVyIHBpeGVsLCB0byBjcmVhdGUgZnVsbCBzcXVhcmUuIDEgY2hhcmFjdGVyIHBlciBwaXhlbHMgZ2l2ZXMgb25seSBoYWxmIHdpZHRoIG9mIHNxdWFyZS5cbiAgICAgICAgICBhc2NpaSArPSAobWFyZ2luIDwgMSAmJiB5KzEgPj0gbWF4KSA/IGJsb2Nrc0xhc3RMaW5lTm9NYXJnaW5bcF0gOiBibG9ja3NbcF07XG4gICAgICAgIH1cblxuICAgICAgICBhc2NpaSArPSAnXFxuJztcbiAgICAgIH1cblxuICAgICAgaWYgKHNpemUgJSAyICYmIG1hcmdpbiA+IDApIHtcbiAgICAgICAgcmV0dXJuIGFzY2lpLnN1YnN0cmluZygwLCBhc2NpaS5sZW5ndGggLSBzaXplIC0gMSkgKyBBcnJheShzaXplKzEpLmpvaW4oJ+KWgCcpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYXNjaWkuc3Vic3RyaW5nKDAsIGFzY2lpLmxlbmd0aC0xKTtcbiAgICB9O1xuXG4gICAgX3RoaXMuY3JlYXRlQVNDSUkgPSBmdW5jdGlvbihjZWxsU2l6ZSwgbWFyZ2luKSB7XG4gICAgICBjZWxsU2l6ZSA9IGNlbGxTaXplIHx8IDE7XG5cbiAgICAgIGlmIChjZWxsU2l6ZSA8IDIpIHtcbiAgICAgICAgcmV0dXJuIF9jcmVhdGVIYWxmQVNDSUkobWFyZ2luKTtcbiAgICAgIH1cblxuICAgICAgY2VsbFNpemUgLT0gMTtcbiAgICAgIG1hcmdpbiA9ICh0eXBlb2YgbWFyZ2luID09ICd1bmRlZmluZWQnKT8gY2VsbFNpemUgKiAyIDogbWFyZ2luO1xuXG4gICAgICB2YXIgc2l6ZSA9IF90aGlzLmdldE1vZHVsZUNvdW50KCkgKiBjZWxsU2l6ZSArIG1hcmdpbiAqIDI7XG4gICAgICB2YXIgbWluID0gbWFyZ2luO1xuICAgICAgdmFyIG1heCA9IHNpemUgLSBtYXJnaW47XG5cbiAgICAgIHZhciB5LCB4LCByLCBwO1xuXG4gICAgICB2YXIgd2hpdGUgPSBBcnJheShjZWxsU2l6ZSsxKS5qb2luKCfilojilognKTtcbiAgICAgIHZhciBibGFjayA9IEFycmF5KGNlbGxTaXplKzEpLmpvaW4oJyAgJyk7XG5cbiAgICAgIHZhciBhc2NpaSA9ICcnO1xuICAgICAgdmFyIGxpbmUgPSAnJztcbiAgICAgIGZvciAoeSA9IDA7IHkgPCBzaXplOyB5ICs9IDEpIHtcbiAgICAgICAgciA9IE1hdGguZmxvb3IoICh5IC0gbWluKSAvIGNlbGxTaXplKTtcbiAgICAgICAgbGluZSA9ICcnO1xuICAgICAgICBmb3IgKHggPSAwOyB4IDwgc2l6ZTsgeCArPSAxKSB7XG4gICAgICAgICAgcCA9IDE7XG5cbiAgICAgICAgICBpZiAobWluIDw9IHggJiYgeCA8IG1heCAmJiBtaW4gPD0geSAmJiB5IDwgbWF4ICYmIF90aGlzLmlzRGFyayhyLCBNYXRoLmZsb29yKCh4IC0gbWluKSAvIGNlbGxTaXplKSkpIHtcbiAgICAgICAgICAgIHAgPSAwO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIE91dHB1dCAyIGNoYXJhY3RlcnMgcGVyIHBpeGVsLCB0byBjcmVhdGUgZnVsbCBzcXVhcmUuIDEgY2hhcmFjdGVyIHBlciBwaXhlbHMgZ2l2ZXMgb25seSBoYWxmIHdpZHRoIG9mIHNxdWFyZS5cbiAgICAgICAgICBsaW5lICs9IHAgPyB3aGl0ZSA6IGJsYWNrO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChyID0gMDsgciA8IGNlbGxTaXplOyByICs9IDEpIHtcbiAgICAgICAgICBhc2NpaSArPSBsaW5lICsgJ1xcbic7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGFzY2lpLnN1YnN0cmluZygwLCBhc2NpaS5sZW5ndGgtMSk7XG4gICAgfTtcblxuICAgIF90aGlzLnJlbmRlclRvMmRDb250ZXh0ID0gZnVuY3Rpb24oY29udGV4dCwgY2VsbFNpemUpIHtcbiAgICAgIGNlbGxTaXplID0gY2VsbFNpemUgfHwgMjtcbiAgICAgIHZhciBsZW5ndGggPSBfdGhpcy5nZXRNb2R1bGVDb3VudCgpO1xuICAgICAgZm9yICh2YXIgcm93ID0gMDsgcm93IDwgbGVuZ3RoOyByb3crKykge1xuICAgICAgICBmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBsZW5ndGg7IGNvbCsrKSB7XG4gICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBfdGhpcy5pc0Rhcmsocm93LCBjb2wpID8gJ2JsYWNrJyA6ICd3aGl0ZSc7XG4gICAgICAgICAgY29udGV4dC5maWxsUmVjdChyb3cgKiBjZWxsU2l6ZSwgY29sICogY2VsbFNpemUsIGNlbGxTaXplLCBjZWxsU2l6ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gX3RoaXM7XG4gIH07XG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gcXJjb2RlLnN0cmluZ1RvQnl0ZXNcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBxcmNvZGUuc3RyaW5nVG9CeXRlc0Z1bmNzID0ge1xuICAgICdkZWZhdWx0JyA6IGZ1bmN0aW9uKHMpIHtcbiAgICAgIHZhciBieXRlcyA9IFtdO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIHZhciBjID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgICAgICBieXRlcy5wdXNoKGMgJiAweGZmKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBieXRlcztcbiAgICB9XG4gIH07XG5cbiAgcXJjb2RlLnN0cmluZ1RvQnl0ZXMgPSBxcmNvZGUuc3RyaW5nVG9CeXRlc0Z1bmNzWydkZWZhdWx0J107XG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gcXJjb2RlLmNyZWF0ZVN0cmluZ1RvQnl0ZXNcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogQHBhcmFtIHVuaWNvZGVEYXRhIGJhc2U2NCBzdHJpbmcgb2YgYnl0ZSBhcnJheS5cbiAgICogWzE2Yml0IFVuaWNvZGVdLFsxNmJpdCBCeXRlc10sIC4uLlxuICAgKiBAcGFyYW0gbnVtQ2hhcnNcbiAgICovXG4gIHFyY29kZS5jcmVhdGVTdHJpbmdUb0J5dGVzID0gZnVuY3Rpb24odW5pY29kZURhdGEsIG51bUNoYXJzKSB7XG5cbiAgICAvLyBjcmVhdGUgY29udmVyc2lvbiBtYXAuXG5cbiAgICB2YXIgdW5pY29kZU1hcCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICB2YXIgYmluID0gYmFzZTY0RGVjb2RlSW5wdXRTdHJlYW0odW5pY29kZURhdGEpO1xuICAgICAgdmFyIHJlYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGIgPSBiaW4ucmVhZCgpO1xuICAgICAgICBpZiAoYiA9PSAtMSkgdGhyb3cgJ2VvZic7XG4gICAgICAgIHJldHVybiBiO1xuICAgICAgfTtcblxuICAgICAgdmFyIGNvdW50ID0gMDtcbiAgICAgIHZhciB1bmljb2RlTWFwID0ge307XG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgYjAgPSBiaW4ucmVhZCgpO1xuICAgICAgICBpZiAoYjAgPT0gLTEpIGJyZWFrO1xuICAgICAgICB2YXIgYjEgPSByZWFkKCk7XG4gICAgICAgIHZhciBiMiA9IHJlYWQoKTtcbiAgICAgICAgdmFyIGIzID0gcmVhZCgpO1xuICAgICAgICB2YXIgayA9IFN0cmluZy5mcm9tQ2hhckNvZGUoIChiMCA8PCA4KSB8IGIxKTtcbiAgICAgICAgdmFyIHYgPSAoYjIgPDwgOCkgfCBiMztcbiAgICAgICAgdW5pY29kZU1hcFtrXSA9IHY7XG4gICAgICAgIGNvdW50ICs9IDE7XG4gICAgICB9XG4gICAgICBpZiAoY291bnQgIT0gbnVtQ2hhcnMpIHtcbiAgICAgICAgdGhyb3cgY291bnQgKyAnICE9ICcgKyBudW1DaGFycztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHVuaWNvZGVNYXA7XG4gICAgfSgpO1xuXG4gICAgdmFyIHVua25vd25DaGFyID0gJz8nLmNoYXJDb2RlQXQoMCk7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24ocykge1xuICAgICAgdmFyIGJ5dGVzID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgdmFyIGMgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGlmIChjIDwgMTI4KSB7XG4gICAgICAgICAgYnl0ZXMucHVzaChjKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgYiA9IHVuaWNvZGVNYXBbcy5jaGFyQXQoaSldO1xuICAgICAgICAgIGlmICh0eXBlb2YgYiA9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgaWYgKCAoYiAmIDB4ZmYpID09IGIpIHtcbiAgICAgICAgICAgICAgLy8gMWJ5dGVcbiAgICAgICAgICAgICAgYnl0ZXMucHVzaChiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIDJieXRlc1xuICAgICAgICAgICAgICBieXRlcy5wdXNoKGIgPj4+IDgpO1xuICAgICAgICAgICAgICBieXRlcy5wdXNoKGIgJiAweGZmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYnl0ZXMucHVzaCh1bmtub3duQ2hhcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gYnl0ZXM7XG4gICAgfTtcbiAgfTtcblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBRUk1vZGVcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICB2YXIgUVJNb2RlID0ge1xuICAgIE1PREVfTlVNQkVSIDogICAgMSA8PCAwLFxuICAgIE1PREVfQUxQSEFfTlVNIDogMSA8PCAxLFxuICAgIE1PREVfOEJJVF9CWVRFIDogMSA8PCAyLFxuICAgIE1PREVfS0FOSkkgOiAgICAgMSA8PCAzXG4gIH07XG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUVJFcnJvckNvcnJlY3Rpb25MZXZlbFxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHZhciBRUkVycm9yQ29ycmVjdGlvbkxldmVsID0ge1xuICAgIEwgOiAxLFxuICAgIE0gOiAwLFxuICAgIFEgOiAzLFxuICAgIEggOiAyXG4gIH07XG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUVJNYXNrUGF0dGVyblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHZhciBRUk1hc2tQYXR0ZXJuID0ge1xuICAgIFBBVFRFUk4wMDAgOiAwLFxuICAgIFBBVFRFUk4wMDEgOiAxLFxuICAgIFBBVFRFUk4wMTAgOiAyLFxuICAgIFBBVFRFUk4wMTEgOiAzLFxuICAgIFBBVFRFUk4xMDAgOiA0LFxuICAgIFBBVFRFUk4xMDEgOiA1LFxuICAgIFBBVFRFUk4xMTAgOiA2LFxuICAgIFBBVFRFUk4xMTEgOiA3XG4gIH07XG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUVJVdGlsXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgdmFyIFFSVXRpbCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIFBBVFRFUk5fUE9TSVRJT05fVEFCTEUgPSBbXG4gICAgICBbXSxcbiAgICAgIFs2LCAxOF0sXG4gICAgICBbNiwgMjJdLFxuICAgICAgWzYsIDI2XSxcbiAgICAgIFs2LCAzMF0sXG4gICAgICBbNiwgMzRdLFxuICAgICAgWzYsIDIyLCAzOF0sXG4gICAgICBbNiwgMjQsIDQyXSxcbiAgICAgIFs2LCAyNiwgNDZdLFxuICAgICAgWzYsIDI4LCA1MF0sXG4gICAgICBbNiwgMzAsIDU0XSxcbiAgICAgIFs2LCAzMiwgNThdLFxuICAgICAgWzYsIDM0LCA2Ml0sXG4gICAgICBbNiwgMjYsIDQ2LCA2Nl0sXG4gICAgICBbNiwgMjYsIDQ4LCA3MF0sXG4gICAgICBbNiwgMjYsIDUwLCA3NF0sXG4gICAgICBbNiwgMzAsIDU0LCA3OF0sXG4gICAgICBbNiwgMzAsIDU2LCA4Ml0sXG4gICAgICBbNiwgMzAsIDU4LCA4Nl0sXG4gICAgICBbNiwgMzQsIDYyLCA5MF0sXG4gICAgICBbNiwgMjgsIDUwLCA3MiwgOTRdLFxuICAgICAgWzYsIDI2LCA1MCwgNzQsIDk4XSxcbiAgICAgIFs2LCAzMCwgNTQsIDc4LCAxMDJdLFxuICAgICAgWzYsIDI4LCA1NCwgODAsIDEwNl0sXG4gICAgICBbNiwgMzIsIDU4LCA4NCwgMTEwXSxcbiAgICAgIFs2LCAzMCwgNTgsIDg2LCAxMTRdLFxuICAgICAgWzYsIDM0LCA2MiwgOTAsIDExOF0sXG4gICAgICBbNiwgMjYsIDUwLCA3NCwgOTgsIDEyMl0sXG4gICAgICBbNiwgMzAsIDU0LCA3OCwgMTAyLCAxMjZdLFxuICAgICAgWzYsIDI2LCA1MiwgNzgsIDEwNCwgMTMwXSxcbiAgICAgIFs2LCAzMCwgNTYsIDgyLCAxMDgsIDEzNF0sXG4gICAgICBbNiwgMzQsIDYwLCA4NiwgMTEyLCAxMzhdLFxuICAgICAgWzYsIDMwLCA1OCwgODYsIDExNCwgMTQyXSxcbiAgICAgIFs2LCAzNCwgNjIsIDkwLCAxMTgsIDE0Nl0sXG4gICAgICBbNiwgMzAsIDU0LCA3OCwgMTAyLCAxMjYsIDE1MF0sXG4gICAgICBbNiwgMjQsIDUwLCA3NiwgMTAyLCAxMjgsIDE1NF0sXG4gICAgICBbNiwgMjgsIDU0LCA4MCwgMTA2LCAxMzIsIDE1OF0sXG4gICAgICBbNiwgMzIsIDU4LCA4NCwgMTEwLCAxMzYsIDE2Ml0sXG4gICAgICBbNiwgMjYsIDU0LCA4MiwgMTEwLCAxMzgsIDE2Nl0sXG4gICAgICBbNiwgMzAsIDU4LCA4NiwgMTE0LCAxNDIsIDE3MF1cbiAgICBdO1xuICAgIHZhciBHMTUgPSAoMSA8PCAxMCkgfCAoMSA8PCA4KSB8ICgxIDw8IDUpIHwgKDEgPDwgNCkgfCAoMSA8PCAyKSB8ICgxIDw8IDEpIHwgKDEgPDwgMCk7XG4gICAgdmFyIEcxOCA9ICgxIDw8IDEyKSB8ICgxIDw8IDExKSB8ICgxIDw8IDEwKSB8ICgxIDw8IDkpIHwgKDEgPDwgOCkgfCAoMSA8PCA1KSB8ICgxIDw8IDIpIHwgKDEgPDwgMCk7XG4gICAgdmFyIEcxNV9NQVNLID0gKDEgPDwgMTQpIHwgKDEgPDwgMTIpIHwgKDEgPDwgMTApIHwgKDEgPDwgNCkgfCAoMSA8PCAxKTtcblxuICAgIHZhciBfdGhpcyA9IHt9O1xuXG4gICAgdmFyIGdldEJDSERpZ2l0ID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgdmFyIGRpZ2l0ID0gMDtcbiAgICAgIHdoaWxlIChkYXRhICE9IDApIHtcbiAgICAgICAgZGlnaXQgKz0gMTtcbiAgICAgICAgZGF0YSA+Pj49IDE7XG4gICAgICB9XG4gICAgICByZXR1cm4gZGlnaXQ7XG4gICAgfTtcblxuICAgIF90aGlzLmdldEJDSFR5cGVJbmZvID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgdmFyIGQgPSBkYXRhIDw8IDEwO1xuICAgICAgd2hpbGUgKGdldEJDSERpZ2l0KGQpIC0gZ2V0QkNIRGlnaXQoRzE1KSA+PSAwKSB7XG4gICAgICAgIGQgXj0gKEcxNSA8PCAoZ2V0QkNIRGlnaXQoZCkgLSBnZXRCQ0hEaWdpdChHMTUpICkgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAoIChkYXRhIDw8IDEwKSB8IGQpIF4gRzE1X01BU0s7XG4gICAgfTtcblxuICAgIF90aGlzLmdldEJDSFR5cGVOdW1iZXIgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICB2YXIgZCA9IGRhdGEgPDwgMTI7XG4gICAgICB3aGlsZSAoZ2V0QkNIRGlnaXQoZCkgLSBnZXRCQ0hEaWdpdChHMTgpID49IDApIHtcbiAgICAgICAgZCBePSAoRzE4IDw8IChnZXRCQ0hEaWdpdChkKSAtIGdldEJDSERpZ2l0KEcxOCkgKSApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIChkYXRhIDw8IDEyKSB8IGQ7XG4gICAgfTtcblxuICAgIF90aGlzLmdldFBhdHRlcm5Qb3NpdGlvbiA9IGZ1bmN0aW9uKHR5cGVOdW1iZXIpIHtcbiAgICAgIHJldHVybiBQQVRURVJOX1BPU0lUSU9OX1RBQkxFW3R5cGVOdW1iZXIgLSAxXTtcbiAgICB9O1xuXG4gICAgX3RoaXMuZ2V0TWFza0Z1bmN0aW9uID0gZnVuY3Rpb24obWFza1BhdHRlcm4pIHtcblxuICAgICAgc3dpdGNoIChtYXNrUGF0dGVybikge1xuXG4gICAgICBjYXNlIFFSTWFza1BhdHRlcm4uUEFUVEVSTjAwMCA6XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihpLCBqKSB7IHJldHVybiAoaSArIGopICUgMiA9PSAwOyB9O1xuICAgICAgY2FzZSBRUk1hc2tQYXR0ZXJuLlBBVFRFUk4wMDEgOlxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oaSwgaikgeyByZXR1cm4gaSAlIDIgPT0gMDsgfTtcbiAgICAgIGNhc2UgUVJNYXNrUGF0dGVybi5QQVRURVJOMDEwIDpcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGksIGopIHsgcmV0dXJuIGogJSAzID09IDA7IH07XG4gICAgICBjYXNlIFFSTWFza1BhdHRlcm4uUEFUVEVSTjAxMSA6XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihpLCBqKSB7IHJldHVybiAoaSArIGopICUgMyA9PSAwOyB9O1xuICAgICAgY2FzZSBRUk1hc2tQYXR0ZXJuLlBBVFRFUk4xMDAgOlxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oaSwgaikgeyByZXR1cm4gKE1hdGguZmxvb3IoaSAvIDIpICsgTWF0aC5mbG9vcihqIC8gMykgKSAlIDIgPT0gMDsgfTtcbiAgICAgIGNhc2UgUVJNYXNrUGF0dGVybi5QQVRURVJOMTAxIDpcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGksIGopIHsgcmV0dXJuIChpICogaikgJSAyICsgKGkgKiBqKSAlIDMgPT0gMDsgfTtcbiAgICAgIGNhc2UgUVJNYXNrUGF0dGVybi5QQVRURVJOMTEwIDpcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGksIGopIHsgcmV0dXJuICggKGkgKiBqKSAlIDIgKyAoaSAqIGopICUgMykgJSAyID09IDA7IH07XG4gICAgICBjYXNlIFFSTWFza1BhdHRlcm4uUEFUVEVSTjExMSA6XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihpLCBqKSB7IHJldHVybiAoIChpICogaikgJSAzICsgKGkgKyBqKSAlIDIpICUgMiA9PSAwOyB9O1xuXG4gICAgICBkZWZhdWx0IDpcbiAgICAgICAgdGhyb3cgJ2JhZCBtYXNrUGF0dGVybjonICsgbWFza1BhdHRlcm47XG4gICAgICB9XG4gICAgfTtcblxuICAgIF90aGlzLmdldEVycm9yQ29ycmVjdFBvbHlub21pYWwgPSBmdW5jdGlvbihlcnJvckNvcnJlY3RMZW5ndGgpIHtcbiAgICAgIHZhciBhID0gcXJQb2x5bm9taWFsKFsxXSwgMCk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVycm9yQ29ycmVjdExlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGEgPSBhLm11bHRpcGx5KHFyUG9seW5vbWlhbChbMSwgUVJNYXRoLmdleHAoaSldLCAwKSApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGE7XG4gICAgfTtcblxuICAgIF90aGlzLmdldExlbmd0aEluQml0cyA9IGZ1bmN0aW9uKG1vZGUsIHR5cGUpIHtcblxuICAgICAgaWYgKDEgPD0gdHlwZSAmJiB0eXBlIDwgMTApIHtcblxuICAgICAgICAvLyAxIC0gOVxuXG4gICAgICAgIHN3aXRjaChtb2RlKSB7XG4gICAgICAgIGNhc2UgUVJNb2RlLk1PREVfTlVNQkVSICAgIDogcmV0dXJuIDEwO1xuICAgICAgICBjYXNlIFFSTW9kZS5NT0RFX0FMUEhBX05VTSA6IHJldHVybiA5O1xuICAgICAgICBjYXNlIFFSTW9kZS5NT0RFXzhCSVRfQllURSA6IHJldHVybiA4O1xuICAgICAgICBjYXNlIFFSTW9kZS5NT0RFX0tBTkpJICAgICA6IHJldHVybiA4O1xuICAgICAgICBkZWZhdWx0IDpcbiAgICAgICAgICB0aHJvdyAnbW9kZTonICsgbW9kZTtcbiAgICAgICAgfVxuXG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPCAyNykge1xuXG4gICAgICAgIC8vIDEwIC0gMjZcblxuICAgICAgICBzd2l0Y2gobW9kZSkge1xuICAgICAgICBjYXNlIFFSTW9kZS5NT0RFX05VTUJFUiAgICA6IHJldHVybiAxMjtcbiAgICAgICAgY2FzZSBRUk1vZGUuTU9ERV9BTFBIQV9OVU0gOiByZXR1cm4gMTE7XG4gICAgICAgIGNhc2UgUVJNb2RlLk1PREVfOEJJVF9CWVRFIDogcmV0dXJuIDE2O1xuICAgICAgICBjYXNlIFFSTW9kZS5NT0RFX0tBTkpJICAgICA6IHJldHVybiAxMDtcbiAgICAgICAgZGVmYXVsdCA6XG4gICAgICAgICAgdGhyb3cgJ21vZGU6JyArIG1vZGU7XG4gICAgICAgIH1cblxuICAgICAgfSBlbHNlIGlmICh0eXBlIDwgNDEpIHtcblxuICAgICAgICAvLyAyNyAtIDQwXG5cbiAgICAgICAgc3dpdGNoKG1vZGUpIHtcbiAgICAgICAgY2FzZSBRUk1vZGUuTU9ERV9OVU1CRVIgICAgOiByZXR1cm4gMTQ7XG4gICAgICAgIGNhc2UgUVJNb2RlLk1PREVfQUxQSEFfTlVNIDogcmV0dXJuIDEzO1xuICAgICAgICBjYXNlIFFSTW9kZS5NT0RFXzhCSVRfQllURSA6IHJldHVybiAxNjtcbiAgICAgICAgY2FzZSBRUk1vZGUuTU9ERV9LQU5KSSAgICAgOiByZXR1cm4gMTI7XG4gICAgICAgIGRlZmF1bHQgOlxuICAgICAgICAgIHRocm93ICdtb2RlOicgKyBtb2RlO1xuICAgICAgICB9XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93ICd0eXBlOicgKyB0eXBlO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfdGhpcy5nZXRMb3N0UG9pbnQgPSBmdW5jdGlvbihxcmNvZGUpIHtcblxuICAgICAgdmFyIG1vZHVsZUNvdW50ID0gcXJjb2RlLmdldE1vZHVsZUNvdW50KCk7XG5cbiAgICAgIHZhciBsb3N0UG9pbnQgPSAwO1xuXG4gICAgICAvLyBMRVZFTDFcblxuICAgICAgZm9yICh2YXIgcm93ID0gMDsgcm93IDwgbW9kdWxlQ291bnQ7IHJvdyArPSAxKSB7XG4gICAgICAgIGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IG1vZHVsZUNvdW50OyBjb2wgKz0gMSkge1xuXG4gICAgICAgICAgdmFyIHNhbWVDb3VudCA9IDA7XG4gICAgICAgICAgdmFyIGRhcmsgPSBxcmNvZGUuaXNEYXJrKHJvdywgY29sKTtcblxuICAgICAgICAgIGZvciAodmFyIHIgPSAtMTsgciA8PSAxOyByICs9IDEpIHtcblxuICAgICAgICAgICAgaWYgKHJvdyArIHIgPCAwIHx8IG1vZHVsZUNvdW50IDw9IHJvdyArIHIpIHtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAodmFyIGMgPSAtMTsgYyA8PSAxOyBjICs9IDEpIHtcblxuICAgICAgICAgICAgICBpZiAoY29sICsgYyA8IDAgfHwgbW9kdWxlQ291bnQgPD0gY29sICsgYykge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKHIgPT0gMCAmJiBjID09IDApIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmIChkYXJrID09IHFyY29kZS5pc0Rhcmsocm93ICsgciwgY29sICsgYykgKSB7XG4gICAgICAgICAgICAgICAgc2FtZUNvdW50ICs9IDE7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc2FtZUNvdW50ID4gNSkge1xuICAgICAgICAgICAgbG9zdFBvaW50ICs9ICgzICsgc2FtZUNvdW50IC0gNSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAvLyBMRVZFTDJcblxuICAgICAgZm9yICh2YXIgcm93ID0gMDsgcm93IDwgbW9kdWxlQ291bnQgLSAxOyByb3cgKz0gMSkge1xuICAgICAgICBmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBtb2R1bGVDb3VudCAtIDE7IGNvbCArPSAxKSB7XG4gICAgICAgICAgdmFyIGNvdW50ID0gMDtcbiAgICAgICAgICBpZiAocXJjb2RlLmlzRGFyayhyb3csIGNvbCkgKSBjb3VudCArPSAxO1xuICAgICAgICAgIGlmIChxcmNvZGUuaXNEYXJrKHJvdyArIDEsIGNvbCkgKSBjb3VudCArPSAxO1xuICAgICAgICAgIGlmIChxcmNvZGUuaXNEYXJrKHJvdywgY29sICsgMSkgKSBjb3VudCArPSAxO1xuICAgICAgICAgIGlmIChxcmNvZGUuaXNEYXJrKHJvdyArIDEsIGNvbCArIDEpICkgY291bnQgKz0gMTtcbiAgICAgICAgICBpZiAoY291bnQgPT0gMCB8fCBjb3VudCA9PSA0KSB7XG4gICAgICAgICAgICBsb3N0UG9pbnQgKz0gMztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gTEVWRUwzXG5cbiAgICAgIGZvciAodmFyIHJvdyA9IDA7IHJvdyA8IG1vZHVsZUNvdW50OyByb3cgKz0gMSkge1xuICAgICAgICBmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBtb2R1bGVDb3VudCAtIDY7IGNvbCArPSAxKSB7XG4gICAgICAgICAgaWYgKHFyY29kZS5pc0Rhcmsocm93LCBjb2wpXG4gICAgICAgICAgICAgICYmICFxcmNvZGUuaXNEYXJrKHJvdywgY29sICsgMSlcbiAgICAgICAgICAgICAgJiYgIHFyY29kZS5pc0Rhcmsocm93LCBjb2wgKyAyKVxuICAgICAgICAgICAgICAmJiAgcXJjb2RlLmlzRGFyayhyb3csIGNvbCArIDMpXG4gICAgICAgICAgICAgICYmICBxcmNvZGUuaXNEYXJrKHJvdywgY29sICsgNClcbiAgICAgICAgICAgICAgJiYgIXFyY29kZS5pc0Rhcmsocm93LCBjb2wgKyA1KVxuICAgICAgICAgICAgICAmJiAgcXJjb2RlLmlzRGFyayhyb3csIGNvbCArIDYpICkge1xuICAgICAgICAgICAgbG9zdFBvaW50ICs9IDQwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBtb2R1bGVDb3VudDsgY29sICs9IDEpIHtcbiAgICAgICAgZm9yICh2YXIgcm93ID0gMDsgcm93IDwgbW9kdWxlQ291bnQgLSA2OyByb3cgKz0gMSkge1xuICAgICAgICAgIGlmIChxcmNvZGUuaXNEYXJrKHJvdywgY29sKVxuICAgICAgICAgICAgICAmJiAhcXJjb2RlLmlzRGFyayhyb3cgKyAxLCBjb2wpXG4gICAgICAgICAgICAgICYmICBxcmNvZGUuaXNEYXJrKHJvdyArIDIsIGNvbClcbiAgICAgICAgICAgICAgJiYgIHFyY29kZS5pc0Rhcmsocm93ICsgMywgY29sKVxuICAgICAgICAgICAgICAmJiAgcXJjb2RlLmlzRGFyayhyb3cgKyA0LCBjb2wpXG4gICAgICAgICAgICAgICYmICFxcmNvZGUuaXNEYXJrKHJvdyArIDUsIGNvbClcbiAgICAgICAgICAgICAgJiYgIHFyY29kZS5pc0Rhcmsocm93ICsgNiwgY29sKSApIHtcbiAgICAgICAgICAgIGxvc3RQb2ludCArPSA0MDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gTEVWRUw0XG5cbiAgICAgIHZhciBkYXJrQ291bnQgPSAwO1xuXG4gICAgICBmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBtb2R1bGVDb3VudDsgY29sICs9IDEpIHtcbiAgICAgICAgZm9yICh2YXIgcm93ID0gMDsgcm93IDwgbW9kdWxlQ291bnQ7IHJvdyArPSAxKSB7XG4gICAgICAgICAgaWYgKHFyY29kZS5pc0Rhcmsocm93LCBjb2wpICkge1xuICAgICAgICAgICAgZGFya0NvdW50ICs9IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciByYXRpbyA9IE1hdGguYWJzKDEwMCAqIGRhcmtDb3VudCAvIG1vZHVsZUNvdW50IC8gbW9kdWxlQ291bnQgLSA1MCkgLyA1O1xuICAgICAgbG9zdFBvaW50ICs9IHJhdGlvICogMTA7XG5cbiAgICAgIHJldHVybiBsb3N0UG9pbnQ7XG4gICAgfTtcblxuICAgIHJldHVybiBfdGhpcztcbiAgfSgpO1xuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFFSTWF0aFxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHZhciBRUk1hdGggPSBmdW5jdGlvbigpIHtcblxuICAgIHZhciBFWFBfVEFCTEUgPSBuZXcgQXJyYXkoMjU2KTtcbiAgICB2YXIgTE9HX1RBQkxFID0gbmV3IEFycmF5KDI1Nik7XG5cbiAgICAvLyBpbml0aWFsaXplIHRhYmxlc1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgODsgaSArPSAxKSB7XG4gICAgICBFWFBfVEFCTEVbaV0gPSAxIDw8IGk7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSA4OyBpIDwgMjU2OyBpICs9IDEpIHtcbiAgICAgIEVYUF9UQUJMRVtpXSA9IEVYUF9UQUJMRVtpIC0gNF1cbiAgICAgICAgXiBFWFBfVEFCTEVbaSAtIDVdXG4gICAgICAgIF4gRVhQX1RBQkxFW2kgLSA2XVxuICAgICAgICBeIEVYUF9UQUJMRVtpIC0gOF07XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMjU1OyBpICs9IDEpIHtcbiAgICAgIExPR19UQUJMRVtFWFBfVEFCTEVbaV0gXSA9IGk7XG4gICAgfVxuXG4gICAgdmFyIF90aGlzID0ge307XG5cbiAgICBfdGhpcy5nbG9nID0gZnVuY3Rpb24obikge1xuXG4gICAgICBpZiAobiA8IDEpIHtcbiAgICAgICAgdGhyb3cgJ2dsb2coJyArIG4gKyAnKSc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBMT0dfVEFCTEVbbl07XG4gICAgfTtcblxuICAgIF90aGlzLmdleHAgPSBmdW5jdGlvbihuKSB7XG5cbiAgICAgIHdoaWxlIChuIDwgMCkge1xuICAgICAgICBuICs9IDI1NTtcbiAgICAgIH1cblxuICAgICAgd2hpbGUgKG4gPj0gMjU2KSB7XG4gICAgICAgIG4gLT0gMjU1O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gRVhQX1RBQkxFW25dO1xuICAgIH07XG5cbiAgICByZXR1cm4gX3RoaXM7XG4gIH0oKTtcblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBxclBvbHlub21pYWxcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICBmdW5jdGlvbiBxclBvbHlub21pYWwobnVtLCBzaGlmdCkge1xuXG4gICAgaWYgKHR5cGVvZiBudW0ubGVuZ3RoID09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aHJvdyBudW0ubGVuZ3RoICsgJy8nICsgc2hpZnQ7XG4gICAgfVxuXG4gICAgdmFyIF9udW0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvZmZzZXQgPSAwO1xuICAgICAgd2hpbGUgKG9mZnNldCA8IG51bS5sZW5ndGggJiYgbnVtW29mZnNldF0gPT0gMCkge1xuICAgICAgICBvZmZzZXQgKz0gMTtcbiAgICAgIH1cbiAgICAgIHZhciBfbnVtID0gbmV3IEFycmF5KG51bS5sZW5ndGggLSBvZmZzZXQgKyBzaGlmdCk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bS5sZW5ndGggLSBvZmZzZXQ7IGkgKz0gMSkge1xuICAgICAgICBfbnVtW2ldID0gbnVtW2kgKyBvZmZzZXRdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIF9udW07XG4gICAgfSgpO1xuXG4gICAgdmFyIF90aGlzID0ge307XG5cbiAgICBfdGhpcy5nZXRBdCA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICByZXR1cm4gX251bVtpbmRleF07XG4gICAgfTtcblxuICAgIF90aGlzLmdldExlbmd0aCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF9udW0ubGVuZ3RoO1xuICAgIH07XG5cbiAgICBfdGhpcy5tdWx0aXBseSA9IGZ1bmN0aW9uKGUpIHtcblxuICAgICAgdmFyIG51bSA9IG5ldyBBcnJheShfdGhpcy5nZXRMZW5ndGgoKSArIGUuZ2V0TGVuZ3RoKCkgLSAxKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfdGhpcy5nZXRMZW5ndGgoKTsgaSArPSAxKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgZS5nZXRMZW5ndGgoKTsgaiArPSAxKSB7XG4gICAgICAgICAgbnVtW2kgKyBqXSBePSBRUk1hdGguZ2V4cChRUk1hdGguZ2xvZyhfdGhpcy5nZXRBdChpKSApICsgUVJNYXRoLmdsb2coZS5nZXRBdChqKSApICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHFyUG9seW5vbWlhbChudW0sIDApO1xuICAgIH07XG5cbiAgICBfdGhpcy5tb2QgPSBmdW5jdGlvbihlKSB7XG5cbiAgICAgIGlmIChfdGhpcy5nZXRMZW5ndGgoKSAtIGUuZ2V0TGVuZ3RoKCkgPCAwKSB7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICAgIH1cblxuICAgICAgdmFyIHJhdGlvID0gUVJNYXRoLmdsb2coX3RoaXMuZ2V0QXQoMCkgKSAtIFFSTWF0aC5nbG9nKGUuZ2V0QXQoMCkgKTtcblxuICAgICAgdmFyIG51bSA9IG5ldyBBcnJheShfdGhpcy5nZXRMZW5ndGgoKSApO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfdGhpcy5nZXRMZW5ndGgoKTsgaSArPSAxKSB7XG4gICAgICAgIG51bVtpXSA9IF90aGlzLmdldEF0KGkpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGUuZ2V0TGVuZ3RoKCk7IGkgKz0gMSkge1xuICAgICAgICBudW1baV0gXj0gUVJNYXRoLmdleHAoUVJNYXRoLmdsb2coZS5nZXRBdChpKSApICsgcmF0aW8pO1xuICAgICAgfVxuXG4gICAgICAvLyByZWN1cnNpdmUgY2FsbFxuICAgICAgcmV0dXJuIHFyUG9seW5vbWlhbChudW0sIDApLm1vZChlKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9O1xuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFFSUlNCbG9ja1xuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHZhciBRUlJTQmxvY2sgPSBmdW5jdGlvbigpIHtcblxuICAgIHZhciBSU19CTE9DS19UQUJMRSA9IFtcblxuICAgICAgLy8gTFxuICAgICAgLy8gTVxuICAgICAgLy8gUVxuICAgICAgLy8gSFxuXG4gICAgICAvLyAxXG4gICAgICBbMSwgMjYsIDE5XSxcbiAgICAgIFsxLCAyNiwgMTZdLFxuICAgICAgWzEsIDI2LCAxM10sXG4gICAgICBbMSwgMjYsIDldLFxuXG4gICAgICAvLyAyXG4gICAgICBbMSwgNDQsIDM0XSxcbiAgICAgIFsxLCA0NCwgMjhdLFxuICAgICAgWzEsIDQ0LCAyMl0sXG4gICAgICBbMSwgNDQsIDE2XSxcblxuICAgICAgLy8gM1xuICAgICAgWzEsIDcwLCA1NV0sXG4gICAgICBbMSwgNzAsIDQ0XSxcbiAgICAgIFsyLCAzNSwgMTddLFxuICAgICAgWzIsIDM1LCAxM10sXG5cbiAgICAgIC8vIDRcbiAgICAgIFsxLCAxMDAsIDgwXSxcbiAgICAgIFsyLCA1MCwgMzJdLFxuICAgICAgWzIsIDUwLCAyNF0sXG4gICAgICBbNCwgMjUsIDldLFxuXG4gICAgICAvLyA1XG4gICAgICBbMSwgMTM0LCAxMDhdLFxuICAgICAgWzIsIDY3LCA0M10sXG4gICAgICBbMiwgMzMsIDE1LCAyLCAzNCwgMTZdLFxuICAgICAgWzIsIDMzLCAxMSwgMiwgMzQsIDEyXSxcblxuICAgICAgLy8gNlxuICAgICAgWzIsIDg2LCA2OF0sXG4gICAgICBbNCwgNDMsIDI3XSxcbiAgICAgIFs0LCA0MywgMTldLFxuICAgICAgWzQsIDQzLCAxNV0sXG5cbiAgICAgIC8vIDdcbiAgICAgIFsyLCA5OCwgNzhdLFxuICAgICAgWzQsIDQ5LCAzMV0sXG4gICAgICBbMiwgMzIsIDE0LCA0LCAzMywgMTVdLFxuICAgICAgWzQsIDM5LCAxMywgMSwgNDAsIDE0XSxcblxuICAgICAgLy8gOFxuICAgICAgWzIsIDEyMSwgOTddLFxuICAgICAgWzIsIDYwLCAzOCwgMiwgNjEsIDM5XSxcbiAgICAgIFs0LCA0MCwgMTgsIDIsIDQxLCAxOV0sXG4gICAgICBbNCwgNDAsIDE0LCAyLCA0MSwgMTVdLFxuXG4gICAgICAvLyA5XG4gICAgICBbMiwgMTQ2LCAxMTZdLFxuICAgICAgWzMsIDU4LCAzNiwgMiwgNTksIDM3XSxcbiAgICAgIFs0LCAzNiwgMTYsIDQsIDM3LCAxN10sXG4gICAgICBbNCwgMzYsIDEyLCA0LCAzNywgMTNdLFxuXG4gICAgICAvLyAxMFxuICAgICAgWzIsIDg2LCA2OCwgMiwgODcsIDY5XSxcbiAgICAgIFs0LCA2OSwgNDMsIDEsIDcwLCA0NF0sXG4gICAgICBbNiwgNDMsIDE5LCAyLCA0NCwgMjBdLFxuICAgICAgWzYsIDQzLCAxNSwgMiwgNDQsIDE2XSxcblxuICAgICAgLy8gMTFcbiAgICAgIFs0LCAxMDEsIDgxXSxcbiAgICAgIFsxLCA4MCwgNTAsIDQsIDgxLCA1MV0sXG4gICAgICBbNCwgNTAsIDIyLCA0LCA1MSwgMjNdLFxuICAgICAgWzMsIDM2LCAxMiwgOCwgMzcsIDEzXSxcblxuICAgICAgLy8gMTJcbiAgICAgIFsyLCAxMTYsIDkyLCAyLCAxMTcsIDkzXSxcbiAgICAgIFs2LCA1OCwgMzYsIDIsIDU5LCAzN10sXG4gICAgICBbNCwgNDYsIDIwLCA2LCA0NywgMjFdLFxuICAgICAgWzcsIDQyLCAxNCwgNCwgNDMsIDE1XSxcblxuICAgICAgLy8gMTNcbiAgICAgIFs0LCAxMzMsIDEwN10sXG4gICAgICBbOCwgNTksIDM3LCAxLCA2MCwgMzhdLFxuICAgICAgWzgsIDQ0LCAyMCwgNCwgNDUsIDIxXSxcbiAgICAgIFsxMiwgMzMsIDExLCA0LCAzNCwgMTJdLFxuXG4gICAgICAvLyAxNFxuICAgICAgWzMsIDE0NSwgMTE1LCAxLCAxNDYsIDExNl0sXG4gICAgICBbNCwgNjQsIDQwLCA1LCA2NSwgNDFdLFxuICAgICAgWzExLCAzNiwgMTYsIDUsIDM3LCAxN10sXG4gICAgICBbMTEsIDM2LCAxMiwgNSwgMzcsIDEzXSxcblxuICAgICAgLy8gMTVcbiAgICAgIFs1LCAxMDksIDg3LCAxLCAxMTAsIDg4XSxcbiAgICAgIFs1LCA2NSwgNDEsIDUsIDY2LCA0Ml0sXG4gICAgICBbNSwgNTQsIDI0LCA3LCA1NSwgMjVdLFxuICAgICAgWzExLCAzNiwgMTIsIDcsIDM3LCAxM10sXG5cbiAgICAgIC8vIDE2XG4gICAgICBbNSwgMTIyLCA5OCwgMSwgMTIzLCA5OV0sXG4gICAgICBbNywgNzMsIDQ1LCAzLCA3NCwgNDZdLFxuICAgICAgWzE1LCA0MywgMTksIDIsIDQ0LCAyMF0sXG4gICAgICBbMywgNDUsIDE1LCAxMywgNDYsIDE2XSxcblxuICAgICAgLy8gMTdcbiAgICAgIFsxLCAxMzUsIDEwNywgNSwgMTM2LCAxMDhdLFxuICAgICAgWzEwLCA3NCwgNDYsIDEsIDc1LCA0N10sXG4gICAgICBbMSwgNTAsIDIyLCAxNSwgNTEsIDIzXSxcbiAgICAgIFsyLCA0MiwgMTQsIDE3LCA0MywgMTVdLFxuXG4gICAgICAvLyAxOFxuICAgICAgWzUsIDE1MCwgMTIwLCAxLCAxNTEsIDEyMV0sXG4gICAgICBbOSwgNjksIDQzLCA0LCA3MCwgNDRdLFxuICAgICAgWzE3LCA1MCwgMjIsIDEsIDUxLCAyM10sXG4gICAgICBbMiwgNDIsIDE0LCAxOSwgNDMsIDE1XSxcblxuICAgICAgLy8gMTlcbiAgICAgIFszLCAxNDEsIDExMywgNCwgMTQyLCAxMTRdLFxuICAgICAgWzMsIDcwLCA0NCwgMTEsIDcxLCA0NV0sXG4gICAgICBbMTcsIDQ3LCAyMSwgNCwgNDgsIDIyXSxcbiAgICAgIFs5LCAzOSwgMTMsIDE2LCA0MCwgMTRdLFxuXG4gICAgICAvLyAyMFxuICAgICAgWzMsIDEzNSwgMTA3LCA1LCAxMzYsIDEwOF0sXG4gICAgICBbMywgNjcsIDQxLCAxMywgNjgsIDQyXSxcbiAgICAgIFsxNSwgNTQsIDI0LCA1LCA1NSwgMjVdLFxuICAgICAgWzE1LCA0MywgMTUsIDEwLCA0NCwgMTZdLFxuXG4gICAgICAvLyAyMVxuICAgICAgWzQsIDE0NCwgMTE2LCA0LCAxNDUsIDExN10sXG4gICAgICBbMTcsIDY4LCA0Ml0sXG4gICAgICBbMTcsIDUwLCAyMiwgNiwgNTEsIDIzXSxcbiAgICAgIFsxOSwgNDYsIDE2LCA2LCA0NywgMTddLFxuXG4gICAgICAvLyAyMlxuICAgICAgWzIsIDEzOSwgMTExLCA3LCAxNDAsIDExMl0sXG4gICAgICBbMTcsIDc0LCA0Nl0sXG4gICAgICBbNywgNTQsIDI0LCAxNiwgNTUsIDI1XSxcbiAgICAgIFszNCwgMzcsIDEzXSxcblxuICAgICAgLy8gMjNcbiAgICAgIFs0LCAxNTEsIDEyMSwgNSwgMTUyLCAxMjJdLFxuICAgICAgWzQsIDc1LCA0NywgMTQsIDc2LCA0OF0sXG4gICAgICBbMTEsIDU0LCAyNCwgMTQsIDU1LCAyNV0sXG4gICAgICBbMTYsIDQ1LCAxNSwgMTQsIDQ2LCAxNl0sXG5cbiAgICAgIC8vIDI0XG4gICAgICBbNiwgMTQ3LCAxMTcsIDQsIDE0OCwgMTE4XSxcbiAgICAgIFs2LCA3MywgNDUsIDE0LCA3NCwgNDZdLFxuICAgICAgWzExLCA1NCwgMjQsIDE2LCA1NSwgMjVdLFxuICAgICAgWzMwLCA0NiwgMTYsIDIsIDQ3LCAxN10sXG5cbiAgICAgIC8vIDI1XG4gICAgICBbOCwgMTMyLCAxMDYsIDQsIDEzMywgMTA3XSxcbiAgICAgIFs4LCA3NSwgNDcsIDEzLCA3NiwgNDhdLFxuICAgICAgWzcsIDU0LCAyNCwgMjIsIDU1LCAyNV0sXG4gICAgICBbMjIsIDQ1LCAxNSwgMTMsIDQ2LCAxNl0sXG5cbiAgICAgIC8vIDI2XG4gICAgICBbMTAsIDE0MiwgMTE0LCAyLCAxNDMsIDExNV0sXG4gICAgICBbMTksIDc0LCA0NiwgNCwgNzUsIDQ3XSxcbiAgICAgIFsyOCwgNTAsIDIyLCA2LCA1MSwgMjNdLFxuICAgICAgWzMzLCA0NiwgMTYsIDQsIDQ3LCAxN10sXG5cbiAgICAgIC8vIDI3XG4gICAgICBbOCwgMTUyLCAxMjIsIDQsIDE1MywgMTIzXSxcbiAgICAgIFsyMiwgNzMsIDQ1LCAzLCA3NCwgNDZdLFxuICAgICAgWzgsIDUzLCAyMywgMjYsIDU0LCAyNF0sXG4gICAgICBbMTIsIDQ1LCAxNSwgMjgsIDQ2LCAxNl0sXG5cbiAgICAgIC8vIDI4XG4gICAgICBbMywgMTQ3LCAxMTcsIDEwLCAxNDgsIDExOF0sXG4gICAgICBbMywgNzMsIDQ1LCAyMywgNzQsIDQ2XSxcbiAgICAgIFs0LCA1NCwgMjQsIDMxLCA1NSwgMjVdLFxuICAgICAgWzExLCA0NSwgMTUsIDMxLCA0NiwgMTZdLFxuXG4gICAgICAvLyAyOVxuICAgICAgWzcsIDE0NiwgMTE2LCA3LCAxNDcsIDExN10sXG4gICAgICBbMjEsIDczLCA0NSwgNywgNzQsIDQ2XSxcbiAgICAgIFsxLCA1MywgMjMsIDM3LCA1NCwgMjRdLFxuICAgICAgWzE5LCA0NSwgMTUsIDI2LCA0NiwgMTZdLFxuXG4gICAgICAvLyAzMFxuICAgICAgWzUsIDE0NSwgMTE1LCAxMCwgMTQ2LCAxMTZdLFxuICAgICAgWzE5LCA3NSwgNDcsIDEwLCA3NiwgNDhdLFxuICAgICAgWzE1LCA1NCwgMjQsIDI1LCA1NSwgMjVdLFxuICAgICAgWzIzLCA0NSwgMTUsIDI1LCA0NiwgMTZdLFxuXG4gICAgICAvLyAzMVxuICAgICAgWzEzLCAxNDUsIDExNSwgMywgMTQ2LCAxMTZdLFxuICAgICAgWzIsIDc0LCA0NiwgMjksIDc1LCA0N10sXG4gICAgICBbNDIsIDU0LCAyNCwgMSwgNTUsIDI1XSxcbiAgICAgIFsyMywgNDUsIDE1LCAyOCwgNDYsIDE2XSxcblxuICAgICAgLy8gMzJcbiAgICAgIFsxNywgMTQ1LCAxMTVdLFxuICAgICAgWzEwLCA3NCwgNDYsIDIzLCA3NSwgNDddLFxuICAgICAgWzEwLCA1NCwgMjQsIDM1LCA1NSwgMjVdLFxuICAgICAgWzE5LCA0NSwgMTUsIDM1LCA0NiwgMTZdLFxuXG4gICAgICAvLyAzM1xuICAgICAgWzE3LCAxNDUsIDExNSwgMSwgMTQ2LCAxMTZdLFxuICAgICAgWzE0LCA3NCwgNDYsIDIxLCA3NSwgNDddLFxuICAgICAgWzI5LCA1NCwgMjQsIDE5LCA1NSwgMjVdLFxuICAgICAgWzExLCA0NSwgMTUsIDQ2LCA0NiwgMTZdLFxuXG4gICAgICAvLyAzNFxuICAgICAgWzEzLCAxNDUsIDExNSwgNiwgMTQ2LCAxMTZdLFxuICAgICAgWzE0LCA3NCwgNDYsIDIzLCA3NSwgNDddLFxuICAgICAgWzQ0LCA1NCwgMjQsIDcsIDU1LCAyNV0sXG4gICAgICBbNTksIDQ2LCAxNiwgMSwgNDcsIDE3XSxcblxuICAgICAgLy8gMzVcbiAgICAgIFsxMiwgMTUxLCAxMjEsIDcsIDE1MiwgMTIyXSxcbiAgICAgIFsxMiwgNzUsIDQ3LCAyNiwgNzYsIDQ4XSxcbiAgICAgIFszOSwgNTQsIDI0LCAxNCwgNTUsIDI1XSxcbiAgICAgIFsyMiwgNDUsIDE1LCA0MSwgNDYsIDE2XSxcblxuICAgICAgLy8gMzZcbiAgICAgIFs2LCAxNTEsIDEyMSwgMTQsIDE1MiwgMTIyXSxcbiAgICAgIFs2LCA3NSwgNDcsIDM0LCA3NiwgNDhdLFxuICAgICAgWzQ2LCA1NCwgMjQsIDEwLCA1NSwgMjVdLFxuICAgICAgWzIsIDQ1LCAxNSwgNjQsIDQ2LCAxNl0sXG5cbiAgICAgIC8vIDM3XG4gICAgICBbMTcsIDE1MiwgMTIyLCA0LCAxNTMsIDEyM10sXG4gICAgICBbMjksIDc0LCA0NiwgMTQsIDc1LCA0N10sXG4gICAgICBbNDksIDU0LCAyNCwgMTAsIDU1LCAyNV0sXG4gICAgICBbMjQsIDQ1LCAxNSwgNDYsIDQ2LCAxNl0sXG5cbiAgICAgIC8vIDM4XG4gICAgICBbNCwgMTUyLCAxMjIsIDE4LCAxNTMsIDEyM10sXG4gICAgICBbMTMsIDc0LCA0NiwgMzIsIDc1LCA0N10sXG4gICAgICBbNDgsIDU0LCAyNCwgMTQsIDU1LCAyNV0sXG4gICAgICBbNDIsIDQ1LCAxNSwgMzIsIDQ2LCAxNl0sXG5cbiAgICAgIC8vIDM5XG4gICAgICBbMjAsIDE0NywgMTE3LCA0LCAxNDgsIDExOF0sXG4gICAgICBbNDAsIDc1LCA0NywgNywgNzYsIDQ4XSxcbiAgICAgIFs0MywgNTQsIDI0LCAyMiwgNTUsIDI1XSxcbiAgICAgIFsxMCwgNDUsIDE1LCA2NywgNDYsIDE2XSxcblxuICAgICAgLy8gNDBcbiAgICAgIFsxOSwgMTQ4LCAxMTgsIDYsIDE0OSwgMTE5XSxcbiAgICAgIFsxOCwgNzUsIDQ3LCAzMSwgNzYsIDQ4XSxcbiAgICAgIFszNCwgNTQsIDI0LCAzNCwgNTUsIDI1XSxcbiAgICAgIFsyMCwgNDUsIDE1LCA2MSwgNDYsIDE2XVxuICAgIF07XG5cbiAgICB2YXIgcXJSU0Jsb2NrID0gZnVuY3Rpb24odG90YWxDb3VudCwgZGF0YUNvdW50KSB7XG4gICAgICB2YXIgX3RoaXMgPSB7fTtcbiAgICAgIF90aGlzLnRvdGFsQ291bnQgPSB0b3RhbENvdW50O1xuICAgICAgX3RoaXMuZGF0YUNvdW50ID0gZGF0YUNvdW50O1xuICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH07XG5cbiAgICB2YXIgX3RoaXMgPSB7fTtcblxuICAgIHZhciBnZXRSc0Jsb2NrVGFibGUgPSBmdW5jdGlvbih0eXBlTnVtYmVyLCBlcnJvckNvcnJlY3Rpb25MZXZlbCkge1xuXG4gICAgICBzd2l0Y2goZXJyb3JDb3JyZWN0aW9uTGV2ZWwpIHtcbiAgICAgIGNhc2UgUVJFcnJvckNvcnJlY3Rpb25MZXZlbC5MIDpcbiAgICAgICAgcmV0dXJuIFJTX0JMT0NLX1RBQkxFWyh0eXBlTnVtYmVyIC0gMSkgKiA0ICsgMF07XG4gICAgICBjYXNlIFFSRXJyb3JDb3JyZWN0aW9uTGV2ZWwuTSA6XG4gICAgICAgIHJldHVybiBSU19CTE9DS19UQUJMRVsodHlwZU51bWJlciAtIDEpICogNCArIDFdO1xuICAgICAgY2FzZSBRUkVycm9yQ29ycmVjdGlvbkxldmVsLlEgOlxuICAgICAgICByZXR1cm4gUlNfQkxPQ0tfVEFCTEVbKHR5cGVOdW1iZXIgLSAxKSAqIDQgKyAyXTtcbiAgICAgIGNhc2UgUVJFcnJvckNvcnJlY3Rpb25MZXZlbC5IIDpcbiAgICAgICAgcmV0dXJuIFJTX0JMT0NLX1RBQkxFWyh0eXBlTnVtYmVyIC0gMSkgKiA0ICsgM107XG4gICAgICBkZWZhdWx0IDpcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3RoaXMuZ2V0UlNCbG9ja3MgPSBmdW5jdGlvbih0eXBlTnVtYmVyLCBlcnJvckNvcnJlY3Rpb25MZXZlbCkge1xuXG4gICAgICB2YXIgcnNCbG9jayA9IGdldFJzQmxvY2tUYWJsZSh0eXBlTnVtYmVyLCBlcnJvckNvcnJlY3Rpb25MZXZlbCk7XG5cbiAgICAgIGlmICh0eXBlb2YgcnNCbG9jayA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aHJvdyAnYmFkIHJzIGJsb2NrIEAgdHlwZU51bWJlcjonICsgdHlwZU51bWJlciArXG4gICAgICAgICAgICAnL2Vycm9yQ29ycmVjdGlvbkxldmVsOicgKyBlcnJvckNvcnJlY3Rpb25MZXZlbDtcbiAgICAgIH1cblxuICAgICAgdmFyIGxlbmd0aCA9IHJzQmxvY2subGVuZ3RoIC8gMztcblxuICAgICAgdmFyIGxpc3QgPSBbXTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuXG4gICAgICAgIHZhciBjb3VudCA9IHJzQmxvY2tbaSAqIDMgKyAwXTtcbiAgICAgICAgdmFyIHRvdGFsQ291bnQgPSByc0Jsb2NrW2kgKiAzICsgMV07XG4gICAgICAgIHZhciBkYXRhQ291bnQgPSByc0Jsb2NrW2kgKiAzICsgMl07XG5cbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjb3VudDsgaiArPSAxKSB7XG4gICAgICAgICAgbGlzdC5wdXNoKHFyUlNCbG9jayh0b3RhbENvdW50LCBkYXRhQ291bnQpICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgfTtcblxuICAgIHJldHVybiBfdGhpcztcbiAgfSgpO1xuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIHFyQml0QnVmZmVyXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgdmFyIHFyQml0QnVmZmVyID0gZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgX2J1ZmZlciA9IFtdO1xuICAgIHZhciBfbGVuZ3RoID0gMDtcblxuICAgIHZhciBfdGhpcyA9IHt9O1xuXG4gICAgX3RoaXMuZ2V0QnVmZmVyID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gX2J1ZmZlcjtcbiAgICB9O1xuXG4gICAgX3RoaXMuZ2V0QXQgPSBmdW5jdGlvbihpbmRleCkge1xuICAgICAgdmFyIGJ1ZkluZGV4ID0gTWF0aC5mbG9vcihpbmRleCAvIDgpO1xuICAgICAgcmV0dXJuICggKF9idWZmZXJbYnVmSW5kZXhdID4+PiAoNyAtIGluZGV4ICUgOCkgKSAmIDEpID09IDE7XG4gICAgfTtcblxuICAgIF90aGlzLnB1dCA9IGZ1bmN0aW9uKG51bSwgbGVuZ3RoKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIF90aGlzLnB1dEJpdCggKCAobnVtID4+PiAobGVuZ3RoIC0gaSAtIDEpICkgJiAxKSA9PSAxKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3RoaXMuZ2V0TGVuZ3RoSW5CaXRzID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gX2xlbmd0aDtcbiAgICB9O1xuXG4gICAgX3RoaXMucHV0Qml0ID0gZnVuY3Rpb24oYml0KSB7XG5cbiAgICAgIHZhciBidWZJbmRleCA9IE1hdGguZmxvb3IoX2xlbmd0aCAvIDgpO1xuICAgICAgaWYgKF9idWZmZXIubGVuZ3RoIDw9IGJ1ZkluZGV4KSB7XG4gICAgICAgIF9idWZmZXIucHVzaCgwKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGJpdCkge1xuICAgICAgICBfYnVmZmVyW2J1ZkluZGV4XSB8PSAoMHg4MCA+Pj4gKF9sZW5ndGggJSA4KSApO1xuICAgICAgfVxuXG4gICAgICBfbGVuZ3RoICs9IDE7XG4gICAgfTtcblxuICAgIHJldHVybiBfdGhpcztcbiAgfTtcblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBxck51bWJlclxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHZhciBxck51bWJlciA9IGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgIHZhciBfbW9kZSA9IFFSTW9kZS5NT0RFX05VTUJFUjtcbiAgICB2YXIgX2RhdGEgPSBkYXRhO1xuXG4gICAgdmFyIF90aGlzID0ge307XG5cbiAgICBfdGhpcy5nZXRNb2RlID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gX21vZGU7XG4gICAgfTtcblxuICAgIF90aGlzLmdldExlbmd0aCA9IGZ1bmN0aW9uKGJ1ZmZlcikge1xuICAgICAgcmV0dXJuIF9kYXRhLmxlbmd0aDtcbiAgICB9O1xuXG4gICAgX3RoaXMud3JpdGUgPSBmdW5jdGlvbihidWZmZXIpIHtcblxuICAgICAgdmFyIGRhdGEgPSBfZGF0YTtcblxuICAgICAgdmFyIGkgPSAwO1xuXG4gICAgICB3aGlsZSAoaSArIDIgPCBkYXRhLmxlbmd0aCkge1xuICAgICAgICBidWZmZXIucHV0KHN0clRvTnVtKGRhdGEuc3Vic3RyaW5nKGksIGkgKyAzKSApLCAxMCk7XG4gICAgICAgIGkgKz0gMztcbiAgICAgIH1cblxuICAgICAgaWYgKGkgPCBkYXRhLmxlbmd0aCkge1xuICAgICAgICBpZiAoZGF0YS5sZW5ndGggLSBpID09IDEpIHtcbiAgICAgICAgICBidWZmZXIucHV0KHN0clRvTnVtKGRhdGEuc3Vic3RyaW5nKGksIGkgKyAxKSApLCA0KTtcbiAgICAgICAgfSBlbHNlIGlmIChkYXRhLmxlbmd0aCAtIGkgPT0gMikge1xuICAgICAgICAgIGJ1ZmZlci5wdXQoc3RyVG9OdW0oZGF0YS5zdWJzdHJpbmcoaSwgaSArIDIpICksIDcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBzdHJUb051bSA9IGZ1bmN0aW9uKHMpIHtcbiAgICAgIHZhciBudW0gPSAwO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIG51bSA9IG51bSAqIDEwICsgY2hhdFRvTnVtKHMuY2hhckF0KGkpICk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVtO1xuICAgIH07XG5cbiAgICB2YXIgY2hhdFRvTnVtID0gZnVuY3Rpb24oYykge1xuICAgICAgaWYgKCcwJyA8PSBjICYmIGMgPD0gJzknKSB7XG4gICAgICAgIHJldHVybiBjLmNoYXJDb2RlQXQoMCkgLSAnMCcuY2hhckNvZGVBdCgwKTtcbiAgICAgIH1cbiAgICAgIHRocm93ICdpbGxlZ2FsIGNoYXIgOicgKyBjO1xuICAgIH07XG5cbiAgICByZXR1cm4gX3RoaXM7XG4gIH07XG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gcXJBbHBoYU51bVxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHZhciBxckFscGhhTnVtID0gZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgdmFyIF9tb2RlID0gUVJNb2RlLk1PREVfQUxQSEFfTlVNO1xuICAgIHZhciBfZGF0YSA9IGRhdGE7XG5cbiAgICB2YXIgX3RoaXMgPSB7fTtcblxuICAgIF90aGlzLmdldE1vZGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfbW9kZTtcbiAgICB9O1xuXG4gICAgX3RoaXMuZ2V0TGVuZ3RoID0gZnVuY3Rpb24oYnVmZmVyKSB7XG4gICAgICByZXR1cm4gX2RhdGEubGVuZ3RoO1xuICAgIH07XG5cbiAgICBfdGhpcy53cml0ZSA9IGZ1bmN0aW9uKGJ1ZmZlcikge1xuXG4gICAgICB2YXIgcyA9IF9kYXRhO1xuXG4gICAgICB2YXIgaSA9IDA7XG5cbiAgICAgIHdoaWxlIChpICsgMSA8IHMubGVuZ3RoKSB7XG4gICAgICAgIGJ1ZmZlci5wdXQoXG4gICAgICAgICAgZ2V0Q29kZShzLmNoYXJBdChpKSApICogNDUgK1xuICAgICAgICAgIGdldENvZGUocy5jaGFyQXQoaSArIDEpICksIDExKTtcbiAgICAgICAgaSArPSAyO1xuICAgICAgfVxuXG4gICAgICBpZiAoaSA8IHMubGVuZ3RoKSB7XG4gICAgICAgIGJ1ZmZlci5wdXQoZ2V0Q29kZShzLmNoYXJBdChpKSApLCA2KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGdldENvZGUgPSBmdW5jdGlvbihjKSB7XG5cbiAgICAgIGlmICgnMCcgPD0gYyAmJiBjIDw9ICc5Jykge1xuICAgICAgICByZXR1cm4gYy5jaGFyQ29kZUF0KDApIC0gJzAnLmNoYXJDb2RlQXQoMCk7XG4gICAgICB9IGVsc2UgaWYgKCdBJyA8PSBjICYmIGMgPD0gJ1onKSB7XG4gICAgICAgIHJldHVybiBjLmNoYXJDb2RlQXQoMCkgLSAnQScuY2hhckNvZGVBdCgwKSArIDEwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3dpdGNoIChjKSB7XG4gICAgICAgIGNhc2UgJyAnIDogcmV0dXJuIDM2O1xuICAgICAgICBjYXNlICckJyA6IHJldHVybiAzNztcbiAgICAgICAgY2FzZSAnJScgOiByZXR1cm4gMzg7XG4gICAgICAgIGNhc2UgJyonIDogcmV0dXJuIDM5O1xuICAgICAgICBjYXNlICcrJyA6IHJldHVybiA0MDtcbiAgICAgICAgY2FzZSAnLScgOiByZXR1cm4gNDE7XG4gICAgICAgIGNhc2UgJy4nIDogcmV0dXJuIDQyO1xuICAgICAgICBjYXNlICcvJyA6IHJldHVybiA0MztcbiAgICAgICAgY2FzZSAnOicgOiByZXR1cm4gNDQ7XG4gICAgICAgIGRlZmF1bHQgOlxuICAgICAgICAgIHRocm93ICdpbGxlZ2FsIGNoYXIgOicgKyBjO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBfdGhpcztcbiAgfTtcblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBxcjhCaXRCeXRlXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgdmFyIHFyOEJpdEJ5dGUgPSBmdW5jdGlvbihkYXRhKSB7XG5cbiAgICB2YXIgX21vZGUgPSBRUk1vZGUuTU9ERV84QklUX0JZVEU7XG4gICAgdmFyIF9kYXRhID0gZGF0YTtcbiAgICB2YXIgX2J5dGVzID0gcXJjb2RlLnN0cmluZ1RvQnl0ZXMoZGF0YSk7XG5cbiAgICB2YXIgX3RoaXMgPSB7fTtcblxuICAgIF90aGlzLmdldE1vZGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfbW9kZTtcbiAgICB9O1xuXG4gICAgX3RoaXMuZ2V0TGVuZ3RoID0gZnVuY3Rpb24oYnVmZmVyKSB7XG4gICAgICByZXR1cm4gX2J5dGVzLmxlbmd0aDtcbiAgICB9O1xuXG4gICAgX3RoaXMud3JpdGUgPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX2J5dGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGJ1ZmZlci5wdXQoX2J5dGVzW2ldLCA4KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9O1xuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIHFyS2FuamlcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICB2YXIgcXJLYW5qaSA9IGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgIHZhciBfbW9kZSA9IFFSTW9kZS5NT0RFX0tBTkpJO1xuICAgIHZhciBfZGF0YSA9IGRhdGE7XG5cbiAgICB2YXIgc3RyaW5nVG9CeXRlcyA9IHFyY29kZS5zdHJpbmdUb0J5dGVzRnVuY3NbJ1NKSVMnXTtcbiAgICBpZiAoIXN0cmluZ1RvQnl0ZXMpIHtcbiAgICAgIHRocm93ICdzamlzIG5vdCBzdXBwb3J0ZWQuJztcbiAgICB9XG4gICAgIWZ1bmN0aW9uKGMsIGNvZGUpIHtcbiAgICAgIC8vIHNlbGYgdGVzdCBmb3Igc2ppcyBzdXBwb3J0LlxuICAgICAgdmFyIHRlc3QgPSBzdHJpbmdUb0J5dGVzKGMpO1xuICAgICAgaWYgKHRlc3QubGVuZ3RoICE9IDIgfHwgKCAodGVzdFswXSA8PCA4KSB8IHRlc3RbMV0pICE9IGNvZGUpIHtcbiAgICAgICAgdGhyb3cgJ3NqaXMgbm90IHN1cHBvcnRlZC4nO1xuICAgICAgfVxuICAgIH0oJ1xcdTUzY2InLCAweDk3NDYpO1xuXG4gICAgdmFyIF9ieXRlcyA9IHN0cmluZ1RvQnl0ZXMoZGF0YSk7XG5cbiAgICB2YXIgX3RoaXMgPSB7fTtcblxuICAgIF90aGlzLmdldE1vZGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfbW9kZTtcbiAgICB9O1xuXG4gICAgX3RoaXMuZ2V0TGVuZ3RoID0gZnVuY3Rpb24oYnVmZmVyKSB7XG4gICAgICByZXR1cm4gfn4oX2J5dGVzLmxlbmd0aCAvIDIpO1xuICAgIH07XG5cbiAgICBfdGhpcy53cml0ZSA9IGZ1bmN0aW9uKGJ1ZmZlcikge1xuXG4gICAgICB2YXIgZGF0YSA9IF9ieXRlcztcblxuICAgICAgdmFyIGkgPSAwO1xuXG4gICAgICB3aGlsZSAoaSArIDEgPCBkYXRhLmxlbmd0aCkge1xuXG4gICAgICAgIHZhciBjID0gKCAoMHhmZiAmIGRhdGFbaV0pIDw8IDgpIHwgKDB4ZmYgJiBkYXRhW2kgKyAxXSk7XG5cbiAgICAgICAgaWYgKDB4ODE0MCA8PSBjICYmIGMgPD0gMHg5RkZDKSB7XG4gICAgICAgICAgYyAtPSAweDgxNDA7XG4gICAgICAgIH0gZWxzZSBpZiAoMHhFMDQwIDw9IGMgJiYgYyA8PSAweEVCQkYpIHtcbiAgICAgICAgICBjIC09IDB4QzE0MDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyAnaWxsZWdhbCBjaGFyIGF0ICcgKyAoaSArIDEpICsgJy8nICsgYztcbiAgICAgICAgfVxuXG4gICAgICAgIGMgPSAoIChjID4+PiA4KSAmIDB4ZmYpICogMHhDMCArIChjICYgMHhmZik7XG5cbiAgICAgICAgYnVmZmVyLnB1dChjLCAxMyk7XG5cbiAgICAgICAgaSArPSAyO1xuICAgICAgfVxuXG4gICAgICBpZiAoaSA8IGRhdGEubGVuZ3RoKSB7XG4gICAgICAgIHRocm93ICdpbGxlZ2FsIGNoYXIgYXQgJyArIChpICsgMSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBfdGhpcztcbiAgfTtcblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBHSUYgU3VwcG9ydCBldGMuXG4gIC8vXG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gYnl0ZUFycmF5T3V0cHV0U3RyZWFtXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgdmFyIGJ5dGVBcnJheU91dHB1dFN0cmVhbSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIF9ieXRlcyA9IFtdO1xuXG4gICAgdmFyIF90aGlzID0ge307XG5cbiAgICBfdGhpcy53cml0ZUJ5dGUgPSBmdW5jdGlvbihiKSB7XG4gICAgICBfYnl0ZXMucHVzaChiICYgMHhmZik7XG4gICAgfTtcblxuICAgIF90aGlzLndyaXRlU2hvcnQgPSBmdW5jdGlvbihpKSB7XG4gICAgICBfdGhpcy53cml0ZUJ5dGUoaSk7XG4gICAgICBfdGhpcy53cml0ZUJ5dGUoaSA+Pj4gOCk7XG4gICAgfTtcblxuICAgIF90aGlzLndyaXRlQnl0ZXMgPSBmdW5jdGlvbihiLCBvZmYsIGxlbikge1xuICAgICAgb2ZmID0gb2ZmIHx8IDA7XG4gICAgICBsZW4gPSBsZW4gfHwgYi5sZW5ndGg7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgIF90aGlzLndyaXRlQnl0ZShiW2kgKyBvZmZdKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3RoaXMud3JpdGVTdHJpbmcgPSBmdW5jdGlvbihzKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgX3RoaXMud3JpdGVCeXRlKHMuY2hhckNvZGVBdChpKSApO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfdGhpcy50b0J5dGVBcnJheSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF9ieXRlcztcbiAgICB9O1xuXG4gICAgX3RoaXMudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzID0gJyc7XG4gICAgICBzICs9ICdbJztcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX2J5dGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGlmIChpID4gMCkge1xuICAgICAgICAgIHMgKz0gJywnO1xuICAgICAgICB9XG4gICAgICAgIHMgKz0gX2J5dGVzW2ldO1xuICAgICAgfVxuICAgICAgcyArPSAnXSc7XG4gICAgICByZXR1cm4gcztcbiAgICB9O1xuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9O1xuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIGJhc2U2NEVuY29kZU91dHB1dFN0cmVhbVxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHZhciBiYXNlNjRFbmNvZGVPdXRwdXRTdHJlYW0gPSBmdW5jdGlvbigpIHtcblxuICAgIHZhciBfYnVmZmVyID0gMDtcbiAgICB2YXIgX2J1ZmxlbiA9IDA7XG4gICAgdmFyIF9sZW5ndGggPSAwO1xuICAgIHZhciBfYmFzZTY0ID0gJyc7XG5cbiAgICB2YXIgX3RoaXMgPSB7fTtcblxuICAgIHZhciB3cml0ZUVuY29kZWQgPSBmdW5jdGlvbihiKSB7XG4gICAgICBfYmFzZTY0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoZW5jb2RlKGIgJiAweDNmKSApO1xuICAgIH07XG5cbiAgICB2YXIgZW5jb2RlID0gZnVuY3Rpb24obikge1xuICAgICAgaWYgKG4gPCAwKSB7XG4gICAgICAgIC8vIGVycm9yLlxuICAgICAgfSBlbHNlIGlmIChuIDwgMjYpIHtcbiAgICAgICAgcmV0dXJuIDB4NDEgKyBuO1xuICAgICAgfSBlbHNlIGlmIChuIDwgNTIpIHtcbiAgICAgICAgcmV0dXJuIDB4NjEgKyAobiAtIDI2KTtcbiAgICAgIH0gZWxzZSBpZiAobiA8IDYyKSB7XG4gICAgICAgIHJldHVybiAweDMwICsgKG4gLSA1Mik7XG4gICAgICB9IGVsc2UgaWYgKG4gPT0gNjIpIHtcbiAgICAgICAgcmV0dXJuIDB4MmI7XG4gICAgICB9IGVsc2UgaWYgKG4gPT0gNjMpIHtcbiAgICAgICAgcmV0dXJuIDB4MmY7XG4gICAgICB9XG4gICAgICB0aHJvdyAnbjonICsgbjtcbiAgICB9O1xuXG4gICAgX3RoaXMud3JpdGVCeXRlID0gZnVuY3Rpb24obikge1xuXG4gICAgICBfYnVmZmVyID0gKF9idWZmZXIgPDwgOCkgfCAobiAmIDB4ZmYpO1xuICAgICAgX2J1ZmxlbiArPSA4O1xuICAgICAgX2xlbmd0aCArPSAxO1xuXG4gICAgICB3aGlsZSAoX2J1ZmxlbiA+PSA2KSB7XG4gICAgICAgIHdyaXRlRW5jb2RlZChfYnVmZmVyID4+PiAoX2J1ZmxlbiAtIDYpICk7XG4gICAgICAgIF9idWZsZW4gLT0gNjtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3RoaXMuZmx1c2ggPSBmdW5jdGlvbigpIHtcblxuICAgICAgaWYgKF9idWZsZW4gPiAwKSB7XG4gICAgICAgIHdyaXRlRW5jb2RlZChfYnVmZmVyIDw8ICg2IC0gX2J1ZmxlbikgKTtcbiAgICAgICAgX2J1ZmZlciA9IDA7XG4gICAgICAgIF9idWZsZW4gPSAwO1xuICAgICAgfVxuXG4gICAgICBpZiAoX2xlbmd0aCAlIDMgIT0gMCkge1xuICAgICAgICAvLyBwYWRkaW5nXG4gICAgICAgIHZhciBwYWRsZW4gPSAzIC0gX2xlbmd0aCAlIDM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFkbGVuOyBpICs9IDEpIHtcbiAgICAgICAgICBfYmFzZTY0ICs9ICc9JztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBfdGhpcy50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF9iYXNlNjQ7XG4gICAgfTtcblxuICAgIHJldHVybiBfdGhpcztcbiAgfTtcblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBiYXNlNjREZWNvZGVJbnB1dFN0cmVhbVxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHZhciBiYXNlNjREZWNvZGVJbnB1dFN0cmVhbSA9IGZ1bmN0aW9uKHN0cikge1xuXG4gICAgdmFyIF9zdHIgPSBzdHI7XG4gICAgdmFyIF9wb3MgPSAwO1xuICAgIHZhciBfYnVmZmVyID0gMDtcbiAgICB2YXIgX2J1ZmxlbiA9IDA7XG5cbiAgICB2YXIgX3RoaXMgPSB7fTtcblxuICAgIF90aGlzLnJlYWQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgd2hpbGUgKF9idWZsZW4gPCA4KSB7XG5cbiAgICAgICAgaWYgKF9wb3MgPj0gX3N0ci5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAoX2J1ZmxlbiA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRocm93ICd1bmV4cGVjdGVkIGVuZCBvZiBmaWxlLi8nICsgX2J1ZmxlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjID0gX3N0ci5jaGFyQXQoX3Bvcyk7XG4gICAgICAgIF9wb3MgKz0gMTtcblxuICAgICAgICBpZiAoYyA9PSAnPScpIHtcbiAgICAgICAgICBfYnVmbGVuID0gMDtcbiAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH0gZWxzZSBpZiAoYy5tYXRjaCgvXlxccyQvKSApIHtcbiAgICAgICAgICAvLyBpZ25vcmUgaWYgd2hpdGVzcGFjZS5cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9idWZmZXIgPSAoX2J1ZmZlciA8PCA2KSB8IGRlY29kZShjLmNoYXJDb2RlQXQoMCkgKTtcbiAgICAgICAgX2J1ZmxlbiArPSA2O1xuICAgICAgfVxuXG4gICAgICB2YXIgbiA9IChfYnVmZmVyID4+PiAoX2J1ZmxlbiAtIDgpICkgJiAweGZmO1xuICAgICAgX2J1ZmxlbiAtPSA4O1xuICAgICAgcmV0dXJuIG47XG4gICAgfTtcblxuICAgIHZhciBkZWNvZGUgPSBmdW5jdGlvbihjKSB7XG4gICAgICBpZiAoMHg0MSA8PSBjICYmIGMgPD0gMHg1YSkge1xuICAgICAgICByZXR1cm4gYyAtIDB4NDE7XG4gICAgICB9IGVsc2UgaWYgKDB4NjEgPD0gYyAmJiBjIDw9IDB4N2EpIHtcbiAgICAgICAgcmV0dXJuIGMgLSAweDYxICsgMjY7XG4gICAgICB9IGVsc2UgaWYgKDB4MzAgPD0gYyAmJiBjIDw9IDB4MzkpIHtcbiAgICAgICAgcmV0dXJuIGMgLSAweDMwICsgNTI7XG4gICAgICB9IGVsc2UgaWYgKGMgPT0gMHgyYikge1xuICAgICAgICByZXR1cm4gNjI7XG4gICAgICB9IGVsc2UgaWYgKGMgPT0gMHgyZikge1xuICAgICAgICByZXR1cm4gNjM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyAnYzonICsgYztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9O1xuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIGdpZkltYWdlIChCL1cpXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgdmFyIGdpZkltYWdlID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xuXG4gICAgdmFyIF93aWR0aCA9IHdpZHRoO1xuICAgIHZhciBfaGVpZ2h0ID0gaGVpZ2h0O1xuICAgIHZhciBfZGF0YSA9IG5ldyBBcnJheSh3aWR0aCAqIGhlaWdodCk7XG5cbiAgICB2YXIgX3RoaXMgPSB7fTtcblxuICAgIF90aGlzLnNldFBpeGVsID0gZnVuY3Rpb24oeCwgeSwgcGl4ZWwpIHtcbiAgICAgIF9kYXRhW3kgKiBfd2lkdGggKyB4XSA9IHBpeGVsO1xuICAgIH07XG5cbiAgICBfdGhpcy53cml0ZSA9IGZ1bmN0aW9uKG91dCkge1xuXG4gICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgLy8gR0lGIFNpZ25hdHVyZVxuXG4gICAgICBvdXQud3JpdGVTdHJpbmcoJ0dJRjg3YScpO1xuXG4gICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgLy8gU2NyZWVuIERlc2NyaXB0b3JcblxuICAgICAgb3V0LndyaXRlU2hvcnQoX3dpZHRoKTtcbiAgICAgIG91dC53cml0ZVNob3J0KF9oZWlnaHQpO1xuXG4gICAgICBvdXQud3JpdGVCeXRlKDB4ODApOyAvLyAyYml0XG4gICAgICBvdXQud3JpdGVCeXRlKDApO1xuICAgICAgb3V0LndyaXRlQnl0ZSgwKTtcblxuICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIC8vIEdsb2JhbCBDb2xvciBNYXBcblxuICAgICAgLy8gYmxhY2tcbiAgICAgIG91dC53cml0ZUJ5dGUoMHgwMCk7XG4gICAgICBvdXQud3JpdGVCeXRlKDB4MDApO1xuICAgICAgb3V0LndyaXRlQnl0ZSgweDAwKTtcblxuICAgICAgLy8gd2hpdGVcbiAgICAgIG91dC53cml0ZUJ5dGUoMHhmZik7XG4gICAgICBvdXQud3JpdGVCeXRlKDB4ZmYpO1xuICAgICAgb3V0LndyaXRlQnl0ZSgweGZmKTtcblxuICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIC8vIEltYWdlIERlc2NyaXB0b3JcblxuICAgICAgb3V0LndyaXRlU3RyaW5nKCcsJyk7XG4gICAgICBvdXQud3JpdGVTaG9ydCgwKTtcbiAgICAgIG91dC53cml0ZVNob3J0KDApO1xuICAgICAgb3V0LndyaXRlU2hvcnQoX3dpZHRoKTtcbiAgICAgIG91dC53cml0ZVNob3J0KF9oZWlnaHQpO1xuICAgICAgb3V0LndyaXRlQnl0ZSgwKTtcblxuICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIC8vIExvY2FsIENvbG9yIE1hcFxuXG4gICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgLy8gUmFzdGVyIERhdGFcblxuICAgICAgdmFyIGx6d01pbkNvZGVTaXplID0gMjtcbiAgICAgIHZhciByYXN0ZXIgPSBnZXRMWldSYXN0ZXIobHp3TWluQ29kZVNpemUpO1xuXG4gICAgICBvdXQud3JpdGVCeXRlKGx6d01pbkNvZGVTaXplKTtcblxuICAgICAgdmFyIG9mZnNldCA9IDA7XG5cbiAgICAgIHdoaWxlIChyYXN0ZXIubGVuZ3RoIC0gb2Zmc2V0ID4gMjU1KSB7XG4gICAgICAgIG91dC53cml0ZUJ5dGUoMjU1KTtcbiAgICAgICAgb3V0LndyaXRlQnl0ZXMocmFzdGVyLCBvZmZzZXQsIDI1NSk7XG4gICAgICAgIG9mZnNldCArPSAyNTU7XG4gICAgICB9XG5cbiAgICAgIG91dC53cml0ZUJ5dGUocmFzdGVyLmxlbmd0aCAtIG9mZnNldCk7XG4gICAgICBvdXQud3JpdGVCeXRlcyhyYXN0ZXIsIG9mZnNldCwgcmFzdGVyLmxlbmd0aCAtIG9mZnNldCk7XG4gICAgICBvdXQud3JpdGVCeXRlKDB4MDApO1xuXG4gICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgLy8gR0lGIFRlcm1pbmF0b3JcbiAgICAgIG91dC53cml0ZVN0cmluZygnOycpO1xuICAgIH07XG5cbiAgICB2YXIgYml0T3V0cHV0U3RyZWFtID0gZnVuY3Rpb24ob3V0KSB7XG5cbiAgICAgIHZhciBfb3V0ID0gb3V0O1xuICAgICAgdmFyIF9iaXRMZW5ndGggPSAwO1xuICAgICAgdmFyIF9iaXRCdWZmZXIgPSAwO1xuXG4gICAgICB2YXIgX3RoaXMgPSB7fTtcblxuICAgICAgX3RoaXMud3JpdGUgPSBmdW5jdGlvbihkYXRhLCBsZW5ndGgpIHtcblxuICAgICAgICBpZiAoIChkYXRhID4+PiBsZW5ndGgpICE9IDApIHtcbiAgICAgICAgICB0aHJvdyAnbGVuZ3RoIG92ZXInO1xuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUgKF9iaXRMZW5ndGggKyBsZW5ndGggPj0gOCkge1xuICAgICAgICAgIF9vdXQud3JpdGVCeXRlKDB4ZmYgJiAoIChkYXRhIDw8IF9iaXRMZW5ndGgpIHwgX2JpdEJ1ZmZlcikgKTtcbiAgICAgICAgICBsZW5ndGggLT0gKDggLSBfYml0TGVuZ3RoKTtcbiAgICAgICAgICBkYXRhID4+Pj0gKDggLSBfYml0TGVuZ3RoKTtcbiAgICAgICAgICBfYml0QnVmZmVyID0gMDtcbiAgICAgICAgICBfYml0TGVuZ3RoID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIF9iaXRCdWZmZXIgPSAoZGF0YSA8PCBfYml0TGVuZ3RoKSB8IF9iaXRCdWZmZXI7XG4gICAgICAgIF9iaXRMZW5ndGggPSBfYml0TGVuZ3RoICsgbGVuZ3RoO1xuICAgICAgfTtcblxuICAgICAgX3RoaXMuZmx1c2ggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKF9iaXRMZW5ndGggPiAwKSB7XG4gICAgICAgICAgX291dC53cml0ZUJ5dGUoX2JpdEJ1ZmZlcik7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBfdGhpcztcbiAgICB9O1xuXG4gICAgdmFyIGdldExaV1Jhc3RlciA9IGZ1bmN0aW9uKGx6d01pbkNvZGVTaXplKSB7XG5cbiAgICAgIHZhciBjbGVhckNvZGUgPSAxIDw8IGx6d01pbkNvZGVTaXplO1xuICAgICAgdmFyIGVuZENvZGUgPSAoMSA8PCBsendNaW5Db2RlU2l6ZSkgKyAxO1xuICAgICAgdmFyIGJpdExlbmd0aCA9IGx6d01pbkNvZGVTaXplICsgMTtcblxuICAgICAgLy8gU2V0dXAgTFpXVGFibGVcbiAgICAgIHZhciB0YWJsZSA9IGx6d1RhYmxlKCk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2xlYXJDb2RlOyBpICs9IDEpIHtcbiAgICAgICAgdGFibGUuYWRkKFN0cmluZy5mcm9tQ2hhckNvZGUoaSkgKTtcbiAgICAgIH1cbiAgICAgIHRhYmxlLmFkZChTdHJpbmcuZnJvbUNoYXJDb2RlKGNsZWFyQ29kZSkgKTtcbiAgICAgIHRhYmxlLmFkZChTdHJpbmcuZnJvbUNoYXJDb2RlKGVuZENvZGUpICk7XG5cbiAgICAgIHZhciBieXRlT3V0ID0gYnl0ZUFycmF5T3V0cHV0U3RyZWFtKCk7XG4gICAgICB2YXIgYml0T3V0ID0gYml0T3V0cHV0U3RyZWFtKGJ5dGVPdXQpO1xuXG4gICAgICAvLyBjbGVhciBjb2RlXG4gICAgICBiaXRPdXQud3JpdGUoY2xlYXJDb2RlLCBiaXRMZW5ndGgpO1xuXG4gICAgICB2YXIgZGF0YUluZGV4ID0gMDtcblxuICAgICAgdmFyIHMgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKF9kYXRhW2RhdGFJbmRleF0pO1xuICAgICAgZGF0YUluZGV4ICs9IDE7XG5cbiAgICAgIHdoaWxlIChkYXRhSW5kZXggPCBfZGF0YS5sZW5ndGgpIHtcblxuICAgICAgICB2YXIgYyA9IFN0cmluZy5mcm9tQ2hhckNvZGUoX2RhdGFbZGF0YUluZGV4XSk7XG4gICAgICAgIGRhdGFJbmRleCArPSAxO1xuXG4gICAgICAgIGlmICh0YWJsZS5jb250YWlucyhzICsgYykgKSB7XG5cbiAgICAgICAgICBzID0gcyArIGM7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgIGJpdE91dC53cml0ZSh0YWJsZS5pbmRleE9mKHMpLCBiaXRMZW5ndGgpO1xuXG4gICAgICAgICAgaWYgKHRhYmxlLnNpemUoKSA8IDB4ZmZmKSB7XG5cbiAgICAgICAgICAgIGlmICh0YWJsZS5zaXplKCkgPT0gKDEgPDwgYml0TGVuZ3RoKSApIHtcbiAgICAgICAgICAgICAgYml0TGVuZ3RoICs9IDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRhYmxlLmFkZChzICsgYyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcyA9IGM7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYml0T3V0LndyaXRlKHRhYmxlLmluZGV4T2YocyksIGJpdExlbmd0aCk7XG5cbiAgICAgIC8vIGVuZCBjb2RlXG4gICAgICBiaXRPdXQud3JpdGUoZW5kQ29kZSwgYml0TGVuZ3RoKTtcblxuICAgICAgYml0T3V0LmZsdXNoKCk7XG5cbiAgICAgIHJldHVybiBieXRlT3V0LnRvQnl0ZUFycmF5KCk7XG4gICAgfTtcblxuICAgIHZhciBsendUYWJsZSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICB2YXIgX21hcCA9IHt9O1xuICAgICAgdmFyIF9zaXplID0gMDtcblxuICAgICAgdmFyIF90aGlzID0ge307XG5cbiAgICAgIF90aGlzLmFkZCA9IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBpZiAoX3RoaXMuY29udGFpbnMoa2V5KSApIHtcbiAgICAgICAgICB0aHJvdyAnZHVwIGtleTonICsga2V5O1xuICAgICAgICB9XG4gICAgICAgIF9tYXBba2V5XSA9IF9zaXplO1xuICAgICAgICBfc2l6ZSArPSAxO1xuICAgICAgfTtcblxuICAgICAgX3RoaXMuc2l6ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gX3NpemU7XG4gICAgICB9O1xuXG4gICAgICBfdGhpcy5pbmRleE9mID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHJldHVybiBfbWFwW2tleV07XG4gICAgICB9O1xuXG4gICAgICBfdGhpcy5jb250YWlucyA9IGZ1bmN0aW9uKGtleSkge1xuICAgICAgICByZXR1cm4gdHlwZW9mIF9tYXBba2V5XSAhPSAndW5kZWZpbmVkJztcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBfdGhpcztcbiAgICB9O1xuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9O1xuXG4gIHZhciBjcmVhdGVEYXRhVVJMID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCwgZ2V0UGl4ZWwpIHtcbiAgICB2YXIgZ2lmID0gZ2lmSW1hZ2Uod2lkdGgsIGhlaWdodCk7XG4gICAgZm9yICh2YXIgeSA9IDA7IHkgPCBoZWlnaHQ7IHkgKz0gMSkge1xuICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB3aWR0aDsgeCArPSAxKSB7XG4gICAgICAgIGdpZi5zZXRQaXhlbCh4LCB5LCBnZXRQaXhlbCh4LCB5KSApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBiID0gYnl0ZUFycmF5T3V0cHV0U3RyZWFtKCk7XG4gICAgZ2lmLndyaXRlKGIpO1xuXG4gICAgdmFyIGJhc2U2NCA9IGJhc2U2NEVuY29kZU91dHB1dFN0cmVhbSgpO1xuICAgIHZhciBieXRlcyA9IGIudG9CeXRlQXJyYXkoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBiYXNlNjQud3JpdGVCeXRlKGJ5dGVzW2ldKTtcbiAgICB9XG4gICAgYmFzZTY0LmZsdXNoKCk7XG5cbiAgICByZXR1cm4gJ2RhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCwnICsgYmFzZTY0O1xuICB9O1xuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIHJldHVybnMgcXJjb2RlIGZ1bmN0aW9uLlxuXG4gIHJldHVybiBxcmNvZGU7XG59KCk7XG5cbi8vIG11bHRpYnl0ZSBzdXBwb3J0XG4hZnVuY3Rpb24oKSB7XG5cbiAgcXJjb2RlLnN0cmluZ1RvQnl0ZXNGdW5jc1snVVRGLTgnXSA9IGZ1bmN0aW9uKHMpIHtcbiAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE4NzI5NDA1L2hvdy10by1jb252ZXJ0LXV0Zjgtc3RyaW5nLXRvLWJ5dGUtYXJyYXlcbiAgICBmdW5jdGlvbiB0b1VURjhBcnJheShzdHIpIHtcbiAgICAgIHZhciB1dGY4ID0gW107XG4gICAgICBmb3IgKHZhciBpPTA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoYXJjb2RlID0gc3RyLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGlmIChjaGFyY29kZSA8IDB4ODApIHV0ZjgucHVzaChjaGFyY29kZSk7XG4gICAgICAgIGVsc2UgaWYgKGNoYXJjb2RlIDwgMHg4MDApIHtcbiAgICAgICAgICB1dGY4LnB1c2goMHhjMCB8IChjaGFyY29kZSA+PiA2KSxcbiAgICAgICAgICAgICAgMHg4MCB8IChjaGFyY29kZSAmIDB4M2YpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjaGFyY29kZSA8IDB4ZDgwMCB8fCBjaGFyY29kZSA+PSAweGUwMDApIHtcbiAgICAgICAgICB1dGY4LnB1c2goMHhlMCB8IChjaGFyY29kZSA+PiAxMiksXG4gICAgICAgICAgICAgIDB4ODAgfCAoKGNoYXJjb2RlPj42KSAmIDB4M2YpLFxuICAgICAgICAgICAgICAweDgwIHwgKGNoYXJjb2RlICYgMHgzZikpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHN1cnJvZ2F0ZSBwYWlyXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGkrKztcbiAgICAgICAgICAvLyBVVEYtMTYgZW5jb2RlcyAweDEwMDAwLTB4MTBGRkZGIGJ5XG4gICAgICAgICAgLy8gc3VidHJhY3RpbmcgMHgxMDAwMCBhbmQgc3BsaXR0aW5nIHRoZVxuICAgICAgICAgIC8vIDIwIGJpdHMgb2YgMHgwLTB4RkZGRkYgaW50byB0d28gaGFsdmVzXG4gICAgICAgICAgY2hhcmNvZGUgPSAweDEwMDAwICsgKCgoY2hhcmNvZGUgJiAweDNmZik8PDEwKVxuICAgICAgICAgICAgfCAoc3RyLmNoYXJDb2RlQXQoaSkgJiAweDNmZikpO1xuICAgICAgICAgIHV0ZjgucHVzaCgweGYwIHwgKGNoYXJjb2RlID4+MTgpLFxuICAgICAgICAgICAgICAweDgwIHwgKChjaGFyY29kZT4+MTIpICYgMHgzZiksXG4gICAgICAgICAgICAgIDB4ODAgfCAoKGNoYXJjb2RlPj42KSAmIDB4M2YpLFxuICAgICAgICAgICAgICAweDgwIHwgKGNoYXJjb2RlICYgMHgzZikpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdXRmODtcbiAgICB9XG4gICAgcmV0dXJuIHRvVVRGOEFycmF5KHMpO1xuICB9O1xuXG59KCk7XG5cbihmdW5jdGlvbiAoZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICBkZWZpbmUoW10sIGZhY3RvcnkpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gIH1cbn0oZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBxcmNvZGU7XG59KSk7XG4iLCJpbXBvcnQgeyBDb3JuZXJEb3RUeXBlcyB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGRvdDogXCJkb3RcIixcbiAgc3F1YXJlOiBcInNxdWFyZVwiLFxuICBzdGFyOiBcInN0YXJcIixcbiAgcGx1czogXCJwbHVzXCIsXG4gIHNxdWFyZVJvdW5kZWQ6IFwic3F1YXJlLXJvdW5kZWRcIixcbiAgcmlnaHRCb3R0b21TcXVhcmU6IFwic3F1YXJlLXJpZ2h0LWJvdHRvbVwiLFxuICBsZWFmOiBcImxlYWZcIixcbiAgbGVmdFRvcENpcmNsZTogXCJjaXJjbGUtbGVmdC10b3BcIixcbiAgcmlnaHRCb3R0b21DaXJjbGU6IFwiY2lyY2xlLXJpZ2h0LWJvdHRvbVwiLFxuICBkaWFtb25kOiBcImRpYW1vbmRcIixcbiAgY3Jvc3M6IFwiY3Jvc3NcIixcbiAgcmhvbWJ1czogXCJyaG9tYnVzXCJcbn0gYXMgQ29ybmVyRG90VHlwZXM7XG4iLCJpbXBvcnQgeyBDb3JuZXJTcXVhcmVUeXBlcyB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGRvdDogXCJkb3RcIixcbiAgc3F1YXJlOiBcInNxdWFyZVwiLFxuICBkb3R0ZWRTcXVhcmU6XCJkb3R0ZWQtc3F1YXJlXCIsXG4gIGV4dHJhUm91bmRlZDogXCJleHRyYS1yb3VuZGVkXCIsXG4gIHJpZ2h0Qm90dG9tU3F1YXJlOiBcInJpZ2h0LWJvdHRvbS1zcXVhcmVcIixcbiAgbGVmdFRvcFNxdWFyZTogXCJsZWZ0LXRvcC1zcXVhcmVcIixcbiAgbGVmdFRvcENpcmNsZTogXCJjaXJjbGUtbGVmdC10b3BcIixcbiAgcmlnaHRCb3R0b21DaXJjbGU6IFwiY2lyY2xlLXJpZ2h0LWJvdHRvbVwiLFxuICBjaXJjbGVJblNxdWFyZTogXCJjaXJjbGUtaW4tc3F1YXJlXCIsXG4gIHBlYW51dDogXCJwZWFudXRcIixcbiAgLy8gcGFyYWdvbmFsOiBcInBhcmFnb25hbFwiLFxufSBhcyBDb3JuZXJTcXVhcmVUeXBlcztcbiIsImltcG9ydCB7IERvdFR5cGVzIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgZG90czogXCJkb3RzXCIsXG4gIHJvdW5kZWQ6IFwicm91bmRlZFwiLFxuICBjbGFzc3k6IFwiY2xhc3N5XCIsXG4gIGNsYXNzeVJvdW5kZWQ6IFwiY2xhc3N5LXJvdW5kZWRcIixcbiAgc3F1YXJlOiBcInNxdWFyZVwiLFxuICBleHRyYVJvdW5kZWQ6IFwiZXh0cmEtcm91bmRlZFwiLFxuICBzdGFyOiBcInN0YXJcIixcbn0gYXMgRG90VHlwZXM7XG4iLCJpbXBvcnQgeyBEcmF3VHlwZXMgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBjYW52YXM6IFwiY2FudmFzXCIsXG4gIHN2ZzogXCJzdmdcIlxufSBhcyBEcmF3VHlwZXM7XG4iLCJpbXBvcnQgeyBFcnJvckNvcnJlY3Rpb25MZXZlbCB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5pbnRlcmZhY2UgRXJyb3JDb3JyZWN0aW9uTGV2ZWxzIHtcbiAgW2tleTogc3RyaW5nXTogRXJyb3JDb3JyZWN0aW9uTGV2ZWw7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgTDogXCJMXCIsXG4gIE06IFwiTVwiLFxuICBROiBcIlFcIixcbiAgSDogXCJIXCJcbn0gYXMgRXJyb3JDb3JyZWN0aW9uTGV2ZWxzO1xuIiwiaW50ZXJmYWNlIEVycm9yQ29ycmVjdGlvblBlcmNlbnRzIHtcbiAgW2tleTogc3RyaW5nXTogbnVtYmVyO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIEw6IDAuMDcsXG4gIE06IDAuMTUsXG4gIFE6IDAuMjUsXG4gIEg6IDAuM1xufSBhcyBFcnJvckNvcnJlY3Rpb25QZXJjZW50cztcbiIsImltcG9ydCB7IEdyYWRpZW50VHlwZXMgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuICByYWRpYWw6IFwicmFkaWFsXCIsXG4gIGxpbmVhcjogXCJsaW5lYXJcIlxufSBhcyBHcmFkaWVudFR5cGVzO1xuIiwiaW1wb3J0IHsgTW9kZSB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5pbnRlcmZhY2UgTW9kZXMge1xuICBba2V5OiBzdHJpbmddOiBNb2RlO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG51bWVyaWM6IFwiTnVtZXJpY1wiLFxuICBhbHBoYW51bWVyaWM6IFwiQWxwaGFudW1lcmljXCIsXG4gIGJ5dGU6IFwiQnl0ZVwiLFxuICBrYW5qaTogXCJLYW5qaVwiXG59IGFzIE1vZGVzO1xuIiwiaW1wb3J0IHsgVHlwZU51bWJlciB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5pbnRlcmZhY2UgVHlwZXNNYXAge1xuICBba2V5OiBudW1iZXJdOiBUeXBlTnVtYmVyO1xufVxuXG5jb25zdCBxclR5cGVzOiBUeXBlc01hcCA9IHt9O1xuXG5mb3IgKGxldCB0eXBlID0gMDsgdHlwZSA8PSA0MDsgdHlwZSsrKSB7XG4gIHFyVHlwZXNbdHlwZV0gPSB0eXBlIGFzIFR5cGVOdW1iZXI7XG59XG5cbi8vIDAgdHlwZXMgaXMgYXV0b2RldGVjdFxuXG4vLyB0eXBlcyA9IHtcbi8vICAgICAwOiAwLFxuLy8gICAgIDE6IDEsXG4vLyAgICAgLi4uXG4vLyAgICAgNDA6IDQwXG4vLyB9XG5cbmV4cG9ydCBkZWZhdWx0IHFyVHlwZXM7XG4iLCJpbXBvcnQgY2FsY3VsYXRlSW1hZ2VTaXplIGZyb20gXCIuLi90b29scy9jYWxjdWxhdGVJbWFnZVNpemVcIjtcbmltcG9ydCBlcnJvckNvcnJlY3Rpb25QZXJjZW50cyBmcm9tIFwiLi4vY29uc3RhbnRzL2Vycm9yQ29ycmVjdGlvblBlcmNlbnRzXCI7XG5pbXBvcnQgUVJEb3QgZnJvbSBcIi4uL2ZpZ3VyZXMvZG90L2NhbnZhcy9RUkRvdFwiO1xuaW1wb3J0IFFSQ29ybmVyU3F1YXJlIGZyb20gXCIuLi9maWd1cmVzL2Nvcm5lclNxdWFyZS9jYW52YXMvUVJDb3JuZXJTcXVhcmVcIjtcbmltcG9ydCBRUkNvcm5lckRvdCBmcm9tIFwiLi4vZmlndXJlcy9jb3JuZXJEb3QvY2FudmFzL1FSQ29ybmVyRG90XCI7XG5pbXBvcnQgeyBSZXF1aXJlZE9wdGlvbnMgfSBmcm9tIFwiLi9RUk9wdGlvbnNcIjtcbmltcG9ydCBncmFkaWVudFR5cGVzIGZyb20gXCIuLi9jb25zdGFudHMvZ3JhZGllbnRUeXBlc1wiO1xuaW1wb3J0IHsgUVJDb2RlLCBHcmFkaWVudCwgRmlsdGVyRnVuY3Rpb24gfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuY29uc3Qgc3F1YXJlTWFzayA9IFtcbiAgWzEsIDEsIDEsIDEsIDEsIDEsIDFdLFxuICBbMSwgMCwgMCwgMCwgMCwgMCwgMV0sXG4gIFsxLCAwLCAwLCAwLCAwLCAwLCAxXSxcbiAgWzEsIDAsIDAsIDAsIDAsIDAsIDFdLFxuICBbMSwgMCwgMCwgMCwgMCwgMCwgMV0sXG4gIFsxLCAwLCAwLCAwLCAwLCAwLCAxXSxcbiAgWzEsIDEsIDEsIDEsIDEsIDEsIDFdXG5dO1xuXG5jb25zdCBkb3RNYXNrID0gW1xuICBbMCwgMCwgMCwgMCwgMCwgMCwgMF0sXG4gIFswLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgWzAsIDAsIDEsIDEsIDEsIDAsIDBdLFxuICBbMCwgMCwgMSwgMSwgMSwgMCwgMF0sXG4gIFswLCAwLCAxLCAxLCAxLCAwLCAwXSxcbiAgWzAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICBbMCwgMCwgMCwgMCwgMCwgMCwgMF1cbl07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFFSQ2FudmFzIHtcbiAgX2NhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XG4gIF9vcHRpb25zOiBSZXF1aXJlZE9wdGlvbnM7XG4gIF9xcj86IFFSQ29kZTtcbiAgX2ltYWdlPzogSFRNTEltYWdlRWxlbWVudDtcblxuICAvL1RPRE8gZG9uJ3QgcGFzcyBhbGwgb3B0aW9ucyB0byB0aGlzIGNsYXNzXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IFJlcXVpcmVkT3B0aW9ucykge1xuICAgIHRoaXMuX2NhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgdGhpcy5fY2FudmFzLndpZHRoID0gb3B0aW9ucy53aWR0aDtcbiAgICB0aGlzLl9jYW52YXMuaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHQ7XG4gICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cblxuICBnZXQgY29udGV4dCgpOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgfVxuXG4gIGdldCB3aWR0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9jYW52YXMud2lkdGg7XG4gIH1cblxuICBnZXQgaGVpZ2h0KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2NhbnZhcy5oZWlnaHQ7XG4gIH1cblxuICBnZXRDYW52YXMoKTogSFRNTENhbnZhc0VsZW1lbnQge1xuICAgIHJldHVybiB0aGlzLl9jYW52YXM7XG4gIH1cblxuICBjbGVhcigpOiB2b2lkIHtcbiAgICBjb25zdCBjYW52YXNDb250ZXh0ID0gdGhpcy5jb250ZXh0O1xuXG4gICAgaWYgKGNhbnZhc0NvbnRleHQpIHtcbiAgICAgIGNhbnZhc0NvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMuX2NhbnZhcy53aWR0aCwgdGhpcy5fY2FudmFzLmhlaWdodCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZHJhd1FSKHFyOiBRUkNvZGUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBjb3VudCA9IHFyLmdldE1vZHVsZUNvdW50KCk7XG4gICAgY29uc3QgbWluU2l6ZSA9IE1hdGgubWluKHRoaXMuX29wdGlvbnMud2lkdGgsIHRoaXMuX29wdGlvbnMuaGVpZ2h0KSAtIHRoaXMuX29wdGlvbnMubWFyZ2luICogMjtcbiAgICBjb25zdCBkb3RTaXplID0gTWF0aC5mbG9vcihtaW5TaXplIC8gY291bnQpO1xuICAgIGxldCBkcmF3SW1hZ2VTaXplID0ge1xuICAgICAgaGlkZVhEb3RzOiAwLFxuICAgICAgaGlkZVlEb3RzOiAwLFxuICAgICAgd2lkdGg6IDAsXG4gICAgICBoZWlnaHQ6IDBcbiAgICB9O1xuXG4gICAgdGhpcy5fcXIgPSBxcjtcblxuICAgIGlmICh0aGlzLl9vcHRpb25zLmltYWdlKSB7XG4gICAgICBhd2FpdCB0aGlzLmxvYWRJbWFnZSgpO1xuICAgICAgaWYgKCF0aGlzLl9pbWFnZSkgcmV0dXJuO1xuICAgICAgY29uc3QgeyBpbWFnZU9wdGlvbnMsIHFyT3B0aW9ucyB9ID0gdGhpcy5fb3B0aW9ucztcbiAgICAgIGNvbnN0IGNvdmVyTGV2ZWwgPSBpbWFnZU9wdGlvbnMuaW1hZ2VTaXplICogZXJyb3JDb3JyZWN0aW9uUGVyY2VudHNbcXJPcHRpb25zLmVycm9yQ29ycmVjdGlvbkxldmVsXTtcbiAgICAgIGNvbnN0IG1heEhpZGRlbkRvdHMgPSBNYXRoLmZsb29yKGNvdmVyTGV2ZWwgKiBjb3VudCAqIGNvdW50KTtcblxuICAgICAgZHJhd0ltYWdlU2l6ZSA9IGNhbGN1bGF0ZUltYWdlU2l6ZSh7XG4gICAgICAgIG9yaWdpbmFsV2lkdGg6IHRoaXMuX2ltYWdlLndpZHRoLFxuICAgICAgICBvcmlnaW5hbEhlaWdodDogdGhpcy5faW1hZ2UuaGVpZ2h0LFxuICAgICAgICBtYXhIaWRkZW5Eb3RzLFxuICAgICAgICBtYXhIaWRkZW5BeGlzRG90czogY291bnQgLSAxNCxcbiAgICAgICAgZG90U2l6ZVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5jbGVhcigpO1xuICAgIHRoaXMuZHJhd0JhY2tncm91bmQoKTtcbiAgICB0aGlzLmRyYXdEb3RzKChpOiBudW1iZXIsIGo6IG51bWJlcik6IGJvb2xlYW4gPT4ge1xuICAgICAgaWYgKHRoaXMuX29wdGlvbnMuaW1hZ2VPcHRpb25zLmhpZGVCYWNrZ3JvdW5kRG90cykge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgaSA+PSAoY291bnQgLSBkcmF3SW1hZ2VTaXplLmhpZGVYRG90cykgLyAyICYmXG4gICAgICAgICAgaSA8IChjb3VudCArIGRyYXdJbWFnZVNpemUuaGlkZVhEb3RzKSAvIDIgJiZcbiAgICAgICAgICBqID49IChjb3VudCAtIGRyYXdJbWFnZVNpemUuaGlkZVlEb3RzKSAvIDIgJiZcbiAgICAgICAgICBqIDwgKGNvdW50ICsgZHJhd0ltYWdlU2l6ZS5oaWRlWURvdHMpIC8gMlxuICAgICAgICApIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHNxdWFyZU1hc2tbaV0/LltqXSB8fCBzcXVhcmVNYXNrW2kgLSBjb3VudCArIDddPy5bal0gfHwgc3F1YXJlTWFza1tpXT8uW2ogLSBjb3VudCArIDddKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGRvdE1hc2tbaV0/LltqXSB8fCBkb3RNYXNrW2kgLSBjb3VudCArIDddPy5bal0gfHwgZG90TWFza1tpXT8uW2ogLSBjb3VudCArIDddKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gICAgdGhpcy5kcmF3Q29ybmVycygpO1xuXG4gICAgaWYgKHRoaXMuX29wdGlvbnMuaW1hZ2UpIHtcbiAgICAgIHRoaXMuZHJhd0ltYWdlKHsgd2lkdGg6IGRyYXdJbWFnZVNpemUud2lkdGgsIGhlaWdodDogZHJhd0ltYWdlU2l6ZS5oZWlnaHQsIGNvdW50LCBkb3RTaXplIH0pO1xuICAgIH1cbiAgfVxuXG4gIGRyYXdCYWNrZ3JvdW5kKCk6IHZvaWQge1xuICAgIGNvbnN0IGNhbnZhc0NvbnRleHQgPSB0aGlzLmNvbnRleHQ7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuX29wdGlvbnM7XG5cbiAgICBpZiAoY2FudmFzQ29udGV4dCkge1xuICAgICAgaWYgKG9wdGlvbnMuYmFja2dyb3VuZE9wdGlvbnMuZ3JhZGllbnQpIHtcbiAgICAgICAgY29uc3QgZ3JhZGllbnRPcHRpb25zID0gb3B0aW9ucy5iYWNrZ3JvdW5kT3B0aW9ucy5ncmFkaWVudDtcbiAgICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9jcmVhdGVHcmFkaWVudCh7XG4gICAgICAgICAgY29udGV4dDogY2FudmFzQ29udGV4dCxcbiAgICAgICAgICBvcHRpb25zOiBncmFkaWVudE9wdGlvbnMsXG4gICAgICAgICAgYWRkaXRpb25hbFJvdGF0aW9uOiAwLFxuICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgeTogMCxcbiAgICAgICAgICBzaXplOiB0aGlzLl9jYW52YXMud2lkdGggPiB0aGlzLl9jYW52YXMuaGVpZ2h0ID8gdGhpcy5fY2FudmFzLndpZHRoIDogdGhpcy5fY2FudmFzLmhlaWdodFxuICAgICAgICB9KTtcblxuICAgICAgICBncmFkaWVudE9wdGlvbnMuY29sb3JTdG9wcy5mb3JFYWNoKCh7IG9mZnNldCwgY29sb3IgfTogeyBvZmZzZXQ6IG51bWJlcjsgY29sb3I6IHN0cmluZyB9KSA9PiB7XG4gICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKG9mZnNldCwgY29sb3IpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjYW52YXNDb250ZXh0LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmJhY2tncm91bmRPcHRpb25zLmNvbG9yKSB7XG4gICAgICAgIGNhbnZhc0NvbnRleHQuZmlsbFN0eWxlID0gb3B0aW9ucy5iYWNrZ3JvdW5kT3B0aW9ucy5jb2xvcjtcbiAgICAgIH1cbiAgICAgIGNhbnZhc0NvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy5fY2FudmFzLndpZHRoLCB0aGlzLl9jYW52YXMuaGVpZ2h0KTtcbiAgICB9XG4gIH1cblxuICBkcmF3RG90cyhmaWx0ZXI/OiBGaWx0ZXJGdW5jdGlvbik6IHZvaWQge1xuICAgIGlmICghdGhpcy5fcXIpIHtcbiAgICAgIHRocm93IFwiUVIgY29kZSBpcyBub3QgZGVmaW5lZFwiO1xuICAgIH1cblxuICAgIGNvbnN0IGNhbnZhc0NvbnRleHQgPSB0aGlzLmNvbnRleHQ7XG5cbiAgICBpZiAoIWNhbnZhc0NvbnRleHQpIHtcbiAgICAgIHRocm93IFwiUVIgY29kZSBpcyBub3QgZGVmaW5lZFwiO1xuICAgIH1cblxuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLl9vcHRpb25zO1xuICAgIGNvbnN0IGNvdW50ID0gdGhpcy5fcXIuZ2V0TW9kdWxlQ291bnQoKTtcblxuICAgIGlmIChjb3VudCA+IG9wdGlvbnMud2lkdGggfHwgY291bnQgPiBvcHRpb25zLmhlaWdodCkge1xuICAgICAgdGhyb3cgXCJUaGUgY2FudmFzIGlzIHRvbyBzbWFsbC5cIjtcbiAgICB9XG5cbiAgICBjb25zdCBtaW5TaXplID0gTWF0aC5taW4ob3B0aW9ucy53aWR0aCwgb3B0aW9ucy5oZWlnaHQpIC0gb3B0aW9ucy5tYXJnaW4gKiAyO1xuICAgIGNvbnN0IGRvdFNpemUgPSBNYXRoLmZsb29yKG1pblNpemUgLyBjb3VudCk7XG4gICAgY29uc3QgeEJlZ2lubmluZyA9IE1hdGguZmxvb3IoKG9wdGlvbnMud2lkdGggLSBjb3VudCAqIGRvdFNpemUpIC8gMik7XG4gICAgY29uc3QgeUJlZ2lubmluZyA9IE1hdGguZmxvb3IoKG9wdGlvbnMuaGVpZ2h0IC0gY291bnQgKiBkb3RTaXplKSAvIDIpO1xuICAgIGNvbnN0IGRvdCA9IG5ldyBRUkRvdCh7IGNvbnRleHQ6IGNhbnZhc0NvbnRleHQsIHR5cGU6IG9wdGlvbnMuZG90c09wdGlvbnMudHlwZSB9KTtcblxuICAgIGNhbnZhc0NvbnRleHQuYmVnaW5QYXRoKCk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY291bnQ7IGorKykge1xuICAgICAgICBpZiAoZmlsdGVyICYmICFmaWx0ZXIoaSwgaikpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX3FyLmlzRGFyayhpLCBqKSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGRvdC5kcmF3KFxuICAgICAgICAgIHhCZWdpbm5pbmcgKyBpICogZG90U2l6ZSxcbiAgICAgICAgICB5QmVnaW5uaW5nICsgaiAqIGRvdFNpemUsXG4gICAgICAgICAgZG90U2l6ZSxcbiAgICAgICAgICAoeE9mZnNldDogbnVtYmVyLCB5T2Zmc2V0OiBudW1iZXIpOiBib29sZWFuID0+IHtcbiAgICAgICAgICAgIGlmIChpICsgeE9mZnNldCA8IDAgfHwgaiArIHlPZmZzZXQgPCAwIHx8IGkgKyB4T2Zmc2V0ID49IGNvdW50IHx8IGogKyB5T2Zmc2V0ID49IGNvdW50KSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICBpZiAoZmlsdGVyICYmICFmaWx0ZXIoaSArIHhPZmZzZXQsIGogKyB5T2Zmc2V0KSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuICEhdGhpcy5fcXIgJiYgdGhpcy5fcXIuaXNEYXJrKGkgKyB4T2Zmc2V0LCBqICsgeU9mZnNldCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmRvdHNPcHRpb25zLmdyYWRpZW50KSB7XG4gICAgICBjb25zdCBncmFkaWVudE9wdGlvbnMgPSBvcHRpb25zLmRvdHNPcHRpb25zLmdyYWRpZW50O1xuICAgICAgY29uc3QgZ3JhZGllbnQgPSB0aGlzLl9jcmVhdGVHcmFkaWVudCh7XG4gICAgICAgIGNvbnRleHQ6IGNhbnZhc0NvbnRleHQsXG4gICAgICAgIG9wdGlvbnM6IGdyYWRpZW50T3B0aW9ucyxcbiAgICAgICAgYWRkaXRpb25hbFJvdGF0aW9uOiAwLFxuICAgICAgICB4OiB4QmVnaW5uaW5nLFxuICAgICAgICB5OiB5QmVnaW5uaW5nLFxuICAgICAgICBzaXplOiBjb3VudCAqIGRvdFNpemVcbiAgICAgIH0pO1xuXG4gICAgICBncmFkaWVudE9wdGlvbnMuY29sb3JTdG9wcy5mb3JFYWNoKCh7IG9mZnNldCwgY29sb3IgfTogeyBvZmZzZXQ6IG51bWJlcjsgY29sb3I6IHN0cmluZyB9KSA9PiB7XG4gICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcChvZmZzZXQsIGNvbG9yKTtcbiAgICAgIH0pO1xuXG4gICAgICBjYW52YXNDb250ZXh0LmZpbGxTdHlsZSA9IGNhbnZhc0NvbnRleHQuc3Ryb2tlU3R5bGUgPSBncmFkaWVudDtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbnMuZG90c09wdGlvbnMuY29sb3IpIHtcbiAgICAgIGNhbnZhc0NvbnRleHQuZmlsbFN0eWxlID0gY2FudmFzQ29udGV4dC5zdHJva2VTdHlsZSA9IG9wdGlvbnMuZG90c09wdGlvbnMuY29sb3I7XG4gICAgfVxuXG4gICAgY2FudmFzQ29udGV4dC5maWxsKFwiZXZlbm9kZFwiKTtcbiAgfVxuXG4gIGRyYXdDb3JuZXJzKGZpbHRlcj86IEZpbHRlckZ1bmN0aW9uKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9xcikge1xuICAgICAgdGhyb3cgXCJRUiBjb2RlIGlzIG5vdCBkZWZpbmVkXCI7XG4gICAgfVxuXG4gICAgY29uc3QgY2FudmFzQ29udGV4dCA9IHRoaXMuY29udGV4dDtcblxuICAgIGlmICghY2FudmFzQ29udGV4dCkge1xuICAgICAgdGhyb3cgXCJRUiBjb2RlIGlzIG5vdCBkZWZpbmVkXCI7XG4gICAgfVxuXG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuX29wdGlvbnM7XG5cbiAgICBjb25zdCBjb3VudCA9IHRoaXMuX3FyLmdldE1vZHVsZUNvdW50KCk7XG4gICAgY29uc3QgbWluU2l6ZSA9IE1hdGgubWluKG9wdGlvbnMud2lkdGgsIG9wdGlvbnMuaGVpZ2h0KSAtIG9wdGlvbnMubWFyZ2luICogMjtcbiAgICBjb25zdCBkb3RTaXplID0gTWF0aC5mbG9vcihtaW5TaXplIC8gY291bnQpO1xuICAgIGNvbnN0IGNvcm5lcnNTcXVhcmVTaXplID0gZG90U2l6ZSAqIDc7XG4gICAgY29uc3QgY29ybmVyc0RvdFNpemUgPSBkb3RTaXplICogMztcbiAgICBjb25zdCB4QmVnaW5uaW5nID0gTWF0aC5mbG9vcigob3B0aW9ucy53aWR0aCAtIGNvdW50ICogZG90U2l6ZSkgLyAyKTtcbiAgICBjb25zdCB5QmVnaW5uaW5nID0gTWF0aC5mbG9vcigob3B0aW9ucy5oZWlnaHQgLSBjb3VudCAqIGRvdFNpemUpIC8gMik7XG5cbiAgICBbXG4gICAgICBbMCwgMCwgMF0sXG4gICAgICBbMSwgMCwgTWF0aC5QSSAvIDJdLFxuICAgICAgWzAsIDEsIC1NYXRoLlBJIC8gMl1cbiAgICBdLmZvckVhY2goKFtjb2x1bW4sIHJvdywgcm90YXRpb25dKSA9PiB7XG4gICAgICBpZiAoZmlsdGVyICYmICFmaWx0ZXIoY29sdW1uLCByb3cpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgeCA9IHhCZWdpbm5pbmcgKyBjb2x1bW4gKiBkb3RTaXplICogKGNvdW50IC0gNyk7XG4gICAgICBjb25zdCB5ID0geUJlZ2lubmluZyArIHJvdyAqIGRvdFNpemUgKiAoY291bnQgLSA3KTtcblxuICAgICAgaWYgKG9wdGlvbnMuY29ybmVyc1NxdWFyZU9wdGlvbnM/LnR5cGUpIHtcbiAgICAgICAgY29uc3QgY29ybmVyc1NxdWFyZSA9IG5ldyBRUkNvcm5lclNxdWFyZSh7IGNvbnRleHQ6IGNhbnZhc0NvbnRleHQsIHR5cGU6IG9wdGlvbnMuY29ybmVyc1NxdWFyZU9wdGlvbnM/LnR5cGUgfSk7XG5cbiAgICAgICAgY2FudmFzQ29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgY29ybmVyc1NxdWFyZS5kcmF3KHgsIHksIGNvcm5lcnNTcXVhcmVTaXplLCByb3RhdGlvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBkb3QgPSBuZXcgUVJEb3QoeyBjb250ZXh0OiBjYW52YXNDb250ZXh0LCB0eXBlOiBvcHRpb25zLmRvdHNPcHRpb25zLnR5cGUgfSk7XG5cbiAgICAgICAgY2FudmFzQ29udGV4dC5iZWdpblBhdGgoKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNxdWFyZU1hc2subGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNxdWFyZU1hc2tbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGlmICghc3F1YXJlTWFza1tpXT8uW2pdKSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkb3QuZHJhdyhcbiAgICAgICAgICAgICAgeCArIGkgKiBkb3RTaXplLFxuICAgICAgICAgICAgICB5ICsgaiAqIGRvdFNpemUsXG4gICAgICAgICAgICAgIGRvdFNpemUsXG4gICAgICAgICAgICAgICh4T2Zmc2V0OiBudW1iZXIsIHlPZmZzZXQ6IG51bWJlcik6IGJvb2xlYW4gPT4gISFzcXVhcmVNYXNrW2kgKyB4T2Zmc2V0XT8uW2ogKyB5T2Zmc2V0XVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMuY29ybmVyc1NxdWFyZU9wdGlvbnM/LmdyYWRpZW50KSB7XG4gICAgICAgIGNvbnN0IGdyYWRpZW50T3B0aW9ucyA9IG9wdGlvbnMuY29ybmVyc1NxdWFyZU9wdGlvbnMuZ3JhZGllbnQ7XG4gICAgICAgIGNvbnN0IGdyYWRpZW50ID0gdGhpcy5fY3JlYXRlR3JhZGllbnQoe1xuICAgICAgICAgIGNvbnRleHQ6IGNhbnZhc0NvbnRleHQsXG4gICAgICAgICAgb3B0aW9uczogZ3JhZGllbnRPcHRpb25zLFxuICAgICAgICAgIGFkZGl0aW9uYWxSb3RhdGlvbjogcm90YXRpb24sXG4gICAgICAgICAgeCxcbiAgICAgICAgICB5LFxuICAgICAgICAgIHNpemU6IGNvcm5lcnNTcXVhcmVTaXplXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGdyYWRpZW50T3B0aW9ucy5jb2xvclN0b3BzLmZvckVhY2goKHsgb2Zmc2V0LCBjb2xvciB9OiB7IG9mZnNldDogbnVtYmVyOyBjb2xvcjogc3RyaW5nIH0pID0+IHtcbiAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3Aob2Zmc2V0LCBjb2xvcik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNhbnZhc0NvbnRleHQuZmlsbFN0eWxlID0gY2FudmFzQ29udGV4dC5zdHJva2VTdHlsZSA9IGdyYWRpZW50O1xuICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmNvcm5lcnNTcXVhcmVPcHRpb25zPy5jb2xvcikge1xuICAgICAgICBjYW52YXNDb250ZXh0LmZpbGxTdHlsZSA9IGNhbnZhc0NvbnRleHQuc3Ryb2tlU3R5bGUgPSBvcHRpb25zLmNvcm5lcnNTcXVhcmVPcHRpb25zLmNvbG9yO1xuICAgICAgfVxuXG4gICAgICBjYW52YXNDb250ZXh0LmZpbGwoXCJldmVub2RkXCIpO1xuXG4gICAgICBpZiAob3B0aW9ucy5jb3JuZXJzRG90T3B0aW9ucz8udHlwZSkge1xuICAgICAgICBjb25zdCBjb3JuZXJzRG90ID0gbmV3IFFSQ29ybmVyRG90KHsgY29udGV4dDogY2FudmFzQ29udGV4dCwgdHlwZTogb3B0aW9ucy5jb3JuZXJzRG90T3B0aW9ucz8udHlwZSB9KTtcblxuICAgICAgICBjYW52YXNDb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICBjb3JuZXJzRG90LmRyYXcoeCArIGRvdFNpemUgKiAyLCB5ICsgZG90U2l6ZSAqIDIsIGNvcm5lcnNEb3RTaXplLCByb3RhdGlvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBkb3QgPSBuZXcgUVJEb3QoeyBjb250ZXh0OiBjYW52YXNDb250ZXh0LCB0eXBlOiBvcHRpb25zLmRvdHNPcHRpb25zLnR5cGUgfSk7XG5cbiAgICAgICAgY2FudmFzQ29udGV4dC5iZWdpblBhdGgoKTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRvdE1hc2subGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGRvdE1hc2tbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGlmICghZG90TWFza1tpXT8uW2pdKSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkb3QuZHJhdyhcbiAgICAgICAgICAgICAgeCArIGkgKiBkb3RTaXplLFxuICAgICAgICAgICAgICB5ICsgaiAqIGRvdFNpemUsXG4gICAgICAgICAgICAgIGRvdFNpemUsXG4gICAgICAgICAgICAgICh4T2Zmc2V0OiBudW1iZXIsIHlPZmZzZXQ6IG51bWJlcik6IGJvb2xlYW4gPT4gISFkb3RNYXNrW2kgKyB4T2Zmc2V0XT8uW2ogKyB5T2Zmc2V0XVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMuY29ybmVyc0RvdE9wdGlvbnM/LmdyYWRpZW50KSB7XG4gICAgICAgIGNvbnN0IGdyYWRpZW50T3B0aW9ucyA9IG9wdGlvbnMuY29ybmVyc0RvdE9wdGlvbnMuZ3JhZGllbnQ7XG4gICAgICAgIGNvbnN0IGdyYWRpZW50ID0gdGhpcy5fY3JlYXRlR3JhZGllbnQoe1xuICAgICAgICAgIGNvbnRleHQ6IGNhbnZhc0NvbnRleHQsXG4gICAgICAgICAgb3B0aW9uczogZ3JhZGllbnRPcHRpb25zLFxuICAgICAgICAgIGFkZGl0aW9uYWxSb3RhdGlvbjogcm90YXRpb24sXG4gICAgICAgICAgeDogeCArIGRvdFNpemUgKiAyLFxuICAgICAgICAgIHk6IHkgKyBkb3RTaXplICogMixcbiAgICAgICAgICBzaXplOiBjb3JuZXJzRG90U2l6ZVxuICAgICAgICB9KTtcblxuICAgICAgICBncmFkaWVudE9wdGlvbnMuY29sb3JTdG9wcy5mb3JFYWNoKCh7IG9mZnNldCwgY29sb3IgfTogeyBvZmZzZXQ6IG51bWJlcjsgY29sb3I6IHN0cmluZyB9KSA9PiB7XG4gICAgICAgICAgZ3JhZGllbnQuYWRkQ29sb3JTdG9wKG9mZnNldCwgY29sb3IpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjYW52YXNDb250ZXh0LmZpbGxTdHlsZSA9IGNhbnZhc0NvbnRleHQuc3Ryb2tlU3R5bGUgPSBncmFkaWVudDtcbiAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5jb3JuZXJzRG90T3B0aW9ucz8uY29sb3IpIHtcbiAgICAgICAgY2FudmFzQ29udGV4dC5maWxsU3R5bGUgPSBjYW52YXNDb250ZXh0LnN0cm9rZVN0eWxlID0gb3B0aW9ucy5jb3JuZXJzRG90T3B0aW9ucy5jb2xvcjtcbiAgICAgIH1cblxuICAgICAgY2FudmFzQ29udGV4dC5maWxsKFwiZXZlbm9kZFwiKTtcbiAgICB9KTtcbiAgfVxuXG4gIGxvYWRJbWFnZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuX29wdGlvbnM7XG4gICAgICBjb25zdCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuXG4gICAgICBpZiAoIW9wdGlvbnMuaW1hZ2UpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdChcIkltYWdlIGlzIG5vdCBkZWZpbmVkXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMuaW1hZ2VPcHRpb25zLmNyb3NzT3JpZ2luID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGltYWdlLmNyb3NzT3JpZ2luID0gb3B0aW9ucy5pbWFnZU9wdGlvbnMuY3Jvc3NPcmlnaW47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2ltYWdlID0gaW1hZ2U7XG4gICAgICBpbWFnZS5vbmxvYWQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH07XG4gICAgICBpbWFnZS5zcmMgPSBvcHRpb25zLmltYWdlO1xuICAgIH0pO1xuICB9XG5cbiAgZHJhd0ltYWdlKHtcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQsXG4gICAgY291bnQsXG4gICAgZG90U2l6ZVxuICB9OiB7XG4gICAgd2lkdGg6IG51bWJlcjtcbiAgICBoZWlnaHQ6IG51bWJlcjtcbiAgICBjb3VudDogbnVtYmVyO1xuICAgIGRvdFNpemU6IG51bWJlcjtcbiAgfSk6IHZvaWQge1xuICAgIGNvbnN0IGNhbnZhc0NvbnRleHQgPSB0aGlzLmNvbnRleHQ7XG5cbiAgICBpZiAoIWNhbnZhc0NvbnRleHQpIHtcbiAgICAgIHRocm93IFwiY2FudmFzQ29udGV4dCBpcyBub3QgZGVmaW5lZFwiO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5faW1hZ2UpIHtcbiAgICAgIHRocm93IFwiaW1hZ2UgaXMgbm90IGRlZmluZWRcIjtcbiAgICB9XG5cbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5fb3B0aW9ucztcbiAgICBjb25zdCB4QmVnaW5uaW5nID0gTWF0aC5mbG9vcigob3B0aW9ucy53aWR0aCAtIGNvdW50ICogZG90U2l6ZSkgLyAyKTtcbiAgICBjb25zdCB5QmVnaW5uaW5nID0gTWF0aC5mbG9vcigob3B0aW9ucy5oZWlnaHQgLSBjb3VudCAqIGRvdFNpemUpIC8gMik7XG4gICAgY29uc3QgZHggPSB4QmVnaW5uaW5nICsgb3B0aW9ucy5pbWFnZU9wdGlvbnMubWFyZ2luICsgKGNvdW50ICogZG90U2l6ZSAtIHdpZHRoKSAvIDI7XG4gICAgY29uc3QgZHkgPSB5QmVnaW5uaW5nICsgb3B0aW9ucy5pbWFnZU9wdGlvbnMubWFyZ2luICsgKGNvdW50ICogZG90U2l6ZSAtIGhlaWdodCkgLyAyO1xuICAgIGNvbnN0IGR3ID0gd2lkdGggLSBvcHRpb25zLmltYWdlT3B0aW9ucy5tYXJnaW4gKiAyO1xuICAgIGNvbnN0IGRoID0gaGVpZ2h0IC0gb3B0aW9ucy5pbWFnZU9wdGlvbnMubWFyZ2luICogMjtcblxuICAgIGNhbnZhc0NvbnRleHQuZHJhd0ltYWdlKHRoaXMuX2ltYWdlLCBkeCwgZHksIGR3IDwgMCA/IDAgOiBkdywgZGggPCAwID8gMCA6IGRoKTtcbiAgfVxuXG4gIF9jcmVhdGVHcmFkaWVudCh7XG4gICAgY29udGV4dCxcbiAgICBvcHRpb25zLFxuICAgIGFkZGl0aW9uYWxSb3RhdGlvbixcbiAgICB4LFxuICAgIHksXG4gICAgc2l6ZVxuICB9OiB7XG4gICAgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICAgIG9wdGlvbnM6IEdyYWRpZW50O1xuICAgIGFkZGl0aW9uYWxSb3RhdGlvbjogbnVtYmVyO1xuICAgIHg6IG51bWJlcjtcbiAgICB5OiBudW1iZXI7XG4gICAgc2l6ZTogbnVtYmVyO1xuICB9KTogQ2FudmFzR3JhZGllbnQge1xuICAgIGxldCBncmFkaWVudDtcblxuICAgIGlmIChvcHRpb25zLnR5cGUgPT09IGdyYWRpZW50VHlwZXMucmFkaWFsKSB7XG4gICAgICBncmFkaWVudCA9IGNvbnRleHQuY3JlYXRlUmFkaWFsR3JhZGllbnQoeCArIHNpemUgLyAyLCB5ICsgc2l6ZSAvIDIsIDAsIHggKyBzaXplIC8gMiwgeSArIHNpemUgLyAyLCBzaXplIC8gMik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHJvdGF0aW9uID0gKChvcHRpb25zLnJvdGF0aW9uIHx8IDApICsgYWRkaXRpb25hbFJvdGF0aW9uKSAlICgyICogTWF0aC5QSSk7XG4gICAgICBjb25zdCBwb3NpdGl2ZVJvdGF0aW9uID0gKHJvdGF0aW9uICsgMiAqIE1hdGguUEkpICUgKDIgKiBNYXRoLlBJKTtcbiAgICAgIGxldCB4MCA9IHggKyBzaXplIC8gMjtcbiAgICAgIGxldCB5MCA9IHkgKyBzaXplIC8gMjtcbiAgICAgIGxldCB4MSA9IHggKyBzaXplIC8gMjtcbiAgICAgIGxldCB5MSA9IHkgKyBzaXplIC8gMjtcblxuICAgICAgaWYgKFxuICAgICAgICAocG9zaXRpdmVSb3RhdGlvbiA+PSAwICYmIHBvc2l0aXZlUm90YXRpb24gPD0gMC4yNSAqIE1hdGguUEkpIHx8XG4gICAgICAgIChwb3NpdGl2ZVJvdGF0aW9uID4gMS43NSAqIE1hdGguUEkgJiYgcG9zaXRpdmVSb3RhdGlvbiA8PSAyICogTWF0aC5QSSlcbiAgICAgICkge1xuICAgICAgICB4MCA9IHgwIC0gc2l6ZSAvIDI7XG4gICAgICAgIHkwID0geTAgLSAoc2l6ZSAvIDIpICogTWF0aC50YW4ocm90YXRpb24pO1xuICAgICAgICB4MSA9IHgxICsgc2l6ZSAvIDI7XG4gICAgICAgIHkxID0geTEgKyAoc2l6ZSAvIDIpICogTWF0aC50YW4ocm90YXRpb24pO1xuICAgICAgfSBlbHNlIGlmIChwb3NpdGl2ZVJvdGF0aW9uID4gMC4yNSAqIE1hdGguUEkgJiYgcG9zaXRpdmVSb3RhdGlvbiA8PSAwLjc1ICogTWF0aC5QSSkge1xuICAgICAgICB5MCA9IHkwIC0gc2l6ZSAvIDI7XG4gICAgICAgIHgwID0geDAgLSBzaXplIC8gMiAvIE1hdGgudGFuKHJvdGF0aW9uKTtcbiAgICAgICAgeTEgPSB5MSArIHNpemUgLyAyO1xuICAgICAgICB4MSA9IHgxICsgc2l6ZSAvIDIgLyBNYXRoLnRhbihyb3RhdGlvbik7XG4gICAgICB9IGVsc2UgaWYgKHBvc2l0aXZlUm90YXRpb24gPiAwLjc1ICogTWF0aC5QSSAmJiBwb3NpdGl2ZVJvdGF0aW9uIDw9IDEuMjUgKiBNYXRoLlBJKSB7XG4gICAgICAgIHgwID0geDAgKyBzaXplIC8gMjtcbiAgICAgICAgeTAgPSB5MCArIChzaXplIC8gMikgKiBNYXRoLnRhbihyb3RhdGlvbik7XG4gICAgICAgIHgxID0geDEgLSBzaXplIC8gMjtcbiAgICAgICAgeTEgPSB5MSAtIChzaXplIC8gMikgKiBNYXRoLnRhbihyb3RhdGlvbik7XG4gICAgICB9IGVsc2UgaWYgKHBvc2l0aXZlUm90YXRpb24gPiAxLjI1ICogTWF0aC5QSSAmJiBwb3NpdGl2ZVJvdGF0aW9uIDw9IDEuNzUgKiBNYXRoLlBJKSB7XG4gICAgICAgIHkwID0geTAgKyBzaXplIC8gMjtcbiAgICAgICAgeDAgPSB4MCArIHNpemUgLyAyIC8gTWF0aC50YW4ocm90YXRpb24pO1xuICAgICAgICB5MSA9IHkxIC0gc2l6ZSAvIDI7XG4gICAgICAgIHgxID0geDEgLSBzaXplIC8gMiAvIE1hdGgudGFuKHJvdGF0aW9uKTtcbiAgICAgIH1cblxuICAgICAgZ3JhZGllbnQgPSBjb250ZXh0LmNyZWF0ZUxpbmVhckdyYWRpZW50KE1hdGgucm91bmQoeDApLCBNYXRoLnJvdW5kKHkwKSwgTWF0aC5yb3VuZCh4MSksIE1hdGgucm91bmQoeTEpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZ3JhZGllbnQ7XG4gIH1cbn1cbiIsImltcG9ydCBnZXRNb2RlIGZyb20gXCIuLi90b29scy9nZXRNb2RlXCI7XG5pbXBvcnQgbWVyZ2VEZWVwIGZyb20gXCIuLi90b29scy9tZXJnZVwiO1xuaW1wb3J0IGRvd25sb2FkVVJJIGZyb20gXCIuLi90b29scy9kb3dubG9hZFVSSVwiO1xuaW1wb3J0IFFSQ2FudmFzIGZyb20gXCIuL1FSQ2FudmFzXCI7XG5pbXBvcnQgUVJTVkcgZnJvbSBcIi4vUVJTVkdcIjtcbmltcG9ydCBkcmF3VHlwZXMgZnJvbSBcIi4uL2NvbnN0YW50cy9kcmF3VHlwZXNcIjtcblxuaW1wb3J0IGRlZmF1bHRPcHRpb25zLCB7IFJlcXVpcmVkT3B0aW9ucyB9IGZyb20gXCIuL1FST3B0aW9uc1wiO1xuaW1wb3J0IHNhbml0aXplT3B0aW9ucyBmcm9tIFwiLi4vdG9vbHMvc2FuaXRpemVPcHRpb25zXCI7XG5pbXBvcnQgeyBFeHRlbnNpb24sIFFSQ29kZSwgT3B0aW9ucywgRG93bmxvYWRPcHRpb25zIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5pbXBvcnQgcXJjb2RlIGZyb20gXCJxcmNvZGUtZ2VuZXJhdG9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFFSQ29kZVN0eWxpbmcge1xuICBfb3B0aW9uczogUmVxdWlyZWRPcHRpb25zO1xuICBfY29udGFpbmVyPzogSFRNTEVsZW1lbnQ7XG4gIF9jYW52YXM/OiBRUkNhbnZhcztcbiAgX3N2Zz86IFFSU1ZHO1xuICBfcXI/OiBRUkNvZGU7XG4gIF9jYW52YXNEcmF3aW5nUHJvbWlzZT86IFByb21pc2U8dm9pZD47XG4gIF9zdmdEcmF3aW5nUHJvbWlzZT86IFByb21pc2U8dm9pZD47XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucz86IFBhcnRpYWw8T3B0aW9ucz4pIHtcbiAgICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyA/IHNhbml0aXplT3B0aW9ucyhtZXJnZURlZXAoZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpIGFzIFJlcXVpcmVkT3B0aW9ucykgOiBkZWZhdWx0T3B0aW9ucztcbiAgICB0aGlzLnVwZGF0ZSgpO1xuICB9XG5cbiAgc3RhdGljIF9jbGVhckNvbnRhaW5lcihjb250YWluZXI/OiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgIGlmIChjb250YWluZXIpIHtcbiAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIF9nZXRRUlN0eWxpbmdFbGVtZW50KGV4dGVuc2lvbjogRXh0ZW5zaW9uID0gXCJwbmdcIik6IFByb21pc2U8UVJDYW52YXMgfCBRUlNWRz4ge1xuICAgIGlmICghdGhpcy5fcXIpIHRocm93IFwiUVIgY29kZSBpcyBlbXB0eVwiO1xuXG4gICAgaWYgKGV4dGVuc2lvbi50b0xvd2VyQ2FzZSgpID09PSBcInN2Z1wiKSB7XG4gICAgICBsZXQgcHJvbWlzZSwgc3ZnOiBRUlNWRztcblxuICAgICAgaWYgKHRoaXMuX3N2ZyAmJiB0aGlzLl9zdmdEcmF3aW5nUHJvbWlzZSkge1xuICAgICAgICBzdmcgPSB0aGlzLl9zdmc7XG4gICAgICAgIHByb21pc2UgPSB0aGlzLl9zdmdEcmF3aW5nUHJvbWlzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN2ZyA9IG5ldyBRUlNWRyh0aGlzLl9vcHRpb25zKTtcbiAgICAgICAgcHJvbWlzZSA9IHN2Zy5kcmF3UVIodGhpcy5fcXIpO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCBwcm9taXNlO1xuXG4gICAgICByZXR1cm4gc3ZnO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgcHJvbWlzZSwgY2FudmFzOiBRUkNhbnZhcztcblxuICAgICAgaWYgKHRoaXMuX2NhbnZhcyAmJiB0aGlzLl9jYW52YXNEcmF3aW5nUHJvbWlzZSkge1xuICAgICAgICBjYW52YXMgPSB0aGlzLl9jYW52YXM7XG4gICAgICAgIHByb21pc2UgPSB0aGlzLl9jYW52YXNEcmF3aW5nUHJvbWlzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhbnZhcyA9IG5ldyBRUkNhbnZhcyh0aGlzLl9vcHRpb25zKTtcbiAgICAgICAgcHJvbWlzZSA9IGNhbnZhcy5kcmF3UVIodGhpcy5fcXIpO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCBwcm9taXNlO1xuXG4gICAgICByZXR1cm4gY2FudmFzO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZShvcHRpb25zPzogUGFydGlhbDxPcHRpb25zPik6IHZvaWQge1xuICAgIFFSQ29kZVN0eWxpbmcuX2NsZWFyQ29udGFpbmVyKHRoaXMuX2NvbnRhaW5lcik7XG4gICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnMgPyBzYW5pdGl6ZU9wdGlvbnMobWVyZ2VEZWVwKHRoaXMuX29wdGlvbnMsIG9wdGlvbnMpIGFzIFJlcXVpcmVkT3B0aW9ucykgOiB0aGlzLl9vcHRpb25zO1xuXG4gICAgaWYgKCF0aGlzLl9vcHRpb25zLmRhdGEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9xciA9IHFyY29kZSh0aGlzLl9vcHRpb25zLnFyT3B0aW9ucy50eXBlTnVtYmVyLCB0aGlzLl9vcHRpb25zLnFyT3B0aW9ucy5lcnJvckNvcnJlY3Rpb25MZXZlbCk7XG4gICAgdGhpcy5fcXIuYWRkRGF0YSh0aGlzLl9vcHRpb25zLmRhdGEsIHRoaXMuX29wdGlvbnMucXJPcHRpb25zLm1vZGUgfHwgZ2V0TW9kZSh0aGlzLl9vcHRpb25zLmRhdGEpKTtcbiAgICB0aGlzLl9xci5tYWtlKCk7XG5cbiAgICBpZiAodGhpcy5fb3B0aW9ucy50eXBlID09PSBkcmF3VHlwZXMuY2FudmFzKSB7XG4gICAgICB0aGlzLl9jYW52YXMgPSBuZXcgUVJDYW52YXModGhpcy5fb3B0aW9ucyk7XG4gICAgICB0aGlzLl9jYW52YXNEcmF3aW5nUHJvbWlzZSA9IHRoaXMuX2NhbnZhcy5kcmF3UVIodGhpcy5fcXIpO1xuICAgICAgdGhpcy5fc3ZnRHJhd2luZ1Byb21pc2UgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLl9zdmcgPSB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3N2ZyA9IG5ldyBRUlNWRyh0aGlzLl9vcHRpb25zKTtcbiAgICAgIHRoaXMuX3N2Z0RyYXdpbmdQcm9taXNlID0gdGhpcy5fc3ZnLmRyYXdRUih0aGlzLl9xcik7XG4gICAgICB0aGlzLl9jYW52YXNEcmF3aW5nUHJvbWlzZSA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX2NhbnZhcyA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB0aGlzLmFwcGVuZCh0aGlzLl9jb250YWluZXIpO1xuICB9XG5cbiAgYXBwZW5kKGNvbnRhaW5lcj86IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgaWYgKCFjb250YWluZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNvbnRhaW5lci5hcHBlbmRDaGlsZCAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB0aHJvdyBcIkNvbnRhaW5lciBzaG91bGQgYmUgYSBzaW5nbGUgRE9NIG5vZGVcIjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fb3B0aW9ucy50eXBlID09PSBkcmF3VHlwZXMuY2FudmFzKSB7XG4gICAgICBpZiAodGhpcy5fY2FudmFzKSB7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLl9jYW52YXMuZ2V0Q2FudmFzKCkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5fc3ZnKSB7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLl9zdmcuZ2V0RWxlbWVudCgpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9jb250YWluZXIgPSBjb250YWluZXI7XG4gIH1cblxuICBhc3luYyBnZXRSYXdEYXRhKGV4dGVuc2lvbjogRXh0ZW5zaW9uID0gXCJwbmdcIik6IFByb21pc2U8QmxvYiB8IG51bGw+IHtcbiAgICBpZiAoIXRoaXMuX3FyKSB0aHJvdyBcIlFSIGNvZGUgaXMgZW1wdHlcIjtcbiAgICBjb25zdCBlbGVtZW50ID0gYXdhaXQgdGhpcy5fZ2V0UVJTdHlsaW5nRWxlbWVudChleHRlbnNpb24pO1xuXG4gICAgaWYgKGV4dGVuc2lvbi50b0xvd2VyQ2FzZSgpID09PSBcInN2Z1wiKSB7XG4gICAgICBjb25zdCBzZXJpYWxpemVyID0gbmV3IFhNTFNlcmlhbGl6ZXIoKTtcbiAgICAgIGNvbnN0IHNvdXJjZSA9IHNlcmlhbGl6ZXIuc2VyaWFsaXplVG9TdHJpbmcoKChlbGVtZW50IGFzIHVua25vd24pIGFzIFFSU1ZHKS5nZXRFbGVtZW50KCkpO1xuXG4gICAgICByZXR1cm4gbmV3IEJsb2IoWyc8P3htbCB2ZXJzaW9uPVwiMS4wXCIgc3RhbmRhbG9uZT1cIm5vXCI/PlxcclxcbicgKyBzb3VyY2VdLCB7IHR5cGU6IFwiaW1hZ2Uvc3ZnK3htbFwiIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+XG4gICAgICAgICgoZWxlbWVudCBhcyB1bmtub3duKSBhcyBRUkNhbnZhcykuZ2V0Q2FudmFzKCkudG9CbG9iKHJlc29sdmUsIGBpbWFnZS8ke2V4dGVuc2lvbn1gLCAxKVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBkb3dubG9hZChkb3dubG9hZE9wdGlvbnM/OiBQYXJ0aWFsPERvd25sb2FkT3B0aW9ucz4gfCBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIXRoaXMuX3FyKSB0aHJvdyBcIlFSIGNvZGUgaXMgZW1wdHlcIjtcbiAgICBsZXQgZXh0ZW5zaW9uID0gXCJwbmdcIiBhcyBFeHRlbnNpb247XG4gICAgbGV0IG5hbWUgPSBcInFyXCI7XG5cbiAgICAvL1RPRE8gcmVtb3ZlIGRlcHJlY2F0ZWQgY29kZSBpbiB0aGUgdjJcbiAgICBpZiAodHlwZW9mIGRvd25sb2FkT3B0aW9ucyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgZXh0ZW5zaW9uID0gZG93bmxvYWRPcHRpb25zIGFzIEV4dGVuc2lvbjtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgXCJFeHRlbnNpb24gaXMgZGVwcmVjYXRlZCBhcyBhcmd1bWVudCBmb3IgJ2Rvd25sb2FkJyBtZXRob2QsIHBsZWFzZSBwYXNzIG9iamVjdCB7IG5hbWU6ICcuLi4nLCBleHRlbnNpb246ICcuLi4nIH0gYXMgYXJndW1lbnRcIlxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkb3dubG9hZE9wdGlvbnMgPT09IFwib2JqZWN0XCIgJiYgZG93bmxvYWRPcHRpb25zICE9PSBudWxsKSB7XG4gICAgICBpZiAoZG93bmxvYWRPcHRpb25zLm5hbWUpIHtcbiAgICAgICAgbmFtZSA9IGRvd25sb2FkT3B0aW9ucy5uYW1lO1xuICAgICAgfVxuICAgICAgaWYgKGRvd25sb2FkT3B0aW9ucy5leHRlbnNpb24pIHtcbiAgICAgICAgZXh0ZW5zaW9uID0gZG93bmxvYWRPcHRpb25zLmV4dGVuc2lvbjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBlbGVtZW50ID0gYXdhaXQgdGhpcy5fZ2V0UVJTdHlsaW5nRWxlbWVudChleHRlbnNpb24pO1xuXG4gICAgaWYgKGV4dGVuc2lvbi50b0xvd2VyQ2FzZSgpID09PSBcInN2Z1wiKSB7XG4gICAgICBjb25zdCBzZXJpYWxpemVyID0gbmV3IFhNTFNlcmlhbGl6ZXIoKTtcbiAgICAgIGxldCBzb3VyY2UgPSBzZXJpYWxpemVyLnNlcmlhbGl6ZVRvU3RyaW5nKCgoZWxlbWVudCBhcyB1bmtub3duKSBhcyBRUlNWRykuZ2V0RWxlbWVudCgpKTtcblxuICAgICAgc291cmNlID0gJzw/eG1sIHZlcnNpb249XCIxLjBcIiBzdGFuZGFsb25lPVwibm9cIj8+XFxyXFxuJyArIHNvdXJjZTtcbiAgICAgIGNvbnN0IHVybCA9IFwiZGF0YTppbWFnZS9zdmcreG1sO2NoYXJzZXQ9dXRmLTgsXCIgKyBlbmNvZGVVUklDb21wb25lbnQoc291cmNlKTtcbiAgICAgIGRvd25sb2FkVVJJKHVybCwgYCR7bmFtZX0uc3ZnYCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHVybCA9ICgoZWxlbWVudCBhcyB1bmtub3duKSBhcyBRUkNhbnZhcykuZ2V0Q2FudmFzKCkudG9EYXRhVVJMKGBpbWFnZS8ke2V4dGVuc2lvbn1gKTtcbiAgICAgIGRvd25sb2FkVVJJKHVybCwgYCR7bmFtZX0uJHtleHRlbnNpb259YCk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgcXJUeXBlcyBmcm9tIFwiLi4vY29uc3RhbnRzL3FyVHlwZXNcIjtcbmltcG9ydCBkcmF3VHlwZXMgZnJvbSBcIi4uL2NvbnN0YW50cy9kcmF3VHlwZXNcIjtcbmltcG9ydCBlcnJvckNvcnJlY3Rpb25MZXZlbHMgZnJvbSBcIi4uL2NvbnN0YW50cy9lcnJvckNvcnJlY3Rpb25MZXZlbHNcIjtcbmltcG9ydCB7IERvdFR5cGUsIE9wdGlvbnMsIFR5cGVOdW1iZXIsIEVycm9yQ29ycmVjdGlvbkxldmVsLCBNb2RlLCBEcmF3VHlwZSwgR3JhZGllbnQgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuZXhwb3J0IGludGVyZmFjZSBSZXF1aXJlZE9wdGlvbnMgZXh0ZW5kcyBPcHRpb25zIHtcbiAgdHlwZTogRHJhd1R5cGU7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICBtYXJnaW46IG51bWJlcjtcbiAgZGF0YTogc3RyaW5nO1xuICBxck9wdGlvbnM6IHtcbiAgICB0eXBlTnVtYmVyOiBUeXBlTnVtYmVyO1xuICAgIG1vZGU/OiBNb2RlO1xuICAgIGVycm9yQ29ycmVjdGlvbkxldmVsOiBFcnJvckNvcnJlY3Rpb25MZXZlbDtcbiAgfTtcbiAgaW1hZ2VPcHRpb25zOiB7XG4gICAgaGlkZUJhY2tncm91bmREb3RzOiBib29sZWFuO1xuICAgIGltYWdlU2l6ZTogbnVtYmVyO1xuICAgIGNyb3NzT3JpZ2luPzogc3RyaW5nO1xuICAgIG1hcmdpbjogbnVtYmVyO1xuICB9O1xuICBkb3RzT3B0aW9uczoge1xuICAgIHR5cGU6IERvdFR5cGU7XG4gICAgY29sb3I6IHN0cmluZztcbiAgICBncmFkaWVudD86IEdyYWRpZW50O1xuICB9O1xuICBiYWNrZ3JvdW5kT3B0aW9uczoge1xuICAgIGNvbG9yOiBzdHJpbmc7XG4gICAgZ3JhZGllbnQ/OiBHcmFkaWVudDtcbiAgfTtcbn1cblxuY29uc3QgZGVmYXVsdE9wdGlvbnM6IFJlcXVpcmVkT3B0aW9ucyA9IHtcbiAgdHlwZTogZHJhd1R5cGVzLmNhbnZhcyxcbiAgd2lkdGg6IDMwMCxcbiAgaGVpZ2h0OiAzMDAsXG4gIGRhdGE6IFwiXCIsXG4gIG1hcmdpbjogMCxcbiAgcXJPcHRpb25zOiB7XG4gICAgdHlwZU51bWJlcjogcXJUeXBlc1swXSxcbiAgICBtb2RlOiB1bmRlZmluZWQsXG4gICAgZXJyb3JDb3JyZWN0aW9uTGV2ZWw6IGVycm9yQ29ycmVjdGlvbkxldmVscy5RXG4gIH0sXG4gIGltYWdlT3B0aW9uczoge1xuICAgIGhpZGVCYWNrZ3JvdW5kRG90czogdHJ1ZSxcbiAgICBpbWFnZVNpemU6IDAuNCxcbiAgICBjcm9zc09yaWdpbjogdW5kZWZpbmVkLFxuICAgIG1hcmdpbjogMFxuICB9LFxuICBkb3RzT3B0aW9uczoge1xuICAgIHR5cGU6IFwic3F1YXJlXCIsXG4gICAgY29sb3I6IFwiIzAwMFwiXG4gIH0sXG4gIGJhY2tncm91bmRPcHRpb25zOiB7XG4gICAgY29sb3I6IFwiI2ZmZlwiXG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmF1bHRPcHRpb25zO1xuIiwiaW1wb3J0IGNhbGN1bGF0ZUltYWdlU2l6ZSBmcm9tIFwiLi4vdG9vbHMvY2FsY3VsYXRlSW1hZ2VTaXplXCI7XG5pbXBvcnQgZXJyb3JDb3JyZWN0aW9uUGVyY2VudHMgZnJvbSBcIi4uL2NvbnN0YW50cy9lcnJvckNvcnJlY3Rpb25QZXJjZW50c1wiO1xuaW1wb3J0IFFSRG90IGZyb20gXCIuLi9maWd1cmVzL2RvdC9zdmcvUVJEb3RcIjtcbmltcG9ydCBRUkNvcm5lclNxdWFyZSBmcm9tIFwiLi4vZmlndXJlcy9jb3JuZXJTcXVhcmUvc3ZnL1FSQ29ybmVyU3F1YXJlXCI7XG5pbXBvcnQgUVJDb3JuZXJEb3QgZnJvbSBcIi4uL2ZpZ3VyZXMvY29ybmVyRG90L3N2Zy9RUkNvcm5lckRvdFwiO1xuaW1wb3J0IHsgUmVxdWlyZWRPcHRpb25zIH0gZnJvbSBcIi4vUVJPcHRpb25zXCI7XG5pbXBvcnQgZ3JhZGllbnRUeXBlcyBmcm9tIFwiLi4vY29uc3RhbnRzL2dyYWRpZW50VHlwZXNcIjtcbmltcG9ydCB7IFFSQ29kZSwgRmlsdGVyRnVuY3Rpb24sIEdyYWRpZW50IH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmNvbnN0IHNxdWFyZU1hc2sgPSBbXG4gIFsxLCAxLCAxLCAxLCAxLCAxLCAxXSxcbiAgWzEsIDAsIDAsIDAsIDAsIDAsIDFdLFxuICBbMSwgMCwgMCwgMCwgMCwgMCwgMV0sXG4gIFsxLCAwLCAwLCAwLCAwLCAwLCAxXSxcbiAgWzEsIDAsIDAsIDAsIDAsIDAsIDFdLFxuICBbMSwgMCwgMCwgMCwgMCwgMCwgMV0sXG4gIFsxLCAxLCAxLCAxLCAxLCAxLCAxXVxuXTtcblxuY29uc3QgZG90TWFzayA9IFtcbiAgWzAsIDAsIDAsIDAsIDAsIDAsIDBdLFxuICBbMCwgMCwgMCwgMCwgMCwgMCwgMF0sXG4gIFswLCAwLCAxLCAxLCAxLCAwLCAwXSxcbiAgWzAsIDAsIDEsIDEsIDEsIDAsIDBdLFxuICBbMCwgMCwgMSwgMSwgMSwgMCwgMF0sXG4gIFswLCAwLCAwLCAwLCAwLCAwLCAwXSxcbiAgWzAsIDAsIDAsIDAsIDAsIDAsIDBdXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRUlNWRyB7XG4gIF9lbGVtZW50OiBTVkdFbGVtZW50O1xuICBfZGVmczogU1ZHRWxlbWVudDtcbiAgX2RvdHNDbGlwUGF0aD86IFNWR0VsZW1lbnQ7XG4gIF9jb3JuZXJzU3F1YXJlQ2xpcFBhdGg/OiBTVkdFbGVtZW50O1xuICBfY29ybmVyc0RvdENsaXBQYXRoPzogU1ZHRWxlbWVudDtcbiAgX29wdGlvbnM6IFJlcXVpcmVkT3B0aW9ucztcbiAgX3FyPzogUVJDb2RlO1xuICBfaW1hZ2U/OiBIVE1MSW1hZ2VFbGVtZW50O1xuXG4gIC8vVE9ETyBkb24ndCBwYXNzIGFsbCBvcHRpb25zIHRvIHRoaXMgY2xhc3NcbiAgY29uc3RydWN0b3Iob3B0aW9uczogUmVxdWlyZWRPcHRpb25zKSB7XG4gICAgdGhpcy5fZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwic3ZnXCIpO1xuICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgU3RyaW5nKG9wdGlvbnMud2lkdGgpKTtcbiAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCBTdHJpbmcob3B0aW9ucy5oZWlnaHQpKTtcbiAgICB0aGlzLl9kZWZzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgXCJkZWZzXCIpO1xuICAgIHRoaXMuX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5fZGVmcyk7XG5cbiAgICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcbiAgfVxuXG4gIGdldCB3aWR0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9vcHRpb25zLndpZHRoO1xuICB9XG5cbiAgZ2V0IGhlaWdodCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9vcHRpb25zLmhlaWdodDtcbiAgfVxuXG4gIGdldEVsZW1lbnQoKTogU1ZHRWxlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnQ7XG4gIH1cblxuICBjbGVhcigpOiB2b2lkIHtcbiAgICBjb25zdCBvbGRFbGVtZW50ID0gdGhpcy5fZWxlbWVudDtcbiAgICB0aGlzLl9lbGVtZW50ID0gb2xkRWxlbWVudC5jbG9uZU5vZGUoZmFsc2UpIGFzIFNWR0VsZW1lbnQ7XG4gICAgb2xkRWxlbWVudD8ucGFyZW50Tm9kZT8ucmVwbGFjZUNoaWxkKHRoaXMuX2VsZW1lbnQsIG9sZEVsZW1lbnQpO1xuICAgIHRoaXMuX2RlZnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBcImRlZnNcIik7XG4gICAgdGhpcy5fZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLl9kZWZzKTtcbiAgfVxuXG4gIGFzeW5jIGRyYXdRUihxcjogUVJDb2RlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgY291bnQgPSBxci5nZXRNb2R1bGVDb3VudCgpO1xuICAgIGNvbnN0IG1pblNpemUgPSBNYXRoLm1pbih0aGlzLl9vcHRpb25zLndpZHRoLCB0aGlzLl9vcHRpb25zLmhlaWdodCkgLSB0aGlzLl9vcHRpb25zLm1hcmdpbiAqIDI7XG4gICAgY29uc3QgZG90U2l6ZSA9IE1hdGguZmxvb3IobWluU2l6ZSAvIGNvdW50KTtcbiAgICBsZXQgZHJhd0ltYWdlU2l6ZSA9IHtcbiAgICAgIGhpZGVYRG90czogMCxcbiAgICAgIGhpZGVZRG90czogMCxcbiAgICAgIHdpZHRoOiAwLFxuICAgICAgaGVpZ2h0OiAwXG4gICAgfTtcblxuICAgIHRoaXMuX3FyID0gcXI7XG5cbiAgICBpZiAodGhpcy5fb3B0aW9ucy5pbWFnZSkge1xuICAgICAgLy9XZSBuZWVkIGl0IHRvIGdldCBpbWFnZSBzaXplXG4gICAgICBhd2FpdCB0aGlzLmxvYWRJbWFnZSgpO1xuICAgICAgaWYgKCF0aGlzLl9pbWFnZSkgcmV0dXJuO1xuICAgICAgY29uc3QgeyBpbWFnZU9wdGlvbnMsIHFyT3B0aW9ucyB9ID0gdGhpcy5fb3B0aW9ucztcbiAgICAgIGNvbnN0IGNvdmVyTGV2ZWwgPSBpbWFnZU9wdGlvbnMuaW1hZ2VTaXplICogZXJyb3JDb3JyZWN0aW9uUGVyY2VudHNbcXJPcHRpb25zLmVycm9yQ29ycmVjdGlvbkxldmVsXTtcbiAgICAgIGNvbnN0IG1heEhpZGRlbkRvdHMgPSBNYXRoLmZsb29yKGNvdmVyTGV2ZWwgKiBjb3VudCAqIGNvdW50KTtcblxuICAgICAgZHJhd0ltYWdlU2l6ZSA9IGNhbGN1bGF0ZUltYWdlU2l6ZSh7XG4gICAgICAgIG9yaWdpbmFsV2lkdGg6IHRoaXMuX2ltYWdlLndpZHRoLFxuICAgICAgICBvcmlnaW5hbEhlaWdodDogdGhpcy5faW1hZ2UuaGVpZ2h0LFxuICAgICAgICBtYXhIaWRkZW5Eb3RzLFxuICAgICAgICBtYXhIaWRkZW5BeGlzRG90czogY291bnQgLSAxNCxcbiAgICAgICAgZG90U2l6ZVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5jbGVhcigpO1xuICAgIHRoaXMuZHJhd0JhY2tncm91bmQoKTtcbiAgICB0aGlzLmRyYXdEb3RzKChpOiBudW1iZXIsIGo6IG51bWJlcik6IGJvb2xlYW4gPT4ge1xuICAgICAgaWYgKHRoaXMuX29wdGlvbnMuaW1hZ2VPcHRpb25zLmhpZGVCYWNrZ3JvdW5kRG90cykge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgaSA+PSAoY291bnQgLSBkcmF3SW1hZ2VTaXplLmhpZGVYRG90cykgLyAyICYmXG4gICAgICAgICAgaSA8IChjb3VudCArIGRyYXdJbWFnZVNpemUuaGlkZVhEb3RzKSAvIDIgJiZcbiAgICAgICAgICBqID49IChjb3VudCAtIGRyYXdJbWFnZVNpemUuaGlkZVlEb3RzKSAvIDIgJiZcbiAgICAgICAgICBqIDwgKGNvdW50ICsgZHJhd0ltYWdlU2l6ZS5oaWRlWURvdHMpIC8gMlxuICAgICAgICApIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHNxdWFyZU1hc2tbaV0/LltqXSB8fCBzcXVhcmVNYXNrW2kgLSBjb3VudCArIDddPy5bal0gfHwgc3F1YXJlTWFza1tpXT8uW2ogLSBjb3VudCArIDddKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGRvdE1hc2tbaV0/LltqXSB8fCBkb3RNYXNrW2kgLSBjb3VudCArIDddPy5bal0gfHwgZG90TWFza1tpXT8uW2ogLSBjb3VudCArIDddKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gICAgdGhpcy5kcmF3Q29ybmVycygpO1xuXG4gICAgaWYgKHRoaXMuX29wdGlvbnMuaW1hZ2UpIHtcbiAgICAgIHRoaXMuZHJhd0ltYWdlKHsgd2lkdGg6IGRyYXdJbWFnZVNpemUud2lkdGgsIGhlaWdodDogZHJhd0ltYWdlU2l6ZS5oZWlnaHQsIGNvdW50LCBkb3RTaXplIH0pO1xuICAgIH1cbiAgfVxuXG4gIGRyYXdCYWNrZ3JvdW5kKCk6IHZvaWQge1xuICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9lbGVtZW50O1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLl9vcHRpb25zO1xuXG4gICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IGdyYWRpZW50T3B0aW9ucyA9IG9wdGlvbnMuYmFja2dyb3VuZE9wdGlvbnM/LmdyYWRpZW50O1xuICAgICAgY29uc3QgY29sb3IgPSBvcHRpb25zLmJhY2tncm91bmRPcHRpb25zPy5jb2xvcjtcblxuICAgICAgaWYgKGdyYWRpZW50T3B0aW9ucyB8fCBjb2xvcikge1xuICAgICAgICB0aGlzLl9jcmVhdGVDb2xvcih7XG4gICAgICAgICAgb3B0aW9uczogZ3JhZGllbnRPcHRpb25zLFxuICAgICAgICAgIGNvbG9yOiBjb2xvcixcbiAgICAgICAgICBhZGRpdGlvbmFsUm90YXRpb246IDAsXG4gICAgICAgICAgeDogMCxcbiAgICAgICAgICB5OiAwLFxuICAgICAgICAgIGhlaWdodDogb3B0aW9ucy5oZWlnaHQsXG4gICAgICAgICAgd2lkdGg6IG9wdGlvbnMud2lkdGgsXG4gICAgICAgICAgbmFtZTogXCJiYWNrZ3JvdW5kLWNvbG9yXCJcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZHJhd0RvdHMoZmlsdGVyPzogRmlsdGVyRnVuY3Rpb24pOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX3FyKSB7XG4gICAgICB0aHJvdyBcIlFSIGNvZGUgaXMgbm90IGRlZmluZWRcIjtcbiAgICB9XG5cbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5fb3B0aW9ucztcbiAgICBjb25zdCBjb3VudCA9IHRoaXMuX3FyLmdldE1vZHVsZUNvdW50KCk7XG5cbiAgICBpZiAoY291bnQgPiBvcHRpb25zLndpZHRoIHx8IGNvdW50ID4gb3B0aW9ucy5oZWlnaHQpIHtcbiAgICAgIHRocm93IFwiVGhlIGNhbnZhcyBpcyB0b28gc21hbGwuXCI7XG4gICAgfVxuXG4gICAgY29uc3QgbWluU2l6ZSA9IE1hdGgubWluKG9wdGlvbnMud2lkdGgsIG9wdGlvbnMuaGVpZ2h0KSAtIG9wdGlvbnMubWFyZ2luICogMjtcbiAgICBjb25zdCBkb3RTaXplID0gTWF0aC5mbG9vcihtaW5TaXplIC8gY291bnQpO1xuICAgIGNvbnN0IHhCZWdpbm5pbmcgPSBNYXRoLmZsb29yKChvcHRpb25zLndpZHRoIC0gY291bnQgKiBkb3RTaXplKSAvIDIpO1xuICAgIGNvbnN0IHlCZWdpbm5pbmcgPSBNYXRoLmZsb29yKChvcHRpb25zLmhlaWdodCAtIGNvdW50ICogZG90U2l6ZSkgLyAyKTtcbiAgICBjb25zdCBkb3QgPSBuZXcgUVJEb3QoeyBzdmc6IHRoaXMuX2VsZW1lbnQsIHR5cGU6IG9wdGlvbnMuZG90c09wdGlvbnMudHlwZSB9KTtcblxuICAgIHRoaXMuX2RvdHNDbGlwUGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwiY2xpcFBhdGhcIik7XG4gICAgdGhpcy5fZG90c0NsaXBQYXRoLnNldEF0dHJpYnV0ZShcImlkXCIsIFwiY2xpcC1wYXRoLWRvdC1jb2xvclwiKTtcbiAgICB0aGlzLl9kZWZzLmFwcGVuZENoaWxkKHRoaXMuX2RvdHNDbGlwUGF0aCk7XG5cbiAgICB0aGlzLl9jcmVhdGVDb2xvcih7XG4gICAgICBvcHRpb25zOiBvcHRpb25zLmRvdHNPcHRpb25zPy5ncmFkaWVudCxcbiAgICAgIGNvbG9yOiBvcHRpb25zLmRvdHNPcHRpb25zLmNvbG9yLFxuICAgICAgYWRkaXRpb25hbFJvdGF0aW9uOiAwLFxuICAgICAgeDogeEJlZ2lubmluZyxcbiAgICAgIHk6IHlCZWdpbm5pbmcsXG4gICAgICBoZWlnaHQ6IGNvdW50ICogZG90U2l6ZSxcbiAgICAgIHdpZHRoOiBjb3VudCAqIGRvdFNpemUsXG4gICAgICBuYW1lOiBcImRvdC1jb2xvclwiXG4gICAgfSk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY291bnQ7IGorKykge1xuICAgICAgICBpZiAoZmlsdGVyICYmICFmaWx0ZXIoaSwgaikpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX3FyPy5pc0RhcmsoaSwgaikpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRvdC5kcmF3KFxuICAgICAgICAgIHhCZWdpbm5pbmcgKyBpICogZG90U2l6ZSxcbiAgICAgICAgICB5QmVnaW5uaW5nICsgaiAqIGRvdFNpemUsXG4gICAgICAgICAgZG90U2l6ZSxcbiAgICAgICAgICAoeE9mZnNldDogbnVtYmVyLCB5T2Zmc2V0OiBudW1iZXIpOiBib29sZWFuID0+IHtcbiAgICAgICAgICAgIGlmIChpICsgeE9mZnNldCA8IDAgfHwgaiArIHlPZmZzZXQgPCAwIHx8IGkgKyB4T2Zmc2V0ID49IGNvdW50IHx8IGogKyB5T2Zmc2V0ID49IGNvdW50KSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICBpZiAoZmlsdGVyICYmICFmaWx0ZXIoaSArIHhPZmZzZXQsIGogKyB5T2Zmc2V0KSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuICEhdGhpcy5fcXIgJiYgdGhpcy5fcXIuaXNEYXJrKGkgKyB4T2Zmc2V0LCBqICsgeU9mZnNldCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIGlmIChkb3QuX2VsZW1lbnQgJiYgdGhpcy5fZG90c0NsaXBQYXRoKSB7XG4gICAgICAgICAgdGhpcy5fZG90c0NsaXBQYXRoLmFwcGVuZENoaWxkKGRvdC5fZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkcmF3Q29ybmVycygpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX3FyKSB7XG4gICAgICB0aHJvdyBcIlFSIGNvZGUgaXMgbm90IGRlZmluZWRcIjtcbiAgICB9XG5cbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudDtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5fb3B0aW9ucztcblxuICAgIGlmICghZWxlbWVudCkge1xuICAgICAgdGhyb3cgXCJFbGVtZW50IGNvZGUgaXMgbm90IGRlZmluZWRcIjtcbiAgICB9XG5cbiAgICBjb25zdCBjb3VudCA9IHRoaXMuX3FyLmdldE1vZHVsZUNvdW50KCk7XG4gICAgY29uc3QgbWluU2l6ZSA9IE1hdGgubWluKG9wdGlvbnMud2lkdGgsIG9wdGlvbnMuaGVpZ2h0KSAtIG9wdGlvbnMubWFyZ2luICogMjtcbiAgICBjb25zdCBkb3RTaXplID0gTWF0aC5mbG9vcihtaW5TaXplIC8gY291bnQpO1xuICAgIGNvbnN0IGNvcm5lcnNTcXVhcmVTaXplID0gZG90U2l6ZSAqIDc7XG4gICAgY29uc3QgY29ybmVyc0RvdFNpemUgPSBkb3RTaXplICogMztcbiAgICBjb25zdCB4QmVnaW5uaW5nID0gTWF0aC5mbG9vcigob3B0aW9ucy53aWR0aCAtIGNvdW50ICogZG90U2l6ZSkgLyAyKTtcbiAgICBjb25zdCB5QmVnaW5uaW5nID0gTWF0aC5mbG9vcigob3B0aW9ucy5oZWlnaHQgLSBjb3VudCAqIGRvdFNpemUpIC8gMik7XG5cbiAgICBbXG4gICAgICBbMCwgMCwgMF0sXG4gICAgICBbMSwgMCwgTWF0aC5QSSAvIDJdLFxuICAgICAgWzAsIDEsIC1NYXRoLlBJIC8gMl1cbiAgICBdLmZvckVhY2goKFtjb2x1bW4sIHJvdywgcm90YXRpb25dKSA9PiB7XG4gICAgICBjb25zdCB4ID0geEJlZ2lubmluZyArIGNvbHVtbiAqIGRvdFNpemUgKiAoY291bnQgLSA3KTtcbiAgICAgIGNvbnN0IHkgPSB5QmVnaW5uaW5nICsgcm93ICogZG90U2l6ZSAqIChjb3VudCAtIDcpO1xuICAgICAgbGV0IGNvcm5lcnNTcXVhcmVDbGlwUGF0aCA9IHRoaXMuX2RvdHNDbGlwUGF0aDtcbiAgICAgIGxldCBjb3JuZXJzRG90Q2xpcFBhdGggPSB0aGlzLl9kb3RzQ2xpcFBhdGg7XG5cbiAgICAgIGlmIChvcHRpb25zLmNvcm5lcnNTcXVhcmVPcHRpb25zPy5ncmFkaWVudCB8fCBvcHRpb25zLmNvcm5lcnNTcXVhcmVPcHRpb25zPy5jb2xvcikge1xuICAgICAgICBjb3JuZXJzU3F1YXJlQ2xpcFBhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBcImNsaXBQYXRoXCIpO1xuICAgICAgICBjb3JuZXJzU3F1YXJlQ2xpcFBhdGguc2V0QXR0cmlidXRlKFwiaWRcIiwgYGNsaXAtcGF0aC1jb3JuZXJzLXNxdWFyZS1jb2xvci0ke2NvbHVtbn0tJHtyb3d9YCk7XG4gICAgICAgIHRoaXMuX2RlZnMuYXBwZW5kQ2hpbGQoY29ybmVyc1NxdWFyZUNsaXBQYXRoKTtcbiAgICAgICAgdGhpcy5fY29ybmVyc1NxdWFyZUNsaXBQYXRoID0gdGhpcy5fY29ybmVyc0RvdENsaXBQYXRoID0gY29ybmVyc0RvdENsaXBQYXRoID0gY29ybmVyc1NxdWFyZUNsaXBQYXRoO1xuXG4gICAgICAgIHRoaXMuX2NyZWF0ZUNvbG9yKHtcbiAgICAgICAgICBvcHRpb25zOiBvcHRpb25zLmNvcm5lcnNTcXVhcmVPcHRpb25zPy5ncmFkaWVudCxcbiAgICAgICAgICBjb2xvcjogb3B0aW9ucy5jb3JuZXJzU3F1YXJlT3B0aW9ucz8uY29sb3IsXG4gICAgICAgICAgYWRkaXRpb25hbFJvdGF0aW9uOiByb3RhdGlvbixcbiAgICAgICAgICB4LFxuICAgICAgICAgIHksXG4gICAgICAgICAgaGVpZ2h0OiBjb3JuZXJzU3F1YXJlU2l6ZSxcbiAgICAgICAgICB3aWR0aDogY29ybmVyc1NxdWFyZVNpemUsXG4gICAgICAgICAgbmFtZTogYGNvcm5lcnMtc3F1YXJlLWNvbG9yLSR7Y29sdW1ufS0ke3Jvd31gXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5jb3JuZXJzU3F1YXJlT3B0aW9ucz8udHlwZSkge1xuICAgICAgICBjb25zdCBjb3JuZXJzU3F1YXJlID0gbmV3IFFSQ29ybmVyU3F1YXJlKHsgc3ZnOiB0aGlzLl9lbGVtZW50LCB0eXBlOiBvcHRpb25zLmNvcm5lcnNTcXVhcmVPcHRpb25zLnR5cGUgfSk7XG5cbiAgICAgICAgY29ybmVyc1NxdWFyZS5kcmF3KHgsIHksIGNvcm5lcnNTcXVhcmVTaXplLCByb3RhdGlvbik7XG5cbiAgICAgICAgaWYgKGNvcm5lcnNTcXVhcmUuX2VsZW1lbnQgJiYgY29ybmVyc1NxdWFyZUNsaXBQYXRoKSB7XG4gICAgICAgICAgY29ybmVyc1NxdWFyZUNsaXBQYXRoLmFwcGVuZENoaWxkKGNvcm5lcnNTcXVhcmUuX2VsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBkb3QgPSBuZXcgUVJEb3QoeyBzdmc6IHRoaXMuX2VsZW1lbnQsIHR5cGU6IG9wdGlvbnMuZG90c09wdGlvbnMudHlwZSB9KTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNxdWFyZU1hc2subGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNxdWFyZU1hc2tbaV0ubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGlmICghc3F1YXJlTWFza1tpXT8uW2pdKSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkb3QuZHJhdyhcbiAgICAgICAgICAgICAgeCArIGkgKiBkb3RTaXplLFxuICAgICAgICAgICAgICB5ICsgaiAqIGRvdFNpemUsXG4gICAgICAgICAgICAgIGRvdFNpemUsXG4gICAgICAgICAgICAgICh4T2Zmc2V0OiBudW1iZXIsIHlPZmZzZXQ6IG51bWJlcik6IGJvb2xlYW4gPT4gISFzcXVhcmVNYXNrW2kgKyB4T2Zmc2V0XT8uW2ogKyB5T2Zmc2V0XVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgaWYgKGRvdC5fZWxlbWVudCAmJiBjb3JuZXJzU3F1YXJlQ2xpcFBhdGgpIHtcbiAgICAgICAgICAgICAgY29ybmVyc1NxdWFyZUNsaXBQYXRoLmFwcGVuZENoaWxkKGRvdC5fZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLmNvcm5lcnNEb3RPcHRpb25zPy5ncmFkaWVudCB8fCBvcHRpb25zLmNvcm5lcnNEb3RPcHRpb25zPy5jb2xvcikge1xuICAgICAgICBjb3JuZXJzRG90Q2xpcFBhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBcImNsaXBQYXRoXCIpO1xuICAgICAgICBjb3JuZXJzRG90Q2xpcFBhdGguc2V0QXR0cmlidXRlKFwiaWRcIiwgYGNsaXAtcGF0aC1jb3JuZXJzLWRvdC1jb2xvci0ke2NvbHVtbn0tJHtyb3d9YCk7XG4gICAgICAgIHRoaXMuX2RlZnMuYXBwZW5kQ2hpbGQoY29ybmVyc0RvdENsaXBQYXRoKTtcbiAgICAgICAgdGhpcy5fY29ybmVyc0RvdENsaXBQYXRoID0gY29ybmVyc0RvdENsaXBQYXRoO1xuXG4gICAgICAgIHRoaXMuX2NyZWF0ZUNvbG9yKHtcbiAgICAgICAgICBvcHRpb25zOiBvcHRpb25zLmNvcm5lcnNEb3RPcHRpb25zPy5ncmFkaWVudCxcbiAgICAgICAgICBjb2xvcjogb3B0aW9ucy5jb3JuZXJzRG90T3B0aW9ucz8uY29sb3IsXG4gICAgICAgICAgYWRkaXRpb25hbFJvdGF0aW9uOiByb3RhdGlvbixcbiAgICAgICAgICB4OiB4ICsgZG90U2l6ZSAqIDIsXG4gICAgICAgICAgeTogeSArIGRvdFNpemUgKiAyLFxuICAgICAgICAgIGhlaWdodDogY29ybmVyc0RvdFNpemUsXG4gICAgICAgICAgd2lkdGg6IGNvcm5lcnNEb3RTaXplLFxuICAgICAgICAgIG5hbWU6IGBjb3JuZXJzLWRvdC1jb2xvci0ke2NvbHVtbn0tJHtyb3d9YFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMuY29ybmVyc0RvdE9wdGlvbnM/LnR5cGUpIHtcbiAgICAgICAgY29uc3QgY29ybmVyc0RvdCA9IG5ldyBRUkNvcm5lckRvdCh7IHN2ZzogdGhpcy5fZWxlbWVudCwgdHlwZTogb3B0aW9ucy5jb3JuZXJzRG90T3B0aW9ucy50eXBlIH0pO1xuXG4gICAgICAgIGNvcm5lcnNEb3QuZHJhdyh4ICsgZG90U2l6ZSAqIDIsIHkgKyBkb3RTaXplICogMiwgY29ybmVyc0RvdFNpemUsIHJvdGF0aW9uKTtcblxuICAgICAgICBpZiAoY29ybmVyc0RvdC5fZWxlbWVudCAmJiBjb3JuZXJzRG90Q2xpcFBhdGgpIHtcbiAgICAgICAgICBjb3JuZXJzRG90Q2xpcFBhdGguYXBwZW5kQ2hpbGQoY29ybmVyc0RvdC5fZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGRvdCA9IG5ldyBRUkRvdCh7IHN2ZzogdGhpcy5fZWxlbWVudCwgdHlwZTogb3B0aW9ucy5kb3RzT3B0aW9ucy50eXBlIH0pO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZG90TWFzay5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZG90TWFza1tpXS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgaWYgKCFkb3RNYXNrW2ldPy5bal0pIHtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRvdC5kcmF3KFxuICAgICAgICAgICAgICB4ICsgaSAqIGRvdFNpemUsXG4gICAgICAgICAgICAgIHkgKyBqICogZG90U2l6ZSxcbiAgICAgICAgICAgICAgZG90U2l6ZSxcbiAgICAgICAgICAgICAgKHhPZmZzZXQ6IG51bWJlciwgeU9mZnNldDogbnVtYmVyKTogYm9vbGVhbiA9PiAhIWRvdE1hc2tbaSArIHhPZmZzZXRdPy5baiArIHlPZmZzZXRdXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBpZiAoZG90Ll9lbGVtZW50ICYmIGNvcm5lcnNEb3RDbGlwUGF0aCkge1xuICAgICAgICAgICAgICBjb3JuZXJzRG90Q2xpcFBhdGguYXBwZW5kQ2hpbGQoZG90Ll9lbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGxvYWRJbWFnZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuX29wdGlvbnM7XG4gICAgICBjb25zdCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuXG4gICAgICBpZiAoIW9wdGlvbnMuaW1hZ2UpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdChcIkltYWdlIGlzIG5vdCBkZWZpbmVkXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMuaW1hZ2VPcHRpb25zLmNyb3NzT3JpZ2luID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGltYWdlLmNyb3NzT3JpZ2luID0gb3B0aW9ucy5pbWFnZU9wdGlvbnMuY3Jvc3NPcmlnaW47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2ltYWdlID0gaW1hZ2U7XG4gICAgICBpbWFnZS5vbmxvYWQgPSAoKTogdm9pZCA9PiB7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH07XG4gICAgICBpbWFnZS5zcmMgPSBvcHRpb25zLmltYWdlO1xuICAgIH0pO1xuICB9XG5cbiAgZHJhd0ltYWdlKHtcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQsXG4gICAgY291bnQsXG4gICAgZG90U2l6ZVxuICB9OiB7XG4gICAgd2lkdGg6IG51bWJlcjtcbiAgICBoZWlnaHQ6IG51bWJlcjtcbiAgICBjb3VudDogbnVtYmVyO1xuICAgIGRvdFNpemU6IG51bWJlcjtcbiAgfSk6IHZvaWQge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLl9vcHRpb25zO1xuICAgIGNvbnN0IHhCZWdpbm5pbmcgPSBNYXRoLmZsb29yKChvcHRpb25zLndpZHRoIC0gY291bnQgKiBkb3RTaXplKSAvIDIpO1xuICAgIGNvbnN0IHlCZWdpbm5pbmcgPSBNYXRoLmZsb29yKChvcHRpb25zLmhlaWdodCAtIGNvdW50ICogZG90U2l6ZSkgLyAyKTtcbiAgICBjb25zdCBkeCA9IHhCZWdpbm5pbmcgKyBvcHRpb25zLmltYWdlT3B0aW9ucy5tYXJnaW4gKyAoY291bnQgKiBkb3RTaXplIC0gd2lkdGgpIC8gMjtcbiAgICBjb25zdCBkeSA9IHlCZWdpbm5pbmcgKyBvcHRpb25zLmltYWdlT3B0aW9ucy5tYXJnaW4gKyAoY291bnQgKiBkb3RTaXplIC0gaGVpZ2h0KSAvIDI7XG4gICAgY29uc3QgZHcgPSB3aWR0aCAtIG9wdGlvbnMuaW1hZ2VPcHRpb25zLm1hcmdpbiAqIDI7XG4gICAgY29uc3QgZGggPSBoZWlnaHQgLSBvcHRpb25zLmltYWdlT3B0aW9ucy5tYXJnaW4gKiAyO1xuXG4gICAgY29uc3QgaW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBcImltYWdlXCIpO1xuICAgIGltYWdlLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgb3B0aW9ucy5pbWFnZSB8fCBcIlwiKTtcbiAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoXCJ4XCIsIFN0cmluZyhkeCkpO1xuICAgIGltYWdlLnNldEF0dHJpYnV0ZShcInlcIiwgU3RyaW5nKGR5KSk7XG4gICAgaW1hZ2Uuc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgYCR7ZHd9cHhgKTtcbiAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIiwgYCR7ZGh9cHhgKTtcblxuICAgIHRoaXMuX2VsZW1lbnQuYXBwZW5kQ2hpbGQoaW1hZ2UpO1xuICB9XG5cbiAgX2NyZWF0ZUNvbG9yKHtcbiAgICBvcHRpb25zLFxuICAgIGNvbG9yLFxuICAgIGFkZGl0aW9uYWxSb3RhdGlvbixcbiAgICB4LFxuICAgIHksXG4gICAgaGVpZ2h0LFxuICAgIHdpZHRoLFxuICAgIG5hbWVcbiAgfToge1xuICAgIG9wdGlvbnM/OiBHcmFkaWVudDtcbiAgICBjb2xvcj86IHN0cmluZztcbiAgICBhZGRpdGlvbmFsUm90YXRpb246IG51bWJlcjtcbiAgICB4OiBudW1iZXI7XG4gICAgeTogbnVtYmVyO1xuICAgIGhlaWdodDogbnVtYmVyO1xuICAgIHdpZHRoOiBudW1iZXI7XG4gICAgbmFtZTogc3RyaW5nO1xuICB9KTogdm9pZCB7XG4gICAgY29uc3Qgc2l6ZSA9IHdpZHRoID4gaGVpZ2h0ID8gd2lkdGggOiBoZWlnaHQ7XG4gICAgY29uc3QgcmVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwicmVjdFwiKTtcbiAgICByZWN0LnNldEF0dHJpYnV0ZShcInhcIiwgU3RyaW5nKHgpKTtcbiAgICByZWN0LnNldEF0dHJpYnV0ZShcInlcIiwgU3RyaW5nKHkpKTtcbiAgICByZWN0LnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCBTdHJpbmcoaGVpZ2h0KSk7XG4gICAgcmVjdC5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCBTdHJpbmcod2lkdGgpKTtcbiAgICByZWN0LnNldEF0dHJpYnV0ZShcImNsaXAtcGF0aFwiLCBgdXJsKCcjY2xpcC1wYXRoLSR7bmFtZX0nKWApO1xuXG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgIGxldCBncmFkaWVudDogU1ZHRWxlbWVudDtcbiAgICAgIGlmIChvcHRpb25zLnR5cGUgPT09IGdyYWRpZW50VHlwZXMucmFkaWFsKSB7XG4gICAgICAgIGdyYWRpZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgXCJyYWRpYWxHcmFkaWVudFwiKTtcbiAgICAgICAgZ3JhZGllbnQuc2V0QXR0cmlidXRlKFwiaWRcIiwgbmFtZSk7XG4gICAgICAgIGdyYWRpZW50LnNldEF0dHJpYnV0ZShcImdyYWRpZW50VW5pdHNcIiwgXCJ1c2VyU3BhY2VPblVzZVwiKTtcbiAgICAgICAgZ3JhZGllbnQuc2V0QXR0cmlidXRlKFwiZnhcIiwgU3RyaW5nKHggKyB3aWR0aCAvIDIpKTtcbiAgICAgICAgZ3JhZGllbnQuc2V0QXR0cmlidXRlKFwiZnlcIiwgU3RyaW5nKHkgKyBoZWlnaHQgLyAyKSk7XG4gICAgICAgIGdyYWRpZW50LnNldEF0dHJpYnV0ZShcImN4XCIsIFN0cmluZyh4ICsgd2lkdGggLyAyKSk7XG4gICAgICAgIGdyYWRpZW50LnNldEF0dHJpYnV0ZShcImN5XCIsIFN0cmluZyh5ICsgaGVpZ2h0IC8gMikpO1xuICAgICAgICBncmFkaWVudC5zZXRBdHRyaWJ1dGUoXCJyXCIsIFN0cmluZyhzaXplIC8gMikpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qgcm90YXRpb24gPSAoKG9wdGlvbnMucm90YXRpb24gfHwgMCkgKyBhZGRpdGlvbmFsUm90YXRpb24pICUgKDIgKiBNYXRoLlBJKTtcbiAgICAgICAgY29uc3QgcG9zaXRpdmVSb3RhdGlvbiA9IChyb3RhdGlvbiArIDIgKiBNYXRoLlBJKSAlICgyICogTWF0aC5QSSk7XG4gICAgICAgIGxldCB4MCA9IHggKyB3aWR0aCAvIDI7XG4gICAgICAgIGxldCB5MCA9IHkgKyBoZWlnaHQgLyAyO1xuICAgICAgICBsZXQgeDEgPSB4ICsgd2lkdGggLyAyO1xuICAgICAgICBsZXQgeTEgPSB5ICsgaGVpZ2h0IC8gMjtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgKHBvc2l0aXZlUm90YXRpb24gPj0gMCAmJiBwb3NpdGl2ZVJvdGF0aW9uIDw9IDAuMjUgKiBNYXRoLlBJKSB8fFxuICAgICAgICAgIChwb3NpdGl2ZVJvdGF0aW9uID4gMS43NSAqIE1hdGguUEkgJiYgcG9zaXRpdmVSb3RhdGlvbiA8PSAyICogTWF0aC5QSSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgeDAgPSB4MCAtIHdpZHRoIC8gMjtcbiAgICAgICAgICB5MCA9IHkwIC0gKGhlaWdodCAvIDIpICogTWF0aC50YW4ocm90YXRpb24pO1xuICAgICAgICAgIHgxID0geDEgKyB3aWR0aCAvIDI7XG4gICAgICAgICAgeTEgPSB5MSArIChoZWlnaHQgLyAyKSAqIE1hdGgudGFuKHJvdGF0aW9uKTtcbiAgICAgICAgfSBlbHNlIGlmIChwb3NpdGl2ZVJvdGF0aW9uID4gMC4yNSAqIE1hdGguUEkgJiYgcG9zaXRpdmVSb3RhdGlvbiA8PSAwLjc1ICogTWF0aC5QSSkge1xuICAgICAgICAgIHkwID0geTAgLSBoZWlnaHQgLyAyO1xuICAgICAgICAgIHgwID0geDAgLSB3aWR0aCAvIDIgLyBNYXRoLnRhbihyb3RhdGlvbik7XG4gICAgICAgICAgeTEgPSB5MSArIGhlaWdodCAvIDI7XG4gICAgICAgICAgeDEgPSB4MSArIHdpZHRoIC8gMiAvIE1hdGgudGFuKHJvdGF0aW9uKTtcbiAgICAgICAgfSBlbHNlIGlmIChwb3NpdGl2ZVJvdGF0aW9uID4gMC43NSAqIE1hdGguUEkgJiYgcG9zaXRpdmVSb3RhdGlvbiA8PSAxLjI1ICogTWF0aC5QSSkge1xuICAgICAgICAgIHgwID0geDAgKyB3aWR0aCAvIDI7XG4gICAgICAgICAgeTAgPSB5MCArIChoZWlnaHQgLyAyKSAqIE1hdGgudGFuKHJvdGF0aW9uKTtcbiAgICAgICAgICB4MSA9IHgxIC0gd2lkdGggLyAyO1xuICAgICAgICAgIHkxID0geTEgLSAoaGVpZ2h0IC8gMikgKiBNYXRoLnRhbihyb3RhdGlvbik7XG4gICAgICAgIH0gZWxzZSBpZiAocG9zaXRpdmVSb3RhdGlvbiA+IDEuMjUgKiBNYXRoLlBJICYmIHBvc2l0aXZlUm90YXRpb24gPD0gMS43NSAqIE1hdGguUEkpIHtcbiAgICAgICAgICB5MCA9IHkwICsgaGVpZ2h0IC8gMjtcbiAgICAgICAgICB4MCA9IHgwICsgd2lkdGggLyAyIC8gTWF0aC50YW4ocm90YXRpb24pO1xuICAgICAgICAgIHkxID0geTEgLSBoZWlnaHQgLyAyO1xuICAgICAgICAgIHgxID0geDEgLSB3aWR0aCAvIDIgLyBNYXRoLnRhbihyb3RhdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBncmFkaWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwibGluZWFyR3JhZGllbnRcIik7XG4gICAgICAgIGdyYWRpZW50LnNldEF0dHJpYnV0ZShcImlkXCIsIG5hbWUpO1xuICAgICAgICBncmFkaWVudC5zZXRBdHRyaWJ1dGUoXCJncmFkaWVudFVuaXRzXCIsIFwidXNlclNwYWNlT25Vc2VcIik7XG4gICAgICAgIGdyYWRpZW50LnNldEF0dHJpYnV0ZShcIngxXCIsIFN0cmluZyhNYXRoLnJvdW5kKHgwKSkpO1xuICAgICAgICBncmFkaWVudC5zZXRBdHRyaWJ1dGUoXCJ5MVwiLCBTdHJpbmcoTWF0aC5yb3VuZCh5MCkpKTtcbiAgICAgICAgZ3JhZGllbnQuc2V0QXR0cmlidXRlKFwieDJcIiwgU3RyaW5nKE1hdGgucm91bmQoeDEpKSk7XG4gICAgICAgIGdyYWRpZW50LnNldEF0dHJpYnV0ZShcInkyXCIsIFN0cmluZyhNYXRoLnJvdW5kKHkxKSkpO1xuICAgICAgfVxuXG4gICAgICBvcHRpb25zLmNvbG9yU3RvcHMuZm9yRWFjaCgoeyBvZmZzZXQsIGNvbG9yIH06IHsgb2Zmc2V0OiBudW1iZXI7IGNvbG9yOiBzdHJpbmcgfSkgPT4ge1xuICAgICAgICBjb25zdCBzdG9wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgXCJzdG9wXCIpO1xuICAgICAgICBzdG9wLnNldEF0dHJpYnV0ZShcIm9mZnNldFwiLCBgJHsxMDAgKiBvZmZzZXR9JWApO1xuICAgICAgICBzdG9wLnNldEF0dHJpYnV0ZShcInN0b3AtY29sb3JcIiwgY29sb3IpO1xuICAgICAgICBncmFkaWVudC5hcHBlbmRDaGlsZChzdG9wKTtcbiAgICAgIH0pO1xuXG4gICAgICByZWN0LnNldEF0dHJpYnV0ZShcImZpbGxcIiwgYHVybCgnIyR7bmFtZX0nKWApO1xuICAgICAgdGhpcy5fZGVmcy5hcHBlbmRDaGlsZChncmFkaWVudCk7XG4gICAgfSBlbHNlIGlmIChjb2xvcikge1xuICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIGNvbG9yKTtcbiAgICB9XG5cbiAgICB0aGlzLl9lbGVtZW50LmFwcGVuZENoaWxkKHJlY3QpO1xuICB9XG59XG4iLCJpbXBvcnQgY29ybmVyRG90VHlwZXMgZnJvbSBcIi4uLy4uLy4uL2NvbnN0YW50cy9jb3JuZXJEb3RUeXBlc1wiO1xuaW1wb3J0IHtcbiAgQ29ybmVyRG90VHlwZSxcbiAgUm90YXRlRmlndXJlQXJnc0NhbnZhcyxcbiAgQmFzaWNGaWd1cmVEcmF3QXJnc0NhbnZhcyxcbiAgRHJhd0FyZ3NDYW52YXMsXG59IGZyb20gXCIuLi8uLi8uLi90eXBlc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRUkNvcm5lckRvdCB7XG4gIF9jb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gIF90eXBlOiBDb3JuZXJEb3RUeXBlO1xuXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBjb250ZXh0LFxuICAgIHR5cGUsXG4gIH06IHtcbiAgICBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gICAgdHlwZTogQ29ybmVyRG90VHlwZTtcbiAgfSkge1xuICAgIHRoaXMuX2NvbnRleHQgPSBjb250ZXh0O1xuICAgIHRoaXMuX3R5cGUgPSB0eXBlO1xuICB9XG5cbiAgZHJhdyh4OiBudW1iZXIsIHk6IG51bWJlciwgc2l6ZTogbnVtYmVyLCByb3RhdGlvbjogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgY29udGV4dCA9IHRoaXMuX2NvbnRleHQ7XG4gICAgY29uc3QgdHlwZSA9IHRoaXMuX3R5cGU7XG4gICAgbGV0IGRyYXdGdW5jdGlvbjtcblxuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSBjb3JuZXJEb3RUeXBlcy5zcXVhcmU6XG4gICAgICAgIGRyYXdGdW5jdGlvbiA9IHRoaXMuX2RyYXdTcXVhcmU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBjb3JuZXJEb3RUeXBlcy5zcXVhcmVSb3VuZGVkOlxuICAgICAgICBkcmF3RnVuY3Rpb24gPSB0aGlzLl9kcmF3U3F1YXJlUm91bmRlZDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGNvcm5lckRvdFR5cGVzLnJpZ2h0Qm90dG9tU3F1YXJlOlxuICAgICAgICBkcmF3RnVuY3Rpb24gPSB0aGlzLl9kcmF3U3F1YXJlUm91bmRlZFJpZ2h0Qm90dG9tRWRnZTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgY29ybmVyRG90VHlwZXMuc3RhcjpcbiAgICAgICAgZHJhd0Z1bmN0aW9uID0gdGhpcy5fZHJhd1N0YXI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBjb3JuZXJEb3RUeXBlcy5wbHVzOlxuICAgICAgICBkcmF3RnVuY3Rpb24gPSB0aGlzLl9kcmF3UGx1cztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGNvcm5lckRvdFR5cGVzLmNyb3NzOlxuICAgICAgICBkcmF3RnVuY3Rpb24gPSB0aGlzLl9kcmF3Q3Jvc3M7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBjb3JuZXJEb3RUeXBlcy5kaWFtb25kOlxuICAgICAgICBkcmF3RnVuY3Rpb24gPSB0aGlzLl9kcmF3RGlhbW9uZDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGNvcm5lckRvdFR5cGVzLmxlYWY6XG4gICAgICAgIGRyYXdGdW5jdGlvbiA9IHRoaXMuX2RyYXdMZWFmO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgY29ybmVyRG90VHlwZXMubGVmdFRvcENpcmNsZTpcbiAgICAgICAgZHJhd0Z1bmN0aW9uID0gdGhpcy5fZHJhd0NpcmNsZUxlZnRUb3BFZGdlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgY29ybmVyRG90VHlwZXMucmlnaHRCb3R0b21DaXJjbGU6XG4gICAgICAgIGRyYXdGdW5jdGlvbiA9IHRoaXMuX2RyYXdDaXJjbGVSaWdodEJvdHRvbUVkZ2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBjb3JuZXJEb3RUeXBlcy5kb3Q6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBkcmF3RnVuY3Rpb24gPSB0aGlzLl9kcmF3RG90O1xuICAgIH1cblxuICAgIGRyYXdGdW5jdGlvbi5jYWxsKHRoaXMsIHsgeCwgeSwgc2l6ZSwgY29udGV4dCwgcm90YXRpb24gfSk7XG4gIH1cblxuICBfcm90YXRlRmlndXJlKHtcbiAgICB4LFxuICAgIHksXG4gICAgc2l6ZSxcbiAgICBjb250ZXh0LFxuICAgIHJvdGF0aW9uID0gMCxcbiAgICBkcmF3LFxuICB9OiBSb3RhdGVGaWd1cmVBcmdzQ2FudmFzKTogdm9pZCB7XG4gICAgY29uc3QgY3ggPSB4ICsgc2l6ZSAvIDI7XG4gICAgY29uc3QgY3kgPSB5ICsgc2l6ZSAvIDI7XG5cbiAgICBjb250ZXh0LnRyYW5zbGF0ZShjeCwgY3kpO1xuICAgIHJvdGF0aW9uICYmIGNvbnRleHQucm90YXRlKHJvdGF0aW9uKTtcbiAgICBkcmF3KCk7XG4gICAgY29udGV4dC5jbG9zZVBhdGgoKTtcbiAgICByb3RhdGlvbiAmJiBjb250ZXh0LnJvdGF0ZSgtcm90YXRpb24pO1xuICAgIGNvbnRleHQudHJhbnNsYXRlKC1jeCwgLWN5KTtcbiAgfVxuXG4gIF9iYXNpY0RvdChhcmdzOiBCYXNpY0ZpZ3VyZURyYXdBcmdzQ2FudmFzKTogdm9pZCB7XG4gICAgY29uc3QgeyBzaXplLCBjb250ZXh0IH0gPSBhcmdzO1xuXG4gICAgdGhpcy5fcm90YXRlRmlndXJlKHtcbiAgICAgIC4uLmFyZ3MsXG4gICAgICBkcmF3OiAoKSA9PiB7XG4gICAgICAgIGNvbnRleHQuYXJjKDAsIDAsIHNpemUgLyAyLCAwLCBNYXRoLlBJICogMik7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgX2Jhc2ljU3F1YXJlKGFyZ3M6IEJhc2ljRmlndXJlRHJhd0FyZ3NDYW52YXMpOiB2b2lkIHtcbiAgICBjb25zdCB7IHNpemUsIGNvbnRleHQgfSA9IGFyZ3M7XG5cbiAgICB0aGlzLl9yb3RhdGVGaWd1cmUoe1xuICAgICAgLi4uYXJncyxcbiAgICAgIGRyYXc6ICgpID0+IHtcbiAgICAgICAgY29udGV4dC5yZWN0KC1zaXplIC8gMiwgLXNpemUgLyAyLCBzaXplLCBzaXplKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBfYmFzaWNSb3VuZGVkU3F1YXJlKGFyZ3M6IEJhc2ljRmlndXJlRHJhd0FyZ3NDYW52YXMpOiB2b2lkIHtcbiAgICBjb25zdCB7IHNpemUsIGNvbnRleHQgfSA9IGFyZ3M7XG4gICAgY29uc3QgcmFkaXVzID0gc2l6ZSAvIDU7IC8vIEFkanVzdCB0aGUgcmFkaXVzIGFzIG5lZWRlZFxuXG4gICAgdGhpcy5fcm90YXRlRmlndXJlKHtcbiAgICAgIC4uLmFyZ3MsXG4gICAgICBkcmF3OiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGhhbGZTaXplID0gc2l6ZSAvIDI7XG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIGNvbnRleHQubW92ZVRvKC1oYWxmU2l6ZSArIHJhZGl1cywgLWhhbGZTaXplKTtcbiAgICAgICAgY29udGV4dC5saW5lVG8oaGFsZlNpemUgLSByYWRpdXMsIC1oYWxmU2l6ZSk7XG4gICAgICAgIGNvbnRleHQuYXJjVG8oXG4gICAgICAgICAgaGFsZlNpemUsXG4gICAgICAgICAgLWhhbGZTaXplLFxuICAgICAgICAgIGhhbGZTaXplLFxuICAgICAgICAgIC1oYWxmU2l6ZSArIHJhZGl1cyxcbiAgICAgICAgICByYWRpdXNcbiAgICAgICAgKTtcbiAgICAgICAgY29udGV4dC5saW5lVG8oaGFsZlNpemUsIGhhbGZTaXplIC0gcmFkaXVzKTtcbiAgICAgICAgY29udGV4dC5hcmNUbyhoYWxmU2l6ZSwgaGFsZlNpemUsIGhhbGZTaXplIC0gcmFkaXVzLCBoYWxmU2l6ZSwgcmFkaXVzKTtcbiAgICAgICAgY29udGV4dC5saW5lVG8oLWhhbGZTaXplICsgcmFkaXVzLCBoYWxmU2l6ZSk7XG4gICAgICAgIGNvbnRleHQuYXJjVG8oXG4gICAgICAgICAgLWhhbGZTaXplLFxuICAgICAgICAgIGhhbGZTaXplLFxuICAgICAgICAgIC1oYWxmU2l6ZSxcbiAgICAgICAgICBoYWxmU2l6ZSAtIHJhZGl1cyxcbiAgICAgICAgICByYWRpdXNcbiAgICAgICAgKTtcbiAgICAgICAgY29udGV4dC5saW5lVG8oLWhhbGZTaXplLCAtaGFsZlNpemUgKyByYWRpdXMpO1xuICAgICAgICBjb250ZXh0LmFyY1RvKFxuICAgICAgICAgIC1oYWxmU2l6ZSxcbiAgICAgICAgICAtaGFsZlNpemUsXG4gICAgICAgICAgLWhhbGZTaXplICsgcmFkaXVzLFxuICAgICAgICAgIC1oYWxmU2l6ZSxcbiAgICAgICAgICByYWRpdXNcbiAgICAgICAgKTtcbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBfYmFzaWNSb3VuZGVkU3F1YXJlUmlnaHRCb3R0b21FZGdlKGFyZ3M6IEJhc2ljRmlndXJlRHJhd0FyZ3NDYW52YXMpOiB2b2lkIHtcbiAgICBjb25zdCB7IHNpemUsIGNvbnRleHQgfSA9IGFyZ3M7XG4gICAgY29uc3QgcmFkaXVzID0gc2l6ZSAvIDU7IC8vIEFkanVzdCB0aGUgcmFkaXVzIGFzIG5lZWRlZFxuXG4gICAgdGhpcy5fcm90YXRlRmlndXJlKHtcbiAgICAgIC4uLmFyZ3MsXG4gICAgICBkcmF3OiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGhhbGZTaXplID0gc2l6ZSAvIDI7XG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIGNvbnRleHQubW92ZVRvKC1oYWxmU2l6ZSArIHJhZGl1cywgLWhhbGZTaXplKTtcbiAgICAgICAgY29udGV4dC5saW5lVG8oaGFsZlNpemUgLSByYWRpdXMsIC1oYWxmU2l6ZSk7XG4gICAgICAgIGNvbnRleHQuYXJjVG8oXG4gICAgICAgICAgaGFsZlNpemUsXG4gICAgICAgICAgLWhhbGZTaXplLFxuICAgICAgICAgIGhhbGZTaXplLFxuICAgICAgICAgIC1oYWxmU2l6ZSArIHJhZGl1cyxcbiAgICAgICAgICByYWRpdXNcbiAgICAgICAgKTtcbiAgICAgICAgY29udGV4dC5saW5lVG8oaGFsZlNpemUsIC1oYWxmU2l6ZSArIHJhZGl1cyk7XG4gICAgICAgIGNvbnRleHQubGluZVRvKGhhbGZTaXplLCBoYWxmU2l6ZSk7XG4gICAgICAgIGNvbnRleHQubGluZVRvKGhhbGZTaXplIC0gcmFkaXVzLCBoYWxmU2l6ZSk7XG4gICAgICAgIGNvbnRleHQuYXJjVG8oXG4gICAgICAgICAgaGFsZlNpemUgLSByYWRpdXMsXG4gICAgICAgICAgaGFsZlNpemUsXG4gICAgICAgICAgaGFsZlNpemUgLSByYWRpdXMsXG4gICAgICAgICAgaGFsZlNpemUgLSByYWRpdXMsXG4gICAgICAgICAgcmFkaXVzXG4gICAgICAgICk7XG4gICAgICAgIGNvbnRleHQubGluZVRvKC1oYWxmU2l6ZSArIHJhZGl1cywgaGFsZlNpemUpO1xuICAgICAgICBjb250ZXh0LmFyY1RvKFxuICAgICAgICAgIC1oYWxmU2l6ZSxcbiAgICAgICAgICBoYWxmU2l6ZSxcbiAgICAgICAgICAtaGFsZlNpemUsXG4gICAgICAgICAgaGFsZlNpemUgLSByYWRpdXMsXG4gICAgICAgICAgcmFkaXVzXG4gICAgICAgICk7XG4gICAgICAgIGNvbnRleHQubGluZVRvKC1oYWxmU2l6ZSwgLWhhbGZTaXplICsgcmFkaXVzKTtcbiAgICAgICAgY29udGV4dC5hcmNUbyhcbiAgICAgICAgICAtaGFsZlNpemUsXG4gICAgICAgICAgLWhhbGZTaXplLFxuICAgICAgICAgIC1oYWxmU2l6ZSArIHJhZGl1cyxcbiAgICAgICAgICAtaGFsZlNpemUsXG4gICAgICAgICAgcmFkaXVzXG4gICAgICAgICk7XG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgX2Jhc2ljTGVhZihhcmdzOiBCYXNpY0ZpZ3VyZURyYXdBcmdzQ2FudmFzKTogdm9pZCB7XG4gICAgY29uc3QgeyBzaXplLCBjb250ZXh0IH0gPSBhcmdzO1xuICAgIGNvbnN0IGV4dGVuc2lvbiA9IHNpemUgLyA0OyAvLyBBZGp1c3QgdGhlIGV4dGVuc2lvbiBhcyBuZWVkZWRcbiAgICBjb25zdCBjb3JuZXJSYWRpdXMgPSBzaXplIC8gMTA7IC8vIEFkanVzdCB0aGUgY29ybmVyIHJhZGl1cyBhcyBuZWVkZWRcblxuICAgIHRoaXMuX3JvdGF0ZUZpZ3VyZSh7XG4gICAgICAuLi5hcmdzLFxuICAgICAgZHJhdzogKCkgPT4ge1xuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICBjb250ZXh0Lm1vdmVUbygtc2l6ZSAvIDIuMiAtIGV4dGVuc2lvbiwgLXNpemUgLyAyLjIgLSBleHRlbnNpb24pOyAvLyBTdGFydCBhdCB0aGUgdG9wIGxlZnQgY29ybmVyXG4gICAgICAgIGNvbnRleHQubGluZVRvKHNpemUgLyAyLjIsIC1zaXplIC8gMi4yKTsgLy8gRHJhdyB0b3AgZWRnZVxuICAgICAgICBjb250ZXh0LmxpbmVUbyhzaXplIC8gMi4yLCBzaXplIC8gMi4yKTsgLy8gRHJhdyByaWdodCBlZGdlXG4gICAgICAgIGNvbnRleHQubGluZVRvKC1zaXplIC8gMi4yLCBzaXplIC8gMi4yKTsgLy8gRHJhdyBib3R0b20gZWRnZVxuXG4gICAgICAgIC8vIERyYXcgcm91bmRlZCBsZWZ0IHRvcCBjb3JuZXJcbiAgICAgICAgY29udGV4dC5hcmMoXG4gICAgICAgICAgLXNpemUgLyAyLjIgLSBleHRlbnNpb24gKyBjb3JuZXJSYWRpdXMsXG4gICAgICAgICAgLXNpemUgLyAyLjIgKyBjb3JuZXJSYWRpdXMgLSBleHRlbnNpb24sXG4gICAgICAgICAgY29ybmVyUmFkaXVzLFxuICAgICAgICAgIE1hdGguUEksXG4gICAgICAgICAgTWF0aC5QSSAqIDEuNVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG5cbiAgICAgICAgY29udGV4dC5maWxsKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgX2Jhc2ljQ2lyY2xlTGVmdFRvcEVkZ2UoYXJnczogQmFzaWNGaWd1cmVEcmF3QXJnc0NhbnZhcyk6IHZvaWQge1xuICAgIGNvbnN0IHsgc2l6ZSwgY29udGV4dCB9ID0gYXJncztcbiAgICBjb25zdCByYWRpdXMgPSBzaXplIC8gMjsgLy8gUmFkaXVzIG9mIHRoZSByb3VuZGVkIGNvcm5lcnNcbiAgICBjb25zdCBjb3JuZXJTaXplID0gcmFkaXVzIC8gMzI7IC8vIFNpemUgb2YgdGhlIGZsYXQgdG9wLWxlZnQgY29ybmVyXG5cbiAgICB0aGlzLl9yb3RhdGVGaWd1cmUoe1xuICAgICAgLi4uYXJncyxcbiAgICAgIGRyYXc6ICgpID0+IHtcbiAgICAgICAgY29uc3QgaGFsZlNpemUgPSBzaXplIC8gMjtcblxuICAgICAgICAvLyBEcmF3IHRoZSBmdWxsIHJvdW5kZWQgc3F1YXJlXG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG5cbiAgICAgICAgLy8gTW92ZSB0byB0aGUgc3RhcnRpbmcgcG9pbnQgb2YgdGhlIHRvcC1yaWdodCBjb3JuZXJcbiAgICAgICAgY29udGV4dC5tb3ZlVG8oLWhhbGZTaXplICsgY29ybmVyU2l6ZSwgLWhhbGZTaXplKTtcblxuICAgICAgICAvLyBEcmF3IHRoZSB0b3AtcmlnaHQgY29ybmVyXG4gICAgICAgIGNvbnRleHQubGluZVRvKGhhbGZTaXplIC0gcmFkaXVzLCAtaGFsZlNpemUpO1xuICAgICAgICBjb250ZXh0LmFyY1RvKFxuICAgICAgICAgIGhhbGZTaXplLFxuICAgICAgICAgIC1oYWxmU2l6ZSxcbiAgICAgICAgICBoYWxmU2l6ZSxcbiAgICAgICAgICAtaGFsZlNpemUgKyByYWRpdXMsXG4gICAgICAgICAgcmFkaXVzXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gRHJhdyB0aGUgcmlnaHQgc2lkZVxuICAgICAgICBjb250ZXh0LmxpbmVUbyhoYWxmU2l6ZSwgaGFsZlNpemUgLSByYWRpdXMpO1xuICAgICAgICBjb250ZXh0LmFyY1RvKGhhbGZTaXplLCBoYWxmU2l6ZSwgaGFsZlNpemUgLSByYWRpdXMsIGhhbGZTaXplLCByYWRpdXMpO1xuXG4gICAgICAgIC8vIERyYXcgdGhlIGJvdHRvbSBzaWRlXG4gICAgICAgIGNvbnRleHQubGluZVRvKC1oYWxmU2l6ZSArIHJhZGl1cywgaGFsZlNpemUpO1xuICAgICAgICBjb250ZXh0LmFyY1RvKFxuICAgICAgICAgIC1oYWxmU2l6ZSxcbiAgICAgICAgICBoYWxmU2l6ZSxcbiAgICAgICAgICAtaGFsZlNpemUsXG4gICAgICAgICAgaGFsZlNpemUgLSByYWRpdXMsXG4gICAgICAgICAgcmFkaXVzXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gRHJhdyB0aGUgbGVmdCBzaWRlXG4gICAgICAgIGNvbnRleHQubGluZVRvKC1oYWxmU2l6ZSwgLWhhbGZTaXplICsgY29ybmVyU2l6ZSk7XG5cbiAgICAgICAgLy8gRHJhdyB0aGUgZmxhdCB0b3AtbGVmdCBjb3JuZXJcbiAgICAgICAgY29udGV4dC5saW5lVG8oLWhhbGZTaXplICsgY29ybmVyU2l6ZSwgLWhhbGZTaXplKTtcblxuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuICAgICAgICAvLyBjb250ZXh0LmZpbGxTdHlsZSA9ICcjMDAwJzsgLy8gU2V0IGNvbG9yIGZvciB0aGUgcm91bmRlZCBzcXVhcmVcbiAgICAgICAgY29udGV4dC5maWxsKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgX2Jhc2ljQ2lyY2xlUmlnaHRCb3R0b21FZGdlKGFyZ3M6IEJhc2ljRmlndXJlRHJhd0FyZ3NDYW52YXMpOiB2b2lkIHtcbiAgICBjb25zdCB7IHNpemUsIGNvbnRleHQgfSA9IGFyZ3M7XG4gICAgY29uc3QgcmFkaXVzID0gc2l6ZSAvIDI7IC8vIFJhZGl1cyBvZiB0aGUgcm91bmRlZCBjb3JuZXJzXG4gICAgY29uc3QgY29ybmVyU2l6ZSA9IHJhZGl1cyAvIDMyOyAvLyBTaXplIG9mIHRoZSBmbGF0IHJpZ2h0LWJvdHRvbSBjb3JuZXJcblxuICAgIHRoaXMuX3JvdGF0ZUZpZ3VyZSh7XG4gICAgICAuLi5hcmdzLFxuICAgICAgZHJhdzogKCkgPT4ge1xuICAgICAgICBjb25zdCBoYWxmU2l6ZSA9IHNpemUgLyAyO1xuXG4gICAgICAgIC8vIERyYXcgdGhlIGZ1bGwgcm91bmRlZCBzcXVhcmVcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcblxuICAgICAgICAvLyBNb3ZlIHRvIHRoZSBzdGFydGluZyBwb2ludCBvZiB0aGUgdG9wLWxlZnQgY29ybmVyXG4gICAgICAgIGNvbnRleHQubW92ZVRvKC1oYWxmU2l6ZSwgLWhhbGZTaXplICsgY29ybmVyU2l6ZSk7XG5cbiAgICAgICAgLy8gRHJhdyB0aGUgdG9wLWxlZnQgY29ybmVyXG4gICAgICAgIGNvbnRleHQubGluZVRvKC1oYWxmU2l6ZSArIHJhZGl1cywgLWhhbGZTaXplKTtcbiAgICAgICAgY29udGV4dC5hcmNUbyhcbiAgICAgICAgICAtaGFsZlNpemUsXG4gICAgICAgICAgLWhhbGZTaXplLFxuICAgICAgICAgIC1oYWxmU2l6ZSxcbiAgICAgICAgICAtaGFsZlNpemUgKyByYWRpdXMsXG4gICAgICAgICAgcmFkaXVzXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gRHJhdyB0aGUgdG9wIHNpZGVcbiAgICAgICAgY29udGV4dC5saW5lVG8oaGFsZlNpemUgLSByYWRpdXMsIC1oYWxmU2l6ZSk7XG4gICAgICAgIGNvbnRleHQuYXJjVG8oXG4gICAgICAgICAgaGFsZlNpemUsXG4gICAgICAgICAgLWhhbGZTaXplLFxuICAgICAgICAgIGhhbGZTaXplLFxuICAgICAgICAgIC1oYWxmU2l6ZSArIHJhZGl1cyxcbiAgICAgICAgICByYWRpdXNcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBEcmF3IHRoZSByaWdodCBzaWRlXG4gICAgICAgIGNvbnRleHQubGluZVRvKGhhbGZTaXplLCBoYWxmU2l6ZSAtIGNvcm5lclNpemUpO1xuXG4gICAgICAgIC8vIERyYXcgdGhlIGZsYXQgcmlnaHQtYm90dG9tIGNvcm5lclxuICAgICAgICBjb250ZXh0LmxpbmVUbyhoYWxmU2l6ZSwgaGFsZlNpemUpO1xuICAgICAgICBjb250ZXh0LmxpbmVUbyhoYWxmU2l6ZSAtIGNvcm5lclNpemUsIGhhbGZTaXplKTtcblxuICAgICAgICAvLyBEcmF3IHRoZSBib3R0b20gc2lkZVxuICAgICAgICBjb250ZXh0LmxpbmVUbygtaGFsZlNpemUgKyByYWRpdXMsIGhhbGZTaXplKTtcbiAgICAgICAgY29udGV4dC5hcmNUbyhcbiAgICAgICAgICAtaGFsZlNpemUsXG4gICAgICAgICAgaGFsZlNpemUsXG4gICAgICAgICAgLWhhbGZTaXplLFxuICAgICAgICAgIGhhbGZTaXplIC0gcmFkaXVzLFxuICAgICAgICAgIHJhZGl1c1xuICAgICAgICApO1xuXG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG4gICAgICAgIC8vIGNvbnRleHQuZmlsbFN0eWxlID0gJyMwMDAnOyAvLyBTZXQgY29sb3IgZm9yIHRoZSByb3VuZGVkIHNxdWFyZVxuICAgICAgICBjb250ZXh0LmZpbGwoKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBfYmFzaWNEaWFtb25kKGFyZ3M6IEJhc2ljRmlndXJlRHJhd0FyZ3NDYW52YXMpOiB2b2lkIHtcbiAgICBjb25zdCB7IHNpemUsIGNvbnRleHQgfSA9IGFyZ3M7XG4gICAgY29uc3QgaGFsZlNpemUgPSBzaXplIC8gMjsgLy8gSGFsZiB0aGUgc2l6ZSBvZiB0aGUgZGlhbW9uZFxuXG4gICAgdGhpcy5fcm90YXRlRmlndXJlKHtcbiAgICAgIC4uLmFyZ3MsXG4gICAgICBkcmF3OiAoKSA9PiB7XG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG5cbiAgICAgICAgLy8gTW92ZSB0byB0aGUgdG9wIHBvaW50IG9mIHRoZSBkaWFtb25kXG4gICAgICAgIGNvbnRleHQubW92ZVRvKDAsIC1oYWxmU2l6ZSk7XG5cbiAgICAgICAgLy8gRHJhdyB0aGUgcmlnaHQgcG9pbnRcbiAgICAgICAgY29udGV4dC5saW5lVG8oaGFsZlNpemUsIDApO1xuXG4gICAgICAgIC8vIERyYXcgdGhlIGJvdHRvbSBwb2ludFxuICAgICAgICBjb250ZXh0LmxpbmVUbygwLCBoYWxmU2l6ZSk7XG5cbiAgICAgICAgLy8gRHJhdyB0aGUgbGVmdCBwb2ludFxuICAgICAgICBjb250ZXh0LmxpbmVUbygtaGFsZlNpemUsIDApO1xuXG4gICAgICAgIC8vIENsb3NlIHRoZSBwYXRoIHRvIHRoZSB0b3AgcG9pbnRcbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcblxuICAgICAgICAvLyBjb250ZXh0LmZpbGxTdHlsZSA9IFwiIzAwMFwiOyAvLyBTZXQgY29sb3IgZm9yIHRoZSBkaWFtb25kXG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIF9iYXNpY1N0YXIoYXJnczogQmFzaWNGaWd1cmVEcmF3QXJnc0NhbnZhcyk6IHZvaWQge1xuICAgIGNvbnN0IHsgc2l6ZSwgY29udGV4dCB9ID0gYXJncztcblxuICAgIGNvbnN0IG51bVBvaW50cyA9IDU7XG4gICAgY29uc3Qgb3V0ZXJSYWRpdXMgPSBzaXplIC8gMjtcbiAgICBjb25zdCBpbm5lclJhZGl1cyA9IG91dGVyUmFkaXVzIC8gMi41O1xuICAgIGNvbnN0IHN0ZXAgPSBNYXRoLlBJIC8gbnVtUG9pbnRzO1xuXG4gICAgdGhpcy5fcm90YXRlRmlndXJlKHtcbiAgICAgIC4uLmFyZ3MsXG4gICAgICBkcmF3OiAoKSA9PiB7XG4gICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMiAqIG51bVBvaW50czsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgcmFkaXVzID0gaSAlIDIgPT09IDAgPyBvdXRlclJhZGl1cyA6IGlubmVyUmFkaXVzO1xuICAgICAgICAgIGNvbnN0IGFuZ2xlID0gaSAqIHN0ZXA7XG4gICAgICAgICAgY29udGV4dC5saW5lVG8ocmFkaXVzICogTWF0aC5jb3MoYW5nbGUpLCByYWRpdXMgKiBNYXRoLnNpbihhbmdsZSkpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgX2Jhc2ljUGx1cyhhcmdzOiBCYXNpY0ZpZ3VyZURyYXdBcmdzQ2FudmFzKTogdm9pZCB7XG4gICAgY29uc3QgeyBzaXplLCBjb250ZXh0IH0gPSBhcmdzO1xuXG4gICAgY29uc3QgdGhpY2tuZXNzID0gc2l6ZSAvIDU7XG4gICAgY29uc3QgaGFsZlRoaWNrbmVzcyA9IHRoaWNrbmVzcyAvIDI7XG4gICAgY29uc3QgaGFsZlNpemUgPSBzaXplIC8gMjtcblxuICAgIHRoaXMuX3JvdGF0ZUZpZ3VyZSh7XG4gICAgICAuLi5hcmdzLFxuICAgICAgZHJhdzogKCkgPT4ge1xuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICBjb250ZXh0LnJlY3QoLWhhbGZUaGlja25lc3MsIC1oYWxmU2l6ZSwgdGhpY2tuZXNzLCBzaXplKTsgLy8gdmVydGljYWwgcmVjdGFuZ2xlXG4gICAgICAgIGNvbnRleHQucmVjdCgtaGFsZlNpemUsIC1oYWxmVGhpY2tuZXNzLCBzaXplLCB0aGlja25lc3MpOyAvLyBob3Jpem9udGFsIHJlY3RhbmdsZVxuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIF9iYXNpY0Nyb3NzKGFyZ3M6IEJhc2ljRmlndXJlRHJhd0FyZ3NDYW52YXMpOiB2b2lkIHtcbiAgICBjb25zdCB7IHNpemUsIGNvbnRleHQgfSA9IGFyZ3M7XG4gICAgY29uc3QgbGluZVdpZHRoID0gc2l6ZSAvIDQ7IC8vIFdpZHRoIG9mIHRoZSBjcm9zcyBsaW5lc1xuICAgIGNvbnN0IGhhbGZTaXplID0gc2l6ZSAvIDI7IC8vIEhhbGYgdGhlIHNpemUgb2YgdGhlIGNyb3NzXG5cbiAgICB0aGlzLl9yb3RhdGVGaWd1cmUoe1xuICAgICAgICAuLi5hcmdzLFxuICAgICAgICBkcmF3OiAoKSA9PiB7XG4gICAgICAgICAgICBjb250ZXh0LnNhdmUoKTsgLy8gU2F2ZSB0aGUgY3VycmVudCBzdGF0ZVxuICAgICAgICAgICAgY29udGV4dC50cmFuc2xhdGUoMCwgMCk7IC8vIE1vdmUgdG8gdGhlIGNlbnRlclxuICAgICAgICAgICAgY29udGV4dC5yb3RhdGUoTWF0aC5QSSAvIDQpOyAvLyBSb3RhdGUgNDUgZGVncmVlcyAocGkvNCByYWRpYW5zKVxuXG4gICAgICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBEcmF3IHRoZSBob3Jpem9udGFsIGxpbmUgb2YgdGhlIGNyb3NzXG4gICAgICAgICAgICBjb250ZXh0LnJlY3QoLWhhbGZTaXplLCAtbGluZVdpZHRoIC8gMiwgc2l6ZSwgbGluZVdpZHRoKTtcblxuICAgICAgICAgICAgLy8gRHJhdyB0aGUgdmVydGljYWwgbGluZSBvZiB0aGUgY3Jvc3NcbiAgICAgICAgICAgIGNvbnRleHQucmVjdCgtbGluZVdpZHRoIC8gMiwgLWhhbGZTaXplLCBsaW5lV2lkdGgsIHNpemUpO1xuXG4gICAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICcjMDAwJzsgLy8gU2V0IGMvL29sb3IgZm9yIHRoZSBjcm9zc1xuICAgICAgICAgICAgY29udGV4dC5maWxsKCk7XG5cbiAgICAgICAgICAgIGNvbnRleHQucmVzdG9yZSgpOyAvLyBSZXN0b3JlIHRoZSBzdGF0ZVxuICAgICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgX2RyYXdEb3QoeyB4LCB5LCBzaXplLCBjb250ZXh0LCByb3RhdGlvbiB9OiBEcmF3QXJnc0NhbnZhcyk6IHZvaWQge1xuICAgIHRoaXMuX2Jhc2ljRG90KHsgeCwgeSwgc2l6ZSwgY29udGV4dCwgcm90YXRpb24gfSk7XG4gIH1cblxuICBfZHJhd1NxdWFyZSh7IHgsIHksIHNpemUsIGNvbnRleHQsIHJvdGF0aW9uIH06IERyYXdBcmdzQ2FudmFzKTogdm9pZCB7XG4gICAgdGhpcy5fYmFzaWNTcXVhcmUoeyB4LCB5LCBzaXplLCBjb250ZXh0LCByb3RhdGlvbiB9KTtcbiAgfVxuXG4gIF9kcmF3U3Rhcih7IHgsIHksIHNpemUsIGNvbnRleHQsIHJvdGF0aW9uIH06IERyYXdBcmdzQ2FudmFzKTogdm9pZCB7XG4gICAgdGhpcy5fYmFzaWNTdGFyKHsgeCwgeSwgc2l6ZSwgY29udGV4dCwgcm90YXRpb24gfSk7XG4gIH1cblxuICBfZHJhd1BsdXMoeyB4LCB5LCBzaXplLCBjb250ZXh0LCByb3RhdGlvbiB9OiBEcmF3QXJnc0NhbnZhcyk6IHZvaWQge1xuICAgIHRoaXMuX2Jhc2ljUGx1cyh7IHgsIHksIHNpemUsIGNvbnRleHQsIHJvdGF0aW9uIH0pO1xuICB9XG5cbiAgX2RyYXdDcm9zcyh7IHgsIHksIHNpemUsIGNvbnRleHQsIHJvdGF0aW9uIH06IERyYXdBcmdzQ2FudmFzKTogdm9pZCB7XG4gICAgdGhpcy5fYmFzaWNDcm9zcyh7IHgsIHksIHNpemUsIGNvbnRleHQsIHJvdGF0aW9uIH0pO1xuICB9XG5cbiAgX2RyYXdEaWFtb25kKHsgeCwgeSwgc2l6ZSwgY29udGV4dCwgcm90YXRpb24gfTogRHJhd0FyZ3NDYW52YXMpOiB2b2lkIHtcbiAgICB0aGlzLl9iYXNpY0RpYW1vbmQoeyB4LCB5LCBzaXplLCBjb250ZXh0LCByb3RhdGlvbiB9KTtcbiAgfVxuXG4gIF9kcmF3U3F1YXJlUm91bmRlZCh7IHgsIHksIHNpemUsIGNvbnRleHQsIHJvdGF0aW9uIH06IERyYXdBcmdzQ2FudmFzKTogdm9pZCB7XG4gICAgdGhpcy5fYmFzaWNSb3VuZGVkU3F1YXJlKHsgeCwgeSwgc2l6ZSwgY29udGV4dCwgcm90YXRpb24gfSk7XG4gIH1cblxuICBfZHJhd1NxdWFyZVJvdW5kZWRSaWdodEJvdHRvbUVkZ2Uoe1xuICAgIHgsXG4gICAgeSxcbiAgICBzaXplLFxuICAgIGNvbnRleHQsXG4gICAgcm90YXRpb24sXG4gIH06IERyYXdBcmdzQ2FudmFzKTogdm9pZCB7XG4gICAgdGhpcy5fYmFzaWNSb3VuZGVkU3F1YXJlUmlnaHRCb3R0b21FZGdlKHsgeCwgeSwgc2l6ZSwgY29udGV4dCwgcm90YXRpb24gfSk7XG4gIH1cblxuICBfZHJhd0xlYWYoeyB4LCB5LCBzaXplLCBjb250ZXh0LCByb3RhdGlvbiB9OiBEcmF3QXJnc0NhbnZhcyk6IHZvaWQge1xuICAgIHRoaXMuX2Jhc2ljTGVhZih7IHgsIHksIHNpemUsIGNvbnRleHQsIHJvdGF0aW9uIH0pO1xuICB9XG5cbiAgX2RyYXdDaXJjbGVMZWZ0VG9wRWRnZSh7XG4gICAgeCxcbiAgICB5LFxuICAgIHNpemUsXG4gICAgY29udGV4dCxcbiAgICByb3RhdGlvbixcbiAgfTogRHJhd0FyZ3NDYW52YXMpOiB2b2lkIHtcbiAgICB0aGlzLl9iYXNpY0NpcmNsZUxlZnRUb3BFZGdlKHsgeCwgeSwgc2l6ZSwgY29udGV4dCwgcm90YXRpb24gfSk7XG4gIH1cblxuICBfZHJhd0NpcmNsZVJpZ2h0Qm90dG9tRWRnZSh7XG4gICAgeCxcbiAgICB5LFxuICAgIHNpemUsXG4gICAgY29udGV4dCxcbiAgICByb3RhdGlvbixcbiAgfTogRHJhd0FyZ3NDYW52YXMpOiB2b2lkIHtcbiAgICB0aGlzLl9iYXNpY0NpcmNsZVJpZ2h0Qm90dG9tRWRnZSh7IHgsIHksIHNpemUsIGNvbnRleHQsIHJvdGF0aW9uIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgY29ybmVyRG90VHlwZXMgZnJvbSBcIi4uLy4uLy4uL2NvbnN0YW50cy9jb3JuZXJEb3RUeXBlc1wiO1xuaW1wb3J0IHtcbiAgQ29ybmVyRG90VHlwZSxcbiAgUm90YXRlRmlndXJlQXJncyxcbiAgQmFzaWNGaWd1cmVEcmF3QXJncyxcbiAgRHJhd0FyZ3MsXG59IGZyb20gXCIuLi8uLi8uLi90eXBlc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRUkNvcm5lckRvdCB7XG4gIF9zdmc6IFNWR0VsZW1lbnQ7XG4gIF90eXBlOiBDb3JuZXJEb3RUeXBlO1xuICBfZWxlbWVudDogU1ZHRWxlbWVudCB8IG51bGw7XG5cbiAgY29uc3RydWN0b3IoeyBzdmcsIHR5cGUgfTogeyBzdmc6IFNWR0VsZW1lbnQ7IHR5cGU6IENvcm5lckRvdFR5cGUgfSkge1xuICAgIHRoaXMuX3N2ZyA9IHN2ZztcbiAgICB0aGlzLl90eXBlID0gdHlwZTtcbiAgICB0aGlzLl9lbGVtZW50ID0gbnVsbDtcbiAgfVxuXG4gIGRyYXcoeDogbnVtYmVyLCB5OiBudW1iZXIsIHNpemU6IG51bWJlciwgcm90YXRpb246IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IHR5cGUgPSB0aGlzLl90eXBlO1xuICAgIGxldCBkcmF3RnVuY3Rpb247XG5cbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgY29ybmVyRG90VHlwZXMuc3F1YXJlOlxuICAgICAgICBkcmF3RnVuY3Rpb24gPSB0aGlzLl9kcmF3U3F1YXJlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgY29ybmVyRG90VHlwZXMuc3RhcjpcbiAgICAgICAgZHJhd0Z1bmN0aW9uID0gdGhpcy5fZHJhd1N0YXI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBjb3JuZXJEb3RUeXBlcy5zcXVhcmVSb3VuZGVkOlxuICAgICAgICBkcmF3RnVuY3Rpb24gPSB0aGlzLl9kcmF3U3F1YXJlUm91bmRlZDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGNvcm5lckRvdFR5cGVzLnJpZ2h0Qm90dG9tU3F1YXJlOlxuICAgICAgICBkcmF3RnVuY3Rpb24gPSB0aGlzLl9kcmF3U3F1YXJlUm91bmRlZFJpZ2h0Qm90dG9tRWRnZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGNvcm5lckRvdFR5cGVzLnBsdXM6XG4gICAgICAgIGRyYXdGdW5jdGlvbiA9IHRoaXMuX2RyYXdQbHVzO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgY29ybmVyRG90VHlwZXMuY3Jvc3M6XG4gICAgICAgIGRyYXdGdW5jdGlvbiA9IHRoaXMuX2RyYXdDcm9zcztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGNvcm5lckRvdFR5cGVzLnJob21idXM6XG4gICAgICAgIGRyYXdGdW5jdGlvbiA9IHRoaXMuX2RyYXdSaG9tYnVzO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgY29ybmVyRG90VHlwZXMubGVhZjpcbiAgICAgICAgZHJhd0Z1bmN0aW9uID0gdGhpcy5fZHJhd0xlYWQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBjb3JuZXJEb3RUeXBlcy5sZWZ0VG9wQ2lyY2xlOlxuICAgICAgICBkcmF3RnVuY3Rpb24gPSB0aGlzLl9kcmF3Q2lyY2xlTGVmdFRvcEVkZ2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBjb3JuZXJEb3RUeXBlcy5yaWdodEJvdHRvbUNpcmNsZTpcbiAgICAgICAgZHJhd0Z1bmN0aW9uID0gdGhpcy5fZHJhd0NpcmNsZVJpZ2h0Qm90dG9tRWRnZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGNvcm5lckRvdFR5cGVzLmRpYW1vbmQ6XG4gICAgICAgIGRyYXdGdW5jdGlvbiA9IHRoaXMuX2RyYXdEaWFtb25kO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgY29ybmVyRG90VHlwZXMuZG90OlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgZHJhd0Z1bmN0aW9uID0gdGhpcy5fZHJhd0RvdDtcbiAgICB9XG5cbiAgICBkcmF3RnVuY3Rpb24uY2FsbCh0aGlzLCB7IHgsIHksIHNpemUsIHJvdGF0aW9uIH0pO1xuICB9XG5cbiAgX3JvdGF0ZUZpZ3VyZSh7IHgsIHksIHNpemUsIHJvdGF0aW9uID0gMCwgZHJhdyB9OiBSb3RhdGVGaWd1cmVBcmdzKTogdm9pZCB7XG4gICAgY29uc3QgY3ggPSB4ICsgc2l6ZSAvIDI7XG4gICAgY29uc3QgY3kgPSB5ICsgc2l6ZSAvIDI7XG5cbiAgICBkcmF3KCk7XG4gICAgY29uc3QgbGFzdENoaWxkID0gdGhpcy5fc3ZnLmxhc3RDaGlsZCBhcyBTVkdFbGVtZW50IHwgbnVsbDtcbiAgICBpZiAobGFzdENoaWxkKSB7XG4gICAgICBsYXN0Q2hpbGQuc2V0QXR0cmlidXRlKFxuICAgICAgICBcInRyYW5zZm9ybVwiLFxuICAgICAgICBgcm90YXRlKCR7KDE4MCAqIHJvdGF0aW9uKSAvIE1hdGguUEl9LCR7Y3h9LCR7Y3l9KWBcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgX2Jhc2ljRG90KGFyZ3M6IEJhc2ljRmlndXJlRHJhd0FyZ3MpOiB2b2lkIHtcbiAgICBjb25zdCB7IHNpemUsIHgsIHkgfSA9IGFyZ3M7XG5cbiAgICB0aGlzLl9yb3RhdGVGaWd1cmUoe1xuICAgICAgLi4uYXJncyxcbiAgICAgIGRyYXc6ICgpID0+IHtcbiAgICAgICAgY29uc3QgY2lyY2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFxuICAgICAgICAgIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcbiAgICAgICAgICBcImNpcmNsZVwiXG4gICAgICAgICk7XG4gICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJjeFwiLCBTdHJpbmcoeCArIHNpemUgLyAyKSk7XG4gICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJjeVwiLCBTdHJpbmcoeSArIHNpemUgLyAyKSk7XG4gICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJyXCIsIFN0cmluZyhzaXplIC8gMikpO1xuICAgICAgICB0aGlzLl9zdmcuYXBwZW5kQ2hpbGQoY2lyY2xlKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBfYmFzaWNTcXVhcmUoYXJnczogQmFzaWNGaWd1cmVEcmF3QXJncyk6IHZvaWQge1xuICAgIGNvbnN0IHsgc2l6ZSwgeCwgeSB9ID0gYXJncztcblxuICAgIHRoaXMuX3JvdGF0ZUZpZ3VyZSh7XG4gICAgICAuLi5hcmdzLFxuICAgICAgZHJhdzogKCkgPT4ge1xuICAgICAgICBjb25zdCByZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFxuICAgICAgICAgIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcbiAgICAgICAgICBcInJlY3RcIlxuICAgICAgICApO1xuICAgICAgICByZWN0LnNldEF0dHJpYnV0ZShcInhcIiwgU3RyaW5nKHgpKTtcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoXCJ5XCIsIFN0cmluZyh5KSk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgU3RyaW5nKHNpemUpKTtcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIiwgU3RyaW5nKHNpemUpKTtcbiAgICAgICAgdGhpcy5fc3ZnLmFwcGVuZENoaWxkKHJlY3QpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIF9iYXNpY1JvdW5kZWRTcXVhcmUoYXJnczogQmFzaWNGaWd1cmVEcmF3QXJncyk6IHZvaWQge1xuICAgIGNvbnN0IHsgc2l6ZSwgeCwgeSB9ID0gYXJncztcbiAgICBjb25zdCByYWRpdXMgPSBzaXplIC8gNTsgLy8gQWRqdXN0IHRoZSByYWRpdXMgYXMgbmVlZGVkXG5cbiAgICB0aGlzLl9yb3RhdGVGaWd1cmUoe1xuICAgICAgLi4uYXJncyxcbiAgICAgIGRyYXc6ICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcbiAgICAgICAgICBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG4gICAgICAgICAgXCJyZWN0XCJcbiAgICAgICAgKTtcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoXCJ4XCIsIFN0cmluZyh4KSk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKFwieVwiLCBTdHJpbmcoeSkpO1xuICAgICAgICByZWN0LnNldEF0dHJpYnV0ZShcIndpZHRoXCIsIFN0cmluZyhzaXplKSk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIsIFN0cmluZyhzaXplKSk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKFwicnhcIiwgU3RyaW5nKHJhZGl1cykpO1xuICAgICAgICByZWN0LnNldEF0dHJpYnV0ZShcInJ5XCIsIFN0cmluZyhyYWRpdXMpKTtcbiAgICAgICAgdGhpcy5fc3ZnLmFwcGVuZENoaWxkKHJlY3QpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIF9iYXNpY1JvdW5kZWRTcXVhcmVSaWdodEJvdHRvbUVkZ2UoYXJnczogQmFzaWNGaWd1cmVEcmF3QXJncyk6IHZvaWQge1xuICAgIGNvbnN0IHsgc2l6ZSwgeCwgeSB9ID0gYXJncztcbiAgICBjb25zdCByYWRpdXMgPSBzaXplIC8gNTsgLy8gQWRqdXN0IHRoZSByYWRpdXMgYXMgbmVlZGVkXG5cbiAgICB0aGlzLl9yb3RhdGVGaWd1cmUoe1xuICAgICAgLi4uYXJncyxcbiAgICAgIGRyYXc6ICgpID0+IHtcbiAgICAgICAgY29uc3QgcmVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcbiAgICAgICAgICBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG4gICAgICAgICAgXCJyZWN0XCJcbiAgICAgICAgKTtcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoXCJ4XCIsIFN0cmluZyh4KSk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKFwieVwiLCBTdHJpbmcoeSkpO1xuICAgICAgICByZWN0LnNldEF0dHJpYnV0ZShcIndpZHRoXCIsIFN0cmluZyhzaXplKSk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIsIFN0cmluZyhzaXplKSk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKFwicnhcIiwgU3RyaW5nKHJhZGl1cykpO1xuICAgICAgICByZWN0LnNldEF0dHJpYnV0ZShcInJ5XCIsIFN0cmluZyhyYWRpdXMpKTtcblxuICAgICAgICAvLyBDcmVhdGUgYSBzbWFsbCByZWN0YW5nbGUgdG8gY292ZXIgdGhlIGJvdHRvbSByaWdodCBjb3JuZXJcbiAgICAgICAgY29uc3QgZmxhdENvcm5lclJlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXG4gICAgICAgICAgXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFxuICAgICAgICAgIFwicmVjdFwiXG4gICAgICAgICk7XG4gICAgICAgIGZsYXRDb3JuZXJSZWN0LnNldEF0dHJpYnV0ZShcInhcIiwgU3RyaW5nKHggKyBzaXplIC0gcmFkaXVzKSk7XG4gICAgICAgIGZsYXRDb3JuZXJSZWN0LnNldEF0dHJpYnV0ZShcInlcIiwgU3RyaW5nKHkgKyBzaXplIC0gcmFkaXVzKSk7XG4gICAgICAgIGZsYXRDb3JuZXJSZWN0LnNldEF0dHJpYnV0ZShcIndpZHRoXCIsIFN0cmluZyhyYWRpdXMpKTtcbiAgICAgICAgZmxhdENvcm5lclJlY3Quc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIsIFN0cmluZyhyYWRpdXMpKTtcblxuICAgICAgICB0aGlzLl9zdmcuYXBwZW5kQ2hpbGQocmVjdCk7XG4gICAgICAgIHRoaXMuX3N2Zy5hcHBlbmRDaGlsZChmbGF0Q29ybmVyUmVjdCk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgX2Jhc2ljTGVhZihhcmdzOiBCYXNpY0ZpZ3VyZURyYXdBcmdzKTogdm9pZCB7XG4gICAgY29uc3QgeyBzaXplLCB4LCB5IH0gPSBhcmdzO1xuICAgIGNvbnN0IGV4dGVuc2lvbiA9IHNpemUgLyA0OyAvLyBBZGp1c3QgdGhlIGV4dGVuc2lvbiBhcyBuZWVkZWRcbiAgICBjb25zdCBjb3JuZXJSYWRpdXMgPSBzaXplIC8gMTA7IC8vIEFkanVzdCB0aGUgY29ybmVyIHJhZGl1cyBhcyBuZWVkZWRcblxuICAgIHRoaXMuX3JvdGF0ZUZpZ3VyZSh7XG4gICAgICAuLi5hcmdzLFxuICAgICAgZHJhdzogKCkgPT4ge1xuICAgICAgICBjb25zdCBwYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFxuICAgICAgICAgIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcbiAgICAgICAgICBcInBhdGhcIlxuICAgICAgICApO1xuICAgICAgICBjb25zdCBkID0gYFxuICAgICAgICBNICR7eCAtIHNpemUgLyAyLjIgLSBleHRlbnNpb259LCR7XG4gICAgICAgICAgeSAtIHNpemUgLyAyLjIgLSBleHRlbnNpb25cbiAgICAgICAgfSAgLy8gTW92ZSB0byB0aGUgdG9wIGxlZnQgY29ybmVyXG4gICAgICAgIEwgJHt4ICsgc2l6ZSAvIDIuMn0sJHt5IC0gc2l6ZSAvIDIuMn0gIC8vIERyYXcgdG9wIGVkZ2VcbiAgICAgICAgTCAke3ggKyBzaXplIC8gMi4yfSwke3kgKyBzaXplIC8gMi4yfSAgLy8gRHJhdyByaWdodCBlZGdlXG4gICAgICAgIEwgJHt4IC0gc2l6ZSAvIDIuMn0sJHt5ICsgc2l6ZSAvIDIuMn0gIC8vIERyYXcgYm90dG9tIGVkZ2VcbiAgICAgICAgQSAke2Nvcm5lclJhZGl1c30sJHtjb3JuZXJSYWRpdXN9IDAgMCAxICR7XG4gICAgICAgICAgeCAtIHNpemUgLyAyLjIgLSBleHRlbnNpb24gKyBjb3JuZXJSYWRpdXNcbiAgICAgICAgfSwke3kgLSBzaXplIC8gMi4yICsgY29ybmVyUmFkaXVzfSAgLy8gRHJhdyByb3VuZGVkIGxlZnQgdG9wIGNvcm5lclxuICAgICAgICBaICAvLyBDbG9zZSB0aGUgcGF0aFxuICAgICAgYFxuICAgICAgICAgIC5yZXBsYWNlKC9cXC9cXC8uKiQvZ20sIFwiXCIpXG4gICAgICAgICAgLnRyaW0oKTsgLy8gUmVtb3ZlIGNvbW1lbnRzIGFuZCB0cmltIHdoaXRlc3BhY2VcbiAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIGQpO1xuICAgICAgICB0aGlzLl9zdmcuYXBwZW5kQ2hpbGQocGF0aCk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgLy8gX2Jhc2ljQ2lyY2xlTGVmdFRvcEVkZ2UoYXJnczogQmFzaWNGaWd1cmVEcmF3QXJncyk6IHZvaWQge1xuICAvLyAgIGNvbnN0IHsgc2l6ZSwgeCwgeSB9ID0gYXJncztcbiAgLy8gICBjb25zdCByYWRpdXMgPSBzaXplIC8gMjtcblxuICAvLyAgIHRoaXMuX3JvdGF0ZUZpZ3VyZSh7XG4gIC8vICAgICAuLi5hcmdzLFxuICAvLyAgICAgZHJhdzogKCkgPT4ge1xuICAvLyAgICAgICBjb25zdCBjaXJjbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXG4gIC8vICAgICAgICAgXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFxuICAvLyAgICAgICAgIFwiY2lyY2xlXCJcbiAgLy8gICAgICAgKTtcblxuICAvLyAgICAgICAvLyBBZGp1c3QgdGhlIGF0dHJpYnV0ZXMgdG8gcG9zaXRpb24gdGhlIGNpcmNsZSB3aXRoIGEgZmxhdCB0b3AgbGVmdCBjb3JuZXJcbiAgLy8gICAgICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcImN4XCIsIFN0cmluZyh4ICsgcmFkaXVzKSk7IC8vIEFkanVzdGVkIHRvIHJhZGl1cyBmb3IgbGVmdCBlZGdlXG4gIC8vICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJjeVwiLCBTdHJpbmcoeSArIHJhZGl1cykpOyAvLyBBZGp1c3RlZCB0byByYWRpdXMgZm9yIHRvcCBlZGdlXG4gIC8vICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJyXCIsIFN0cmluZyhyYWRpdXMpKTsgLy8gVXNlIHJhZGl1cyBhcyB0aGUgc2l6ZVxuXG4gIC8vICAgICAgIHRoaXMuX3N2Zy5hcHBlbmRDaGlsZChjaXJjbGUpO1xuICAvLyAgICAgfSxcbiAgLy8gICB9KTtcbiAgLy8gfVxuXG4gIF9iYXNpY0NpcmNsZUxlZnRUb3BFZGdlKGFyZ3M6IEJhc2ljRmlndXJlRHJhd0FyZ3MpOiB2b2lkIHtcbiAgICBjb25zdCB7IHNpemUsIHgsIHkgfSA9IGFyZ3M7XG4gICAgY29uc3QgcmFkaXVzID0gc2l6ZSAvIDI7XG5cbiAgICB0aGlzLl9yb3RhdGVGaWd1cmUoe1xuICAgICAgLi4uYXJncyxcbiAgICAgIGRyYXc6ICgpID0+IHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgY2lyY2xlIGZvciB0aGUgY3VydmVkIHBhcnRcbiAgICAgICAgY29uc3QgY2lyY2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFxuICAgICAgICAgIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcbiAgICAgICAgICBcImNpcmNsZVwiXG4gICAgICAgICk7XG4gICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJjeFwiLCBTdHJpbmcoeCArIHJhZGl1cykpO1xuICAgICAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwiY3lcIiwgU3RyaW5nKHkgKyByYWRpdXMpKTtcbiAgICAgICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcInJcIiwgU3RyaW5nKHJhZGl1cykpO1xuXG4gICAgICAgIC8vIENyZWF0ZSBhIHJlY3RhbmdsZSBmb3IgdGhlIGZsYXQgY29ybmVyXG4gICAgICAgIGNvbnN0IHJlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXG4gICAgICAgICAgXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFxuICAgICAgICAgIFwicmVjdFwiXG4gICAgICAgICk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKFwieFwiLCBTdHJpbmcoeCkpO1xuICAgICAgICByZWN0LnNldEF0dHJpYnV0ZShcInlcIiwgU3RyaW5nKHkpKTtcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCBTdHJpbmcocmFkaXVzKSk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIsIFN0cmluZyhyYWRpdXMpKTtcblxuICAgICAgICAvLyBBZGQgYm90aCBzaGFwZXMgdG8gdGhlIFNWR1xuICAgICAgICB0aGlzLl9zdmcuYXBwZW5kQ2hpbGQoY2lyY2xlKTtcbiAgICAgICAgdGhpcy5fc3ZnLmFwcGVuZENoaWxkKHJlY3QpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIF9iYXNpY0NpcmNsZVJpZ2h0Qm90dG9tRWRnZShhcmdzOiBCYXNpY0ZpZ3VyZURyYXdBcmdzKTogdm9pZCB7XG4gICAgY29uc3QgeyBzaXplLCB4LCB5IH0gPSBhcmdzO1xuICAgIGNvbnN0IHJhZGl1cyA9IHNpemUgLyAyO1xuXG4gICAgdGhpcy5fcm90YXRlRmlndXJlKHtcbiAgICAgIC4uLmFyZ3MsXG4gICAgICBkcmF3OiAoKSA9PiB7XG4gICAgICAgIC8vIENyZWF0ZSBhIGNpcmNsZSBmb3IgdGhlIGN1cnZlZCBwYXJ0XG4gICAgICAgIGNvbnN0IGNpcmNsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcbiAgICAgICAgICBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG4gICAgICAgICAgXCJjaXJjbGVcIlxuICAgICAgICApO1xuICAgICAgICBjaXJjbGUuc2V0QXR0cmlidXRlKFwiY3hcIiwgU3RyaW5nKHggKyByYWRpdXMpKTtcbiAgICAgICAgY2lyY2xlLnNldEF0dHJpYnV0ZShcImN5XCIsIFN0cmluZyh5ICsgcmFkaXVzKSk7XG4gICAgICAgIGNpcmNsZS5zZXRBdHRyaWJ1dGUoXCJyXCIsIFN0cmluZyhyYWRpdXMpKTtcblxuICAgICAgICAvLyBDcmVhdGUgYSByZWN0YW5nbGUgZm9yIHRoZSBmbGF0IGJvdHRvbS1yaWdodCBjb3JuZXJcbiAgICAgICAgY29uc3QgcmVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcbiAgICAgICAgICBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG4gICAgICAgICAgXCJyZWN0XCJcbiAgICAgICAgKTtcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoXCJ4XCIsIFN0cmluZyh4ICsgcmFkaXVzKSk7XG4gICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKFwieVwiLCBTdHJpbmcoeSArIHJhZGl1cykpO1xuICAgICAgICByZWN0LnNldEF0dHJpYnV0ZShcIndpZHRoXCIsIFN0cmluZyhyYWRpdXMpKTtcbiAgICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIiwgU3RyaW5nKHJhZGl1cykpO1xuXG4gICAgICAgIC8vIEFkZCBib3RoIHNoYXBlcyB0byB0aGUgU1ZHXG4gICAgICAgIHRoaXMuX3N2Zy5hcHBlbmRDaGlsZChjaXJjbGUpO1xuICAgICAgICB0aGlzLl9zdmcuYXBwZW5kQ2hpbGQocmVjdCk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgLy8gX2Jhc2ljRXh0ZW5kZWRTcXVhcmUoYXJnczogQmFzaWNGaWd1cmVEcmF3QXJncyk6IHZvaWQge1xuICAvLyAgIGNvbnN0IHsgc2l6ZSwgeCwgeSB9ID0gYXJncztcbiAgLy8gICBjb25zdCBleHRlbnNpb24gPSBzaXplIC8gNjsgIC8vIEFkanVzdCB0aGUgZXh0ZW5zaW9uIGFzIG5lZWRlZFxuXG4gIC8vICAgdGhpcy5fcm90YXRlRmlndXJlKHtcbiAgLy8gICAgIC4uLmFyZ3MsXG4gIC8vICAgICBkcmF3OiAoKSA9PiB7XG4gIC8vICAgICAgIGNvbnN0IHJlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBcInJlY3RcIik7XG4gIC8vICAgICAgIHJlY3Quc2V0QXR0cmlidXRlKFwieFwiLCBTdHJpbmcoeCAtIGV4dGVuc2lvbikpO1xuICAvLyAgICAgICByZWN0LnNldEF0dHJpYnV0ZShcInlcIiwgU3RyaW5nKHkgLSBleHRlbnNpb24pKTtcbiAgLy8gICAgICAgcmVjdC5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCBTdHJpbmcoc2l6ZSArIGV4dGVuc2lvbikpO1xuICAvLyAgICAgICByZWN0LnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCBTdHJpbmcoc2l6ZSArIGV4dGVuc2lvbikpO1xuICAvLyAgICAgICB0aGlzLl9zdmcuYXBwZW5kQ2hpbGQocmVjdCk7XG4gIC8vICAgICB9XG4gIC8vICAgfSk7XG4gIC8vIH1cblxuICBfYmFzaWNEaWFtb25kKGFyZ3M6IEJhc2ljRmlndXJlRHJhd0FyZ3MpOiB2b2lkIHtcbiAgICBjb25zdCB7IHNpemUsIHgsIHkgfSA9IGFyZ3M7XG5cbiAgICB0aGlzLl9yb3RhdGVGaWd1cmUoe1xuICAgICAgLi4uYXJncyxcbiAgICAgIGRyYXc6ICgpID0+IHtcbiAgICAgICAgY29uc3QgcG9seWdvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcbiAgICAgICAgICBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG4gICAgICAgICAgXCJwb2x5Z29uXCJcbiAgICAgICAgKTtcbiAgICAgICAgcG9seWdvbi5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgXCJwb2ludHNcIixcbiAgICAgICAgICBgXG4gICAgICAgICAgJHt4ICsgc2l6ZSAvIDJ9LCAke3l9XG4gICAgICAgICAgJHt4ICsgc2l6ZX0sICR7eSArIHNpemUgLyAyfVxuICAgICAgICAgICR7eCArIHNpemUgLyAyfSwgJHt5ICsgc2l6ZX1cbiAgICAgICAgICAke3h9LCAke3kgKyBzaXplIC8gMn1cbiAgICAgICAgYFxuICAgICAgICApO1xuICAgICAgICB0aGlzLl9zdmcuYXBwZW5kQ2hpbGQocG9seWdvbik7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgX2Jhc2ljU3RhcihhcmdzOiBCYXNpY0ZpZ3VyZURyYXdBcmdzKTogdm9pZCB7XG4gICAgY29uc3QgeyBzaXplLCB4LCB5IH0gPSBhcmdzO1xuXG4gICAgY29uc3QgbnVtUG9pbnRzID0gNTtcbiAgICBjb25zdCBvdXRlclJhZGl1cyA9IHNpemUgLyAyO1xuICAgIGNvbnN0IGlubmVyUmFkaXVzID0gb3V0ZXJSYWRpdXMgLyAyLjU7XG4gICAgY29uc3Qgc3RlcCA9IE1hdGguUEkgLyBudW1Qb2ludHM7XG5cbiAgICB0aGlzLl9yb3RhdGVGaWd1cmUoe1xuICAgICAgLi4uYXJncyxcbiAgICAgIGRyYXc6ICgpID0+IHtcbiAgICAgICAgY29uc3QgcG9pbnRzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMiAqIG51bVBvaW50czsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgcmFkaXVzID0gaSAlIDIgPT09IDAgPyBvdXRlclJhZGl1cyA6IGlubmVyUmFkaXVzO1xuICAgICAgICAgIGNvbnN0IGFuZ2xlID0gaSAqIHN0ZXA7XG4gICAgICAgICAgY29uc3QgcHggPSB4ICsgc2l6ZSAvIDIgKyByYWRpdXMgKiBNYXRoLmNvcyhhbmdsZSk7XG4gICAgICAgICAgY29uc3QgcHkgPSB5ICsgc2l6ZSAvIDIgKyByYWRpdXMgKiBNYXRoLnNpbihhbmdsZSk7XG4gICAgICAgICAgcG9pbnRzLnB1c2goYCR7cHh9LCR7cHl9YCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb2x5Z29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFxuICAgICAgICAgIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcbiAgICAgICAgICBcInBvbHlnb25cIlxuICAgICAgICApO1xuICAgICAgICBwb2x5Z29uLnNldEF0dHJpYnV0ZShcInBvaW50c1wiLCBwb2ludHMuam9pbihcIiBcIikpO1xuICAgICAgICB0aGlzLl9zdmcuYXBwZW5kQ2hpbGQocG9seWdvbik7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgX2Jhc2ljUGx1cyhhcmdzOiBCYXNpY0ZpZ3VyZURyYXdBcmdzKTogdm9pZCB7XG4gICAgY29uc3QgeyBzaXplLCB4LCB5IH0gPSBhcmdzO1xuXG4gICAgY29uc3QgdGhpY2tuZXNzID0gc2l6ZSAvIDU7XG4gICAgY29uc3QgaGFsZlRoaWNrbmVzcyA9IHRoaWNrbmVzcyAvIDI7XG4gICAgY29uc3QgaGFsZlNpemUgPSBzaXplIC8gMjtcblxuICAgIHRoaXMuX3JvdGF0ZUZpZ3VyZSh7XG4gICAgICAuLi5hcmdzLFxuICAgICAgZHJhdzogKCkgPT4ge1xuICAgICAgICBjb25zdCBncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcbiAgICAgICAgICBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG4gICAgICAgICAgXCJnXCJcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCB2ZXJ0aWNhbFJlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXG4gICAgICAgICAgXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFxuICAgICAgICAgIFwicmVjdFwiXG4gICAgICAgICk7XG4gICAgICAgIHZlcnRpY2FsUmVjdC5zZXRBdHRyaWJ1dGUoXCJ4XCIsIFN0cmluZyh4ICsgaGFsZlNpemUgLSBoYWxmVGhpY2tuZXNzKSk7XG4gICAgICAgIHZlcnRpY2FsUmVjdC5zZXRBdHRyaWJ1dGUoXCJ5XCIsIFN0cmluZyh5KSk7XG4gICAgICAgIHZlcnRpY2FsUmVjdC5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCBTdHJpbmcodGhpY2tuZXNzKSk7XG4gICAgICAgIHZlcnRpY2FsUmVjdC5zZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIiwgU3RyaW5nKHNpemUpKTtcbiAgICAgICAgZ3JvdXAuYXBwZW5kQ2hpbGQodmVydGljYWxSZWN0KTtcblxuICAgICAgICBjb25zdCBob3Jpem9udGFsUmVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcbiAgICAgICAgICBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG4gICAgICAgICAgXCJyZWN0XCJcbiAgICAgICAgKTtcbiAgICAgICAgaG9yaXpvbnRhbFJlY3Quc2V0QXR0cmlidXRlKFwieFwiLCBTdHJpbmcoeCkpO1xuICAgICAgICBob3Jpem9udGFsUmVjdC5zZXRBdHRyaWJ1dGUoXCJ5XCIsIFN0cmluZyh5ICsgaGFsZlNpemUgLSBoYWxmVGhpY2tuZXNzKSk7XG4gICAgICAgIGhvcml6b250YWxSZWN0LnNldEF0dHJpYnV0ZShcIndpZHRoXCIsIFN0cmluZyhzaXplKSk7XG4gICAgICAgIGhvcml6b250YWxSZWN0LnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCBTdHJpbmcodGhpY2tuZXNzKSk7XG4gICAgICAgIGdyb3VwLmFwcGVuZENoaWxkKGhvcml6b250YWxSZWN0KTtcblxuICAgICAgICB0aGlzLl9zdmcuYXBwZW5kQ2hpbGQoZ3JvdXApO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIF9iYXNpY0Nyb3NzKGFyZ3M6IEJhc2ljRmlndXJlRHJhd0FyZ3MpOiB2b2lkIHtcbiAgICBjb25zdCB7IHNpemUsIHgsIHkgfSA9IGFyZ3M7XG5cbiAgICBjb25zdCB0aGlja25lc3MgPSBzaXplIC8gMi41O1xuICAgIGNvbnN0IGhhbGZUaGlja25lc3MgPSB0aGlja25lc3MgLyAyO1xuICAgIGNvbnN0IGhhbGZTaXplID0gc2l6ZSAvIDI7XG5cbiAgICB0aGlzLl9yb3RhdGVGaWd1cmUoe1xuICAgICAgLi4uYXJncyxcbiAgICAgIGRyYXc6ICgpID0+IHtcbiAgICAgICAgY29uc3QgZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXG4gICAgICAgICAgXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFxuICAgICAgICAgIFwiZ1wiXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgdmVydGljYWxSZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFxuICAgICAgICAgIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcbiAgICAgICAgICBcInJlY3RcIlxuICAgICAgICApO1xuICAgICAgICB2ZXJ0aWNhbFJlY3Quc2V0QXR0cmlidXRlKFwieFwiLCBTdHJpbmcoeCArIGhhbGZTaXplIC0gaGFsZlRoaWNrbmVzcykpO1xuICAgICAgICB2ZXJ0aWNhbFJlY3Quc2V0QXR0cmlidXRlKFwieVwiLCBTdHJpbmcoeSkpO1xuICAgICAgICB2ZXJ0aWNhbFJlY3Quc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgU3RyaW5nKHRoaWNrbmVzcykpO1xuICAgICAgICB2ZXJ0aWNhbFJlY3Quc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIsIFN0cmluZyhzaXplKSk7XG4gICAgICAgIHZlcnRpY2FsUmVjdC5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgXCJ0cmFuc2Zvcm1cIixcbiAgICAgICAgICBgcm90YXRlKDQ1ICR7eCArIGhhbGZTaXplfSAke3kgKyBoYWxmU2l6ZX0pYFxuICAgICAgICApO1xuICAgICAgICB2ZXJ0aWNhbFJlY3Quc2V0QXR0cmlidXRlKFwicnhcIiwgU3RyaW5nKHRoaWNrbmVzcyAvIDIpKTsgLy8gYWRkIHRoaXMgbGluZVxuICAgICAgICBncm91cC5hcHBlbmRDaGlsZCh2ZXJ0aWNhbFJlY3QpO1xuXG4gICAgICAgIGNvbnN0IGhvcml6b250YWxSZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFxuICAgICAgICAgIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcbiAgICAgICAgICBcInJlY3RcIlxuICAgICAgICApO1xuICAgICAgICBob3Jpem9udGFsUmVjdC5zZXRBdHRyaWJ1dGUoXCJ4XCIsIFN0cmluZyh4KSk7XG4gICAgICAgIGhvcml6b250YWxSZWN0LnNldEF0dHJpYnV0ZShcInlcIiwgU3RyaW5nKHkgKyBoYWxmU2l6ZSAtIGhhbGZUaGlja25lc3MpKTtcbiAgICAgICAgaG9yaXpvbnRhbFJlY3Quc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgU3RyaW5nKHNpemUpKTtcbiAgICAgICAgaG9yaXpvbnRhbFJlY3Quc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIsIFN0cmluZyh0aGlja25lc3MpKTtcbiAgICAgICAgaG9yaXpvbnRhbFJlY3Quc2V0QXR0cmlidXRlKFxuICAgICAgICAgIFwidHJhbnNmb3JtXCIsXG4gICAgICAgICAgYHJvdGF0ZSg0NSAke3ggKyBoYWxmU2l6ZX0gJHt5ICsgaGFsZlNpemV9KWBcbiAgICAgICAgKTtcbiAgICAgICAgaG9yaXpvbnRhbFJlY3Quc2V0QXR0cmlidXRlKFwicnhcIiwgU3RyaW5nKHRoaWNrbmVzcyAvIDIpKTsgLy8gYWRkIHRoaXMgbGluZVxuICAgICAgICBncm91cC5hcHBlbmRDaGlsZChob3Jpem9udGFsUmVjdCk7XG5cbiAgICAgICAgdGhpcy5fc3ZnLmFwcGVuZENoaWxkKGdyb3VwKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBfYmFzaWNSaG9tYnVzKGFyZ3M6IEJhc2ljRmlndXJlRHJhd0FyZ3MpOiB2b2lkIHtcbiAgICBjb25zdCB7IHNpemUsIHgsIHkgfSA9IGFyZ3M7XG5cbiAgICBjb25zdCB0aGlja25lc3MgPSBzaXplIC8gMS44O1xuICAgIGNvbnN0IGhhbGZUaGlja25lc3MgPSB0aGlja25lc3MgLyAyO1xuICAgIGNvbnN0IGhhbGZTaXplID0gc2l6ZSAvIDI7XG5cbiAgICB0aGlzLl9yb3RhdGVGaWd1cmUoe1xuICAgICAgLi4uYXJncyxcbiAgICAgIGRyYXc6ICgpID0+IHtcbiAgICAgICAgY29uc3QgZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXG4gICAgICAgICAgXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFxuICAgICAgICAgIFwiZ1wiXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gZ3JvdXAuc2V0QXR0cmlidXRlKFwidHJhbnNmb3JtXCIsIGByb3RhdGUoNDUgJHt4ICsgaGFsZlNpemV9ICR7eSArIGhhbGZTaXplfSlgKTtcblxuICAgICAgICBjb25zdCB2ZXJ0aWNhbFJlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXG4gICAgICAgICAgXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFxuICAgICAgICAgIFwicmVjdFwiXG4gICAgICAgICk7XG4gICAgICAgIHZlcnRpY2FsUmVjdC5zZXRBdHRyaWJ1dGUoXCJ4XCIsIFN0cmluZyh4ICsgaGFsZlNpemUgLSBoYWxmVGhpY2tuZXNzKSk7XG4gICAgICAgIHZlcnRpY2FsUmVjdC5zZXRBdHRyaWJ1dGUoXCJ5XCIsIFN0cmluZyh5KSk7XG4gICAgICAgIHZlcnRpY2FsUmVjdC5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCBTdHJpbmcodGhpY2tuZXNzKSk7XG4gICAgICAgIHZlcnRpY2FsUmVjdC5zZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIiwgU3RyaW5nKHNpemUpKTtcblxuICAgICAgICBjb25zdCB2ZXJ0aWNhbFRvcFRyaWFuZ2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFxuICAgICAgICAgIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcbiAgICAgICAgICBcInBvbHlnb25cIlxuICAgICAgICApO1xuICAgICAgICB2ZXJ0aWNhbFRvcFRyaWFuZ2xlLnNldEF0dHJpYnV0ZShcbiAgICAgICAgICBcInBvaW50c1wiLFxuICAgICAgICAgIGBcbiAgICAgICAgICAke3ggKyBoYWxmU2l6ZSAtIGhhbGZUaGlja25lc3N9LCR7eX1cbiAgICAgICAgICAke3ggKyBoYWxmU2l6ZX0sJHt5IC0gaGFsZlRoaWNrbmVzc31cbiAgICAgICAgICAke3ggKyBoYWxmU2l6ZSArIGhhbGZUaGlja25lc3N9LCR7eX1cbiAgICAgICAgYFxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IHZlcnRpY2FsQm90dG9tVHJpYW5nbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXG4gICAgICAgICAgXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFxuICAgICAgICAgIFwicG9seWdvblwiXG4gICAgICAgICk7XG4gICAgICAgIHZlcnRpY2FsQm90dG9tVHJpYW5nbGUuc2V0QXR0cmlidXRlKFxuICAgICAgICAgIFwicG9pbnRzXCIsXG4gICAgICAgICAgYFxuICAgICAgICAgICR7eCArIGhhbGZTaXplIC0gaGFsZlRoaWNrbmVzc30sJHt5ICsgc2l6ZX1cbiAgICAgICAgICAke3ggKyBoYWxmU2l6ZSArIGhhbGZUaGlja25lc3N9LCR7eSArIHNpemV9XG4gICAgICAgICAgJHt4ICsgaGFsZlNpemV9LCR7eSArIHNpemUgKyBoYWxmVGhpY2tuZXNzfVxuICAgICAgICBgXG4gICAgICAgICk7XG5cbiAgICAgICAgZ3JvdXAuYXBwZW5kQ2hpbGQodmVydGljYWxSZWN0KTtcbiAgICAgICAgZ3JvdXAuYXBwZW5kQ2hpbGQodmVydGljYWxUb3BUcmlhbmdsZSk7XG4gICAgICAgIGdyb3VwLmFwcGVuZENoaWxkKHZlcnRpY2FsQm90dG9tVHJpYW5nbGUpO1xuXG4gICAgICAgIGNvbnN0IGhvcml6b250YWxSZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFxuICAgICAgICAgIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcbiAgICAgICAgICBcInJlY3RcIlxuICAgICAgICApO1xuICAgICAgICBob3Jpem9udGFsUmVjdC5zZXRBdHRyaWJ1dGUoXCJ4XCIsIFN0cmluZyh4KSk7XG4gICAgICAgIGhvcml6b250YWxSZWN0LnNldEF0dHJpYnV0ZShcInlcIiwgU3RyaW5nKHkgKyBoYWxmU2l6ZSAtIGhhbGZUaGlja25lc3MpKTtcbiAgICAgICAgaG9yaXpvbnRhbFJlY3Quc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgU3RyaW5nKHNpemUpKTtcbiAgICAgICAgaG9yaXpvbnRhbFJlY3Quc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIsIFN0cmluZyh0aGlja25lc3MpKTtcblxuICAgICAgICBjb25zdCBob3Jpem9udGFsTGVmdFRyaWFuZ2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFxuICAgICAgICAgIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcbiAgICAgICAgICBcInBvbHlnb25cIlxuICAgICAgICApO1xuICAgICAgICBob3Jpem9udGFsTGVmdFRyaWFuZ2xlLnNldEF0dHJpYnV0ZShcbiAgICAgICAgICBcInBvaW50c1wiLFxuICAgICAgICAgIGBcbiAgICAgICAgICAke3h9LCR7eSArIGhhbGZTaXplIC0gaGFsZlRoaWNrbmVzc31cbiAgICAgICAgICAke3ggLSBoYWxmVGhpY2tuZXNzfSwke3kgKyBoYWxmU2l6ZX1cbiAgICAgICAgICAke3h9LCR7eSArIGhhbGZTaXplICsgaGFsZlRoaWNrbmVzc31cbiAgICAgICAgYFxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IGhvcml6b250YWxSaWdodFRyaWFuZ2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFxuICAgICAgICAgIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcbiAgICAgICAgICBcInBvbHlnb25cIlxuICAgICAgICApO1xuICAgICAgICBob3Jpem9udGFsUmlnaHRUcmlhbmdsZS5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgXCJwb2ludHNcIixcbiAgICAgICAgICBgXG4gICAgICAgICAgJHt4ICsgc2l6ZX0sJHt5ICsgaGFsZlNpemUgLSBoYWxmVGhpY2tuZXNzfVxuICAgICAgICAgICR7eCArIHNpemUgKyBoYWxmVGhpY2tuZXNzfSwke3kgKyBoYWxmU2l6ZX1cbiAgICAgICAgICAke3ggKyBzaXplfSwke3kgKyBoYWxmU2l6ZSArIGhhbGZUaGlja25lc3N9XG4gICAgICAgIGBcbiAgICAgICAgKTtcblxuICAgICAgICBncm91cC5hcHBlbmRDaGlsZChob3Jpem9udGFsUmVjdCk7XG4gICAgICAgIGdyb3VwLmFwcGVuZENoaWxkKGhvcml6b250YWxMZWZ0VHJpYW5nbGUpO1xuICAgICAgICBncm91cC5hcHBlbmRDaGlsZChob3Jpem9udGFsUmlnaHRUcmlhbmdsZSk7XG5cbiAgICAgICAgdGhpcy5fc3ZnLmFwcGVuZENoaWxkKGdyb3VwKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBfZHJhd0RvdCh7IHgsIHksIHNpemUsIHJvdGF0aW9uIH06IERyYXdBcmdzKTogdm9pZCB7XG4gICAgdGhpcy5fYmFzaWNEb3QoeyB4LCB5LCBzaXplLCByb3RhdGlvbiB9KTtcbiAgfVxuXG4gIF9kcmF3U3F1YXJlKHsgeCwgeSwgc2l6ZSwgcm90YXRpb24gfTogRHJhd0FyZ3MpOiB2b2lkIHtcbiAgICB0aGlzLl9iYXNpY1NxdWFyZSh7IHgsIHksIHNpemUsIHJvdGF0aW9uIH0pO1xuICB9XG5cbiAgX2RyYXdTdGFyKHsgeCwgeSwgc2l6ZSwgcm90YXRpb24gfTogRHJhd0FyZ3MpOiB2b2lkIHtcbiAgICB0aGlzLl9iYXNpY1N0YXIoeyB4LCB5LCBzaXplLCByb3RhdGlvbiB9KTtcbiAgfVxuXG4gIF9kcmF3UGx1cyh7IHgsIHksIHNpemUsIHJvdGF0aW9uIH06IERyYXdBcmdzKTogdm9pZCB7XG4gICAgdGhpcy5fYmFzaWNQbHVzKHsgeCwgeSwgc2l6ZSwgcm90YXRpb24gfSk7XG4gIH1cblxuICBfZHJhd1NxdWFyZVJvdW5kZWQoeyB4LCB5LCBzaXplLCByb3RhdGlvbiB9OiBEcmF3QXJncyk6IHZvaWQge1xuICAgIHRoaXMuX2Jhc2ljUm91bmRlZFNxdWFyZSh7IHgsIHksIHNpemUsIHJvdGF0aW9uIH0pO1xuICB9XG5cbiAgX2RyYXdTcXVhcmVSb3VuZGVkUmlnaHRCb3R0b21FZGdlKHsgeCwgeSwgc2l6ZSwgcm90YXRpb24gfTogRHJhd0FyZ3MpOiB2b2lkIHtcbiAgICB0aGlzLl9iYXNpY1JvdW5kZWRTcXVhcmVSaWdodEJvdHRvbUVkZ2UoeyB4LCB5LCBzaXplLCByb3RhdGlvbiB9KTtcbiAgfVxuXG4gIF9kcmF3TGVhZCh7IHgsIHksIHNpemUsIHJvdGF0aW9uIH06IERyYXdBcmdzKTogdm9pZCB7XG4gICAgdGhpcy5fYmFzaWNMZWFmKHsgeCwgeSwgc2l6ZSwgcm90YXRpb24gfSk7XG4gIH1cblxuICBfZHJhd0NpcmNsZUxlZnRUb3BFZGdlKHsgeCwgeSwgc2l6ZSwgcm90YXRpb24gfTogRHJhd0FyZ3MpOiB2b2lkIHtcbiAgICB0aGlzLl9iYXNpY0NpcmNsZUxlZnRUb3BFZGdlKHsgeCwgeSwgc2l6ZSwgcm90YXRpb24gfSk7XG4gIH1cbiAgX2RyYXdDaXJjbGVSaWdodEJvdHRvbUVkZ2UoeyB4LCB5LCBzaXplLCByb3RhdGlvbiB9OiBEcmF3QXJncyk6IHZvaWQge1xuICAgIHRoaXMuX2Jhc2ljQ2lyY2xlUmlnaHRCb3R0b21FZGdlKHsgeCwgeSwgc2l6ZSwgcm90YXRpb24gfSk7XG4gIH1cblxuICBfZHJhd0RpYW1vbmQoeyB4LCB5LCBzaXplLCByb3RhdGlvbiB9OiBEcmF3QXJncyk6IHZvaWQge1xuICAgIHRoaXMuX2Jhc2ljRGlhbW9uZCh7IHgsIHksIHNpemUsIHJvdGF0aW9uIH0pO1xuICB9XG4gIF9kcmF3Q3Jvc3MoeyB4LCB5LCBzaXplLCByb3RhdGlvbiB9OiBEcmF3QXJncyk6IHZvaWQge1xuICAgIHRoaXMuX2Jhc2ljQ3Jvc3MoeyB4LCB5LCBzaXplLCByb3RhdGlvbiB9KTtcbiAgfVxuXG4gIF9kcmF3UmhvbWJ1cyh7IHgsIHksIHNpemUsIHJvdGF0aW9uIH06IERyYXdBcmdzKTogdm9pZCB7XG4gICAgdGhpcy5fYmFzaWNSaG9tYnVzKHsgeCwgeSwgc2l6ZSwgcm90YXRpb24gfSk7XG4gIH1cbn1cbiIsImltcG9ydCBjb3JuZXJTcXVhcmVUeXBlcyBmcm9tIFwiLi4vLi4vLi4vY29uc3RhbnRzL2Nvcm5lclNxdWFyZVR5cGVzXCI7XG5pbXBvcnQgeyBDb3JuZXJTcXVhcmVUeXBlLCBSb3RhdGVGaWd1cmVBcmdzQ2FudmFzLCBCYXNpY0ZpZ3VyZURyYXdBcmdzQ2FudmFzLCBEcmF3QXJnc0NhbnZhcyB9IGZyb20gXCIuLi8uLi8uLi90eXBlc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRUkNvcm5lclNxdWFyZSB7XG4gIF9jb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gIF90eXBlOiBDb3JuZXJTcXVhcmVUeXBlO1xuXG4gIGNvbnN0cnVjdG9yKHsgY29udGV4dCwgdHlwZSB9OiB7IGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDsgdHlwZTogQ29ybmVyU3F1YXJlVHlwZSB9KSB7XG4gICAgdGhpcy5fY29udGV4dCA9IGNvbnRleHQ7XG4gICAgdGhpcy5fdHlwZSA9IHR5cGU7XG4gIH1cblxuICBkcmF3KHg6IG51bWJlciwgeTogbnVtYmVyLCBzaXplOiBudW1iZXIsIHJvdGF0aW9uOiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5fY29udGV4dDtcbiAgICBjb25zdCB0eXBlID0gdGhpcy5fdHlwZTtcbiAgICBsZXQgZHJhd0Z1bmN0aW9uO1xuXG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlIGNvcm5lclNxdWFyZVR5cGVzLnNxdWFyZTpcbiAgICAgICAgZHJhd0Z1bmN0aW9uID0gdGhpcy5fZHJhd1NxdWFyZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGNvcm5lclNxdWFyZVR5cGVzLmV4dHJhUm91bmRlZDpcbiAgICAgICAgZHJhd0Z1bmN0aW9uID0gdGhpcy5fZHJhd0V4dHJhUm91bmRlZDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGNvcm5lclNxdWFyZVR5cGVzLmRvdDpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGRyYXdGdW5jdGlvbiA9IHRoaXMuX2RyYXdEb3Q7XG4gICAgfVxuXG4gICAgZHJhd0Z1bmN0aW9uLmNhbGwodGhpcywgeyB4LCB5LCBzaXplLCBjb250ZXh0LCByb3RhdGlvbiB9KTtcbiAgfVxuXG4gIF9yb3RhdGVGaWd1cmUoeyB4LCB5LCBzaXplLCBjb250ZXh0LCByb3RhdGlvbiA9IDAsIGRyYXcgfTogUm90YXRlRmlndXJlQXJnc0NhbnZhcyk6IHZvaWQge1xuICAgIGNvbnN0IGN4ID0geCArIHNpemUgLyAyO1xuICAgIGNvbnN0IGN5ID0geSArIHNpemUgLyAyO1xuXG4gICAgY29udGV4dC50cmFuc2xhdGUoY3gsIGN5KTtcbiAgICByb3RhdGlvbiAmJiBjb250ZXh0LnJvdGF0ZShyb3RhdGlvbik7XG4gICAgZHJhdygpO1xuICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG4gICAgcm90YXRpb24gJiYgY29udGV4dC5yb3RhdGUoLXJvdGF0aW9uKTtcbiAgICBjb250ZXh0LnRyYW5zbGF0ZSgtY3gsIC1jeSk7XG4gIH1cblxuICBfYmFzaWNEb3QoYXJnczogQmFzaWNGaWd1cmVEcmF3QXJnc0NhbnZhcyk6IHZvaWQge1xuICAgIGNvbnN0IHsgc2l6ZSwgY29udGV4dCB9ID0gYXJncztcbiAgICBjb25zdCBkb3RTaXplID0gc2l6ZSAvIDc7XG5cbiAgICB0aGlzLl9yb3RhdGVGaWd1cmUoe1xuICAgICAgLi4uYXJncyxcbiAgICAgIGRyYXc6ICgpID0+IHtcbiAgICAgICAgY29udGV4dC5hcmMoMCwgMCwgc2l6ZSAvIDIsIDAsIE1hdGguUEkgKiAyKTtcbiAgICAgICAgY29udGV4dC5hcmMoMCwgMCwgc2l6ZSAvIDIgLSBkb3RTaXplLCAwLCBNYXRoLlBJICogMik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBfYmFzaWNTcXVhcmUoYXJnczogQmFzaWNGaWd1cmVEcmF3QXJnc0NhbnZhcyk6IHZvaWQge1xuICAgIGNvbnN0IHsgc2l6ZSwgY29udGV4dCB9ID0gYXJncztcbiAgICBjb25zdCBkb3RTaXplID0gc2l6ZSAvIDc7XG5cbiAgICB0aGlzLl9yb3RhdGVGaWd1cmUoe1xuICAgICAgLi4uYXJncyxcbiAgICAgIGRyYXc6ICgpID0+IHtcbiAgICAgICAgY29udGV4dC5yZWN0KC1zaXplIC8gMiwgLXNpemUgLyAyLCBzaXplLCBzaXplKTtcbiAgICAgICAgY29udGV4dC5yZWN0KC1zaXplIC8gMiArIGRvdFNpemUsIC1zaXplIC8gMiArIGRvdFNpemUsIHNpemUgLSAyICogZG90U2l6ZSwgc2l6ZSAtIDIgKiBkb3RTaXplKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIF9iYXNpY0V4dHJhUm91bmRlZChhcmdzOiBCYXNpY0ZpZ3VyZURyYXdBcmdzQ2FudmFzKTogdm9pZCB7XG4gICAgY29uc3QgeyBzaXplLCBjb250ZXh0IH0gPSBhcmdzO1xuICAgIGNvbnN0IGRvdFNpemUgPSBzaXplIC8gNztcblxuICAgIHRoaXMuX3JvdGF0ZUZpZ3VyZSh7XG4gICAgICAuLi5hcmdzLFxuICAgICAgZHJhdzogKCkgPT4ge1xuICAgICAgICBjb250ZXh0LmFyYygtZG90U2l6ZSwgLWRvdFNpemUsIDIuNSAqIGRvdFNpemUsIE1hdGguUEksIC1NYXRoLlBJIC8gMik7XG4gICAgICAgIGNvbnRleHQubGluZVRvKGRvdFNpemUsIC0zLjUgKiBkb3RTaXplKTtcbiAgICAgICAgY29udGV4dC5hcmMoZG90U2l6ZSwgLWRvdFNpemUsIDIuNSAqIGRvdFNpemUsIC1NYXRoLlBJIC8gMiwgMCk7XG4gICAgICAgIGNvbnRleHQubGluZVRvKDMuNSAqIGRvdFNpemUsIC1kb3RTaXplKTtcbiAgICAgICAgY29udGV4dC5hcmMoZG90U2l6ZSwgZG90U2l6ZSwgMi41ICogZG90U2l6ZSwgMCwgTWF0aC5QSSAvIDIpO1xuICAgICAgICBjb250ZXh0LmxpbmVUbygtZG90U2l6ZSwgMy41ICogZG90U2l6ZSk7XG4gICAgICAgIGNvbnRleHQuYXJjKC1kb3RTaXplLCBkb3RTaXplLCAyLjUgKiBkb3RTaXplLCBNYXRoLlBJIC8gMiwgTWF0aC5QSSk7XG4gICAgICAgIGNvbnRleHQubGluZVRvKC0zLjUgKiBkb3RTaXplLCAtZG90U2l6ZSk7XG5cbiAgICAgICAgY29udGV4dC5hcmMoLWRvdFNpemUsIC1kb3RTaXplLCAxLjUgKiBkb3RTaXplLCBNYXRoLlBJLCAtTWF0aC5QSSAvIDIpO1xuICAgICAgICBjb250ZXh0LmxpbmVUbyhkb3RTaXplLCAtMi41ICogZG90U2l6ZSk7XG4gICAgICAgIGNvbnRleHQuYXJjKGRvdFNpemUsIC1kb3RTaXplLCAxLjUgKiBkb3RTaXplLCAtTWF0aC5QSSAvIDIsIDApO1xuICAgICAgICBjb250ZXh0LmxpbmVUbygyLjUgKiBkb3RTaXplLCAtZG90U2l6ZSk7XG4gICAgICAgIGNvbnRleHQuYXJjKGRvdFNpemUsIGRvdFNpemUsIDEuNSAqIGRvdFNpemUsIDAsIE1hdGguUEkgLyAyKTtcbiAgICAgICAgY29udGV4dC5saW5lVG8oLWRvdFNpemUsIDIuNSAqIGRvdFNpemUpO1xuICAgICAgICBjb250ZXh0LmFyYygtZG90U2l6ZSwgZG90U2l6ZSwgMS41ICogZG90U2l6ZSwgTWF0aC5QSSAvIDIsIE1hdGguUEkpO1xuICAgICAgICBjb250ZXh0LmxpbmVUbygtMi41ICogZG90U2l6ZSwgLWRvdFNpemUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgX2RyYXdEb3QoeyB4LCB5LCBzaXplLCBjb250ZXh0LCByb3RhdGlvbiB9OiBEcmF3QXJnc0NhbnZhcyk6IHZvaWQge1xuICAgIHRoaXMuX2Jhc2ljRG90KHsgeCwgeSwgc2l6ZSwgY29udGV4dCwgcm90YXRpb24gfSk7XG4gIH1cblxuICBfZHJhd1NxdWFyZSh7IHgsIHksIHNpemUsIGNvbnRleHQsIHJvdGF0aW9uIH06IERyYXdBcmdzQ2FudmFzKTogdm9pZCB7XG4gICAgdGhpcy5fYmFzaWNTcXVhcmUoeyB4LCB5LCBzaXplLCBjb250ZXh0LCByb3RhdGlvbiB9KTtcbiAgfVxuXG4gIF9kcmF3RXh0cmFSb3VuZGVkKHsgeCwgeSwgc2l6ZSwgY29udGV4dCwgcm90YXRpb24gfTogRHJhd0FyZ3NDYW52YXMpOiB2b2lkIHtcbiAgICB0aGlzLl9iYXNpY0V4dHJhUm91bmRlZCh7IHgsIHksIHNpemUsIGNvbnRleHQsIHJvdGF0aW9uIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgY29ybmVyU3F1YXJlVHlwZXMgZnJvbSBcIi4uLy4uLy4uL2NvbnN0YW50cy9jb3JuZXJTcXVhcmVUeXBlc1wiO1xuaW1wb3J0IHtcbiAgQ29ybmVyU3F1YXJlVHlwZSxcbiAgRHJhd0FyZ3MsXG4gIEJhc2ljRmlndXJlRHJhd0FyZ3MsXG4gIFJvdGF0ZUZpZ3VyZUFyZ3MsXG59IGZyb20gXCIuLi8uLi8uLi90eXBlc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRUkNvcm5lclNxdWFyZSB7XG4gIF9lbGVtZW50PzogU1ZHRWxlbWVudDtcbiAgX3N2ZzogU1ZHRWxlbWVudDtcbiAgX3R5cGU6IENvcm5lclNxdWFyZVR5cGU7XG5cbiAgY29uc3RydWN0b3IoeyBzdmcsIHR5cGUgfTogeyBzdmc6IFNWR0VsZW1lbnQ7IHR5cGU6IENvcm5lclNxdWFyZVR5cGUgfSkge1xuICAgIHRoaXMuX3N2ZyA9IHN2ZztcbiAgICB0aGlzLl90eXBlID0gdHlwZTtcbiAgfVxuXG4gIGRyYXcoeDogbnVtYmVyLCB5OiBudW1iZXIsIHNpemU6IG51bWJlciwgcm90YXRpb246IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IHR5cGUgPSB0aGlzLl90eXBlO1xuICAgIGxldCBkcmF3RnVuY3Rpb247XG5cbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgY29ybmVyU3F1YXJlVHlwZXMuc3F1YXJlOlxuICAgICAgICBkcmF3RnVuY3Rpb24gPSB0aGlzLl9kcmF3U3F1YXJlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgY29ybmVyU3F1YXJlVHlwZXMuZXh0cmFSb3VuZGVkOlxuICAgICAgICBkcmF3RnVuY3Rpb24gPSB0aGlzLl9kcmF3RXh0cmFSb3VuZGVkO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgY29ybmVyU3F1YXJlVHlwZXMuZG90dGVkU3F1YXJlOlxuICAgICAgICBkcmF3RnVuY3Rpb24gPSB0aGlzLl9kcmF3RG90dGVkU3F1YXJlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgY29ybmVyU3F1YXJlVHlwZXMucmlnaHRCb3R0b21TcXVhcmU6XG4gICAgICAgIGRyYXdGdW5jdGlvbiA9IHRoaXMuX2RyYXdSb3VuZGVkU3F1YXJlUmlnaHRCb3R0b21FZGdlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgY29ybmVyU3F1YXJlVHlwZXMubGVmdFRvcFNxdWFyZTpcbiAgICAgICAgZHJhd0Z1bmN0aW9uID0gdGhpcy5fZHJhd1JvdW5kZWRTcXVhcmVMZWZ0VG9wRWRnZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGNvcm5lclNxdWFyZVR5cGVzLmxlZnRUb3BDaXJjbGU6XG4gICAgICAgIGRyYXdGdW5jdGlvbiA9IHRoaXMuX2RyYXdDaXJjbGVMZWZ0VG9wRmxhdDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGNvcm5lclNxdWFyZVR5cGVzLnJpZ2h0Qm90dG9tQ2lyY2xlOlxuICAgICAgICBkcmF3RnVuY3Rpb24gPSB0aGlzLl9kcmF3Q2lyY2xlUmlnaHRCb3R0b21GbGF0O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgY29ybmVyU3F1YXJlVHlwZXMucGVhbnV0OlxuICAgICAgICBkcmF3RnVuY3Rpb24gPSB0aGlzLl9kcmF3UGVhbnV0U2hhcGU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBjb3JuZXJTcXVhcmVUeXBlcy5jaXJjbGVJblNxdWFyZTpcbiAgICAgICAgZHJhd0Z1bmN0aW9uID0gdGhpcy5fZHJhd0NpcmNsZUluU3F1YXJlO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIGNhc2UgY29ybmVyU3F1YXJlVHlwZXMucGFyYWdvbmFsOlxuICAgICAgLy8gICBkcmF3RnVuY3Rpb24gPSB0aGlzLl9kcmF3UGFyYWdvbmFsU2hhcGU7XG4gICAgICAvLyAgIGJyZWFrO1xuICAgICAgY2FzZSBjb3JuZXJTcXVhcmVUeXBlcy5kb3Q6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBkcmF3RnVuY3Rpb24gPSB0aGlzLl9kcmF3RG90O1xuICAgIH1cblxuICAgIGRyYXdGdW5jdGlvbi5jYWxsKHRoaXMsIHsgeCwgeSwgc2l6ZSwgcm90YXRpb24gfSk7XG4gIH1cblxuICBfcm90YXRlRmlndXJlKHsgeCwgeSwgc2l6ZSwgcm90YXRpb24gPSAwLCBkcmF3IH06IFJvdGF0ZUZpZ3VyZUFyZ3MpOiB2b2lkIHtcbiAgICBjb25zdCBjeCA9IHggKyBzaXplIC8gMjtcbiAgICBjb25zdCBjeSA9IHkgKyBzaXplIC8gMjtcblxuICAgIGRyYXcoKTtcbiAgICB0aGlzLl9lbGVtZW50Py5zZXRBdHRyaWJ1dGUoXG4gICAgICBcInRyYW5zZm9ybVwiLFxuICAgICAgYHJvdGF0ZSgkeygxODAgKiByb3RhdGlvbikgLyBNYXRoLlBJfSwke2N4fSwke2N5fSlgXG4gICAgKTtcbiAgfVxuXG4gIF9iYXNpY0RvdChhcmdzOiBCYXNpY0ZpZ3VyZURyYXdBcmdzKTogdm9pZCB7XG4gICAgY29uc3QgeyBzaXplLCB4LCB5IH0gPSBhcmdzO1xuICAgIGNvbnN0IGRvdFNpemUgPSBzaXplIC8gNztcblxuICAgIHRoaXMuX3JvdGF0ZUZpZ3VyZSh7XG4gICAgICAuLi5hcmdzLFxuICAgICAgZHJhdzogKCkgPT4ge1xuICAgICAgICB0aGlzLl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFxuICAgICAgICAgIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcbiAgICAgICAgICBcInBhdGhcIlxuICAgICAgICApO1xuICAgICAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShcImNsaXAtcnVsZVwiLCBcImV2ZW5vZGRcIik7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKFxuICAgICAgICAgIFwiZFwiLFxuICAgICAgICAgIGBNICR7eCArIHNpemUgLyAyfSAke3l9YCArIC8vIE0gY3gsIHkgLy8gIE1vdmUgdG8gdG9wIG9mIHJpbmdcbiAgICAgICAgICAgIGBhICR7c2l6ZSAvIDJ9ICR7c2l6ZSAvIDJ9IDAgMSAwIDAuMSAwYCArIC8vIGEgb3V0ZXJSYWRpdXMsIG91dGVyUmFkaXVzLCAwLCAxLCAwLCAxLCAwIC8vIERyYXcgb3V0ZXIgYXJjLCBidXQgZG9uJ3QgY2xvc2UgaXRcbiAgICAgICAgICAgIGB6YCArIC8vIFogLy8gQ2xvc2UgdGhlIG91dGVyIHNoYXBlXG4gICAgICAgICAgICBgbSAwICR7ZG90U2l6ZX1gICsgLy8gbSAtMSBvdXRlclJhZGl1cy1pbm5lclJhZGl1cyAvLyBNb3ZlIHRvIHRvcCBwb2ludCBvZiBpbm5lciByYWRpdXNcbiAgICAgICAgICAgIGBhICR7c2l6ZSAvIDIgLSBkb3RTaXplfSAke3NpemUgLyAyIC0gZG90U2l6ZX0gMCAxIDEgLTAuMSAwYCArIC8vIGEgaW5uZXJSYWRpdXMsIGlubmVyUmFkaXVzLCAwLCAxLCAxLCAtMSwgMCAvLyBEcmF3IGlubmVyIGFyYywgYnV0IGRvbid0IGNsb3NlIGl0XG4gICAgICAgICAgICBgWmAgLy8gWiAvLyBDbG9zZSB0aGUgaW5uZXIgcmluZy4gQWN0dWFsbHkgd2lsbCBzdGlsbCB3b3JrIHdpdGhvdXQsIGJ1dCBpbm5lciByaW5nIHdpbGwgaGF2ZSBvbmUgdW5pdCBtaXNzaW5nIGluIHN0cm9rZVxuICAgICAgICApO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIF9iYXNpY1NxdWFyZShhcmdzOiBCYXNpY0ZpZ3VyZURyYXdBcmdzKTogdm9pZCB7XG4gICAgY29uc3QgeyBzaXplLCB4LCB5IH0gPSBhcmdzO1xuICAgIGNvbnN0IGRvdFNpemUgPSBzaXplIC8gNztcblxuICAgIHRoaXMuX3JvdGF0ZUZpZ3VyZSh7XG4gICAgICAuLi5hcmdzLFxuICAgICAgZHJhdzogKCkgPT4ge1xuICAgICAgICB0aGlzLl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFxuICAgICAgICAgIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcbiAgICAgICAgICBcInBhdGhcIlxuICAgICAgICApO1xuICAgICAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShcImNsaXAtcnVsZVwiLCBcImV2ZW5vZGRcIik7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKFxuICAgICAgICAgIFwiZFwiLFxuICAgICAgICAgIGBNICR7eH0gJHt5fWAgK1xuICAgICAgICAgICAgYHYgJHtzaXplfWAgK1xuICAgICAgICAgICAgYGggJHtzaXplfWAgK1xuICAgICAgICAgICAgYHYgJHstc2l6ZX1gICtcbiAgICAgICAgICAgIGB6YCArXG4gICAgICAgICAgICBgTSAke3ggKyBkb3RTaXplfSAke3kgKyBkb3RTaXplfWAgK1xuICAgICAgICAgICAgYGggJHtzaXplIC0gMiAqIGRvdFNpemV9YCArXG4gICAgICAgICAgICBgdiAke3NpemUgLSAyICogZG90U2l6ZX1gICtcbiAgICAgICAgICAgIGBoICR7LXNpemUgKyAyICogZG90U2l6ZX1gICtcbiAgICAgICAgICAgIGB6YFxuICAgICAgICApO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIF9iYXNpY0V4dHJhUm91bmRlZChhcmdzOiBCYXNpY0ZpZ3VyZURyYXdBcmdzKTogdm9pZCB7XG4gICAgY29uc3QgeyBzaXplLCB4LCB5IH0gPSBhcmdzO1xuICAgIGNvbnN0IGRvdFNpemUgPSBzaXplIC8gNztcblxuICAgIHRoaXMuX3JvdGF0ZUZpZ3VyZSh7XG4gICAgICAuLi5hcmdzLFxuICAgICAgZHJhdzogKCkgPT4ge1xuICAgICAgICB0aGlzLl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFxuICAgICAgICAgIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcbiAgICAgICAgICBcInBhdGhcIlxuICAgICAgICApO1xuICAgICAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShcImNsaXAtcnVsZVwiLCBcImV2ZW5vZGRcIik7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKFxuICAgICAgICAgIFwiZFwiLFxuICAgICAgICAgIGBNICR7eH0gJHt5ICsgMi41ICogZG90U2l6ZX1gICtcbiAgICAgICAgICAgIGB2ICR7MiAqIGRvdFNpemV9YCArXG4gICAgICAgICAgICBgYSAkezIuNSAqIGRvdFNpemV9ICR7Mi41ICogZG90U2l6ZX0sIDAsIDAsIDAsICR7ZG90U2l6ZSAqIDIuNX0gJHtcbiAgICAgICAgICAgICAgZG90U2l6ZSAqIDIuNVxuICAgICAgICAgICAgfWAgK1xuICAgICAgICAgICAgYGggJHsyICogZG90U2l6ZX1gICtcbiAgICAgICAgICAgIGBhICR7Mi41ICogZG90U2l6ZX0gJHsyLjUgKiBkb3RTaXplfSwgMCwgMCwgMCwgJHtkb3RTaXplICogMi41fSAke1xuICAgICAgICAgICAgICAtZG90U2l6ZSAqIDIuNVxuICAgICAgICAgICAgfWAgK1xuICAgICAgICAgICAgYHYgJHstMiAqIGRvdFNpemV9YCArXG4gICAgICAgICAgICBgYSAkezIuNSAqIGRvdFNpemV9ICR7Mi41ICogZG90U2l6ZX0sIDAsIDAsIDAsICR7LWRvdFNpemUgKiAyLjV9ICR7XG4gICAgICAgICAgICAgIC1kb3RTaXplICogMi41XG4gICAgICAgICAgICB9YCArXG4gICAgICAgICAgICBgaCAkey0yICogZG90U2l6ZX1gICtcbiAgICAgICAgICAgIGBhICR7Mi41ICogZG90U2l6ZX0gJHsyLjUgKiBkb3RTaXplfSwgMCwgMCwgMCwgJHstZG90U2l6ZSAqIDIuNX0gJHtcbiAgICAgICAgICAgICAgZG90U2l6ZSAqIDIuNVxuICAgICAgICAgICAgfWAgK1xuICAgICAgICAgICAgYE0gJHt4ICsgMi41ICogZG90U2l6ZX0gJHt5ICsgZG90U2l6ZX1gICtcbiAgICAgICAgICAgIGBoICR7MiAqIGRvdFNpemV9YCArXG4gICAgICAgICAgICBgYSAkezEuNSAqIGRvdFNpemV9ICR7MS41ICogZG90U2l6ZX0sIDAsIDAsIDEsICR7ZG90U2l6ZSAqIDEuNX0gJHtcbiAgICAgICAgICAgICAgZG90U2l6ZSAqIDEuNVxuICAgICAgICAgICAgfWAgK1xuICAgICAgICAgICAgYHYgJHsyICogZG90U2l6ZX1gICtcbiAgICAgICAgICAgIGBhICR7MS41ICogZG90U2l6ZX0gJHsxLjUgKiBkb3RTaXplfSwgMCwgMCwgMSwgJHstZG90U2l6ZSAqIDEuNX0gJHtcbiAgICAgICAgICAgICAgZG90U2l6ZSAqIDEuNVxuICAgICAgICAgICAgfWAgK1xuICAgICAgICAgICAgYGggJHstMiAqIGRvdFNpemV9YCArXG4gICAgICAgICAgICBgYSAkezEuNSAqIGRvdFNpemV9ICR7MS41ICogZG90U2l6ZX0sIDAsIDAsIDEsICR7LWRvdFNpemUgKiAxLjV9ICR7XG4gICAgICAgICAgICAgIC1kb3RTaXplICogMS41XG4gICAgICAgICAgICB9YCArXG4gICAgICAgICAgICBgdiAkey0yICogZG90U2l6ZX1gICtcbiAgICAgICAgICAgIGBhICR7MS41ICogZG90U2l6ZX0gJHsxLjUgKiBkb3RTaXplfSwgMCwgMCwgMSwgJHtkb3RTaXplICogMS41fSAke1xuICAgICAgICAgICAgICAtZG90U2l6ZSAqIDEuNVxuICAgICAgICAgICAgfWBcbiAgICAgICAgKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBfYmFzaWNEb3R0ZWRTcXVhcmUoYXJnczogQmFzaWNGaWd1cmVEcmF3QXJncyk6IHZvaWQge1xuICAgIGNvbnN0IHsgc2l6ZSwgeCwgeSB9ID0gYXJncztcbiAgICBjb25zdCBzcXVhcmVTaXplID0gc2l6ZSAvIDc7XG4gICAgY29uc3QgZ2FwID0gc3F1YXJlU2l6ZSAqIDEuMjtcblxuICAgIHRoaXMuX3JvdGF0ZUZpZ3VyZSh7XG4gICAgICAuLi5hcmdzLFxuICAgICAgZHJhdzogKCkgPT4ge1xuICAgICAgICB0aGlzLl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFxuICAgICAgICAgIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcbiAgICAgICAgICBcInBhdGhcIlxuICAgICAgICApO1xuICAgICAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShcImNsaXAtcnVsZVwiLCBcImV2ZW5vZGRcIik7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIiMwMDBcIik7IC8vIEFkZCB0aGlzIGxpbmUgdG8gZmlsbCB0aGUgc3F1YXJlc1xuXG4gICAgICAgIGxldCBwYXRoRGF0YSA9IFwiXCI7XG4gICAgICAgIC8vIFRvcCBlZGdlXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IHNpemUgLSBzcXVhcmVTaXplOyBpICs9IGdhcCkge1xuICAgICAgICAgIHBhdGhEYXRhICs9IGBNICR7XG4gICAgICAgICAgICB4ICsgaVxuICAgICAgICAgIH0gJHt5fSBoICR7c3F1YXJlU2l6ZX0gdiAke3NxdWFyZVNpemV9IGggLSR7c3F1YXJlU2l6ZX0geiBgO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJpZ2h0IGVkZ2VcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gc2l6ZSAtIHNxdWFyZVNpemU7IGkgKz0gZ2FwKSB7XG4gICAgICAgICAgcGF0aERhdGEgKz0gYE0gJHt4ICsgc2l6ZSAtIHNxdWFyZVNpemV9ICR7XG4gICAgICAgICAgICB5ICsgaVxuICAgICAgICAgIH0gaCAke3NxdWFyZVNpemV9IHYgJHtzcXVhcmVTaXplfSBoIC0ke3NxdWFyZVNpemV9IHogYDtcbiAgICAgICAgfVxuICAgICAgICAvLyBCb3R0b20gZWRnZVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBzaXplIC0gc3F1YXJlU2l6ZTsgaSArPSBnYXApIHtcbiAgICAgICAgICBwYXRoRGF0YSArPSBgTSAke3ggKyBzaXplIC0gaSAtIHNxdWFyZVNpemV9ICR7XG4gICAgICAgICAgICB5ICsgc2l6ZSAtIHNxdWFyZVNpemVcbiAgICAgICAgICB9IGggJHtzcXVhcmVTaXplfSB2ICR7c3F1YXJlU2l6ZX0gaCAtJHtzcXVhcmVTaXplfSB6IGA7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTGVmdCBlZGdlXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IHNpemUgLSBzcXVhcmVTaXplOyBpICs9IGdhcCkge1xuICAgICAgICAgIHBhdGhEYXRhICs9IGBNICR7eH0gJHtcbiAgICAgICAgICAgIHkgKyBzaXplIC0gaSAtIHNxdWFyZVNpemVcbiAgICAgICAgICB9IGggJHtzcXVhcmVTaXplfSB2ICR7c3F1YXJlU2l6ZX0gaCAtJHtzcXVhcmVTaXplfSB6IGA7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVG9wLWxlZnQgY29ybmVyXG4gICAgICAgIHBhdGhEYXRhICs9IGBNICR7eH0gJHt5fSBoICR7c3F1YXJlU2l6ZX0gdiAke3NxdWFyZVNpemV9IGggLSR7c3F1YXJlU2l6ZX0geiBgO1xuICAgICAgICAvLyBUb3AtcmlnaHQgY29ybmVyXG4gICAgICAgIHBhdGhEYXRhICs9IGBNICR7XG4gICAgICAgICAgeCArIHNpemUgLSBzcXVhcmVTaXplXG4gICAgICAgIH0gJHt5fSBoICR7c3F1YXJlU2l6ZX0gdiAke3NxdWFyZVNpemV9IGggLSR7c3F1YXJlU2l6ZX0geiBgO1xuICAgICAgICAvLyBCb3R0b20tcmlnaHQgY29ybmVyXG4gICAgICAgIHBhdGhEYXRhICs9IGBNICR7eCArIHNpemUgLSBzcXVhcmVTaXplfSAke1xuICAgICAgICAgIHkgKyBzaXplIC0gc3F1YXJlU2l6ZVxuICAgICAgICB9IGggJHtzcXVhcmVTaXplfSB2ICR7c3F1YXJlU2l6ZX0gaCAtJHtzcXVhcmVTaXplfSB6IGA7XG4gICAgICAgIC8vIEJvdHRvbS1sZWZ0IGNvcm5lclxuICAgICAgICBwYXRoRGF0YSArPSBgTSAke3h9ICR7XG4gICAgICAgICAgeSArIHNpemUgLSBzcXVhcmVTaXplXG4gICAgICAgIH0gaCAke3NxdWFyZVNpemV9IHYgJHtzcXVhcmVTaXplfSBoIC0ke3NxdWFyZVNpemV9IHogYDtcblxuICAgICAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShcImRcIiwgcGF0aERhdGEpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIF9iYXNpY1JvdW5kZWRTcXVhcmVSaWdodEJvdHRvbUVkZ2UoYXJnczogQmFzaWNGaWd1cmVEcmF3QXJncyk6IHZvaWQge1xuICAgIGNvbnN0IHsgc2l6ZSwgeCwgeSB9ID0gYXJncztcbiAgICBjb25zdCByYWRpdXMgPSBzaXplIC8gNDsgLy8gQWRqdXN0IHRoaXMgdmFsdWUgdG8gY29udHJvbCB0aGUgcm91bmRpbmcgcmFkaXVzXG4gICAgY29uc3QgaW5uZXJTcXVhcmVTaXplID0gc2l6ZSAvIDEuNDsgLy8gU2l6ZSBvZiB0aGUgaW5uZXIgc3F1YXJlXG4gICAgY29uc3QgaW5uZXJTcXVhcmVSYWRpdXMgPSBpbm5lclNxdWFyZVNpemUgLyA0OyAvLyBSYWRpdXMgZm9yIHRoZSBpbm5lciBzcXVhcmVcbiAgICBjb25zdCBpbm5lclggPSB4ICsgKHNpemUgLSBpbm5lclNxdWFyZVNpemUpIC8gMjsgLy8gWCBwb3NpdGlvbiBmb3IgdGhlIGlubmVyIHNxdWFyZVxuICAgIGNvbnN0IGlubmVyWSA9IHkgKyAoc2l6ZSAtIGlubmVyU3F1YXJlU2l6ZSkgLyAyOyAvLyBZIHBvc2l0aW9uIGZvciB0aGUgaW5uZXIgc3F1YXJlXG5cbiAgICB0aGlzLl9yb3RhdGVGaWd1cmUoe1xuICAgICAgLi4uYXJncyxcbiAgICAgIGRyYXc6ICgpID0+IHtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBtYWluIHNoYXBlIHBhdGhcbiAgICAgICAgY29uc3QgcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcbiAgICAgICAgICBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG4gICAgICAgICAgXCJwYXRoXCJcbiAgICAgICAgKTtcbiAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJjbGlwLXJ1bGVcIiwgXCJldmVub2RkXCIpO1xuICAgICAgICBwYXRoLnNldEF0dHJpYnV0ZShcbiAgICAgICAgICBcImRcIixcbiAgICAgICAgICBgTSAke3ggKyByYWRpdXN9ICR7eX1gICsgLy8gU3RhcnQgYXQgdGhlIHRvcC1sZWZ0IHJvdW5kZWQgY29ybmVyXG4gICAgICAgICAgICBgSCAke3ggKyBzaXplIC0gcmFkaXVzfWAgKyAvLyBEcmF3IGEgaG9yaXpvbnRhbCBsaW5lIHRvIHRoZSByaWdodFxuICAgICAgICAgICAgYGEgJHtyYWRpdXN9ICR7cmFkaXVzfSAwIDAgMSAke3JhZGl1c30gJHtyYWRpdXN9YCArIC8vIERyYXcgdGhlIHRvcC1yaWdodCBhcmNcbiAgICAgICAgICAgIGBWICR7eSArIHNpemUgLSByYWRpdXN9YCArIC8vIERyYXcgYSB2ZXJ0aWNhbCBsaW5lIGRvd24gdG8gdGhlIGJvdHRvbS1yaWdodCBmbGF0IGVkZ2VcbiAgICAgICAgICAgIGBIICR7eCArIHNpemV9YCArIC8vIE1vdmUgdG8gdGhlIGJvdHRvbS1yaWdodCBmbGF0IGVkZ2VcbiAgICAgICAgICAgIGBWICR7eSArIHNpemV9YCArIC8vIERyYXcgYSB2ZXJ0aWNhbCBsaW5lIGRvd24gdG8gdGhlIGJvdHRvbVxuICAgICAgICAgICAgYEggJHt4ICsgcmFkaXVzfWAgKyAvLyBEcmF3IGEgaG9yaXpvbnRhbCBsaW5lIHRvIHRoZSBsZWZ0XG4gICAgICAgICAgICBgYSAke3JhZGl1c30gJHtyYWRpdXN9IDAgMCAxIC0ke3JhZGl1c30gLSR7cmFkaXVzfWAgKyAvLyBEcmF3IHRoZSBib3R0b20tbGVmdCBhcmNcbiAgICAgICAgICAgIGBWICR7eSArIHJhZGl1c31gICsgLy8gRHJhdyBhIHZlcnRpY2FsIGxpbmUgdXAgdG8gdGhlIHN0YXJ0aW5nIHBvaW50XG4gICAgICAgICAgICBgYSAke3JhZGl1c30gJHtyYWRpdXN9IDAgMCAxICR7cmFkaXVzfSAtJHtyYWRpdXN9YCArIC8vIERyYXcgdGhlIHRvcC1sZWZ0IGFyY1xuICAgICAgICAgICAgYFpgIC8vIENsb3NlIHRoZSBwYXRoXG4gICAgICAgICk7XG4gICAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIndoaXRlXCIpOyAvLyBTZXQgZmlsbCB0byB3aGl0ZVxuICAgICAgICBwYXRoLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCBcImJsYWNrXCIpOyAvLyBTZXQgdGhlIHN0cm9rZSBjb2xvclxuICAgICAgICBwYXRoLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCBcIjFcIik7IC8vIFNldCB0aGUgc3Ryb2tlIHdpZHRoXG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSBwYXRoO1xuXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgaW5uZXIgc3F1YXJlIHBhdGhcbiAgICAgICAgY29uc3QgaW5uZXJQYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFxuICAgICAgICAgIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcbiAgICAgICAgICBcInBhdGhcIlxuICAgICAgICApO1xuICAgICAgICBpbm5lclBhdGguc2V0QXR0cmlidXRlKFwiY2xpcC1ydWxlXCIsIFwiZXZlbm9kZFwiKTtcbiAgICAgICAgaW5uZXJQYXRoLnNldEF0dHJpYnV0ZShcbiAgICAgICAgICBcImRcIixcbiAgICAgICAgICBgTSAke2lubmVyWCArIGlubmVyU3F1YXJlUmFkaXVzfSAke2lubmVyWX1gICsgLy8gU3RhcnQgYXQgdGhlIHRvcC1sZWZ0IHJvdW5kZWQgY29ybmVyXG4gICAgICAgICAgICBgSCAke2lubmVyWCArIGlubmVyU3F1YXJlU2l6ZSAtIGlubmVyU3F1YXJlUmFkaXVzfWAgKyAvLyBEcmF3IGEgaG9yaXpvbnRhbCBsaW5lIHRvIHRoZSByaWdodFxuICAgICAgICAgICAgYGEgJHtpbm5lclNxdWFyZVJhZGl1c30gJHtpbm5lclNxdWFyZVJhZGl1c30gMCAwIDEgJHtpbm5lclNxdWFyZVJhZGl1c30gJHtpbm5lclNxdWFyZVJhZGl1c31gICsgLy8gRHJhdyB0aGUgdG9wLXJpZ2h0IGFyY1xuICAgICAgICAgICAgYFYgJHtpbm5lclkgKyBpbm5lclNxdWFyZVNpemUgLSBpbm5lclNxdWFyZVJhZGl1c31gICsgLy8gRHJhdyBhIHZlcnRpY2FsIGxpbmUgZG93biB0byB0aGUgYm90dG9tLXJpZ2h0IGZsYXQgZWRnZVxuICAgICAgICAgICAgYEggJHtpbm5lclggKyBpbm5lclNxdWFyZVNpemV9YCArIC8vIE1vdmUgdG8gdGhlIGJvdHRvbS1yaWdodCBmbGF0IGVkZ2VcbiAgICAgICAgICAgIGBWICR7aW5uZXJZICsgaW5uZXJTcXVhcmVTaXplfWAgKyAvLyBEcmF3IGEgdmVydGljYWwgbGluZSBkb3duIHRvIHRoZSBib3R0b21cbiAgICAgICAgICAgIGBIICR7aW5uZXJYICsgaW5uZXJTcXVhcmVSYWRpdXN9YCArIC8vIERyYXcgYSBob3Jpem9udGFsIGxpbmUgdG8gdGhlIGxlZnRcbiAgICAgICAgICAgIGBhICR7aW5uZXJTcXVhcmVSYWRpdXN9ICR7aW5uZXJTcXVhcmVSYWRpdXN9IDAgMCAxIC0ke2lubmVyU3F1YXJlUmFkaXVzfSAtJHtpbm5lclNxdWFyZVJhZGl1c31gICsgLy8gRHJhdyB0aGUgYm90dG9tLWxlZnQgYXJjXG4gICAgICAgICAgICBgViAke2lubmVyWSArIGlubmVyU3F1YXJlUmFkaXVzfWAgKyAvLyBEcmF3IGEgdmVydGljYWwgbGluZSB1cCB0byB0aGUgc3RhcnRpbmcgcG9pbnRcbiAgICAgICAgICAgIGBhICR7aW5uZXJTcXVhcmVSYWRpdXN9ICR7aW5uZXJTcXVhcmVSYWRpdXN9IDAgMCAxICR7aW5uZXJTcXVhcmVSYWRpdXN9IC0ke2lubmVyU3F1YXJlUmFkaXVzfWAgKyAvLyBEcmF3IHRoZSB0b3AtbGVmdCBhcmNcbiAgICAgICAgICAgIGBaYCAvLyBDbG9zZSB0aGUgcGF0aFxuICAgICAgICApO1xuICAgICAgICBpbm5lclBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIndoaXRlXCIpOyAvLyBTZXQgZmlsbCB0byB3aGl0ZSBmb3IgdGhlIGlubmVyIHNxdWFyZVxuICAgICAgICBpbm5lclBhdGguc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIFwiYmxhY2tcIik7IC8vIFNldCB0aGUgc3Ryb2tlIGNvbG9yXG4gICAgICAgIGlubmVyUGF0aC5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgXCIxXCIpOyAvLyBTZXQgdGhlIHN0cm9rZSB3aWR0aFxuXG4gICAgICAgIC8vIEFwcGVuZCB0aGUgZWxlbWVudHMgdG8gdGhlIFNWRyBjb250YWluZXJcbiAgICAgICAgY29uc3Qgc3ZnQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInN2Z1wiKTsgLy8gQWRqdXN0IHRoaXMgc2VsZWN0b3IgdG8gbWF0Y2ggeW91ciBTVkcgY29udGFpbmVyXG4gICAgICAgIGlmIChzdmdDb250YWluZXIpIHtcbiAgICAgICAgICBzdmdDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5fZWxlbWVudCk7XG4gICAgICAgICAgc3ZnQ29udGFpbmVyLmFwcGVuZENoaWxkKGlubmVyUGF0aCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBfYmFzaWNSb3VuZGVkU3F1YXJlTGVmdFRvcEVkZ2UoYXJnczogQmFzaWNGaWd1cmVEcmF3QXJncyk6IHZvaWQge1xuICAgIGNvbnN0IHsgc2l6ZSwgeCwgeSB9ID0gYXJncztcbiAgICBjb25zdCByYWRpdXMgPSBzaXplIC8gNDsgLy8gQWRqdXN0IHRoaXMgdmFsdWUgdG8gY29udHJvbCB0aGUgcm91bmRpbmcgcmFkaXVzXG4gICAgY29uc3QgaW5uZXJTcXVhcmVTaXplID0gc2l6ZSAvIDEuNDsgLy8gU2l6ZSBvZiB0aGUgaW5uZXIgc3F1YXJlXG4gICAgY29uc3QgaW5uZXJTcXVhcmVSYWRpdXMgPSBpbm5lclNxdWFyZVNpemUgLyA0OyAvLyBSYWRpdXMgZm9yIHRoZSBpbm5lciBzcXVhcmVcbiAgICBjb25zdCBpbm5lclggPSB4ICsgKHNpemUgLSBpbm5lclNxdWFyZVNpemUpIC8gMjsgLy8gWCBwb3NpdGlvbiBmb3IgdGhlIGlubmVyIHNxdWFyZVxuICAgIGNvbnN0IGlubmVyWSA9IHkgKyAoc2l6ZSAtIGlubmVyU3F1YXJlU2l6ZSkgLyAyOyAvLyBZIHBvc2l0aW9uIGZvciB0aGUgaW5uZXIgc3F1YXJlXG5cbiAgICB0aGlzLl9yb3RhdGVGaWd1cmUoe1xuICAgICAgLi4uYXJncyxcbiAgICAgIGRyYXc6ICgpID0+IHtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBtYWluIHNoYXBlIHBhdGhcbiAgICAgICAgY29uc3QgcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcbiAgICAgICAgICBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG4gICAgICAgICAgXCJwYXRoXCJcbiAgICAgICAgKTtcbiAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJjbGlwLXJ1bGVcIiwgXCJldmVub2RkXCIpO1xuICAgICAgICBwYXRoLnNldEF0dHJpYnV0ZShcbiAgICAgICAgICBcImRcIixcbiAgICAgICAgICBgTSAke3ggKyByYWRpdXN9ICR7eX1gICsgLy8gU3RhcnQgYXQgdGhlIHRvcC1sZWZ0IGZsYXQgZWRnZVxuICAgICAgICAgICAgYEggJHt4ICsgc2l6ZSAtIHJhZGl1c31gICsgLy8gRHJhdyBhIGhvcml6b250YWwgbGluZSB0byB0aGUgcmlnaHRcbiAgICAgICAgICAgIGBhICR7cmFkaXVzfSAke3JhZGl1c30gMCAwIDEgJHtyYWRpdXN9ICR7cmFkaXVzfWAgKyAvLyBEcmF3IHRoZSB0b3AtcmlnaHQgYXJjXG4gICAgICAgICAgICBgViAke3kgKyBzaXplIC0gcmFkaXVzfWAgKyAvLyBEcmF3IGEgdmVydGljYWwgbGluZSBkb3duIHRvIHRoZSBib3R0b20tcmlnaHRcbiAgICAgICAgICAgIGBhICR7cmFkaXVzfSAke3JhZGl1c30gMCAwIDEgLSR7cmFkaXVzfSAke3JhZGl1c31gICsgLy8gRHJhdyB0aGUgYm90dG9tLXJpZ2h0IGFyY1xuICAgICAgICAgICAgYEggJHt4ICsgcmFkaXVzfWAgKyAvLyBEcmF3IGEgaG9yaXpvbnRhbCBsaW5lIHRvIHRoZSBsZWZ0XG4gICAgICAgICAgICBgYSAke3JhZGl1c30gJHtyYWRpdXN9IDAgMCAxIC0ke3JhZGl1c30gLSR7cmFkaXVzfWAgKyAvLyBEcmF3IHRoZSBib3R0b20tbGVmdCBhcmNcbiAgICAgICAgICAgIGBWICR7eSArIHJhZGl1c31gICsgLy8gRHJhdyBhIHZlcnRpY2FsIGxpbmUgdXAgdG8gdGhlIHN0YXJ0aW5nIHBvaW50XG4gICAgICAgICAgICBgSCAke3h9YCArIC8vIERyYXcgYSBob3Jpem9udGFsIGxpbmUgdG8gdGhlIGxlZnQgdG8gdGhlIHN0YXJ0aW5nIHBvaW50XG4gICAgICAgICAgICBgViAke3l9YCArIC8vIE1vdmUgdXAgdG8gdGhlIHRvcCB0byBlbnN1cmUgdGhlIGZsYXQgY29ybmVyIGlzIGNvbXBsZXRlXG4gICAgICAgICAgICBgWmAgLy8gQ2xvc2UgdGhlIHBhdGhcbiAgICAgICAgKTtcbiAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwid2hpdGVcIik7IC8vIFNldCBmaWxsIHRvIHdoaXRlXG4gICAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIFwiYmxhY2tcIik7IC8vIFNldCB0aGUgc3Ryb2tlIGNvbG9yXG4gICAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwic3Ryb2tlLXdpZHRoXCIsIFwiMVwiKTsgLy8gU2V0IHRoZSBzdHJva2Ugd2lkdGhcbiAgICAgICAgdGhpcy5fZWxlbWVudCA9IHBhdGg7XG5cbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBpbm5lciBzcXVhcmUgcGF0aFxuICAgICAgICBjb25zdCBpbm5lclBhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXG4gICAgICAgICAgXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFxuICAgICAgICAgIFwicGF0aFwiXG4gICAgICAgICk7XG4gICAgICAgIGlubmVyUGF0aC5zZXRBdHRyaWJ1dGUoXCJjbGlwLXJ1bGVcIiwgXCJldmVub2RkXCIpO1xuICAgICAgICBpbm5lclBhdGguc2V0QXR0cmlidXRlKFxuICAgICAgICAgIFwiZFwiLFxuICAgICAgICAgIGBNICR7aW5uZXJYICsgaW5uZXJTcXVhcmVSYWRpdXN9ICR7aW5uZXJZfWAgKyAvLyBTdGFydCBhdCB0aGUgdG9wLWxlZnQgZmxhdCBlZGdlXG4gICAgICAgICAgICBgSCAke2lubmVyWCArIGlubmVyU3F1YXJlU2l6ZSAtIGlubmVyU3F1YXJlUmFkaXVzfWAgKyAvLyBEcmF3IGEgaG9yaXpvbnRhbCBsaW5lIHRvIHRoZSByaWdodFxuICAgICAgICAgICAgYGEgJHtpbm5lclNxdWFyZVJhZGl1c30gJHtpbm5lclNxdWFyZVJhZGl1c30gMCAwIDEgJHtpbm5lclNxdWFyZVJhZGl1c30gJHtpbm5lclNxdWFyZVJhZGl1c31gICsgLy8gRHJhdyB0aGUgdG9wLXJpZ2h0IGFyY1xuICAgICAgICAgICAgYFYgJHtpbm5lclkgKyBpbm5lclNxdWFyZVNpemUgLSBpbm5lclNxdWFyZVJhZGl1c31gICsgLy8gRHJhdyBhIHZlcnRpY2FsIGxpbmUgZG93biB0byB0aGUgYm90dG9tLXJpZ2h0XG4gICAgICAgICAgICBgYSAke2lubmVyU3F1YXJlUmFkaXVzfSAke2lubmVyU3F1YXJlUmFkaXVzfSAwIDAgMSAtJHtpbm5lclNxdWFyZVJhZGl1c30gJHtpbm5lclNxdWFyZVJhZGl1c31gICsgLy8gRHJhdyB0aGUgYm90dG9tLXJpZ2h0IGFyY1xuICAgICAgICAgICAgYEggJHtpbm5lclggKyBpbm5lclNxdWFyZVJhZGl1c31gICsgLy8gRHJhdyBhIGhvcml6b250YWwgbGluZSB0byB0aGUgbGVmdFxuICAgICAgICAgICAgYGEgJHtpbm5lclNxdWFyZVJhZGl1c30gJHtpbm5lclNxdWFyZVJhZGl1c30gMCAwIDEgLSR7aW5uZXJTcXVhcmVSYWRpdXN9IC0ke2lubmVyU3F1YXJlUmFkaXVzfWAgKyAvLyBEcmF3IHRoZSBib3R0b20tbGVmdCBhcmNcbiAgICAgICAgICAgIGBWICR7aW5uZXJZICsgaW5uZXJTcXVhcmVSYWRpdXN9YCArIC8vIERyYXcgYSB2ZXJ0aWNhbCBsaW5lIHVwIHRvIHRoZSBzdGFydGluZyBwb2ludFxuICAgICAgICAgICAgYEggJHtpbm5lclh9YCArIC8vIERyYXcgYSBob3Jpem9udGFsIGxpbmUgdG8gdGhlIGxlZnQgdG8gdGhlIHN0YXJ0aW5nIHBvaW50XG4gICAgICAgICAgICBgViAke2lubmVyWX1gICsgLy8gTW92ZSB1cCB0byB0aGUgdG9wIHRvIGVuc3VyZSB0aGUgZmxhdCBjb3JuZXIgaXMgY29tcGxldGVcbiAgICAgICAgICAgIGBaYCAvLyBDbG9zZSB0aGUgcGF0aFxuICAgICAgICApO1xuICAgICAgICBpbm5lclBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIndoaXRlXCIpOyAvLyBTZXQgZmlsbCB0byB3aGl0ZSBmb3IgdGhlIGlubmVyIHNxdWFyZVxuICAgICAgICBpbm5lclBhdGguc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIFwiYmxhY2tcIik7IC8vIFNldCB0aGUgc3Ryb2tlIGNvbG9yXG4gICAgICAgIGlubmVyUGF0aC5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgXCIxXCIpOyAvLyBTZXQgdGhlIHN0cm9rZSB3aWR0aFxuXG4gICAgICAgIC8vIEFwcGVuZCB0aGUgZWxlbWVudHMgdG8gdGhlIFNWRyBjb250YWluZXJcbiAgICAgICAgY29uc3Qgc3ZnQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInN2Z1wiKTsgLy8gQWRqdXN0IHRoaXMgc2VsZWN0b3IgdG8gbWF0Y2ggeW91ciBTVkcgY29udGFpbmVyXG4gICAgICAgIGlmIChzdmdDb250YWluZXIpIHtcbiAgICAgICAgICBzdmdDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5fZWxlbWVudCk7XG4gICAgICAgICAgc3ZnQ29udGFpbmVyLmFwcGVuZENoaWxkKGlubmVyUGF0aCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBfYmFzaWNDaXJjbGVJblNxdWFyZShhcmdzOiBCYXNpY0ZpZ3VyZURyYXdBcmdzKTogdm9pZCB7XG4gICAgY29uc3QgeyBzaXplLCB4LCB5IH0gPSBhcmdzO1xuICAgIGNvbnN0IGJvcmRlcldpZHRoID0gc2l6ZSAvIDc7IC8vIEFkanVzdCB0aGUgYm9yZGVyIHdpZHRoIGFzIG5lZWRlZFxuICAgIGNvbnN0IGNpcmNsZVJhZGl1cyA9IHNpemUgLyAyIC0gYm9yZGVyV2lkdGggLyAyO1xuXG4gICAgdGhpcy5fcm90YXRlRmlndXJlKHtcbiAgICAgIC4uLmFyZ3MsXG4gICAgICBkcmF3OiAoKSA9PiB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXG4gICAgICAgICAgXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFxuICAgICAgICAgIFwicGF0aFwiXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKFxuICAgICAgICAgIFwiZFwiLFxuICAgICAgICAgIGBNICR7eH0gJHt5fWAgK1xuICAgICAgICAgICAgYGggJHtzaXplfWAgK1xuICAgICAgICAgICAgYHYgJHtzaXplfWAgK1xuICAgICAgICAgICAgYGggJHstc2l6ZX1gICtcbiAgICAgICAgICAgIGB6YCArIC8vIE91dGVyIHNxdWFyZSBib3JkZXJcbiAgICAgICAgICAgIGBNICR7eCArIHNpemUgLyAyfSwgJHt5ICsgc2l6ZSAvIDJ9YCArXG4gICAgICAgICAgICBgbSAtJHtjaXJjbGVSYWRpdXN9LCAwYCArXG4gICAgICAgICAgICBgYSAke2NpcmNsZVJhZGl1c30sJHtjaXJjbGVSYWRpdXN9IDAgMSwwICR7MiAqIGNpcmNsZVJhZGl1c30sMGAgK1xuICAgICAgICAgICAgYGEgJHtjaXJjbGVSYWRpdXN9LCR7Y2lyY2xlUmFkaXVzfSAwIDEsMCAtJHsyICogY2lyY2xlUmFkaXVzfSwwYCAvLyBDaXJjbGUgaW4gdGhlIGNlbnRlclxuICAgICAgICApO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIF9iYXNpY0xlZnRUb3BDaXJjbGUoYXJnczogQmFzaWNGaWd1cmVEcmF3QXJncyk6IHZvaWQge1xuICAgIGNvbnN0IHsgc2l6ZSwgeCwgeSB9ID0gYXJncztcbiAgICBjb25zdCByYWRpdXMgPSBzaXplIC8gMjtcbiAgICBjb25zdCBmbGF0RWRnZUxlbmd0aCA9IHNpemUgLyAxNjsgLy8gQWRqdXN0IHRoaXMgdmFsdWUgYXMgbmVlZGVkIHRvIGNvbnRyb2wgdGhlIGxlbmd0aCBvZiB0aGUgZmxhdCBlZGdlXG4gICAgY29uc3Qgc21hbGxEb3RSYWRpdXMgPSByYWRpdXMgLyAxLjQ7IC8vIEFkanVzdCB0aGlzIHZhbHVlIHRvIGNvbnRyb2wgdGhlIHNpemUgb2YgdGhlIHNtYWxsIGRvdFxuXG4gICAgdGhpcy5fcm90YXRlRmlndXJlKHtcbiAgICAgIC4uLmFyZ3MsXG4gICAgICBkcmF3OiAoKSA9PiB7XG4gICAgICAgIC8vIENyZWF0ZSB0aGUgbWFpbiBzaGFwZSBwYXRoXG4gICAgICAgIGNvbnN0IHBhdGggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXG4gICAgICAgICAgXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFxuICAgICAgICAgIFwicGF0aFwiXG4gICAgICAgICk7XG4gICAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiY2xpcC1ydWxlXCIsIFwiZXZlbm9kZFwiKTtcbiAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgXCJkXCIsXG4gICAgICAgICAgYE0gJHt4ICsgZmxhdEVkZ2VMZW5ndGh9ICR7eX1gICsgLy8gU3RhcnQgYXQgdGhlIHRvcC1sZWZ0IGZsYXQgZWRnZVxuICAgICAgICAgICAgYEggJHt4ICsgc2l6ZSAtIHJhZGl1c31gICsgLy8gRHJhdyBhIGhvcml6b250YWwgbGluZSB0byB0aGUgcmlnaHRcbiAgICAgICAgICAgIGBhICR7cmFkaXVzfSAke3JhZGl1c30gMCAwIDEgJHtyYWRpdXN9ICR7cmFkaXVzfWAgKyAvLyBEcmF3IHRoZSB0b3AtcmlnaHQgYXJjXG4gICAgICAgICAgICBgViAke3kgKyBzaXplIC0gcmFkaXVzfWAgKyAvLyBEcmF3IGEgdmVydGljYWwgbGluZSBkb3duIHRvIHRoZSBib3R0b20tcmlnaHRcbiAgICAgICAgICAgIGBhICR7cmFkaXVzfSAke3JhZGl1c30gMCAwIDEgLSR7cmFkaXVzfSAke3JhZGl1c31gICsgLy8gRHJhdyB0aGUgYm90dG9tLXJpZ2h0IGFyY1xuICAgICAgICAgICAgYEggJHt4ICsgcmFkaXVzfWAgKyAvLyBEcmF3IGEgaG9yaXpvbnRhbCBsaW5lIHRvIHRoZSBsZWZ0XG4gICAgICAgICAgICBgYSAke3JhZGl1c30gJHtyYWRpdXN9IDAgMCAxIC0ke3JhZGl1c30gLSR7cmFkaXVzfWAgKyAvLyBEcmF3IHRoZSBib3R0b20tbGVmdCBhcmNcbiAgICAgICAgICAgIGBWICR7eSArIGZsYXRFZGdlTGVuZ3RofWAgKyAvLyBEcmF3IGEgdmVydGljYWwgbGluZSB1cCB0byB0aGUgc3RhcnRpbmcgcG9pbnQgdG8gY2xvc2UgdGhlIHBhdGhcbiAgICAgICAgICAgIGBhICR7cmFkaXVzfSAke3JhZGl1c30gMCAwIDEgJHtyYWRpdXN9IC0ke3JhZGl1c31gICsgLy8gRHJhdyB0aGUgdG9wLWxlZnQgYXJjXG4gICAgICAgICAgICBgWmAgLy8gQ2xvc2UgdGhlIHBhdGhcbiAgICAgICAgKTtcbiAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwibm9uZVwiKTsgLy8gTm8gZmlsbFxuICAgICAgICBwYXRoLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCBcImJsYWNrXCIpOyAvLyBTZXQgdGhlIHN0cm9rZSBjb2xvclxuICAgICAgICBwYXRoLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCBcIjFcIik7IC8vIFNldCB0aGUgc3Ryb2tlIHdpZHRoXG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSBwYXRoO1xuXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgd2hpdGUgcm91bmRlZCBkb3Qgd2l0aCBmbGF0IGNvcm5lclxuICAgICAgICBjb25zdCBzbWFsbERvdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcbiAgICAgICAgICBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG4gICAgICAgICAgXCJjaXJjbGVcIlxuICAgICAgICApO1xuICAgICAgICBzbWFsbERvdC5zZXRBdHRyaWJ1dGUoXCJjeFwiLCBgJHt4ICsgcmFkaXVzfWApOyAvLyBDZW50ZXIgeFxuICAgICAgICBzbWFsbERvdC5zZXRBdHRyaWJ1dGUoXCJjeVwiLCBgJHt5ICsgcmFkaXVzfWApOyAvLyBDZW50ZXIgeVxuICAgICAgICBzbWFsbERvdC5zZXRBdHRyaWJ1dGUoXCJyXCIsIGAke3NtYWxsRG90UmFkaXVzfWApOyAvLyBSYWRpdXMgb2YgdGhlIHdoaXRlIGNpcmNsZVxuICAgICAgICBzbWFsbERvdC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwid2hpdGVcIik7IC8vIFdoaXRlIGZpbGxcbiAgICAgICAgc21hbGxEb3Quc2V0QXR0cmlidXRlKFwic3Ryb2tlXCIsIFwibm9uZVwiKTsgLy8gTm8gc3Ryb2tlXG5cbiAgICAgICAgLy8gQXBwZW5kIGJvdGggZWxlbWVudHMgdG8gdGhlIFNWRyBjb250YWluZXJcbiAgICAgICAgY29uc3Qgc3ZnQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInN2Z1wiKTsgLy8gQWRqdXN0IHRoaXMgc2VsZWN0b3IgdG8gbWF0Y2ggeW91ciBTVkcgY29udGFpbmVyXG4gICAgICAgIGlmIChzdmdDb250YWluZXIpIHtcbiAgICAgICAgICBzdmdDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5fZWxlbWVudCk7XG4gICAgICAgICAgc3ZnQ29udGFpbmVyLmFwcGVuZENoaWxkKHNtYWxsRG90KTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIF9iYXNpY1JpZ2h0Qm90dG9tQ2lyY2xlKGFyZ3M6IEJhc2ljRmlndXJlRHJhd0FyZ3MpOiB2b2lkIHtcbiAgICBjb25zdCB7IHNpemUsIHgsIHkgfSA9IGFyZ3M7XG4gICAgY29uc3QgcmFkaXVzID0gc2l6ZSAvIDI7XG4gICAgY29uc3QgZmxhdEVkZ2VMZW5ndGggPSBzaXplIC8gMTY7IC8vIEFkanVzdCB0aGlzIHZhbHVlIGFzIG5lZWRlZCB0byBjb250cm9sIHRoZSBsZW5ndGggb2YgdGhlIGZsYXQgZWRnZVxuICAgIGNvbnN0IHNtYWxsRG90UmFkaXVzID0gcmFkaXVzIC8gMS40OyAvLyBBZGp1c3QgdGhpcyB2YWx1ZSB0byBjb250cm9sIHRoZSBzaXplIG9mIHRoZSBzbWFsbCBkb3RcblxuICAgIHRoaXMuX3JvdGF0ZUZpZ3VyZSh7XG4gICAgICAuLi5hcmdzLFxuICAgICAgZHJhdzogKCkgPT4ge1xuICAgICAgICAvLyBDcmVhdGUgdGhlIG1haW4gc2hhcGUgcGF0aFxuICAgICAgICBjb25zdCBwYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFxuICAgICAgICAgIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcbiAgICAgICAgICBcInBhdGhcIlxuICAgICAgICApO1xuICAgICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImNsaXAtcnVsZVwiLCBcImV2ZW5vZGRcIik7XG4gICAgICAgIHBhdGguc2V0QXR0cmlidXRlKFxuICAgICAgICAgIFwiZFwiLFxuICAgICAgICAgIGBNICR7eH0gJHt5ICsgcmFkaXVzfWAgKyAvLyBTdGFydCBhdCB0aGUgdG9wLWxlZnQgYXJjXG4gICAgICAgICAgICBgYSAke3JhZGl1c30gJHtyYWRpdXN9IDAgMCAxICR7cmFkaXVzfSAtJHtyYWRpdXN9YCArIC8vIERyYXcgdGhlIHRvcC1sZWZ0IGFyY1xuICAgICAgICAgICAgYEggJHt4ICsgc2l6ZSAtIHJhZGl1c31gICsgLy8gRHJhdyBhIGhvcml6b250YWwgbGluZSB0byB0aGUgcmlnaHRcbiAgICAgICAgICAgIGBhICR7cmFkaXVzfSAke3JhZGl1c30gMCAwIDEgJHtyYWRpdXN9ICR7cmFkaXVzfWAgKyAvLyBEcmF3IHRoZSB0b3AtcmlnaHQgYXJjXG4gICAgICAgICAgICBgViAke3kgKyBzaXplIC0gcmFkaXVzfWAgKyAvLyBEcmF3IGEgdmVydGljYWwgbGluZSBkb3duIHRvIHRoZSBib3R0b20tcmlnaHQgZmxhdCBlZGdlXG4gICAgICAgICAgICBgSCAke3ggKyBzaXplIC0gZmxhdEVkZ2VMZW5ndGh9YCArIC8vIERyYXcgYSBob3Jpem9udGFsIGxpbmUgdG8gdGhlIGxlZnQgdG8gdGhlIGZsYXQgZWRnZVxuICAgICAgICAgICAgYFYgJHt5ICsgc2l6ZX1gICsgLy8gRHJhdyBhIHZlcnRpY2FsIGxpbmUgZG93biB0byB0aGUgYm90dG9tXG4gICAgICAgICAgICBgSCAke3ggKyByYWRpdXN9YCArIC8vIERyYXcgYSBob3Jpem9udGFsIGxpbmUgdG8gdGhlIGxlZnRcbiAgICAgICAgICAgIGBhICR7cmFkaXVzfSAke3JhZGl1c30gMCAwIDEgLSR7cmFkaXVzfSAtJHtyYWRpdXN9YCArIC8vIERyYXcgdGhlIGJvdHRvbS1sZWZ0IGFyY1xuICAgICAgICAgICAgYFpgIC8vIENsb3NlIHRoZSBwYXRoXG4gICAgICAgICk7XG4gICAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIm5vbmVcIik7IC8vIE5vIGZpbGxcbiAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgXCJibGFja1wiKTsgLy8gU2V0IHRoZSBzdHJva2UgY29sb3JcbiAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJzdHJva2Utd2lkdGhcIiwgXCIxXCIpOyAvLyBTZXQgdGhlIHN0cm9rZSB3aWR0aFxuICAgICAgICB0aGlzLl9lbGVtZW50ID0gcGF0aDtcblxuICAgICAgICAvLyBDcmVhdGUgdGhlIHdoaXRlIHJvdW5kZWQgZG90IHdpdGggZmxhdCBjb3JuZXJcbiAgICAgICAgY29uc3Qgc21hbGxEb3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXG4gICAgICAgICAgXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLFxuICAgICAgICAgIFwiY2lyY2xlXCJcbiAgICAgICAgKTtcbiAgICAgICAgc21hbGxEb3Quc2V0QXR0cmlidXRlKFwiY3hcIiwgYCR7eCArIHJhZGl1c31gKTsgLy8gQ2VudGVyIHhcbiAgICAgICAgc21hbGxEb3Quc2V0QXR0cmlidXRlKFwiY3lcIiwgYCR7eSArIHJhZGl1c31gKTsgLy8gQ2VudGVyIHlcbiAgICAgICAgc21hbGxEb3Quc2V0QXR0cmlidXRlKFwiclwiLCBgJHtzbWFsbERvdFJhZGl1c31gKTsgLy8gUmFkaXVzIG9mIHRoZSB3aGl0ZSBjaXJjbGVcbiAgICAgICAgc21hbGxEb3Quc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIndoaXRlXCIpOyAvLyBXaGl0ZSBmaWxsXG4gICAgICAgIHNtYWxsRG90LnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCBcIm5vbmVcIik7IC8vIE5vIHN0cm9rZVxuXG4gICAgICAgIC8vIEFwcGVuZCBib3RoIGVsZW1lbnRzIHRvIHRoZSBTVkcgY29udGFpbmVyXG4gICAgICAgIGNvbnN0IHN2Z0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJzdmdcIik7IC8vIEFkanVzdCB0aGlzIHNlbGVjdG9yIHRvIG1hdGNoIHlvdXIgU1ZHIGNvbnRhaW5lclxuICAgICAgICBpZiAoc3ZnQ29udGFpbmVyKSB7XG4gICAgICAgICAgc3ZnQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuX2VsZW1lbnQpO1xuICAgICAgICAgIHN2Z0NvbnRhaW5lci5hcHBlbmRDaGlsZChzbWFsbERvdCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBfYmFzaWNQZWFudXRTaGFwZShhcmdzOiBCYXNpY0ZpZ3VyZURyYXdBcmdzKTogdm9pZCB7XG4gICAgY29uc3QgeyBzaXplLCB4LCB5IH0gPSBhcmdzO1xuICAgIGNvbnN0IHJhZGl1cyA9IHNpemUgLyAzLjc7IC8vIEFkanVzdCB0aGlzIHZhbHVlIHRvIGNvbnRyb2wgdGhlIHJvdW5kaW5nIHJhZGl1c1xuICAgIGNvbnN0IGlubmVyU3F1YXJlU2l6ZSA9IHNpemUgLyAxLjQ7IC8vIFNpemUgb2YgdGhlIGlubmVyIHNxdWFyZVxuICAgIGNvbnN0IGlubmVyU3F1YXJlUmFkaXVzID0gaW5uZXJTcXVhcmVTaXplIC8gMy43OyAvLyBSYWRpdXMgZm9yIHRoZSBpbm5lciBzcXVhcmVcbiAgICBjb25zdCBpbm5lclggPSB4ICsgKHNpemUgLSBpbm5lclNxdWFyZVNpemUpIC8gMjsgLy8gWCBwb3NpdGlvbiBmb3IgdGhlIGlubmVyIHNxdWFyZVxuICAgIGNvbnN0IGlubmVyWSA9IHkgKyAoc2l6ZSAtIGlubmVyU3F1YXJlU2l6ZSkgLyAyOyAvLyBZIHBvc2l0aW9uIGZvciB0aGUgaW5uZXIgc3F1YXJlXG5cbiAgICB0aGlzLl9yb3RhdGVGaWd1cmUoe1xuICAgICAgLi4uYXJncyxcbiAgICAgIGRyYXc6ICgpID0+IHtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBtYWluIHNoYXBlIHBhdGhcbiAgICAgICAgY29uc3QgcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcbiAgICAgICAgICBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXG4gICAgICAgICAgXCJwYXRoXCJcbiAgICAgICAgKTtcbiAgICAgICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJjbGlwLXJ1bGVcIiwgXCJldmVub2RkXCIpO1xuICAgICAgICBwYXRoLnNldEF0dHJpYnV0ZShcbiAgICAgICAgICBcImRcIixcbiAgICAgICAgICBgTSAke3ggKyByYWRpdXN9ICR7eX1gICsgLy8gU3RhcnQgYXQgdGhlIHRvcC1sZWZ0IGZsYXQgZWRnZVxuICAgICAgICAgICAgYEggJHt4ICsgc2l6ZSAtIHJhZGl1c31gICsgLy8gRHJhdyBhIGhvcml6b250YWwgbGluZSB0byB0aGUgcmlnaHRcbiAgICAgICAgICAgIGBhICR7cmFkaXVzfSAke3JhZGl1c30gMCAwIDEgJHtyYWRpdXN9ICR7cmFkaXVzfWAgKyAvLyBEcmF3IHRoZSB0b3AtcmlnaHQgYXJjXG4gICAgICAgICAgICBgViAke3kgKyBzaXplIC0gcmFkaXVzfWAgKyAvLyBEcmF3IGEgdmVydGljYWwgbGluZSBkb3duIHRvIHRoZSBib3R0b20tcmlnaHQgZmxhdCBlZGdlXG4gICAgICAgICAgICBgSCAke3ggKyBzaXplfWAgKyAvLyBNb3ZlIHRvIHRoZSBib3R0b20tcmlnaHQgZmxhdCBlZGdlXG4gICAgICAgICAgICBgViAke3kgKyBzaXplfWAgKyAvLyBEcmF3IGEgdmVydGljYWwgbGluZSBkb3duIHRvIHRoZSBib3R0b21cbiAgICAgICAgICAgIGBIICR7eCArIHJhZGl1c31gICsgLy8gRHJhdyBhIGhvcml6b250YWwgbGluZSB0byB0aGUgbGVmdFxuICAgICAgICAgICAgYGEgJHtyYWRpdXN9ICR7cmFkaXVzfSAwIDAgMSAtJHtyYWRpdXN9IC0ke3JhZGl1c31gICsgLy8gRHJhdyB0aGUgYm90dG9tLWxlZnQgYXJjXG4gICAgICAgICAgICBgViAke3kgKyByYWRpdXN9YCArIC8vIERyYXcgYSB2ZXJ0aWNhbCBsaW5lIHVwIHRvIHRoZSBzdGFydGluZyBwb2ludFxuICAgICAgICAgICAgYEggJHt4fWAgKyAvLyBNb3ZlIHRvIHRoZSB0b3AtbGVmdCBmbGF0IGVkZ2VcbiAgICAgICAgICAgIGBWICR7eX1gICsgLy8gRHJhdyBhIHZlcnRpY2FsIGxpbmUgdXAgdG8gdGhlIHRvcFxuICAgICAgICAgICAgYFpgIC8vIENsb3NlIHRoZSBwYXRoXG4gICAgICAgICk7XG4gICAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcIndoaXRlXCIpOyAvLyBTZXQgZmlsbCB0byB3aGl0ZVxuICAgICAgICBwYXRoLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCBcImJsYWNrXCIpOyAvLyBTZXQgdGhlIHN0cm9rZSBjb2xvclxuICAgICAgICBwYXRoLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCBcIjFcIik7IC8vIFNldCB0aGUgc3Ryb2tlIHdpZHRoXG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSBwYXRoO1xuXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgaW5uZXIgc3F1YXJlIHBhdGhcbiAgICAgICAgY29uc3QgaW5uZXJQYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFxuICAgICAgICAgIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIixcbiAgICAgICAgICBcInBhdGhcIlxuICAgICAgICApO1xuICAgICAgICBpbm5lclBhdGguc2V0QXR0cmlidXRlKFwiY2xpcC1ydWxlXCIsIFwiZXZlbm9kZFwiKTtcbiAgICAgICAgaW5uZXJQYXRoLnNldEF0dHJpYnV0ZShcbiAgICAgICAgICBcImRcIixcbiAgICAgICAgICBgTSAke2lubmVyWCArIGlubmVyU3F1YXJlUmFkaXVzfSAke2lubmVyWX1gICsgLy8gU3RhcnQgYXQgdGhlIHRvcC1sZWZ0IGZsYXQgZWRnZVxuICAgICAgICAgICAgYEggJHtpbm5lclggKyBpbm5lclNxdWFyZVNpemUgLSBpbm5lclNxdWFyZVJhZGl1c31gICsgLy8gRHJhdyBhIGhvcml6b250YWwgbGluZSB0byB0aGUgcmlnaHRcbiAgICAgICAgICAgIGBhICR7aW5uZXJTcXVhcmVSYWRpdXN9ICR7aW5uZXJTcXVhcmVSYWRpdXN9IDAgMCAxICR7aW5uZXJTcXVhcmVSYWRpdXN9ICR7aW5uZXJTcXVhcmVSYWRpdXN9YCArIC8vIERyYXcgdGhlIHRvcC1yaWdodCBhcmNcbiAgICAgICAgICAgIGBWICR7aW5uZXJZICsgaW5uZXJTcXVhcmVTaXplIC0gaW5uZXJTcXVhcmVSYWRpdXN9YCArIC8vIERyYXcgYSB2ZXJ0aWNhbCBsaW5lIGRvd24gdG8gdGhlIGJvdHRvbS1yaWdodCBmbGF0IGVkZ2VcbiAgICAgICAgICAgIGBIICR7aW5uZXJYICsgaW5uZXJTcXVhcmVTaXplfWAgKyAvLyBNb3ZlIHRvIHRoZSBib3R0b20tcmlnaHQgZmxhdCBlZGdlXG4gICAgICAgICAgICBgViAke2lubmVyWSArIGlubmVyU3F1YXJlU2l6ZX1gICsgLy8gRHJhdyBhIHZlcnRpY2FsIGxpbmUgZG93biB0byB0aGUgYm90dG9tXG4gICAgICAgICAgICBgSCAke2lubmVyWCArIGlubmVyU3F1YXJlUmFkaXVzfWAgKyAvLyBEcmF3IGEgaG9yaXpvbnRhbCBsaW5lIHRvIHRoZSBsZWZ0XG4gICAgICAgICAgICBgYSAke2lubmVyU3F1YXJlUmFkaXVzfSAke2lubmVyU3F1YXJlUmFkaXVzfSAwIDAgMSAtJHtpbm5lclNxdWFyZVJhZGl1c30gLSR7aW5uZXJTcXVhcmVSYWRpdXN9YCArIC8vIERyYXcgdGhlIGJvdHRvbS1sZWZ0IGFyY1xuICAgICAgICAgICAgYFYgJHtpbm5lclkgKyBpbm5lclNxdWFyZVJhZGl1c31gICsgLy8gRHJhdyBhIHZlcnRpY2FsIGxpbmUgdXAgdG8gdGhlIHN0YXJ0aW5nIHBvaW50XG4gICAgICAgICAgICBgSCAke2lubmVyWH1gICsgLy8gTW92ZSB0byB0aGUgdG9wLWxlZnQgZmxhdCBlZGdlXG4gICAgICAgICAgICBgViAke2lubmVyWX1gICsgLy8gRHJhdyBhIHZlcnRpY2FsIGxpbmUgdXAgdG8gdGhlIHRvcFxuICAgICAgICAgICAgYFpgIC8vIENsb3NlIHRoZSBwYXRoXG4gICAgICAgICk7XG4gICAgICAgIGlubmVyUGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwid2hpdGVcIik7IC8vIFNldCBmaWxsIHRvIHdoaXRlIGZvciB0aGUgaW5uZXIgc3F1YXJlXG4gICAgICAgIGlubmVyUGF0aC5zZXRBdHRyaWJ1dGUoXCJzdHJva2VcIiwgXCJibGFja1wiKTsgLy8gU2V0IHRoZSBzdHJva2UgY29sb3JcbiAgICAgICAgaW5uZXJQYXRoLnNldEF0dHJpYnV0ZShcInN0cm9rZS13aWR0aFwiLCBcIjFcIik7IC8vIFNldCB0aGUgc3Ryb2tlIHdpZHRoXG5cbiAgICAgICAgLy8gQXBwZW5kIHRoZSBlbGVtZW50cyB0byB0aGUgU1ZHIGNvbnRhaW5lclxuICAgICAgICBjb25zdCBzdmdDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwic3ZnXCIpOyAvLyBBZGp1c3QgdGhpcyBzZWxlY3RvciB0byBtYXRjaCB5b3VyIFNWRyBjb250YWluZXJcbiAgICAgICAgaWYgKHN2Z0NvbnRhaW5lcikge1xuICAgICAgICAgIHN2Z0NvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLl9lbGVtZW50KTtcbiAgICAgICAgICBzdmdDb250YWluZXIuYXBwZW5kQ2hpbGQoaW5uZXJQYXRoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIC8vIF9iYXNpY1BhcmFnb25hbFNoYXBlKGFyZ3M6IEJhc2ljRmlndXJlRHJhd0FyZ3MpOiB2b2lkIHtcbiAgLy8gICBjb25zdCB7IHNpemUsIHgsIHkgfSA9IGFyZ3M7XG4gIFxuICAvLyAgIHRoaXMuX3JvdGF0ZUZpZ3VyZSh7XG4gIC8vICAgICAuLi5hcmdzLFxuICAvLyAgICAgZHJhdzogKCkgPT4ge1xuICAvLyAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgXCJwYXRoXCIpO1xuICAvLyAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImNsaXAtcnVsZVwiLCBcImV2ZW5vZGRcIik7XG4gIC8vICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFxuICAvLyAgICAgICAgIFwiZFwiLFxuICAvLyAgICAgICAgIGBNICR7eCArIHNpemUgKiAwLjJ9ICR7eX1gICsgLy8gTW92ZSB0byB0aGUgdG9wLWxlZnQgY29ybmVyXG4gIC8vICAgICAgICAgYEwgJHt4ICsgc2l6ZSAqIDAuOH0gJHt5fWAgKyAvLyBEcmF3IGxpbmUgdG8gdG9wLXJpZ2h0IGNvcm5lclxuICAvLyAgICAgICAgIGBMICR7eCArIHNpemUgKiAwLjl9ICR7eSArIHNpemUgKiAwLjN9YCArIC8vIERyYXcgbGluZSB0byByaWdodC1taWRkbGUgY29ybmVyXG4gIC8vICAgICAgICAgYEwgJHt4ICsgc2l6ZSAqIDAuN30gJHt5ICsgc2l6ZX1gICsgLy8gRHJhdyBsaW5lIHRvIGJvdHRvbS1yaWdodCBjb3JuZXJcbiAgLy8gICAgICAgICBgTCAke3ggKyBzaXplICogMC4zfSAke3kgKyBzaXplfWAgKyAvLyBEcmF3IGxpbmUgdG8gYm90dG9tLWxlZnQgY29ybmVyXG4gIC8vICAgICAgICAgYEwgJHt4ICsgc2l6ZSAqIDAuMX0gJHt5ICsgc2l6ZSAqIDAuN31gICsgLy8gRHJhdyBsaW5lIHRvIGxlZnQtbWlkZGxlIGNvcm5lclxuICAvLyAgICAgICAgIGBaYCAvLyBDbG9zZSB0aGUgc2hhcGVcbiAgLy8gICAgICAgKTtcbiAgLy8gICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwiYmxhY2tcIik7IC8vIFNldCBmaWxsIGNvbG9yIHRvIGJsYWNrXG4gIFxuICAvLyAgICAgICAvLyBBcHBlbmQgdGhlIHNoYXBlIHRvIHRoZSBwYXJlbnQgZWxlbWVudFxuICAvLyAgICAgICBhcmdzLnBhcmVudC5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgLy8gICAgIH0sXG4gIC8vICAgfSk7XG4gIC8vIH1cbiAgXG4gIFxuXG4gIF9kcmF3RG90KHsgeCwgeSwgc2l6ZSwgcm90YXRpb24gfTogRHJhd0FyZ3MpOiB2b2lkIHtcbiAgICB0aGlzLl9iYXNpY0RvdCh7IHgsIHksIHNpemUsIHJvdGF0aW9uIH0pO1xuICB9XG5cbiAgX2RyYXdTcXVhcmUoeyB4LCB5LCBzaXplLCByb3RhdGlvbiB9OiBEcmF3QXJncyk6IHZvaWQge1xuICAgIHRoaXMuX2Jhc2ljU3F1YXJlKHsgeCwgeSwgc2l6ZSwgcm90YXRpb24gfSk7XG4gIH1cblxuICBfZHJhd0V4dHJhUm91bmRlZCh7IHgsIHksIHNpemUsIHJvdGF0aW9uIH06IERyYXdBcmdzKTogdm9pZCB7XG4gICAgdGhpcy5fYmFzaWNFeHRyYVJvdW5kZWQoeyB4LCB5LCBzaXplLCByb3RhdGlvbiB9KTtcbiAgfVxuXG4gIF9kcmF3RG90dGVkU3F1YXJlKHsgeCwgeSwgc2l6ZSwgcm90YXRpb24gfTogRHJhd0FyZ3MpOiB2b2lkIHtcbiAgICB0aGlzLl9iYXNpY0RvdHRlZFNxdWFyZSh7IHgsIHksIHNpemUsIHJvdGF0aW9uIH0pO1xuICB9XG5cbiAgX2RyYXdSb3VuZGVkU3F1YXJlUmlnaHRCb3R0b21FZGdlKHsgeCwgeSwgc2l6ZSwgcm90YXRpb24gfTogRHJhd0FyZ3MpOiB2b2lkIHtcbiAgICB0aGlzLl9iYXNpY1JvdW5kZWRTcXVhcmVSaWdodEJvdHRvbUVkZ2UoeyB4LCB5LCBzaXplLCByb3RhdGlvbiB9KTtcbiAgfVxuXG4gIF9kcmF3Um91bmRlZFNxdWFyZUxlZnRUb3BFZGdlKHsgeCwgeSwgc2l6ZSwgcm90YXRpb24gfTogRHJhd0FyZ3MpOiB2b2lkIHtcbiAgICB0aGlzLl9iYXNpY1JvdW5kZWRTcXVhcmVMZWZ0VG9wRWRnZSh7IHgsIHksIHNpemUsIHJvdGF0aW9uIH0pO1xuICB9XG5cbiAgX2RyYXdDaXJjbGVJblNxdWFyZSh7IHgsIHksIHNpemUsIHJvdGF0aW9uIH06IERyYXdBcmdzKTogdm9pZCB7XG4gICAgdGhpcy5fYmFzaWNDaXJjbGVJblNxdWFyZSh7IHgsIHksIHNpemUsIHJvdGF0aW9uIH0pO1xuICB9XG5cbiAgX2RyYXdDaXJjbGVMZWZ0VG9wRmxhdCh7IHgsIHksIHNpemUsIHJvdGF0aW9uIH06IERyYXdBcmdzKTogdm9pZCB7XG4gICAgdGhpcy5fYmFzaWNMZWZ0VG9wQ2lyY2xlKHsgeCwgeSwgc2l6ZSwgcm90YXRpb24gfSk7XG4gIH1cblxuICBfZHJhd0NpcmNsZVJpZ2h0Qm90dG9tRmxhdCh7IHgsIHksIHNpemUsIHJvdGF0aW9uIH06IERyYXdBcmdzKTogdm9pZCB7XG4gICAgdGhpcy5fYmFzaWNSaWdodEJvdHRvbUNpcmNsZSh7IHgsIHksIHNpemUsIHJvdGF0aW9uIH0pO1xuICB9XG4gIF9kcmF3UGVhbnV0U2hhcGUoeyB4LCB5LCBzaXplLCByb3RhdGlvbiB9OiBEcmF3QXJncyk6IHZvaWQge1xuICAgIHRoaXMuX2Jhc2ljUGVhbnV0U2hhcGUoeyB4LCB5LCBzaXplLCByb3RhdGlvbiB9KTtcbiAgfVxuICAvLyBfZHJhd1BhcmFnb25hbFNoYXBlKHsgeCwgeSwgc2l6ZSwgcm90YXRpb24gfTogRHJhd0FyZ3MpOiB2b2lkIHtcbiAgLy8gICB0aGlzLl9iYXNpY1BhcmFnb25hbFNoYXBlKHsgeCwgeSwgc2l6ZSwgcm90YXRpb24gfSk7XG4gIC8vIH1cbn1cbiIsImltcG9ydCBkb3RUeXBlcyBmcm9tIFwiLi4vLi4vLi4vY29uc3RhbnRzL2RvdFR5cGVzXCI7XG5pbXBvcnQge1xuICBEb3RUeXBlLFxuICBHZXROZWlnaGJvcixcbiAgUm90YXRlRmlndXJlQXJnc0NhbnZhcyxcbiAgQmFzaWNGaWd1cmVEcmF3QXJnc0NhbnZhcyxcbiAgRHJhd0FyZ3NDYW52YXNcbn0gZnJvbSBcIi4uLy4uLy4uL3R5cGVzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFFSRG90IHtcbiAgX2NvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgX3R5cGU6IERvdFR5cGU7XG5cbiAgY29uc3RydWN0b3IoeyBjb250ZXh0LCB0eXBlIH06IHsgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEOyB0eXBlOiBEb3RUeXBlIH0pIHtcbiAgICB0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcbiAgICB0aGlzLl90eXBlID0gdHlwZTtcbiAgfVxuXG4gIGRyYXcoeDogbnVtYmVyLCB5OiBudW1iZXIsIHNpemU6IG51bWJlciwgZ2V0TmVpZ2hib3I6IEdldE5laWdoYm9yKTogdm9pZCB7XG4gICAgY29uc3QgY29udGV4dCA9IHRoaXMuX2NvbnRleHQ7XG4gICAgY29uc3QgdHlwZSA9IHRoaXMuX3R5cGU7XG4gICAgbGV0IGRyYXdGdW5jdGlvbjtcblxuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSBkb3RUeXBlcy5kb3RzOlxuICAgICAgICBkcmF3RnVuY3Rpb24gPSB0aGlzLl9kcmF3RG90O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgZG90VHlwZXMuY2xhc3N5OlxuICAgICAgICBkcmF3RnVuY3Rpb24gPSB0aGlzLl9kcmF3Q2xhc3N5O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgZG90VHlwZXMuY2xhc3N5Um91bmRlZDpcbiAgICAgICAgZHJhd0Z1bmN0aW9uID0gdGhpcy5fZHJhd0NsYXNzeVJvdW5kZWQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBkb3RUeXBlcy5yb3VuZGVkOlxuICAgICAgICBkcmF3RnVuY3Rpb24gPSB0aGlzLl9kcmF3Um91bmRlZDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGRvdFR5cGVzLmV4dHJhUm91bmRlZDpcbiAgICAgICAgZHJhd0Z1bmN0aW9uID0gdGhpcy5fZHJhd0V4dHJhUm91bmRlZDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGRvdFR5cGVzLnNxdWFyZTpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGRyYXdGdW5jdGlvbiA9IHRoaXMuX2RyYXdTcXVhcmU7XG4gICAgfVxuXG4gICAgZHJhd0Z1bmN0aW9uLmNhbGwodGhpcywgeyB4LCB5LCBzaXplLCBjb250ZXh0LCBnZXROZWlnaGJvciB9KTtcbiAgfVxuXG4gIF9yb3RhdGVGaWd1cmUoeyB4LCB5LCBzaXplLCBjb250ZXh0LCByb3RhdGlvbiA9IDAsIGRyYXcgfTogUm90YXRlRmlndXJlQXJnc0NhbnZhcyk6IHZvaWQge1xuICAgIGNvbnN0IGN4ID0geCArIHNpemUgLyAyO1xuICAgIGNvbnN0IGN5ID0geSArIHNpemUgLyAyO1xuXG4gICAgY29udGV4dC50cmFuc2xhdGUoY3gsIGN5KTtcbiAgICByb3RhdGlvbiAmJiBjb250ZXh0LnJvdGF0ZShyb3RhdGlvbik7XG4gICAgZHJhdygpO1xuICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG4gICAgcm90YXRpb24gJiYgY29udGV4dC5yb3RhdGUoLXJvdGF0aW9uKTtcbiAgICBjb250ZXh0LnRyYW5zbGF0ZSgtY3gsIC1jeSk7XG4gIH1cblxuICBfYmFzaWNEb3QoYXJnczogQmFzaWNGaWd1cmVEcmF3QXJnc0NhbnZhcyk6IHZvaWQge1xuICAgIGNvbnN0IHsgc2l6ZSwgY29udGV4dCB9ID0gYXJncztcblxuICAgIHRoaXMuX3JvdGF0ZUZpZ3VyZSh7XG4gICAgICAuLi5hcmdzLFxuICAgICAgZHJhdzogKCkgPT4ge1xuICAgICAgICBjb250ZXh0LmFyYygwLCAwLCBzaXplIC8gMiwgMCwgTWF0aC5QSSAqIDIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgX2Jhc2ljU3F1YXJlKGFyZ3M6IEJhc2ljRmlndXJlRHJhd0FyZ3NDYW52YXMpOiB2b2lkIHtcbiAgICBjb25zdCB7IHNpemUsIGNvbnRleHQgfSA9IGFyZ3M7XG5cbiAgICB0aGlzLl9yb3RhdGVGaWd1cmUoe1xuICAgICAgLi4uYXJncyxcbiAgICAgIGRyYXc6ICgpID0+IHtcbiAgICAgICAgY29udGV4dC5yZWN0KC1zaXplIC8gMiwgLXNpemUgLyAyLCBzaXplLCBzaXplKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vaWYgcm90YXRpb24gPT09IDAgLSByaWdodCBzaWRlIGlzIHJvdW5kZWRcbiAgX2Jhc2ljU2lkZVJvdW5kZWQoYXJnczogQmFzaWNGaWd1cmVEcmF3QXJnc0NhbnZhcyk6IHZvaWQge1xuICAgIGNvbnN0IHsgc2l6ZSwgY29udGV4dCB9ID0gYXJncztcblxuICAgIHRoaXMuX3JvdGF0ZUZpZ3VyZSh7XG4gICAgICAuLi5hcmdzLFxuICAgICAgZHJhdzogKCkgPT4ge1xuICAgICAgICBjb250ZXh0LmFyYygwLCAwLCBzaXplIC8gMiwgLU1hdGguUEkgLyAyLCBNYXRoLlBJIC8gMik7XG4gICAgICAgIGNvbnRleHQubGluZVRvKC1zaXplIC8gMiwgc2l6ZSAvIDIpO1xuICAgICAgICBjb250ZXh0LmxpbmVUbygtc2l6ZSAvIDIsIC1zaXplIC8gMik7XG4gICAgICAgIGNvbnRleHQubGluZVRvKDAsIC1zaXplIC8gMik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvL2lmIHJvdGF0aW9uID09PSAwIC0gdG9wIHJpZ2h0IGNvcm5lciBpcyByb3VuZGVkXG4gIF9iYXNpY0Nvcm5lclJvdW5kZWQoYXJnczogQmFzaWNGaWd1cmVEcmF3QXJnc0NhbnZhcyk6IHZvaWQge1xuICAgIGNvbnN0IHsgc2l6ZSwgY29udGV4dCB9ID0gYXJncztcblxuICAgIHRoaXMuX3JvdGF0ZUZpZ3VyZSh7XG4gICAgICAuLi5hcmdzLFxuICAgICAgZHJhdzogKCkgPT4ge1xuICAgICAgICBjb250ZXh0LmFyYygwLCAwLCBzaXplIC8gMiwgLU1hdGguUEkgLyAyLCAwKTtcbiAgICAgICAgY29udGV4dC5saW5lVG8oc2l6ZSAvIDIsIHNpemUgLyAyKTtcbiAgICAgICAgY29udGV4dC5saW5lVG8oLXNpemUgLyAyLCBzaXplIC8gMik7XG4gICAgICAgIGNvbnRleHQubGluZVRvKC1zaXplIC8gMiwgLXNpemUgLyAyKTtcbiAgICAgICAgY29udGV4dC5saW5lVG8oMCwgLXNpemUgLyAyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vaWYgcm90YXRpb24gPT09IDAgLSB0b3AgcmlnaHQgY29ybmVyIGlzIHJvdW5kZWRcbiAgX2Jhc2ljQ29ybmVyRXh0cmFSb3VuZGVkKGFyZ3M6IEJhc2ljRmlndXJlRHJhd0FyZ3NDYW52YXMpOiB2b2lkIHtcbiAgICBjb25zdCB7IHNpemUsIGNvbnRleHQgfSA9IGFyZ3M7XG5cbiAgICB0aGlzLl9yb3RhdGVGaWd1cmUoe1xuICAgICAgLi4uYXJncyxcbiAgICAgIGRyYXc6ICgpID0+IHtcbiAgICAgICAgY29udGV4dC5hcmMoLXNpemUgLyAyLCBzaXplIC8gMiwgc2l6ZSwgLU1hdGguUEkgLyAyLCAwKTtcbiAgICAgICAgY29udGV4dC5saW5lVG8oLXNpemUgLyAyLCBzaXplIC8gMik7XG4gICAgICAgIGNvbnRleHQubGluZVRvKC1zaXplIC8gMiwgLXNpemUgLyAyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIF9iYXNpY0Nvcm5lcnNSb3VuZGVkKGFyZ3M6IEJhc2ljRmlndXJlRHJhd0FyZ3NDYW52YXMpOiB2b2lkIHtcbiAgICBjb25zdCB7IHNpemUsIGNvbnRleHQgfSA9IGFyZ3M7XG5cbiAgICB0aGlzLl9yb3RhdGVGaWd1cmUoe1xuICAgICAgLi4uYXJncyxcbiAgICAgIGRyYXc6ICgpID0+IHtcbiAgICAgICAgY29udGV4dC5hcmMoMCwgMCwgc2l6ZSAvIDIsIC1NYXRoLlBJIC8gMiwgMCk7XG4gICAgICAgIGNvbnRleHQubGluZVRvKHNpemUgLyAyLCBzaXplIC8gMik7XG4gICAgICAgIGNvbnRleHQubGluZVRvKDAsIHNpemUgLyAyKTtcbiAgICAgICAgY29udGV4dC5hcmMoMCwgMCwgc2l6ZSAvIDIsIE1hdGguUEkgLyAyLCBNYXRoLlBJKTtcbiAgICAgICAgY29udGV4dC5saW5lVG8oLXNpemUgLyAyLCAtc2l6ZSAvIDIpO1xuICAgICAgICBjb250ZXh0LmxpbmVUbygwLCAtc2l6ZSAvIDIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgX2Jhc2ljQ29ybmVyc0V4dHJhUm91bmRlZChhcmdzOiBCYXNpY0ZpZ3VyZURyYXdBcmdzQ2FudmFzKTogdm9pZCB7XG4gICAgY29uc3QgeyBzaXplLCBjb250ZXh0IH0gPSBhcmdzO1xuXG4gICAgdGhpcy5fcm90YXRlRmlndXJlKHtcbiAgICAgIC4uLmFyZ3MsXG4gICAgICBkcmF3OiAoKSA9PiB7XG4gICAgICAgIGNvbnRleHQuYXJjKC1zaXplIC8gMiwgc2l6ZSAvIDIsIHNpemUsIC1NYXRoLlBJIC8gMiwgMCk7XG4gICAgICAgIGNvbnRleHQuYXJjKHNpemUgLyAyLCAtc2l6ZSAvIDIsIHNpemUsIE1hdGguUEkgLyAyLCBNYXRoLlBJKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIF9kcmF3RG90KHsgeCwgeSwgc2l6ZSwgY29udGV4dCB9OiBEcmF3QXJnc0NhbnZhcyk6IHZvaWQge1xuICAgIHRoaXMuX2Jhc2ljRG90KHsgeCwgeSwgc2l6ZSwgY29udGV4dCwgcm90YXRpb246IDAgfSk7XG4gIH1cblxuICBfZHJhd1NxdWFyZSh7IHgsIHksIHNpemUsIGNvbnRleHQgfTogRHJhd0FyZ3NDYW52YXMpOiB2b2lkIHtcbiAgICB0aGlzLl9iYXNpY1NxdWFyZSh7IHgsIHksIHNpemUsIGNvbnRleHQsIHJvdGF0aW9uOiAwIH0pO1xuICB9XG5cbiAgX2RyYXdSb3VuZGVkKHsgeCwgeSwgc2l6ZSwgY29udGV4dCwgZ2V0TmVpZ2hib3IgfTogRHJhd0FyZ3NDYW52YXMpOiB2b2lkIHtcbiAgICBjb25zdCBsZWZ0TmVpZ2hib3IgPSBnZXROZWlnaGJvciA/ICtnZXROZWlnaGJvcigtMSwgMCkgOiAwO1xuICAgIGNvbnN0IHJpZ2h0TmVpZ2hib3IgPSBnZXROZWlnaGJvciA/ICtnZXROZWlnaGJvcigxLCAwKSA6IDA7XG4gICAgY29uc3QgdG9wTmVpZ2hib3IgPSBnZXROZWlnaGJvciA/ICtnZXROZWlnaGJvcigwLCAtMSkgOiAwO1xuICAgIGNvbnN0IGJvdHRvbU5laWdoYm9yID0gZ2V0TmVpZ2hib3IgPyArZ2V0TmVpZ2hib3IoMCwgMSkgOiAwO1xuXG4gICAgY29uc3QgbmVpZ2hib3JzQ291bnQgPSBsZWZ0TmVpZ2hib3IgKyByaWdodE5laWdoYm9yICsgdG9wTmVpZ2hib3IgKyBib3R0b21OZWlnaGJvcjtcblxuICAgIGlmIChuZWlnaGJvcnNDb3VudCA9PT0gMCkge1xuICAgICAgdGhpcy5fYmFzaWNEb3QoeyB4LCB5LCBzaXplLCBjb250ZXh0LCByb3RhdGlvbjogMCB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobmVpZ2hib3JzQ291bnQgPiAyIHx8IChsZWZ0TmVpZ2hib3IgJiYgcmlnaHROZWlnaGJvcikgfHwgKHRvcE5laWdoYm9yICYmIGJvdHRvbU5laWdoYm9yKSkge1xuICAgICAgdGhpcy5fYmFzaWNTcXVhcmUoeyB4LCB5LCBzaXplLCBjb250ZXh0LCByb3RhdGlvbjogMCB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobmVpZ2hib3JzQ291bnQgPT09IDIpIHtcbiAgICAgIGxldCByb3RhdGlvbiA9IDA7XG5cbiAgICAgIGlmIChsZWZ0TmVpZ2hib3IgJiYgdG9wTmVpZ2hib3IpIHtcbiAgICAgICAgcm90YXRpb24gPSBNYXRoLlBJIC8gMjtcbiAgICAgIH0gZWxzZSBpZiAodG9wTmVpZ2hib3IgJiYgcmlnaHROZWlnaGJvcikge1xuICAgICAgICByb3RhdGlvbiA9IE1hdGguUEk7XG4gICAgICB9IGVsc2UgaWYgKHJpZ2h0TmVpZ2hib3IgJiYgYm90dG9tTmVpZ2hib3IpIHtcbiAgICAgICAgcm90YXRpb24gPSAtTWF0aC5QSSAvIDI7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2Jhc2ljQ29ybmVyUm91bmRlZCh7IHgsIHksIHNpemUsIGNvbnRleHQsIHJvdGF0aW9uIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChuZWlnaGJvcnNDb3VudCA9PT0gMSkge1xuICAgICAgbGV0IHJvdGF0aW9uID0gMDtcblxuICAgICAgaWYgKHRvcE5laWdoYm9yKSB7XG4gICAgICAgIHJvdGF0aW9uID0gTWF0aC5QSSAvIDI7XG4gICAgICB9IGVsc2UgaWYgKHJpZ2h0TmVpZ2hib3IpIHtcbiAgICAgICAgcm90YXRpb24gPSBNYXRoLlBJO1xuICAgICAgfSBlbHNlIGlmIChib3R0b21OZWlnaGJvcikge1xuICAgICAgICByb3RhdGlvbiA9IC1NYXRoLlBJIC8gMjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fYmFzaWNTaWRlUm91bmRlZCh7IHgsIHksIHNpemUsIGNvbnRleHQsIHJvdGF0aW9uIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIF9kcmF3RXh0cmFSb3VuZGVkKHsgeCwgeSwgc2l6ZSwgY29udGV4dCwgZ2V0TmVpZ2hib3IgfTogRHJhd0FyZ3NDYW52YXMpOiB2b2lkIHtcbiAgICBjb25zdCBsZWZ0TmVpZ2hib3IgPSBnZXROZWlnaGJvciA/ICtnZXROZWlnaGJvcigtMSwgMCkgOiAwO1xuICAgIGNvbnN0IHJpZ2h0TmVpZ2hib3IgPSBnZXROZWlnaGJvciA/ICtnZXROZWlnaGJvcigxLCAwKSA6IDA7XG4gICAgY29uc3QgdG9wTmVpZ2hib3IgPSBnZXROZWlnaGJvciA/ICtnZXROZWlnaGJvcigwLCAtMSkgOiAwO1xuICAgIGNvbnN0IGJvdHRvbU5laWdoYm9yID0gZ2V0TmVpZ2hib3IgPyArZ2V0TmVpZ2hib3IoMCwgMSkgOiAwO1xuXG4gICAgY29uc3QgbmVpZ2hib3JzQ291bnQgPSBsZWZ0TmVpZ2hib3IgKyByaWdodE5laWdoYm9yICsgdG9wTmVpZ2hib3IgKyBib3R0b21OZWlnaGJvcjtcblxuICAgIGlmIChuZWlnaGJvcnNDb3VudCA9PT0gMCkge1xuICAgICAgdGhpcy5fYmFzaWNEb3QoeyB4LCB5LCBzaXplLCBjb250ZXh0LCByb3RhdGlvbjogMCB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobmVpZ2hib3JzQ291bnQgPiAyIHx8IChsZWZ0TmVpZ2hib3IgJiYgcmlnaHROZWlnaGJvcikgfHwgKHRvcE5laWdoYm9yICYmIGJvdHRvbU5laWdoYm9yKSkge1xuICAgICAgdGhpcy5fYmFzaWNTcXVhcmUoeyB4LCB5LCBzaXplLCBjb250ZXh0LCByb3RhdGlvbjogMCB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobmVpZ2hib3JzQ291bnQgPT09IDIpIHtcbiAgICAgIGxldCByb3RhdGlvbiA9IDA7XG5cbiAgICAgIGlmIChsZWZ0TmVpZ2hib3IgJiYgdG9wTmVpZ2hib3IpIHtcbiAgICAgICAgcm90YXRpb24gPSBNYXRoLlBJIC8gMjtcbiAgICAgIH0gZWxzZSBpZiAodG9wTmVpZ2hib3IgJiYgcmlnaHROZWlnaGJvcikge1xuICAgICAgICByb3RhdGlvbiA9IE1hdGguUEk7XG4gICAgICB9IGVsc2UgaWYgKHJpZ2h0TmVpZ2hib3IgJiYgYm90dG9tTmVpZ2hib3IpIHtcbiAgICAgICAgcm90YXRpb24gPSAtTWF0aC5QSSAvIDI7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2Jhc2ljQ29ybmVyRXh0cmFSb3VuZGVkKHsgeCwgeSwgc2l6ZSwgY29udGV4dCwgcm90YXRpb24gfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG5laWdoYm9yc0NvdW50ID09PSAxKSB7XG4gICAgICBsZXQgcm90YXRpb24gPSAwO1xuXG4gICAgICBpZiAodG9wTmVpZ2hib3IpIHtcbiAgICAgICAgcm90YXRpb24gPSBNYXRoLlBJIC8gMjtcbiAgICAgIH0gZWxzZSBpZiAocmlnaHROZWlnaGJvcikge1xuICAgICAgICByb3RhdGlvbiA9IE1hdGguUEk7XG4gICAgICB9IGVsc2UgaWYgKGJvdHRvbU5laWdoYm9yKSB7XG4gICAgICAgIHJvdGF0aW9uID0gLU1hdGguUEkgLyAyO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9iYXNpY1NpZGVSb3VuZGVkKHsgeCwgeSwgc2l6ZSwgY29udGV4dCwgcm90YXRpb24gfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgX2RyYXdDbGFzc3koeyB4LCB5LCBzaXplLCBjb250ZXh0LCBnZXROZWlnaGJvciB9OiBEcmF3QXJnc0NhbnZhcyk6IHZvaWQge1xuICAgIGNvbnN0IGxlZnROZWlnaGJvciA9IGdldE5laWdoYm9yID8gK2dldE5laWdoYm9yKC0xLCAwKSA6IDA7XG4gICAgY29uc3QgcmlnaHROZWlnaGJvciA9IGdldE5laWdoYm9yID8gK2dldE5laWdoYm9yKDEsIDApIDogMDtcbiAgICBjb25zdCB0b3BOZWlnaGJvciA9IGdldE5laWdoYm9yID8gK2dldE5laWdoYm9yKDAsIC0xKSA6IDA7XG4gICAgY29uc3QgYm90dG9tTmVpZ2hib3IgPSBnZXROZWlnaGJvciA/ICtnZXROZWlnaGJvcigwLCAxKSA6IDA7XG5cbiAgICBjb25zdCBuZWlnaGJvcnNDb3VudCA9IGxlZnROZWlnaGJvciArIHJpZ2h0TmVpZ2hib3IgKyB0b3BOZWlnaGJvciArIGJvdHRvbU5laWdoYm9yO1xuXG4gICAgaWYgKG5laWdoYm9yc0NvdW50ID09PSAwKSB7XG4gICAgICB0aGlzLl9iYXNpY0Nvcm5lcnNSb3VuZGVkKHsgeCwgeSwgc2l6ZSwgY29udGV4dCwgcm90YXRpb246IE1hdGguUEkgLyAyIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghbGVmdE5laWdoYm9yICYmICF0b3BOZWlnaGJvcikge1xuICAgICAgdGhpcy5fYmFzaWNDb3JuZXJSb3VuZGVkKHsgeCwgeSwgc2l6ZSwgY29udGV4dCwgcm90YXRpb246IC1NYXRoLlBJIC8gMiB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXJpZ2h0TmVpZ2hib3IgJiYgIWJvdHRvbU5laWdoYm9yKSB7XG4gICAgICB0aGlzLl9iYXNpY0Nvcm5lclJvdW5kZWQoeyB4LCB5LCBzaXplLCBjb250ZXh0LCByb3RhdGlvbjogTWF0aC5QSSAvIDIgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fYmFzaWNTcXVhcmUoeyB4LCB5LCBzaXplLCBjb250ZXh0LCByb3RhdGlvbjogMCB9KTtcbiAgfVxuXG4gIF9kcmF3Q2xhc3N5Um91bmRlZCh7IHgsIHksIHNpemUsIGNvbnRleHQsIGdldE5laWdoYm9yIH06IERyYXdBcmdzQ2FudmFzKTogdm9pZCB7XG4gICAgY29uc3QgbGVmdE5laWdoYm9yID0gZ2V0TmVpZ2hib3IgPyArZ2V0TmVpZ2hib3IoLTEsIDApIDogMDtcbiAgICBjb25zdCByaWdodE5laWdoYm9yID0gZ2V0TmVpZ2hib3IgPyArZ2V0TmVpZ2hib3IoMSwgMCkgOiAwO1xuICAgIGNvbnN0IHRvcE5laWdoYm9yID0gZ2V0TmVpZ2hib3IgPyArZ2V0TmVpZ2hib3IoMCwgLTEpIDogMDtcbiAgICBjb25zdCBib3R0b21OZWlnaGJvciA9IGdldE5laWdoYm9yID8gK2dldE5laWdoYm9yKDAsIDEpIDogMDtcblxuICAgIGNvbnN0IG5laWdoYm9yc0NvdW50ID0gbGVmdE5laWdoYm9yICsgcmlnaHROZWlnaGJvciArIHRvcE5laWdoYm9yICsgYm90dG9tTmVpZ2hib3I7XG5cbiAgICBpZiAobmVpZ2hib3JzQ291bnQgPT09IDApIHtcbiAgICAgIHRoaXMuX2Jhc2ljQ29ybmVyc1JvdW5kZWQoeyB4LCB5LCBzaXplLCBjb250ZXh0LCByb3RhdGlvbjogTWF0aC5QSSAvIDIgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFsZWZ0TmVpZ2hib3IgJiYgIXRvcE5laWdoYm9yKSB7XG4gICAgICB0aGlzLl9iYXNpY0Nvcm5lckV4dHJhUm91bmRlZCh7IHgsIHksIHNpemUsIGNvbnRleHQsIHJvdGF0aW9uOiAtTWF0aC5QSSAvIDIgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFyaWdodE5laWdoYm9yICYmICFib3R0b21OZWlnaGJvcikge1xuICAgICAgdGhpcy5fYmFzaWNDb3JuZXJFeHRyYVJvdW5kZWQoeyB4LCB5LCBzaXplLCBjb250ZXh0LCByb3RhdGlvbjogTWF0aC5QSSAvIDIgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fYmFzaWNTcXVhcmUoeyB4LCB5LCBzaXplLCBjb250ZXh0LCByb3RhdGlvbjogMCB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IGRvdFR5cGVzIGZyb20gXCIuLi8uLi8uLi9jb25zdGFudHMvZG90VHlwZXNcIjtcbmltcG9ydCB7IERvdFR5cGUsIEdldE5laWdoYm9yLCBEcmF3QXJncywgQmFzaWNGaWd1cmVEcmF3QXJncywgUm90YXRlRmlndXJlQXJncyB9IGZyb20gXCIuLi8uLi8uLi90eXBlc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRUkRvdCB7XG4gIF9lbGVtZW50PzogU1ZHRWxlbWVudDtcbiAgX3N2ZzogU1ZHRWxlbWVudDtcbiAgX3R5cGU6IERvdFR5cGU7XG5cbiAgY29uc3RydWN0b3IoeyBzdmcsIHR5cGUgfTogeyBzdmc6IFNWR0VsZW1lbnQ7IHR5cGU6IERvdFR5cGUgfSkge1xuICAgIHRoaXMuX3N2ZyA9IHN2ZztcbiAgICB0aGlzLl90eXBlID0gdHlwZTtcbiAgfVxuXG4gIGRyYXcoeDogbnVtYmVyLCB5OiBudW1iZXIsIHNpemU6IG51bWJlciwgZ2V0TmVpZ2hib3I6IEdldE5laWdoYm9yKTogdm9pZCB7XG4gICAgY29uc3QgdHlwZSA9IHRoaXMuX3R5cGU7XG4gICAgbGV0IGRyYXdGdW5jdGlvbjtcblxuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSBkb3RUeXBlcy5kb3RzOlxuICAgICAgICBkcmF3RnVuY3Rpb24gPSB0aGlzLl9kcmF3RG90O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgZG90VHlwZXMuY2xhc3N5OlxuICAgICAgICBkcmF3RnVuY3Rpb24gPSB0aGlzLl9kcmF3Q2xhc3N5O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgZG90VHlwZXMuY2xhc3N5Um91bmRlZDpcbiAgICAgICAgZHJhd0Z1bmN0aW9uID0gdGhpcy5fZHJhd0NsYXNzeVJvdW5kZWQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBkb3RUeXBlcy5yb3VuZGVkOlxuICAgICAgICBkcmF3RnVuY3Rpb24gPSB0aGlzLl9kcmF3Um91bmRlZDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGRvdFR5cGVzLmV4dHJhUm91bmRlZDpcbiAgICAgICAgZHJhd0Z1bmN0aW9uID0gdGhpcy5fZHJhd0V4dHJhUm91bmRlZDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGRvdFR5cGVzLnNxdWFyZTpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGRyYXdGdW5jdGlvbiA9IHRoaXMuX2RyYXdTcXVhcmU7XG4gICAgfVxuXG4gICAgZHJhd0Z1bmN0aW9uLmNhbGwodGhpcywgeyB4LCB5LCBzaXplLCBnZXROZWlnaGJvciB9KTtcbiAgfVxuXG4gIF9yb3RhdGVGaWd1cmUoeyB4LCB5LCBzaXplLCByb3RhdGlvbiA9IDAsIGRyYXcgfTogUm90YXRlRmlndXJlQXJncyk6IHZvaWQge1xuICAgIGNvbnN0IGN4ID0geCArIHNpemUgLyAyO1xuICAgIGNvbnN0IGN5ID0geSArIHNpemUgLyAyO1xuXG4gICAgZHJhdygpO1xuICAgIHRoaXMuX2VsZW1lbnQ/LnNldEF0dHJpYnV0ZShcInRyYW5zZm9ybVwiLCBgcm90YXRlKCR7KDE4MCAqIHJvdGF0aW9uKSAvIE1hdGguUEl9LCR7Y3h9LCR7Y3l9KWApO1xuICB9XG5cbiAgX2Jhc2ljRG90KGFyZ3M6IEJhc2ljRmlndXJlRHJhd0FyZ3MpOiB2b2lkIHtcbiAgICBjb25zdCB7IHNpemUsIHgsIHkgfSA9IGFyZ3M7XG5cbiAgICB0aGlzLl9yb3RhdGVGaWd1cmUoe1xuICAgICAgLi4uYXJncyxcbiAgICAgIGRyYXc6ICgpID0+IHtcbiAgICAgICAgdGhpcy5fZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwiY2lyY2xlXCIpO1xuICAgICAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShcImN4XCIsIFN0cmluZyh4ICsgc2l6ZSAvIDIpKTtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJjeVwiLCBTdHJpbmcoeSArIHNpemUgLyAyKSk7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKFwiclwiLCBTdHJpbmcoc2l6ZSAvIDIpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIF9iYXNpY1NxdWFyZShhcmdzOiBCYXNpY0ZpZ3VyZURyYXdBcmdzKTogdm9pZCB7XG4gICAgY29uc3QgeyBzaXplLCB4LCB5IH0gPSBhcmdzO1xuXG4gICAgdGhpcy5fcm90YXRlRmlndXJlKHtcbiAgICAgIC4uLmFyZ3MsXG4gICAgICBkcmF3OiAoKSA9PiB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBcInJlY3RcIik7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKFwieFwiLCBTdHJpbmcoeCkpO1xuICAgICAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShcInlcIiwgU3RyaW5nKHkpKTtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCBTdHJpbmcoc2l6ZSkpO1xuICAgICAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCBTdHJpbmcoc2l6ZSkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy9pZiByb3RhdGlvbiA9PT0gMCAtIHJpZ2h0IHNpZGUgaXMgcm91bmRlZFxuICBfYmFzaWNTaWRlUm91bmRlZChhcmdzOiBCYXNpY0ZpZ3VyZURyYXdBcmdzKTogdm9pZCB7XG4gICAgY29uc3QgeyBzaXplLCB4LCB5IH0gPSBhcmdzO1xuXG4gICAgdGhpcy5fcm90YXRlRmlndXJlKHtcbiAgICAgIC4uLmFyZ3MsXG4gICAgICBkcmF3OiAoKSA9PiB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiLCBcInBhdGhcIik7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKFxuICAgICAgICAgIFwiZFwiLFxuICAgICAgICAgIGBNICR7eH0gJHt5fWAgKyAvL2dvIHRvIHRvcCBsZWZ0IHBvc2l0aW9uXG4gICAgICAgICAgICBgdiAke3NpemV9YCArIC8vZHJhdyBsaW5lIHRvIGxlZnQgYm90dG9tIGNvcm5lclxuICAgICAgICAgICAgYGggJHtzaXplIC8gMn1gICsgLy9kcmF3IGxpbmUgdG8gbGVmdCBib3R0b20gY29ybmVyICsgaGFsZiBvZiBzaXplIHJpZ2h0XG4gICAgICAgICAgICBgYSAke3NpemUgLyAyfSAke3NpemUgLyAyfSwgMCwgMCwgMCwgMCAkey1zaXplfWAgLy8gZHJhdyByb3VuZGVkIGNvcm5lclxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy9pZiByb3RhdGlvbiA9PT0gMCAtIHRvcCByaWdodCBjb3JuZXIgaXMgcm91bmRlZFxuICBfYmFzaWNDb3JuZXJSb3VuZGVkKGFyZ3M6IEJhc2ljRmlndXJlRHJhd0FyZ3MpOiB2b2lkIHtcbiAgICBjb25zdCB7IHNpemUsIHgsIHkgfSA9IGFyZ3M7XG5cbiAgICB0aGlzLl9yb3RhdGVGaWd1cmUoe1xuICAgICAgLi4uYXJncyxcbiAgICAgIGRyYXc6ICgpID0+IHtcbiAgICAgICAgdGhpcy5fZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwicGF0aFwiKTtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgXCJkXCIsXG4gICAgICAgICAgYE0gJHt4fSAke3l9YCArIC8vZ28gdG8gdG9wIGxlZnQgcG9zaXRpb25cbiAgICAgICAgICAgIGB2ICR7c2l6ZX1gICsgLy9kcmF3IGxpbmUgdG8gbGVmdCBib3R0b20gY29ybmVyXG4gICAgICAgICAgICBgaCAke3NpemV9YCArIC8vZHJhdyBsaW5lIHRvIHJpZ2h0IGJvdHRvbSBjb3JuZXJcbiAgICAgICAgICAgIGB2ICR7LXNpemUgLyAyfWAgKyAvL2RyYXcgbGluZSB0byByaWdodCBib3R0b20gY29ybmVyICsgaGFsZiBvZiBzaXplIHRvcFxuICAgICAgICAgICAgYGEgJHtzaXplIC8gMn0gJHtzaXplIC8gMn0sIDAsIDAsIDAsICR7LXNpemUgLyAyfSAkey1zaXplIC8gMn1gIC8vIGRyYXcgcm91bmRlZCBjb3JuZXJcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vaWYgcm90YXRpb24gPT09IDAgLSB0b3AgcmlnaHQgY29ybmVyIGlzIHJvdW5kZWRcbiAgX2Jhc2ljQ29ybmVyRXh0cmFSb3VuZGVkKGFyZ3M6IEJhc2ljRmlndXJlRHJhd0FyZ3MpOiB2b2lkIHtcbiAgICBjb25zdCB7IHNpemUsIHgsIHkgfSA9IGFyZ3M7XG5cbiAgICB0aGlzLl9yb3RhdGVGaWd1cmUoe1xuICAgICAgLi4uYXJncyxcbiAgICAgIGRyYXc6ICgpID0+IHtcbiAgICAgICAgdGhpcy5fZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwicGF0aFwiKTtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgXCJkXCIsXG4gICAgICAgICAgYE0gJHt4fSAke3l9YCArIC8vZ28gdG8gdG9wIGxlZnQgcG9zaXRpb25cbiAgICAgICAgICAgIGB2ICR7c2l6ZX1gICsgLy9kcmF3IGxpbmUgdG8gbGVmdCBib3R0b20gY29ybmVyXG4gICAgICAgICAgICBgaCAke3NpemV9YCArIC8vZHJhdyBsaW5lIHRvIHJpZ2h0IGJvdHRvbSBjb3JuZXJcbiAgICAgICAgICAgIGBhICR7c2l6ZX0gJHtzaXplfSwgMCwgMCwgMCwgJHstc2l6ZX0gJHstc2l6ZX1gIC8vIGRyYXcgcm91bmRlZCB0b3AgcmlnaHQgY29ybmVyXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvL2lmIHJvdGF0aW9uID09PSAwIC0gbGVmdCBib3R0b20gYW5kIHJpZ2h0IHRvcCBjb3JuZXJzIGFyZSByb3VuZGVkXG4gIF9iYXNpY0Nvcm5lcnNSb3VuZGVkKGFyZ3M6IEJhc2ljRmlndXJlRHJhd0FyZ3MpOiB2b2lkIHtcbiAgICBjb25zdCB7IHNpemUsIHgsIHkgfSA9IGFyZ3M7XG5cbiAgICB0aGlzLl9yb3RhdGVGaWd1cmUoe1xuICAgICAgLi4uYXJncyxcbiAgICAgIGRyYXc6ICgpID0+IHtcbiAgICAgICAgdGhpcy5fZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwicGF0aFwiKTtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgXCJkXCIsXG4gICAgICAgICAgYE0gJHt4fSAke3l9YCArIC8vZ28gdG8gbGVmdCB0b3AgcG9zaXRpb25cbiAgICAgICAgICAgIGB2ICR7c2l6ZSAvIDJ9YCArIC8vZHJhdyBsaW5lIHRvIGxlZnQgdG9wIGNvcm5lciArIGhhbGYgb2Ygc2l6ZSBib3R0b21cbiAgICAgICAgICAgIGBhICR7c2l6ZSAvIDJ9ICR7c2l6ZSAvIDJ9LCAwLCAwLCAwLCAke3NpemUgLyAyfSAke3NpemUgLyAyfWAgKyAvLyBkcmF3IHJvdW5kZWQgbGVmdCBib3R0b20gY29ybmVyXG4gICAgICAgICAgICBgaCAke3NpemUgLyAyfWAgKyAvL2RyYXcgbGluZSB0byByaWdodCBib3R0b20gY29ybmVyXG4gICAgICAgICAgICBgdiAkey1zaXplIC8gMn1gICsgLy9kcmF3IGxpbmUgdG8gcmlnaHQgYm90dG9tIGNvcm5lciArIGhhbGYgb2Ygc2l6ZSB0b3BcbiAgICAgICAgICAgIGBhICR7c2l6ZSAvIDJ9ICR7c2l6ZSAvIDJ9LCAwLCAwLCAwLCAkey1zaXplIC8gMn0gJHstc2l6ZSAvIDJ9YCAvLyBkcmF3IHJvdW5kZWQgcmlnaHQgdG9wIGNvcm5lclxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgX2RyYXdEb3QoeyB4LCB5LCBzaXplIH06IERyYXdBcmdzKTogdm9pZCB7XG4gICAgdGhpcy5fYmFzaWNEb3QoeyB4LCB5LCBzaXplLCByb3RhdGlvbjogMCB9KTtcbiAgfVxuXG4gIF9kcmF3U3F1YXJlKHsgeCwgeSwgc2l6ZSB9OiBEcmF3QXJncyk6IHZvaWQge1xuICAgIHRoaXMuX2Jhc2ljU3F1YXJlKHsgeCwgeSwgc2l6ZSwgcm90YXRpb246IDAgfSk7XG4gIH1cblxuICBfZHJhd1JvdW5kZWQoeyB4LCB5LCBzaXplLCBnZXROZWlnaGJvciB9OiBEcmF3QXJncyk6IHZvaWQge1xuICAgIGNvbnN0IGxlZnROZWlnaGJvciA9IGdldE5laWdoYm9yID8gK2dldE5laWdoYm9yKC0xLCAwKSA6IDA7XG4gICAgY29uc3QgcmlnaHROZWlnaGJvciA9IGdldE5laWdoYm9yID8gK2dldE5laWdoYm9yKDEsIDApIDogMDtcbiAgICBjb25zdCB0b3BOZWlnaGJvciA9IGdldE5laWdoYm9yID8gK2dldE5laWdoYm9yKDAsIC0xKSA6IDA7XG4gICAgY29uc3QgYm90dG9tTmVpZ2hib3IgPSBnZXROZWlnaGJvciA/ICtnZXROZWlnaGJvcigwLCAxKSA6IDA7XG5cbiAgICBjb25zdCBuZWlnaGJvcnNDb3VudCA9IGxlZnROZWlnaGJvciArIHJpZ2h0TmVpZ2hib3IgKyB0b3BOZWlnaGJvciArIGJvdHRvbU5laWdoYm9yO1xuXG4gICAgaWYgKG5laWdoYm9yc0NvdW50ID09PSAwKSB7XG4gICAgICB0aGlzLl9iYXNpY0RvdCh7IHgsIHksIHNpemUsIHJvdGF0aW9uOiAwIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChuZWlnaGJvcnNDb3VudCA+IDIgfHwgKGxlZnROZWlnaGJvciAmJiByaWdodE5laWdoYm9yKSB8fCAodG9wTmVpZ2hib3IgJiYgYm90dG9tTmVpZ2hib3IpKSB7XG4gICAgICB0aGlzLl9iYXNpY1NxdWFyZSh7IHgsIHksIHNpemUsIHJvdGF0aW9uOiAwIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChuZWlnaGJvcnNDb3VudCA9PT0gMikge1xuICAgICAgbGV0IHJvdGF0aW9uID0gMDtcblxuICAgICAgaWYgKGxlZnROZWlnaGJvciAmJiB0b3BOZWlnaGJvcikge1xuICAgICAgICByb3RhdGlvbiA9IE1hdGguUEkgLyAyO1xuICAgICAgfSBlbHNlIGlmICh0b3BOZWlnaGJvciAmJiByaWdodE5laWdoYm9yKSB7XG4gICAgICAgIHJvdGF0aW9uID0gTWF0aC5QSTtcbiAgICAgIH0gZWxzZSBpZiAocmlnaHROZWlnaGJvciAmJiBib3R0b21OZWlnaGJvcikge1xuICAgICAgICByb3RhdGlvbiA9IC1NYXRoLlBJIC8gMjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fYmFzaWNDb3JuZXJSb3VuZGVkKHsgeCwgeSwgc2l6ZSwgcm90YXRpb24gfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG5laWdoYm9yc0NvdW50ID09PSAxKSB7XG4gICAgICBsZXQgcm90YXRpb24gPSAwO1xuXG4gICAgICBpZiAodG9wTmVpZ2hib3IpIHtcbiAgICAgICAgcm90YXRpb24gPSBNYXRoLlBJIC8gMjtcbiAgICAgIH0gZWxzZSBpZiAocmlnaHROZWlnaGJvcikge1xuICAgICAgICByb3RhdGlvbiA9IE1hdGguUEk7XG4gICAgICB9IGVsc2UgaWYgKGJvdHRvbU5laWdoYm9yKSB7XG4gICAgICAgIHJvdGF0aW9uID0gLU1hdGguUEkgLyAyO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9iYXNpY1NpZGVSb3VuZGVkKHsgeCwgeSwgc2l6ZSwgcm90YXRpb24gfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgX2RyYXdFeHRyYVJvdW5kZWQoeyB4LCB5LCBzaXplLCBnZXROZWlnaGJvciB9OiBEcmF3QXJncyk6IHZvaWQge1xuICAgIGNvbnN0IGxlZnROZWlnaGJvciA9IGdldE5laWdoYm9yID8gK2dldE5laWdoYm9yKC0xLCAwKSA6IDA7XG4gICAgY29uc3QgcmlnaHROZWlnaGJvciA9IGdldE5laWdoYm9yID8gK2dldE5laWdoYm9yKDEsIDApIDogMDtcbiAgICBjb25zdCB0b3BOZWlnaGJvciA9IGdldE5laWdoYm9yID8gK2dldE5laWdoYm9yKDAsIC0xKSA6IDA7XG4gICAgY29uc3QgYm90dG9tTmVpZ2hib3IgPSBnZXROZWlnaGJvciA/ICtnZXROZWlnaGJvcigwLCAxKSA6IDA7XG5cbiAgICBjb25zdCBuZWlnaGJvcnNDb3VudCA9IGxlZnROZWlnaGJvciArIHJpZ2h0TmVpZ2hib3IgKyB0b3BOZWlnaGJvciArIGJvdHRvbU5laWdoYm9yO1xuXG4gICAgaWYgKG5laWdoYm9yc0NvdW50ID09PSAwKSB7XG4gICAgICB0aGlzLl9iYXNpY0RvdCh7IHgsIHksIHNpemUsIHJvdGF0aW9uOiAwIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChuZWlnaGJvcnNDb3VudCA+IDIgfHwgKGxlZnROZWlnaGJvciAmJiByaWdodE5laWdoYm9yKSB8fCAodG9wTmVpZ2hib3IgJiYgYm90dG9tTmVpZ2hib3IpKSB7XG4gICAgICB0aGlzLl9iYXNpY1NxdWFyZSh7IHgsIHksIHNpemUsIHJvdGF0aW9uOiAwIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChuZWlnaGJvcnNDb3VudCA9PT0gMikge1xuICAgICAgbGV0IHJvdGF0aW9uID0gMDtcblxuICAgICAgaWYgKGxlZnROZWlnaGJvciAmJiB0b3BOZWlnaGJvcikge1xuICAgICAgICByb3RhdGlvbiA9IE1hdGguUEkgLyAyO1xuICAgICAgfSBlbHNlIGlmICh0b3BOZWlnaGJvciAmJiByaWdodE5laWdoYm9yKSB7XG4gICAgICAgIHJvdGF0aW9uID0gTWF0aC5QSTtcbiAgICAgIH0gZWxzZSBpZiAocmlnaHROZWlnaGJvciAmJiBib3R0b21OZWlnaGJvcikge1xuICAgICAgICByb3RhdGlvbiA9IC1NYXRoLlBJIC8gMjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fYmFzaWNDb3JuZXJFeHRyYVJvdW5kZWQoeyB4LCB5LCBzaXplLCByb3RhdGlvbiB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobmVpZ2hib3JzQ291bnQgPT09IDEpIHtcbiAgICAgIGxldCByb3RhdGlvbiA9IDA7XG5cbiAgICAgIGlmICh0b3BOZWlnaGJvcikge1xuICAgICAgICByb3RhdGlvbiA9IE1hdGguUEkgLyAyO1xuICAgICAgfSBlbHNlIGlmIChyaWdodE5laWdoYm9yKSB7XG4gICAgICAgIHJvdGF0aW9uID0gTWF0aC5QSTtcbiAgICAgIH0gZWxzZSBpZiAoYm90dG9tTmVpZ2hib3IpIHtcbiAgICAgICAgcm90YXRpb24gPSAtTWF0aC5QSSAvIDI7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2Jhc2ljU2lkZVJvdW5kZWQoeyB4LCB5LCBzaXplLCByb3RhdGlvbiB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICBfZHJhd0NsYXNzeSh7IHgsIHksIHNpemUsIGdldE5laWdoYm9yIH06IERyYXdBcmdzKTogdm9pZCB7XG4gICAgY29uc3QgbGVmdE5laWdoYm9yID0gZ2V0TmVpZ2hib3IgPyArZ2V0TmVpZ2hib3IoLTEsIDApIDogMDtcbiAgICBjb25zdCByaWdodE5laWdoYm9yID0gZ2V0TmVpZ2hib3IgPyArZ2V0TmVpZ2hib3IoMSwgMCkgOiAwO1xuICAgIGNvbnN0IHRvcE5laWdoYm9yID0gZ2V0TmVpZ2hib3IgPyArZ2V0TmVpZ2hib3IoMCwgLTEpIDogMDtcbiAgICBjb25zdCBib3R0b21OZWlnaGJvciA9IGdldE5laWdoYm9yID8gK2dldE5laWdoYm9yKDAsIDEpIDogMDtcblxuICAgIGNvbnN0IG5laWdoYm9yc0NvdW50ID0gbGVmdE5laWdoYm9yICsgcmlnaHROZWlnaGJvciArIHRvcE5laWdoYm9yICsgYm90dG9tTmVpZ2hib3I7XG5cbiAgICBpZiAobmVpZ2hib3JzQ291bnQgPT09IDApIHtcbiAgICAgIHRoaXMuX2Jhc2ljQ29ybmVyc1JvdW5kZWQoeyB4LCB5LCBzaXplLCByb3RhdGlvbjogTWF0aC5QSSAvIDIgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFsZWZ0TmVpZ2hib3IgJiYgIXRvcE5laWdoYm9yKSB7XG4gICAgICB0aGlzLl9iYXNpY0Nvcm5lclJvdW5kZWQoeyB4LCB5LCBzaXplLCByb3RhdGlvbjogLU1hdGguUEkgLyAyIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghcmlnaHROZWlnaGJvciAmJiAhYm90dG9tTmVpZ2hib3IpIHtcbiAgICAgIHRoaXMuX2Jhc2ljQ29ybmVyUm91bmRlZCh7IHgsIHksIHNpemUsIHJvdGF0aW9uOiBNYXRoLlBJIC8gMiB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9iYXNpY1NxdWFyZSh7IHgsIHksIHNpemUsIHJvdGF0aW9uOiAwIH0pO1xuICB9XG5cbiAgX2RyYXdDbGFzc3lSb3VuZGVkKHsgeCwgeSwgc2l6ZSwgZ2V0TmVpZ2hib3IgfTogRHJhd0FyZ3MpOiB2b2lkIHtcbiAgICBjb25zdCBsZWZ0TmVpZ2hib3IgPSBnZXROZWlnaGJvciA/ICtnZXROZWlnaGJvcigtMSwgMCkgOiAwO1xuICAgIGNvbnN0IHJpZ2h0TmVpZ2hib3IgPSBnZXROZWlnaGJvciA/ICtnZXROZWlnaGJvcigxLCAwKSA6IDA7XG4gICAgY29uc3QgdG9wTmVpZ2hib3IgPSBnZXROZWlnaGJvciA/ICtnZXROZWlnaGJvcigwLCAtMSkgOiAwO1xuICAgIGNvbnN0IGJvdHRvbU5laWdoYm9yID0gZ2V0TmVpZ2hib3IgPyArZ2V0TmVpZ2hib3IoMCwgMSkgOiAwO1xuXG4gICAgY29uc3QgbmVpZ2hib3JzQ291bnQgPSBsZWZ0TmVpZ2hib3IgKyByaWdodE5laWdoYm9yICsgdG9wTmVpZ2hib3IgKyBib3R0b21OZWlnaGJvcjtcblxuICAgIGlmIChuZWlnaGJvcnNDb3VudCA9PT0gMCkge1xuICAgICAgdGhpcy5fYmFzaWNDb3JuZXJzUm91bmRlZCh7IHgsIHksIHNpemUsIHJvdGF0aW9uOiBNYXRoLlBJIC8gMiB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIWxlZnROZWlnaGJvciAmJiAhdG9wTmVpZ2hib3IpIHtcbiAgICAgIHRoaXMuX2Jhc2ljQ29ybmVyRXh0cmFSb3VuZGVkKHsgeCwgeSwgc2l6ZSwgcm90YXRpb246IC1NYXRoLlBJIC8gMiB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXJpZ2h0TmVpZ2hib3IgJiYgIWJvdHRvbU5laWdoYm9yKSB7XG4gICAgICB0aGlzLl9iYXNpY0Nvcm5lckV4dHJhUm91bmRlZCh7IHgsIHksIHNpemUsIHJvdGF0aW9uOiBNYXRoLlBJIC8gMiB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9iYXNpY1NxdWFyZSh7IHgsIHksIHNpemUsIHJvdGF0aW9uOiAwIH0pO1xuICB9XG59XG4iLCJpbnRlcmZhY2UgSW1hZ2VTaXplT3B0aW9ucyB7XG4gIG9yaWdpbmFsSGVpZ2h0OiBudW1iZXI7XG4gIG9yaWdpbmFsV2lkdGg6IG51bWJlcjtcbiAgbWF4SGlkZGVuRG90czogbnVtYmVyO1xuICBtYXhIaWRkZW5BeGlzRG90cz86IG51bWJlcjtcbiAgZG90U2l6ZTogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgSW1hZ2VTaXplUmVzdWx0IHtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhpZGVZRG90czogbnVtYmVyO1xuICBoaWRlWERvdHM6IG51bWJlcjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY2FsY3VsYXRlSW1hZ2VTaXplKHtcbiAgb3JpZ2luYWxIZWlnaHQsXG4gIG9yaWdpbmFsV2lkdGgsXG4gIG1heEhpZGRlbkRvdHMsXG4gIG1heEhpZGRlbkF4aXNEb3RzLFxuICBkb3RTaXplXG59OiBJbWFnZVNpemVPcHRpb25zKTogSW1hZ2VTaXplUmVzdWx0IHtcbiAgY29uc3QgaGlkZURvdHMgPSB7IHg6IDAsIHk6IDAgfTtcbiAgY29uc3QgaW1hZ2VTaXplID0geyB4OiAwLCB5OiAwIH07XG5cbiAgaWYgKG9yaWdpbmFsSGVpZ2h0IDw9IDAgfHwgb3JpZ2luYWxXaWR0aCA8PSAwIHx8IG1heEhpZGRlbkRvdHMgPD0gMCB8fCBkb3RTaXplIDw9IDApIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGVpZ2h0OiAwLFxuICAgICAgd2lkdGg6IDAsXG4gICAgICBoaWRlWURvdHM6IDAsXG4gICAgICBoaWRlWERvdHM6IDBcbiAgICB9O1xuICB9XG5cbiAgY29uc3QgayA9IG9yaWdpbmFsSGVpZ2h0IC8gb3JpZ2luYWxXaWR0aDtcblxuICAvL0dldHRpbmcgdGhlIG1heGltdW0gcG9zc2libGUgYXhpcyBoaWRkZW4gZG90c1xuICBoaWRlRG90cy54ID0gTWF0aC5mbG9vcihNYXRoLnNxcnQobWF4SGlkZGVuRG90cyAvIGspKTtcbiAgLy9UaGUgY291bnQgb2YgaGlkZGVuIGRvdCdzIGNhbid0IGJlIGxlc3MgdGhhbiAxXG4gIGlmIChoaWRlRG90cy54IDw9IDApIGhpZGVEb3RzLnggPSAxO1xuICAvL0NoZWNrIHRoZSBsaW1pdCBvZiB0aGUgbWF4aW11bSBhbGxvd2VkIGF4aXMgaGlkZGVuIGRvdHNcbiAgaWYgKG1heEhpZGRlbkF4aXNEb3RzICYmIG1heEhpZGRlbkF4aXNEb3RzIDwgaGlkZURvdHMueCkgaGlkZURvdHMueCA9IG1heEhpZGRlbkF4aXNEb3RzO1xuICAvL1RoZSBjb3VudCBvZiBkb3RzIHNob3VsZCBiZSBvZGRcbiAgaWYgKGhpZGVEb3RzLnggJSAyID09PSAwKSBoaWRlRG90cy54LS07XG4gIGltYWdlU2l6ZS54ID0gaGlkZURvdHMueCAqIGRvdFNpemU7XG4gIC8vQ2FsY3VsYXRlIG9wcG9zaXRlIGF4aXMgaGlkZGVuIGRvdHMgYmFzZWQgb24gYXhpcyB2YWx1ZS5cbiAgLy9UaGUgdmFsdWUgd2lsbCBiZSBvZGQuXG4gIC8vV2UgdXNlIGNlaWwgdG8gcHJldmVudCBkb3RzIGNvdmVyaW5nIGJ5IHRoZSBpbWFnZS5cbiAgaGlkZURvdHMueSA9IDEgKyAyICogTWF0aC5jZWlsKChoaWRlRG90cy54ICogayAtIDEpIC8gMik7XG4gIGltYWdlU2l6ZS55ID0gTWF0aC5yb3VuZChpbWFnZVNpemUueCAqIGspO1xuICAvL0lmIHRoZSByZXN1bHQgZG90cyBjb3VudCBpcyBiaWdnZXIgdGhhbiBtYXggLSB0aGVuIGRlY3JlYXNlIHNpemUgYW5kIGNhbGN1bGF0ZSBhZ2FpblxuICBpZiAoaGlkZURvdHMueSAqIGhpZGVEb3RzLnggPiBtYXhIaWRkZW5Eb3RzIHx8IChtYXhIaWRkZW5BeGlzRG90cyAmJiBtYXhIaWRkZW5BeGlzRG90cyA8IGhpZGVEb3RzLnkpKSB7XG4gICAgaWYgKG1heEhpZGRlbkF4aXNEb3RzICYmIG1heEhpZGRlbkF4aXNEb3RzIDwgaGlkZURvdHMueSkge1xuICAgICAgaGlkZURvdHMueSA9IG1heEhpZGRlbkF4aXNEb3RzO1xuICAgICAgaWYgKGhpZGVEb3RzLnkgJSAyID09PSAwKSBoaWRlRG90cy54LS07XG4gICAgfSBlbHNlIHtcbiAgICAgIGhpZGVEb3RzLnkgLT0gMjtcbiAgICB9XG4gICAgaW1hZ2VTaXplLnkgPSBoaWRlRG90cy55ICogZG90U2l6ZTtcbiAgICBoaWRlRG90cy54ID0gMSArIDIgKiBNYXRoLmNlaWwoKGhpZGVEb3RzLnkgLyBrIC0gMSkgLyAyKTtcbiAgICBpbWFnZVNpemUueCA9IE1hdGgucm91bmQoaW1hZ2VTaXplLnkgLyBrKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaGVpZ2h0OiBpbWFnZVNpemUueSxcbiAgICB3aWR0aDogaW1hZ2VTaXplLngsXG4gICAgaGlkZVlEb3RzOiBoaWRlRG90cy55LFxuICAgIGhpZGVYRG90czogaGlkZURvdHMueFxuICB9O1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZG93bmxvYWRVUkkodXJpOiBzdHJpbmcsIG5hbWU6IHN0cmluZyk6IHZvaWQge1xuICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gIGxpbmsuZG93bmxvYWQgPSBuYW1lO1xuICBsaW5rLmhyZWYgPSB1cmk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XG4gIGxpbmsuY2xpY2soKTtcbiAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChsaW5rKTtcbn1cbiIsImltcG9ydCBtb2RlcyBmcm9tIFwiLi4vY29uc3RhbnRzL21vZGVzXCI7XG5pbXBvcnQgeyBNb2RlIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldE1vZGUoZGF0YTogc3RyaW5nKTogTW9kZSB7XG4gIHN3aXRjaCAodHJ1ZSkge1xuICAgIGNhc2UgL15bMC05XSokLy50ZXN0KGRhdGEpOlxuICAgICAgcmV0dXJuIG1vZGVzLm51bWVyaWM7XG4gICAgY2FzZSAvXlswLTlBLVogJCUqK1xcLS4vOl0qJC8udGVzdChkYXRhKTpcbiAgICAgIHJldHVybiBtb2Rlcy5hbHBoYW51bWVyaWM7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBtb2Rlcy5ieXRlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBVbmtub3duT2JqZWN0IH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmNvbnN0IGlzT2JqZWN0ID0gKG9iajogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pOiBib29sZWFuID0+ICEhb2JqICYmIHR5cGVvZiBvYmogPT09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkob2JqKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbWVyZ2VEZWVwKHRhcmdldDogVW5rbm93bk9iamVjdCwgLi4uc291cmNlczogVW5rbm93bk9iamVjdFtdKTogVW5rbm93bk9iamVjdCB7XG4gIGlmICghc291cmNlcy5sZW5ndGgpIHJldHVybiB0YXJnZXQ7XG4gIGNvbnN0IHNvdXJjZSA9IHNvdXJjZXMuc2hpZnQoKTtcbiAgaWYgKHNvdXJjZSA9PT0gdW5kZWZpbmVkIHx8ICFpc09iamVjdCh0YXJnZXQpIHx8ICFpc09iamVjdChzb3VyY2UpKSByZXR1cm4gdGFyZ2V0O1xuICB0YXJnZXQgPSB7IC4uLnRhcmdldCB9O1xuICBPYmplY3Qua2V5cyhzb3VyY2UpLmZvckVhY2goKGtleTogc3RyaW5nKTogdm9pZCA9PiB7XG4gICAgY29uc3QgdGFyZ2V0VmFsdWUgPSB0YXJnZXRba2V5XTtcbiAgICBjb25zdCBzb3VyY2VWYWx1ZSA9IHNvdXJjZVtrZXldO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkodGFyZ2V0VmFsdWUpICYmIEFycmF5LmlzQXJyYXkoc291cmNlVmFsdWUpKSB7XG4gICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVZhbHVlO1xuICAgIH0gZWxzZSBpZiAoaXNPYmplY3QodGFyZ2V0VmFsdWUpICYmIGlzT2JqZWN0KHNvdXJjZVZhbHVlKSkge1xuICAgICAgdGFyZ2V0W2tleV0gPSBtZXJnZURlZXAoT2JqZWN0LmFzc2lnbih7fSwgdGFyZ2V0VmFsdWUpLCBzb3VyY2VWYWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldFtrZXldID0gc291cmNlVmFsdWU7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gbWVyZ2VEZWVwKHRhcmdldCwgLi4uc291cmNlcyk7XG59XG4iLCJpbXBvcnQgeyBSZXF1aXJlZE9wdGlvbnMgfSBmcm9tIFwiLi4vY29yZS9RUk9wdGlvbnNcIjtcbmltcG9ydCB7IEdyYWRpZW50IH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmZ1bmN0aW9uIHNhbml0aXplR3JhZGllbnQoZ3JhZGllbnQ6IEdyYWRpZW50KTogR3JhZGllbnQge1xuICBjb25zdCBuZXdHcmFkaWVudCA9IHsgLi4uZ3JhZGllbnQgfTtcblxuICBpZiAoIW5ld0dyYWRpZW50LmNvbG9yU3RvcHMgfHwgIW5ld0dyYWRpZW50LmNvbG9yU3RvcHMubGVuZ3RoKSB7XG4gICAgdGhyb3cgXCJGaWVsZCAnY29sb3JTdG9wcycgaXMgcmVxdWlyZWQgaW4gZ3JhZGllbnRcIjtcbiAgfVxuXG4gIGlmIChuZXdHcmFkaWVudC5yb3RhdGlvbikge1xuICAgIG5ld0dyYWRpZW50LnJvdGF0aW9uID0gTnVtYmVyKG5ld0dyYWRpZW50LnJvdGF0aW9uKTtcbiAgfSBlbHNlIHtcbiAgICBuZXdHcmFkaWVudC5yb3RhdGlvbiA9IDA7XG4gIH1cblxuICBuZXdHcmFkaWVudC5jb2xvclN0b3BzID0gbmV3R3JhZGllbnQuY29sb3JTdG9wcy5tYXAoKGNvbG9yU3RvcDogeyBvZmZzZXQ6IG51bWJlcjsgY29sb3I6IHN0cmluZyB9KSA9PiAoe1xuICAgIC4uLmNvbG9yU3RvcCxcbiAgICBvZmZzZXQ6IE51bWJlcihjb2xvclN0b3Aub2Zmc2V0KVxuICB9KSk7XG5cbiAgcmV0dXJuIG5ld0dyYWRpZW50O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzYW5pdGl6ZU9wdGlvbnMob3B0aW9uczogUmVxdWlyZWRPcHRpb25zKTogUmVxdWlyZWRPcHRpb25zIHtcbiAgY29uc3QgbmV3T3B0aW9ucyA9IHsgLi4ub3B0aW9ucyB9O1xuXG4gIG5ld09wdGlvbnMud2lkdGggPSBOdW1iZXIobmV3T3B0aW9ucy53aWR0aCk7XG4gIG5ld09wdGlvbnMuaGVpZ2h0ID0gTnVtYmVyKG5ld09wdGlvbnMuaGVpZ2h0KTtcbiAgbmV3T3B0aW9ucy5tYXJnaW4gPSBOdW1iZXIobmV3T3B0aW9ucy5tYXJnaW4pO1xuICBuZXdPcHRpb25zLmltYWdlT3B0aW9ucyA9IHtcbiAgICAuLi5uZXdPcHRpb25zLmltYWdlT3B0aW9ucyxcbiAgICBoaWRlQmFja2dyb3VuZERvdHM6IEJvb2xlYW4obmV3T3B0aW9ucy5pbWFnZU9wdGlvbnMuaGlkZUJhY2tncm91bmREb3RzKSxcbiAgICBpbWFnZVNpemU6IE51bWJlcihuZXdPcHRpb25zLmltYWdlT3B0aW9ucy5pbWFnZVNpemUpLFxuICAgIG1hcmdpbjogTnVtYmVyKG5ld09wdGlvbnMuaW1hZ2VPcHRpb25zLm1hcmdpbilcbiAgfTtcblxuICBpZiAobmV3T3B0aW9ucy5tYXJnaW4gPiBNYXRoLm1pbihuZXdPcHRpb25zLndpZHRoLCBuZXdPcHRpb25zLmhlaWdodCkpIHtcbiAgICBuZXdPcHRpb25zLm1hcmdpbiA9IE1hdGgubWluKG5ld09wdGlvbnMud2lkdGgsIG5ld09wdGlvbnMuaGVpZ2h0KTtcbiAgfVxuXG4gIG5ld09wdGlvbnMuZG90c09wdGlvbnMgPSB7XG4gICAgLi4ubmV3T3B0aW9ucy5kb3RzT3B0aW9uc1xuICB9O1xuICBpZiAobmV3T3B0aW9ucy5kb3RzT3B0aW9ucy5ncmFkaWVudCkge1xuICAgIG5ld09wdGlvbnMuZG90c09wdGlvbnMuZ3JhZGllbnQgPSBzYW5pdGl6ZUdyYWRpZW50KG5ld09wdGlvbnMuZG90c09wdGlvbnMuZ3JhZGllbnQpO1xuICB9XG5cbiAgaWYgKG5ld09wdGlvbnMuY29ybmVyc1NxdWFyZU9wdGlvbnMpIHtcbiAgICBuZXdPcHRpb25zLmNvcm5lcnNTcXVhcmVPcHRpb25zID0ge1xuICAgICAgLi4ubmV3T3B0aW9ucy5jb3JuZXJzU3F1YXJlT3B0aW9uc1xuICAgIH07XG4gICAgaWYgKG5ld09wdGlvbnMuY29ybmVyc1NxdWFyZU9wdGlvbnMuZ3JhZGllbnQpIHtcbiAgICAgIG5ld09wdGlvbnMuY29ybmVyc1NxdWFyZU9wdGlvbnMuZ3JhZGllbnQgPSBzYW5pdGl6ZUdyYWRpZW50KG5ld09wdGlvbnMuY29ybmVyc1NxdWFyZU9wdGlvbnMuZ3JhZGllbnQpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChuZXdPcHRpb25zLmNvcm5lcnNEb3RPcHRpb25zKSB7XG4gICAgbmV3T3B0aW9ucy5jb3JuZXJzRG90T3B0aW9ucyA9IHtcbiAgICAgIC4uLm5ld09wdGlvbnMuY29ybmVyc0RvdE9wdGlvbnNcbiAgICB9O1xuICAgIGlmIChuZXdPcHRpb25zLmNvcm5lcnNEb3RPcHRpb25zLmdyYWRpZW50KSB7XG4gICAgICBuZXdPcHRpb25zLmNvcm5lcnNEb3RPcHRpb25zLmdyYWRpZW50ID0gc2FuaXRpemVHcmFkaWVudChuZXdPcHRpb25zLmNvcm5lcnNEb3RPcHRpb25zLmdyYWRpZW50KTtcbiAgICB9XG4gIH1cblxuICBpZiAobmV3T3B0aW9ucy5iYWNrZ3JvdW5kT3B0aW9ucykge1xuICAgIG5ld09wdGlvbnMuYmFja2dyb3VuZE9wdGlvbnMgPSB7XG4gICAgICAuLi5uZXdPcHRpb25zLmJhY2tncm91bmRPcHRpb25zXG4gICAgfTtcbiAgICBpZiAobmV3T3B0aW9ucy5iYWNrZ3JvdW5kT3B0aW9ucy5ncmFkaWVudCkge1xuICAgICAgbmV3T3B0aW9ucy5iYWNrZ3JvdW5kT3B0aW9ucy5ncmFkaWVudCA9IHNhbml0aXplR3JhZGllbnQobmV3T3B0aW9ucy5iYWNrZ3JvdW5kT3B0aW9ucy5ncmFkaWVudCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ld09wdGlvbnM7XG59XG4iLCJleHBvcnQgaW50ZXJmYWNlIFVua25vd25PYmplY3Qge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICBba2V5OiBzdHJpbmddOiBhbnk7XG59XG5cbmV4cG9ydCB0eXBlIERvdFR5cGUgPSBcImRvdHNcIiB8IFwicm91bmRlZFwiIHwgXCJjbGFzc3lcIiB8IFwiY2xhc3N5LXJvdW5kZWRcIiB8IFwic3F1YXJlXCIgfCBcImV4dHJhLXJvdW5kZWRcIiB8IFwic3RhclwiIDtcbmV4cG9ydCB0eXBlIENvcm5lckRvdFR5cGUgPSBcImRvdFwiIHwgXCJzcXVhcmVcIiB8IFwic3RhclwiIHwgXCJwbHVzXCIgfCBcInNxdWFyZS1yb3VuZGVkXCIgfCBcImxlYWZcIiB8IFwiY2lyY2xlLWxlZnQtdG9wXCIgfCBcImNpcmNsZS1yaWdodC1ib3R0b21cIiB8IFwic3F1YXJlLXJpZ2h0LWJvdHRvbVwiIHwgXCJkaWFtb25kXCIgfCBcImNyb3NzXCIgfCBcInJob21idXNcIlxuZXhwb3J0IHR5cGUgQ29ybmVyU3F1YXJlVHlwZSA9IFwiZG90XCIgfCBcInNxdWFyZVwiIHwgXCJleHRyYS1yb3VuZGVkXCIgfCBcImRvdHRlZC1zcXVhcmVcIiB8IFwicmlnaHQtYm90dG9tLXNxdWFyZVwiIHwgXCJsZWZ0LXRvcC1zcXVhcmVcIiB8IFwiY2lyY2xlLWluLXNxdWFyZVwiIHwgXCJjaXJjbGUtbGVmdC10b3BcIiB8IFwiY2lyY2xlLXJpZ2h0LWJvdHRvbVwiIHwgXCJwZWFudXRcIiB8IFwicGFyYWdvbmFsXCI7XG5leHBvcnQgdHlwZSBFeHRlbnNpb24gPSBcInN2Z1wiIHwgXCJwbmdcIiB8IFwianBlZ1wiIHwgXCJ3ZWJwXCI7XG5leHBvcnQgdHlwZSBHcmFkaWVudFR5cGUgPSBcInJhZGlhbFwiIHwgXCJsaW5lYXJcIjtcbmV4cG9ydCB0eXBlIERyYXdUeXBlID0gXCJjYW52YXNcIiB8IFwic3ZnXCI7XG5cbmV4cG9ydCB0eXBlIEdyYWRpZW50ID0ge1xuICB0eXBlOiBHcmFkaWVudFR5cGU7XG4gIHJvdGF0aW9uPzogbnVtYmVyO1xuICBjb2xvclN0b3BzOiB7XG4gICAgb2Zmc2V0OiBudW1iZXI7XG4gICAgY29sb3I6IHN0cmluZztcbiAgfVtdO1xufTtcblxuZXhwb3J0IGludGVyZmFjZSBEb3RUeXBlcyB7XG4gIFtrZXk6IHN0cmluZ106IERvdFR5cGU7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR3JhZGllbnRUeXBlcyB7XG4gIFtrZXk6IHN0cmluZ106IEdyYWRpZW50VHlwZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb3JuZXJEb3RUeXBlcyB7XG4gIFtrZXk6IHN0cmluZ106IENvcm5lckRvdFR5cGU7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29ybmVyU3F1YXJlVHlwZXMge1xuICBba2V5OiBzdHJpbmddOiBDb3JuZXJTcXVhcmVUeXBlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIERyYXdUeXBlcyB7XG4gIFtrZXk6IHN0cmluZ106IERyYXdUeXBlO1xufVxuXG5leHBvcnQgdHlwZSBUeXBlTnVtYmVyID1cbiAgfCAwXG4gIHwgMVxuICB8IDJcbiAgfCAzXG4gIHwgNFxuICB8IDVcbiAgfCA2XG4gIHwgN1xuICB8IDhcbiAgfCA5XG4gIHwgMTBcbiAgfCAxMVxuICB8IDEyXG4gIHwgMTNcbiAgfCAxNFxuICB8IDE1XG4gIHwgMTZcbiAgfCAxN1xuICB8IDE4XG4gIHwgMTlcbiAgfCAyMFxuICB8IDIxXG4gIHwgMjJcbiAgfCAyM1xuICB8IDI0XG4gIHwgMjVcbiAgfCAyNlxuICB8IDI3XG4gIHwgMjhcbiAgfCAyOVxuICB8IDMwXG4gIHwgMzFcbiAgfCAzMlxuICB8IDMzXG4gIHwgMzRcbiAgfCAzNVxuICB8IDM2XG4gIHwgMzdcbiAgfCAzOFxuICB8IDM5XG4gIHwgNDA7XG5cbmV4cG9ydCB0eXBlIEVycm9yQ29ycmVjdGlvbkxldmVsID0gXCJMXCIgfCBcIk1cIiB8IFwiUVwiIHwgXCJIXCI7XG5leHBvcnQgdHlwZSBNb2RlID0gXCJOdW1lcmljXCIgfCBcIkFscGhhbnVtZXJpY1wiIHwgXCJCeXRlXCIgfCBcIkthbmppXCI7XG5leHBvcnQgaW50ZXJmYWNlIFFSQ29kZSB7XG4gIGFkZERhdGEoZGF0YTogc3RyaW5nLCBtb2RlPzogTW9kZSk6IHZvaWQ7XG4gIG1ha2UoKTogdm9pZDtcbiAgZ2V0TW9kdWxlQ291bnQoKTogbnVtYmVyO1xuICBpc0Rhcmsocm93OiBudW1iZXIsIGNvbDogbnVtYmVyKTogYm9vbGVhbjtcbiAgY3JlYXRlSW1nVGFnKGNlbGxTaXplPzogbnVtYmVyLCBtYXJnaW4/OiBudW1iZXIpOiBzdHJpbmc7XG4gIGNyZWF0ZVN2Z1RhZyhjZWxsU2l6ZT86IG51bWJlciwgbWFyZ2luPzogbnVtYmVyKTogc3RyaW5nO1xuICBjcmVhdGVTdmdUYWcob3B0cz86IHsgY2VsbFNpemU/OiBudW1iZXI7IG1hcmdpbj86IG51bWJlcjsgc2NhbGFibGU/OiBib29sZWFuIH0pOiBzdHJpbmc7XG4gIGNyZWF0ZURhdGFVUkwoY2VsbFNpemU/OiBudW1iZXIsIG1hcmdpbj86IG51bWJlcik6IHN0cmluZztcbiAgY3JlYXRlVGFibGVUYWcoY2VsbFNpemU/OiBudW1iZXIsIG1hcmdpbj86IG51bWJlcik6IHN0cmluZztcbiAgY3JlYXRlQVNDSUkoY2VsbFNpemU/OiBudW1iZXIsIG1hcmdpbj86IG51bWJlcik6IHN0cmluZztcbiAgcmVuZGVyVG8yZENvbnRleHQoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBjZWxsU2l6ZT86IG51bWJlcik6IHZvaWQ7XG59XG5cbmV4cG9ydCB0eXBlIE9wdGlvbnMgPSB7XG4gIHR5cGU/OiBEcmF3VHlwZTtcbiAgd2lkdGg/OiBudW1iZXI7XG4gIGhlaWdodD86IG51bWJlcjtcbiAgbWFyZ2luPzogbnVtYmVyO1xuICBkYXRhPzogc3RyaW5nO1xuICBpbWFnZT86IHN0cmluZztcbiAgcXJPcHRpb25zPzoge1xuICAgIHR5cGVOdW1iZXI/OiBUeXBlTnVtYmVyO1xuICAgIG1vZGU/OiBNb2RlO1xuICAgIGVycm9yQ29ycmVjdGlvbkxldmVsPzogRXJyb3JDb3JyZWN0aW9uTGV2ZWw7XG4gIH07XG4gIGltYWdlT3B0aW9ucz86IHtcbiAgICBoaWRlQmFja2dyb3VuZERvdHM/OiBib29sZWFuO1xuICAgIGltYWdlU2l6ZT86IG51bWJlcjtcbiAgICBjcm9zc09yaWdpbj86IHN0cmluZztcbiAgICBtYXJnaW4/OiBudW1iZXI7XG4gIH07XG4gIGRvdHNPcHRpb25zPzoge1xuICAgIHR5cGU/OiBEb3RUeXBlO1xuICAgIGNvbG9yPzogc3RyaW5nO1xuICAgIGdyYWRpZW50PzogR3JhZGllbnQ7XG4gIH07XG4gIGNvcm5lcnNTcXVhcmVPcHRpb25zPzoge1xuICAgIHR5cGU/OiBDb3JuZXJTcXVhcmVUeXBlO1xuICAgIGNvbG9yPzogc3RyaW5nO1xuICAgIGdyYWRpZW50PzogR3JhZGllbnQ7XG4gIH07XG4gIGNvcm5lcnNEb3RPcHRpb25zPzoge1xuICAgIHR5cGU/OiBDb3JuZXJEb3RUeXBlO1xuICAgIGNvbG9yPzogc3RyaW5nO1xuICAgIGdyYWRpZW50PzogR3JhZGllbnQ7XG4gIH07XG4gIGJhY2tncm91bmRPcHRpb25zPzoge1xuICAgIGNvbG9yPzogc3RyaW5nO1xuICAgIGdyYWRpZW50PzogR3JhZGllbnQ7XG4gIH07XG59O1xuXG5leHBvcnQgdHlwZSBGaWx0ZXJGdW5jdGlvbiA9IChpOiBudW1iZXIsIGo6IG51bWJlcikgPT4gYm9vbGVhbjtcblxuZXhwb3J0IHR5cGUgRG93bmxvYWRPcHRpb25zID0ge1xuICBuYW1lPzogc3RyaW5nO1xuICBleHRlbnNpb24/OiBFeHRlbnNpb247XG59O1xuXG5leHBvcnQgdHlwZSBEcmF3QXJncyA9IHtcbiAgeDogbnVtYmVyO1xuICB5OiBudW1iZXI7XG4gIHNpemU6IG51bWJlcjtcbiAgcm90YXRpb24/OiBudW1iZXI7XG4gIGdldE5laWdoYm9yPzogR2V0TmVpZ2hib3I7XG59O1xuXG5leHBvcnQgdHlwZSBCYXNpY0ZpZ3VyZURyYXdBcmdzID0ge1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbiAgc2l6ZTogbnVtYmVyO1xuICByb3RhdGlvbj86IG51bWJlcjtcbn07XG5cbmV4cG9ydCB0eXBlIFJvdGF0ZUZpZ3VyZUFyZ3MgPSB7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xuICBzaXplOiBudW1iZXI7XG4gIHJvdGF0aW9uPzogbnVtYmVyO1xuICBkcmF3OiAoKSA9PiB2b2lkO1xufTtcblxuZXhwb3J0IHR5cGUgRHJhd0FyZ3NDYW52YXMgPSBEcmF3QXJncyAmIHtcbiAgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xufTtcblxuZXhwb3J0IHR5cGUgQmFzaWNGaWd1cmVEcmF3QXJnc0NhbnZhcyA9IEJhc2ljRmlndXJlRHJhd0FyZ3MgJiB7XG4gIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbn07XG5cbmV4cG9ydCB0eXBlIFJvdGF0ZUZpZ3VyZUFyZ3NDYW52YXMgPSBSb3RhdGVGaWd1cmVBcmdzICYge1xuICBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG59O1xuXG5leHBvcnQgdHlwZSBHZXROZWlnaGJvciA9ICh4OiBudW1iZXIsIHk6IG51bWJlcikgPT4gYm9vbGVhbjtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgUVJDb2RlU3R5bGluZyBmcm9tIFwiLi9jb3JlL1FSQ29kZVN0eWxpbmdcIjtcbmltcG9ydCBkb3RUeXBlcyBmcm9tIFwiLi9jb25zdGFudHMvZG90VHlwZXNcIjtcbmltcG9ydCBjb3JuZXJEb3RUeXBlcyBmcm9tIFwiLi9jb25zdGFudHMvY29ybmVyRG90VHlwZXNcIjtcbmltcG9ydCBjb3JuZXJTcXVhcmVUeXBlcyBmcm9tIFwiLi9jb25zdGFudHMvY29ybmVyU3F1YXJlVHlwZXNcIjtcbmltcG9ydCBlcnJvckNvcnJlY3Rpb25MZXZlbHMgZnJvbSBcIi4vY29uc3RhbnRzL2Vycm9yQ29ycmVjdGlvbkxldmVsc1wiO1xuaW1wb3J0IGVycm9yQ29ycmVjdGlvblBlcmNlbnRzIGZyb20gXCIuL2NvbnN0YW50cy9lcnJvckNvcnJlY3Rpb25QZXJjZW50c1wiO1xuaW1wb3J0IG1vZGVzIGZyb20gXCIuL2NvbnN0YW50cy9tb2Rlc1wiO1xuaW1wb3J0IHFyVHlwZXMgZnJvbSBcIi4vY29uc3RhbnRzL3FyVHlwZXNcIjtcbmltcG9ydCBkcmF3VHlwZXMgZnJvbSBcIi4vY29uc3RhbnRzL2RyYXdUeXBlc1wiO1xuXG5leHBvcnQgKiBmcm9tIFwiLi90eXBlc1wiO1xuXG5leHBvcnQge1xuICBkb3RUeXBlcyxcbiAgY29ybmVyRG90VHlwZXMsXG4gIGNvcm5lclNxdWFyZVR5cGVzLFxuICBlcnJvckNvcnJlY3Rpb25MZXZlbHMsXG4gIGVycm9yQ29ycmVjdGlvblBlcmNlbnRzLFxuICBtb2RlcyxcbiAgcXJUeXBlcyxcbiAgZHJhd1R5cGVzXG59O1xuXG5leHBvcnQgZGVmYXVsdCBRUkNvZGVTdHlsaW5nO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9