THREE.TGXLoaderUtils = (function() {
	var scope = {
		// https://www.khronos.org/opengl/wiki/Normalized_Integer
		unormalize: function(value, bits) {
			var max = Math.pow(2, bits) - 1;
			return value/max;
		},

		normalize: function(value, bits) {
			var max = Math.pow(2, bits-1) - 1;
			return Math.max(value/max, -1);
		},

		byte: function(data, offset) {
			return scope.decodeSigned(data, offset, 1);
		},

		ubyte: function(data, offset) {
			return scope.decodeUnsigned(data, offset, 1);
		},

		short: function(data, offset) {
			return scope.decodeSigned(data, offset, 2);
		},

		ushort: function(data, offset) {
			return scope.decodeUnsigned(data, offset, 2);
		},

		int: function(data, offset) {
			return scope.decodeSigned(data, offset, 4);
		},

		uint: function(data, offset) {
			return scope.decodeUnsigned(data, offset, 4);
		},

		float: function(data, offset) {
			return scope.decodeFloat(scope.bytes(data, offset, 4), 1, 8, 23, -126, 127);
		},

		bytes: function(data, offset, length) {
			var bytes = [];
			for (var i=0; i<length; i++) {
				bytes.push(scope.ubyte(data, offset+i));
			}
			return bytes;
		},

		string: function(data, offset, length) {
			var str = '';
			if (offset == undefined) offset = 0;
			if (length == undefined) length = data.length-offset;
			for (var i=0; i<length; i++) {
				var chr = data[offset+i];
				if (chr == 0) continue;
				str += String.fromCharCode(chr);
			}
			//var str = data.substr(offset, length);
			//if (str.indexOf("\0") != -1) str = str.substr(0, str.indexOf("\0"));
			return str;
		},

		bits: function(value, length) {
			var str = '';
			for (var i=0; i<length; i++) {
				str = ((value >> i) & 0x1)+str;
			}
			return str;
		},

		radianToDegrees: function(value) {
			return value * 180 / Math.PI;
		},

		degreesToRadian: function(value) {
			return value * Math.PI / 180;
		},

		padNum: function(num, length) {
			num = num.toString();
			while(num.length < length) {
				num = '0'+num;
			}
			return num;
		},

		decodeHex: function(data, offset, length) {
			var hex = '';

			if (typeof data == 'number') {
				length = offset != undefined ? offset : 4;
				for (var i=0; i<length; i++) {
					var u8 = (data >> (i*8)) & 0xFF;
					hex = scope.padNum(u8.toString(16), 2).toUpperCase() + hex;
				}
				return '0x'+hex;
			}

			if (offset == undefined) offset = 0;
			if (length == undefined) length = data.length;
			for (var i=0; i<length; i++) {
				hex = scope.padNum(data.charCodeAt(offset+i).toString(16).toUpperCase(), 2) + hex;
			}
			return '0x'+hex;
		},

		decodeUnsigned: function(data, offset, length) {
			var int = 0;
			for (var i=0; i<length; i++) {
				int |= data[offset+i] << (i*8);
			}
			return int;
		},

		decodeSigned: function(data, offset, length) {
			if (typeof data != 'number') data = scope.decodeUnsigned(data, offset, length);
			else length = offset;
			var bits = length * 8;
			var max = (1 << bits) - 1;
			if (data & (1 << (bits - 1))) {
				data = (data & max) - max;
			}
			return data;
		},

		decodeFloat: function(bytes, signBits, exponentBits, fractionBits, eMin, eMax, littleEndian) {
			if (littleEndian == undefined) littleEndian = true;
			var totalBits = (signBits + exponentBits + fractionBits);

			var binary = "";
			for (var i = 0, l = bytes.length; i < l; i++) {
				var bits = bytes[i].toString(2);
				while (bits.length < 8)
					bits = "0" + bits;

				if (littleEndian)
					binary = bits + binary;
				else
					binary += bits;
			}

			var sign = (binary.charAt(0) == '1')?-1:1;
			var exponent = parseInt(binary.substr(signBits, exponentBits), 2) - eMax;
			var significandBase = binary.substr(signBits + exponentBits, fractionBits);
			var significandBin = '1'+significandBase;
			var i = 0;
			var val = 1;
			var significand = 0;

			if (exponent == -eMax) {
				if (significandBase.indexOf('1') == -1)
					return 0;
				else {
					exponent = eMin;
					significandBin = '0'+significandBase;
				}
			}

			while (i < significandBin.length) {
				significand += val * parseInt(significandBin.charAt(i));
				val = val / 2;
				i++;
			}

			return sign * significand * Math.pow(2, exponent);
		}
	};
	return scope;
})();

// This is a copy of THREE.FileLoader with some extra settings applied to the XMLHttpRequest
// Was getting this error when trying to apply it to a standard THREE.FileLoader
// Error: Failed to execute 'setRequestHeader' on 'XMLHttpRequest': The object's state must be OPENED.
THREE.BungieNetLoader = function(manager) {
	this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
};
Object.assign(THREE.BungieNetLoader.prototype, {
	load: function (url, apiKey, onLoad, onProgress, onError ) {

		if ( url === undefined ) url = '';

		if ( this.path !== undefined ) url = this.path + url;

		var scope = this;

		var cached = THREE.Cache.get( url );

		if ( cached !== undefined ) {

			scope.manager.itemStart( url );

			setTimeout( function () {

				if ( onLoad ) onLoad( cached );

				scope.manager.itemEnd( url );

			}, 0 );

			return cached;

		}

		var request = new XMLHttpRequest();
		request.open( 'GET', url, true );

		// If an API Key is supplied, add it to the request header
		// otherwise assume we want binary data
		if (typeof apiKey == 'string') request.setRequestHeader('X-API-Key', apiKey);
		if (url.indexOf('geometry') != -1) request.responseType = 'arraybuffer';

		request.addEventListener( 'load', function ( event ) {

			var response = event.target.response;

			THREE.Cache.add( url, response );

			if ( this.status === 200 ) {

				if ( onLoad ) onLoad( response );

				scope.manager.itemEnd( url );

			} else if ( this.status === 0 ) {

				// Some browsers return HTTP Status 0 when using non-http protocol
				// e.g. 'file://' or 'data://'. Handle as success.

				console.warn( 'THREE.FileLoader: HTTP Status 0 received.' );

				if ( onLoad ) onLoad( response );

				scope.manager.itemEnd( url );

			} else {

				if ( onError ) onError( event );

				scope.manager.itemError( url );

			}

		}, false );

		if ( onProgress !== undefined ) {

			request.addEventListener( 'progress', function ( event ) {

				onProgress( event );

			}, false );

		}

		request.addEventListener( 'error', function ( event ) {

			if ( onError ) onError( event );

			scope.manager.itemError( url );

		}, false );

		if ( this.responseType !== undefined ) request.responseType = this.responseType;
		if ( this.withCredentials !== undefined ) request.withCredentials = this.withCredentials;

		if ( request.overrideMimeType ) request.overrideMimeType( this.mimeType !== undefined ? this.mimeType : 'text/plain' );

		request.send( null );

		scope.manager.itemStart( url );

		return request;

	}
});